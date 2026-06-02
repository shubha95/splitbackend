const mongoose = require('mongoose');

const GroupSchema = new mongoose.Schema(
  {
    groupName: {
      type:      String,
      required:  true,
      trim:      true,
      minlength: 2,
      maxlength: 100,
    },
    createdBy: {
      type:     String,
      required: true,
    },
    description: {
      type:      String,
      trim:      true,
      maxlength: 500,
      default:   '',
    },
  },
  {
    timestamps: {
      createdAt: 'createDate',
      updatedAt: 'updateDate',
    },
  }
);

module.exports = mongoose.model('Group', GroupSchema);
