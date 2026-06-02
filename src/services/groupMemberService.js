const GroupMember            = require('../models/GroupMember');
const { PERMISSIONS }        = require('../models/GroupMember');

const addMembers = async ({ memberID, groupID, groupAddedBy }) => {
  // Must be owner OR admin with addMember permission
  const requester = await GroupMember.findOne({ memberID: String(groupAddedBy), groupID: String(groupID) });
  const canAdd = requester && (
    requester.role === 'owner' ||
    (requester.role === 'admin' && requester.permissions.includes('addMember'))
  );
  if (!canAdd) {
    const err = new Error('You do not have permission to add members to this group');
    err.statusCode = 403;
    throw err;
  }

  const docs = memberID.map((id) => ({
    memberID:     String(id).trim(),
    groupID:      String(groupID).trim(),
    groupAddedBy: String(groupAddedBy),
    role:         'member',
    permissions:  [],
  }));

  // ordered: false — continues inserting remaining members even if one is a duplicate
  let insertedDocs = [];
  let skippedCount = 0;

  try {
    const result = await GroupMember.insertMany(docs, { ordered: false });
    insertedDocs = result;
  } catch (err) {
    // code 11000 = duplicate key — some inserted, some skipped
    if (err.code === 11000 || err.writeErrors) {
      insertedDocs = err.insertedDocs  || [];
      skippedCount = (err.writeErrors  || []).length;
    } else {
      throw err;
    }
  }

  return {
    totalRequested: memberID.length,
    added:          insertedDocs.length,
    skipped:        skippedCount,
    members:        insertedDocs.map(formatMember),
  };
};

const updateMember = async ({ memberRecordID, groupID, groupAddedBy }) => {
  const member = await GroupMember.findOne({ _id: memberRecordID, groupAddedBy: String(groupAddedBy) });
  if (!member) {
    const err = new Error('Member record not found or you do not have permission');
    err.statusCode = 404;
    throw err;
  }

  member.groupID = String(groupID).trim();
  await member.save();

  return formatMember(member);
};

const deleteMember = async ({ memberRecordID, requesterId }) => {
  const memberDoc = await GroupMember.findById(memberRecordID).lean();
  if (!memberDoc) {
    const err = new Error('Member record not found');
    err.statusCode = 404;
    throw err;
  }

  if (memberDoc.role === 'owner') {
    const err = new Error('The group owner cannot be removed');
    err.statusCode = 403;
    throw err;
  }

  // Must be owner OR admin with removeMember permission
  const requester = await GroupMember.findOne({ memberID: String(requesterId), groupID: memberDoc.groupID });
  const canRemove = requester && (
    requester.role === 'owner' ||
    (requester.role === 'admin' && requester.permissions.includes('removeMember'))
  );
  if (!canRemove) {
    const err = new Error('You do not have permission to remove members from this group');
    err.statusCode = 403;
    throw err;
  }

  await GroupMember.findByIdAndDelete(memberRecordID);
  return { memberRecordID: memberDoc._id };
};

const promoteToAdmin = async ({ targetMemberID, groupID, requesterId }) => {
  // Only owner can promote
  const requester = await GroupMember.findOne({ memberID: String(requesterId), groupID: String(groupID) });
  if (!requester || requester.role !== 'owner') {
    const err = new Error('Only the group owner can promote members to admin');
    err.statusCode = 403;
    throw err;
  }

  const member = await GroupMember.findOneAndUpdate(
    { memberID: String(targetMemberID), groupID: String(groupID), role: 'member' },
    { role: 'admin', permissions: [] },
    { new: true }
  );
  if (!member) {
    const err = new Error('Member not found or is already an admin/owner');
    err.statusCode = 404;
    throw err;
  }

  return formatMember(member);
};

const demoteToMember = async ({ targetMemberID, groupID, requesterId }) => {
  // Only owner can demote
  const requester = await GroupMember.findOne({ memberID: String(requesterId), groupID: String(groupID) });
  if (!requester || requester.role !== 'owner') {
    const err = new Error('Only the group owner can demote admins');
    err.statusCode = 403;
    throw err;
  }

  const member = await GroupMember.findOneAndUpdate(
    { memberID: String(targetMemberID), groupID: String(groupID), role: 'admin' },
    { role: 'member', permissions: [] },
    { new: true }
  );
  if (!member) {
    const err = new Error('Member not found or is not an admin');
    err.statusCode = 404;
    throw err;
  }

  return formatMember(member);
};

const updatePermissions = async ({ targetMemberID, groupID, permissions, requesterId }) => {
  // Only owner can manage permissions
  const requester = await GroupMember.findOne({ memberID: String(requesterId), groupID: String(groupID) });
  if (!requester || requester.role !== 'owner') {
    const err = new Error('Only the group owner can manage permissions');
    err.statusCode = 403;
    throw err;
  }

  const member = await GroupMember.findOneAndUpdate(
    { memberID: String(targetMemberID), groupID: String(groupID), role: 'admin' },
    { permissions },
    { new: true }
  );
  if (!member) {
    const err = new Error('Admin member not found in this group');
    err.statusCode = 404;
    throw err;
  }

  return formatMember(member);
};

const formatMember = (member) => ({
  memberRecordID: member._id,
  memberID:       member.memberID,
  groupID:        member.groupID,
  groupAddedBy:   member.groupAddedBy,
  role:           member.role,
  permissions:    member.permissions,
  createDate:     member.createDate,
});

module.exports = { addMembers, updateMember, deleteMember, promoteToAdmin, demoteToMember, updatePermissions, PERMISSIONS };
