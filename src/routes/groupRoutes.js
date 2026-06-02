const express = require('express');
const router  = express.Router();
const auth    = require('../middleware/authMiddleware');
const group   = require('../controllers/groupController');

router.post('/my-groups', auth, group.getMyGroups);
router.post('/',          auth, group.createGroup);
router.put('/',           auth, group.updateGroup);
router.delete('/',        auth, group.deleteGroup);

module.exports = router;
