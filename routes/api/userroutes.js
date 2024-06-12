const router = require('express').Router();
//getting users, adding user, modifying user, getting friends, removing friends
const {
    getAllUsers,
    getUserById,
    addUser,
    modUser,
    destUser,
    addFriend,
    destFriend
} = require('../../controllers/usercontroller');
//get users and add users
router.route('/').get(getAllUsers).post(addUser);
// get user by id modify user and delete user 
router.route('/:userId').get(getUserById).put(modUser).delete(destUser);
//add a friend and remove a friend 
router.route('/:userId/friendList/:friendId').post(addFriend).delete(destFriend);

module.exports = router;
