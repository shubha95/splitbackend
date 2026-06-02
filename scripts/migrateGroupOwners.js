require('dotenv').config();

const mongoose    = require('mongoose');
const Group       = require('../src/models/Group');
const GroupMember = require('../src/models/GroupMember');

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDB connected');

  // Find all groups
  const groups = await Group.find().lean();
  console.log(`Found ${groups.length} total groups`);

  let created = 0;
  let skipped = 0;

  for (const group of groups) {
    const groupID  = String(group._id);
    const memberID = String(group.createdBy);

    // Check if an owner record already exists for this group
    const exists = await GroupMember.findOne({ memberID, groupID });

    if (exists) {
      // Update to owner role if it's just a regular member record
      if (exists.role !== 'owner') {
        await GroupMember.updateOne({ _id: exists._id }, { role: 'owner', permissions: [] });
        console.log(`  Updated role→owner: group ${groupID} / user ${memberID}`);
        created++;
      } else {
        skipped++;
      }
    } else {
      // Create missing owner record
      await GroupMember.create({
        memberID,
        groupID,
        groupAddedBy: memberID,
        role:         'owner',
        permissions:  [],
      });
      console.log(`  Created owner record: group ${groupID} / user ${memberID}`);
      created++;
    }
  }

  console.log(`\nDone — created/fixed: ${created}, already correct: ${skipped}`);
  await mongoose.disconnect();
};

run().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
