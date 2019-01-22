'use strict';

import mongoose from 'mongoose'
import adminData from '../../InitData/admin'

const Schema = mongoose.Schema;

const adminSchema = new Schema({
	id: Number,
	user_name: String,
	password: String,
	create_time: String,
	admin: {type: String, default: '管理员'},
	status: Number,
	avatar: {type: String, default: 'default.jpg'},
	city: String,
})

adminSchema.index({id: 1});
const Admin = mongoose.model('Admin', adminSchema);
Admin.findOne((err, data) => {
	if (!data) {
		Admin.create(adminData);
	}
});

export default Admin
