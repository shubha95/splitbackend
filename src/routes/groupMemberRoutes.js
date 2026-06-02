const express     = require('express');
const router      = express.Router();
const auth        = require('../middleware/authMiddleware');
const groupMember = require('../controllers/groupMemberController');

router.post('/',              auth, groupMember.addMembers);
router.put('/',               auth, groupMember.updateMember);
router.delete('/',            auth, groupMember.deleteMember);
router.put('/promote',        auth, groupMember.promoteToAdmin);
router.put('/demote',         auth, groupMember.demoteToMember);
router.put('/permissions',    auth, groupMember.updatePermissions);

module.exports = router;
