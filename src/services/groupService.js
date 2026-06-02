const Group       = require('../models/Group');
const GroupMember = require('../models/GroupMember');

const createGroup = async ({ groupName, description, userId }) => {
  const group = new Group({
    groupName:   String(groupName).trim(),
    createdBy:   String(userId),
    description: description ? String(description).trim() : '',
  });

  await group.save();

  // Seed the creator as owner in GroupMember
  await GroupMember.create({
    memberID:     String(userId),
    groupID:      String(group._id),
    groupAddedBy: String(userId),
    role:         'owner',
    permissions:  [],
  });

  return formatGroup(group);
};

const updateGroup = async ({ groupID, userId, groupName, description }) => {
  const membership = await GroupMember.findOne({ memberID: String(userId), groupID: String(groupID) });
  const canEdit = membership && (
    membership.role === 'owner' ||
    (membership.role === 'admin' && membership.permissions.includes('editGroup'))
  );
  if (!canEdit) {
    const err = new Error('Group not found or you do not have permission to edit');
    err.statusCode = 404;
    throw err;
  }

  const group = await Group.findById(groupID);
  if (!group) {
    const err = new Error('Group not found');
    err.statusCode = 404;
    throw err;
  }

  if (groupName !== undefined)   group.groupName   = String(groupName).trim();
  if (description !== undefined) group.description = String(description).trim();

  await group.save();
  return formatGroup(group);
};

const deleteGroup = async ({ groupID, userId }) => {
  const membership = await GroupMember.findOne({ memberID: String(userId), groupID: String(groupID) });
  const canDelete = membership && (
    membership.role === 'owner' ||
    (membership.role === 'admin' && membership.permissions.includes('deleteGroup'))
  );
  if (!canDelete) {
    const err = new Error('Group not found or you do not have permission to delete');
    err.statusCode = 404;
    throw err;
  }

  // Block deletion if other members still exist (owner must remove all members first)
  const memberCount = await GroupMember.countDocuments({ groupID: String(groupID) });
  if (memberCount > 1) {
    const err = new Error('Cannot delete group while it still has members. Remove all members first.');
    err.statusCode = 400;
    throw err;
  }

  const group = await Group.findByIdAndDelete(groupID);
  if (!group) {
    const err = new Error('Group not found');
    err.statusCode = 404;
    throw err;
  }

  await GroupMember.deleteMany({ groupID: String(groupID) });

  return { groupID: group._id };
};

const formatGroup = (group) => ({
  groupID:     group._id,
  groupName:   group.groupName,
  createdBy:   group.createdBy,
  description: group.description,
  createDate:  group.createDate,
  updateDate:  group.updateDate,
});

const getMyGroups = async ({ userId, pageNumber, itemNumber }) => {
  const limit = Number(itemNumber);
  const skip  = (Number(pageNumber) - 1) * limit;

  const [result] = await GroupMember.aggregate([
    { $match: { memberID: String(userId) } },
    {
      $facet: {
        total: [{ $count: 'count' }],
        members: [
          { $skip: skip },
          { $limit: limit },
          {
            $lookup: {
              from:     'groups',
              let:      { gid: '$groupID' },
              pipeline: [
                { $match: { $expr: { $eq: ['$_id', { $toObjectId: '$$gid' }] } } },
              ],
              as: 'groupData',
            },
          },
          { $unwind: '$groupData' },
          { $replaceRoot: { newRoot: '$groupData' } },
        ],
      },
    },
  ]);

  const total = result.total[0]?.count ?? 0;

  return {
    total,
    pageNumber:  Number(pageNumber),
    itemNumber:  limit,
    totalPages:  Math.ceil(total / limit),
    groups:      result.members.map(formatGroup),
  };
};

module.exports = { createGroup, updateGroup, deleteGroup, getMyGroups };
