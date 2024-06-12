const { Schema, model } = require('mongoose');
//creates a schema for users, uses email regex to verify email
const userScm = new Schema(
    {
        username: {  type: String, unique: true, trimmed: true, required: true},
        email: {type: String, unique: true, match: /^([a-z0-9_.-]+)@([\da-z.-]+).([a-z.]{2,6})$/, required: true},
        thoughts: [
            {
                type: Schema.Types.ObjectId,
                ref: 'thought'
            }
        ],
        friendList: [
            {
                type: Schema.Types.ObjectId,
                ref: 'user'
            }
        ]
    },
    {
        toJSON: {virtuals: true}, id: false
    }
);
//return the count of friends listed for each user document
userScm.virtual('friendCount').get(function () {
    return this.friendList.length;
})


const user = model('user', userScm);

module.exports = user; 