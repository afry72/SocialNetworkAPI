const { Schema, model } = require('mongoose');

//creating schema for reactions
const reactScm = new Schema(
    {
        reactBody: { type: String, required: true, maxlength: 200},

        username: {type: String, required: true},

        timeStamp: {type: Date, default: Date.now}
    }
);

//creating schema for thoughts and relating it to reaction
const thoughtScm = new Schema(
    {
        thoughtText: {type: String, required: true},
        username: {type: String, required: true},
        timeStamp: {type: Date, default: Date.now},
        reactions: [reactScm]
    },
    {
        toJSON: {virtuals: true}, id: false
    }
);
//creates a virtual property in the thought schema and returns reaction count
thoughtScm.virtual('reactionCount').get(function () {
    return this.reactions.length;
});

const thought = model('thought', thoughtScm);

module.exports = thought;
