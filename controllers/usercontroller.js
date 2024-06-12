const { user, thought } = require('../models');

module.exports = {
    //gets all users
    async getAllUsers(req, res) {
        try{
            //pulls all users and puts them into the response
            const getUsers = await user.find();
            res.json(getUsers);
        }catch (error){
            res.status(500).json(error);
            console.error(error)
        }
    },
    //get all users by id 
    async getUserById(req, res) {
        try{
            //pulls a user and populates with all thoughts and friends
            const userById = await user.findOne({ _id: req.params.userId })
            .populate('thoughts')
            .populate('friends');
            if(!userById) {
                return res.status(404).json({ message: `${req.params.userId} not found` })
            }
            //respond with single user
            res.json(userById);
        }catch (err){
            res.status(500).json(err);
        }
    },
    //add a new user 
    async addUser(req, res) {
        try{
            // creates new user and sends it in response
            const newUser = await user.create(req.body);
            res.json(newUser);
        }catch (err) {
            res.status(500).json(err)
        }
    },
    //modify existing user 
    async modUser (req, res) {
        try{
            // gets user then sets new data and validates it 
            const modUser = await user.findOneAndUpdate(
                { _id: req.params.userId },
                { $set: req.body },
                { runValidators: true, new: true }
            );
            //if no user then throw a message
            if(!modUser) {
                return res.status(404).json({ message: `${req.params.userId} not found` })
            }
            res.json(modUser);
        }catch (err) {
            res.status(500).json(err)
        }
    },

    //destroy a user 
    async destUser (req, res) {
        try{
            const deleteUser = await user.findOneAndDelete({ _id: req.params.userId });
            //finds user and if it doesnt exist throw a message 
            if(!deleteUser) {
                res.status(404).json({ message: `${req.params.userId} not found` })
            }
            //iterates over every thought and then deletes them
            for(let i = 0; i < deleteUser.thoughts.length; i++ ){
                await deleteUser.findByIdAndDelete({ _id: deleteUser.thoughts[i]._id })
            }
            res.json({ message: 'user deleted and thoughts deleted' })
        }catch(err) {
            res.status(500).json(err);
            console.error(err)
        }
    },

    //add a friend for a user
    async addFriend(req, res) {
        try {
            console.log('Request params:', req.params);
            
            const addUserFriend = await user.findOne({ _id: req.params.userId });
            const addFriend = await user.findOne({ _id: req.params.friendId });
    
            console.log('Add user friend:', addUserFriend);
            console.log('Add friend:', addFriend);
    
            // Check if both users exist
            if (!addUserFriend || !addFriend) {
                if (!addUserFriend) {
                    console.log(`No user found with id: ${req.params.userId}`);
                    return res.status(404).json({ error: `No user found with id: ${req.params.userId}` });
                } else if (!addFriend) {
                    console.log(`No user found with id: ${req.params.friendId}`);
                    return res.status(404).json({ error: `No user found with id: ${req.params.friendId}` });
                }
            }
    
            // Check if the friend list exists and if the friend is already in the list
            if (!addUserFriend.friendList.includes(addFriend._id)) {
                // Add the friend's ID to the user's friend list
                console.log('Adding friend to friend list');
                addUserFriend.friendList.push(addFriend._id);
                await addUserFriend.save();
    
                console.log('Friend added to friend list');
                return res.status(200).json({ message: `${addFriend.username} added to ${addUserFriend.username}'s friend list` });
            } else {
                console.log('User already in friend list');
                return res.json({ message: 'User already in friend list' });
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error' });
            console.log("errored out");
        }
    },

    //remove friend from friends list 
    async destFriend (req, res) {
        try{
            const destUserFriend = await user.findOne({_id: req.params.userId});
            const destfriend = await user.findOne({_id: req.params.friendId});
            //finds user and friends associated with request 
            //checks to make sure user and friends exist 
            if (!destUserFriend || !destfriend){
                if (!destUserFriend) {
                    return res.status(404).json({ error: `no id matching : ${destUserFriend}` })
                } else if (!destfriend) {
                    return res.status(404).json({ error: `no id matching: ${destfriend}` })
                }
            }
            // disassociates user and friend then saves
            if (destUserFriend.friendList.includes(friend._id)){
                destUserFriend.friendList.pop(friend._id);
                destUserFriend.save();
                res.status(200).json({ message: `${destfriend.username} removed from ${destUserFriend.username}` })
            } else {
                return res.status(404).json({ message: `${destfriend.username} is not in ${destUserFriend.username}` })
            }
        }catch(err){
            res.status(500).json(err);
            console.error(err);
        }
    }
};