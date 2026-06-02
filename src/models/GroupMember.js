const mongoose = require('mongoose');

const PERMISSIONS = ['addMember', 'removeMember', 'editGroup', 'deleteGroup', 'promoteAdmin', 'manageExpenses'];

const GroupMemberSchema = new mongoose.Schema(
  {
    memberID: {
      type:     String,
      required: true,
    },
    groupAddedBy: {
      type:     String,
      required: true,
    },
    groupID: {
      type:     String,
      required: true,
    },
    role: {
      type:    String,
      enum:    ['owner', 'admin', 'member'],
      default: 'member',
    },
    permissions: {
      type:    [String],
      enum:    PERMISSIONS,
      default: [],
    },
  },
  {
    timestamps: {
      createdAt: 'createDate',
      updatedAt: false,
    },
  }
);

// Prevent duplicate member in the same group
GroupMemberSchema.index({ memberID: 1, groupID: 1 }, { unique: true });

module.exports = mongoose.model('GroupMember', GroupMemberSchema);
module.exports.PERMISSIONS = PERMISSIONS;
