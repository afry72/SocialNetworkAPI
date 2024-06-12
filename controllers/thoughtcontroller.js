const { user, thought } = require('../models');
//export every function for routes
module.exports = {
    //get all thoughts
    async getAllThoughts (req, res) {
        try{
            const allThoughts = await thought.find()
            res.json(allThoughts);
        }catch (err) {
            res.status(500).json(err);
            console.error(err);
        }
    },
    //getting individual thoughts
    async getThoughtById (req, res) {
        try{
            //getting individual thought and then populating reactions
            const thoughtById = await thought.findOne({ _id: req.params.thoughtId })
            .populate('reactions');
            //if no thoughts then send message
            if(!thoughtById){
                return res.status(404).json({ message: `${req.params.thoughtId} not found` });
            }
            //respond with items
            res.json(thoughtById);
        }catch (err) {
            res.status(500).json(err);
            console.error(err);
        }
    },
    //add a new thought
    async addThought (req, res) {
        try{
            const addThought = await thought.create(req.body);
            //pulling all thoughts and users
            const addUserThought = await user.findOne({ _id: req.body.userId });
            //if no thoughts then send message
            if(!addUserThought) {
                return res.status(404).json({ error: `${req.body.userId} not found` })
            };
            //push new thought into db
            addUserThought.thoughts.push(addThought);
            await addUserThought.save();
            //wait for save then respond
            res.json(addThought);
        }catch (err) {
            res.status(500).json(err);
            console.error(err);
        }
    },
    //modify an existing thought
    async modThought (req, res) {
        try{
            //query all thoughts, set new data, then validate it 
            const modThought = await thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $set: req.body },
                { runValidators: true, new: true }
            )
            // if thought doesnt exist send message
            if(!modThought) {
                return res.status(404).json({ message: `${req.params.thoughtId} not found` })
            }
            res.json(modThought)
        }catch (err) {
            res.status(500).json(err);
            console.error(err);
        }
    },
    //destroy specific thought
    async destThought (req, res) {
        try{
            //find thought by id and then delete it 
            const destroyThought = await thought.findOneAndDelete({ _id: req.params.thoughtId });
            if(!destroyThought){
                return res.status(404).json({ message: `${req.params.thoughtId} not found` })
            }
            //respond and send message
            res.json({ message:`${req.params.thoughtId} deleted` })
        }catch (err) {
            res.status(500).json(err);
            console.error(err);
        }
    },
    //add a reaction to a thought
    async addReact (req, res) {
        try{
            //find reactions
            console.log('Request body:', req.body);
            console.log('Thought ID:', req.params.thoughtId);
            const addReactThought = await thought.findOne({ _id: req.params.thoughtsId });
            console.log('Found thought:', addReactThought);
            //if no reactions throw message
            if(!addReactThought){
                return res.status(404).json({ error: `${req.params.thoughtId} not found2` });
            }
            //request body will be react
            const react = req.body;
            //checks both reacts and user
            if(!react.reactBody || !react.username) {
                if (!react.reactBody){
                    return res.status(400).json({ message: `include reaction` })
                } else if (!react.username) {
                    return res.status(400).json({ message: `include username` })
                }
            }
            //push the reactions to the db
            addReactThought.reactions.push({
                reactBody: react.reactBody,
                username: react.username
            })
            addReactThought.save();
            //respond with message
            res.status(200).json({ message: 'reaction added succesfuly' })
        }catch(err){
            res.status(500).json(err);
            console.error(err)
        }
    },
    //destroy a reaction
    async destReact(req, res) {
        try {
            //pull ideas and put them into a const
            const thoughtId = req.params.thoughtId;
            const reactionId = req.params.reactionId;

            console.log('Thought ID:', thoughtId);
            console.log('Reaction ID:', reactionId);
            //pull existing reacts by id 
            const destReactThought = await thought.findOne({ _id: thoughtId });
            //if nothing to destroy throw error
            if (!destReactThought) {
                return res.status(404).json({ error: `${thoughtId} not found` });
            }
            // finds a thought associated with a react and puts them together
            const reactionIndex = destReactThought.reactions.findIndex((react) => String(react._id) === reactionId);
            if (reactionIndex === -1) {
                return res.status(404).json({ error: `${reactionId} not found` });
            }
            //removes one element from the reactions array
            destReactThought.reactions.splice(reactionIndex, 1);
            await destReactThought.save();
            res.status(200).json({ message: 'Reaction deleted' });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: 'Server Error' });
        }
    }
};
//