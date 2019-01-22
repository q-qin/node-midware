'use strict';

import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const newsSchema = new Schema({
	id: Number,
	title: String,
	sub_title: String,
	type: {
		type: String,
		default: ''
	},
	description: {
		type: String,
		default: ""
	},
	sort: Number,
	delflg: {
		type: Number,
		default: 0
	},
	update_user:Number,
	update_time: { type: Date, default: Date.now },
})

newsSchema.index({
	id: 1
});

const News = mongoose.model('News', newsSchema);

export default News