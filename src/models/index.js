// Central model loader — ensures all models are registered with Mongoose on startup
// so collections and indexes are created even before the first document is inserted.

require('./User');
require('./Expense');
require('./Group');
require('./GroupMember');
