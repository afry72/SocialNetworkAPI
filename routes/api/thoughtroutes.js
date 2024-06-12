const router = require('express').Router();
//getting thought, adding thought, modifying thought, getting reaction, deleting reaction
const {
    getAllThoughts,
    getThoughtById,
    addThought,
    modThought,
    destThought,
    addReact,
    destReact
} = require('../../controllers/thoughtcontroller');
//get thoughts and add thoughts
router.route('/').get(getAllThoughts).post(addThought);
//get thought from id, modify existing thought and delete thought
router.route('/:thoughtId').get(getThoughtById).put(modThought).delete(destThought);
//add reation
router.route('/:thoughtsId/reacts').post(addReact)
//delete reaction
router.route('/:thoughtId/reacts/:reactionId').delete(destReact);

module.exports = router;
//http://localhost:3001/api/thoughts/66690d06dc85840297012b94/reacts/666910fe27a4fdddc695592b