'use strict';

import mongoose from 'mongoose'
import userData from '../../InitData/user'

const Schema = mongoose.Schema;

const userSchema = new Schema({
	user_id: Number,
	username: String,
	password: String,
})

const User = mongoose.model('User', userSchema);
User.findOne((err, data) => {
	if (!data) {
		User.create(userData);
	}
});

export default User