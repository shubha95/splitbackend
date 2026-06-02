require('dotenv').config();

const mongoose    = require('mongoose');
const Group       = require('../src/models/Group');
const GroupMember = require('../src/models/GroupMember');

const USER_ID = '6a19e1d0558d507ac9c50e30';

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDB connected\n');

  // Step 1: check GroupMember records for this user
  const members = await GroupMember.find({ memberID: USER_ID }).lean();
  console.log(`GroupMember records for user: ${members.length}`);
  members.forEach(m => console.log('  ', JSON.stringify(m)));

  // Step 2: check Group documents for each groupID
  console.log('\nGroup documents:');
  for (const m of members) {
    const group = await Group.findById(m.groupID).lean();
    console.log(`  groupID=${m.groupID} → found=${!!group}`, group ? JSON.stringify(group) : 'NOT FOUND');
  }

  // Step 3: run the exact aggregation used by getMyGroups
  console.log('\nAggregation result:');
  const [result] = await GroupMember.aggregate([
    { $match: { memberID: USER_ID } },
    {
      $facet: {
        total: [{ $count: 'count' }],
        members: [
          { $skip: 0 },
          { $limit: 10 },
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
          { $unwind: { path: '$groupData', preserveNullAndEmptyArrays: true } },
        ],
      },
    },
  ]);

  console.log('  total:', JSON.stringify(result.total));
  console.log('  members:', JSON.stringify(result.members));

  await mongoose.disconnect();
};

run().catch(err => { console.error(err); process.exit(1); });
