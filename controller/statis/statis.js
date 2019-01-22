'use strict'

import AdminModel from '../../models/admin/admin'
import UserInfoModel from '../../models/user/userInfo'
import StatisModel from '../../models/statis/statis'
import dtime from 'time-formater'

class Statis {
	constructor(){

	}
	async apiCount(req, res, next){
		const date = req.params.date;
		if (!date) {
			console.log('参数错误')
			res.send({
				code: -1,
				msg: '参数错误'
			})
			return
		}
		try{
			const count = await StatisModel.find({date}).count()
			res.send({
				code: 0,
				data:count,
			})
		}catch(err){
			console.log('获取当天API请求次数失败');
			res.send({
				code: -1,
				msg: '获取当天API请求次数失败'
			})
		}
	}
	async apiAllCount(req, res, next){
		try{
			const count = await StatisModel.count()
			res.send({
				code: 0,
				data:count,
			})
		}catch(err){
			console.log('获取所有API请求次数失败');
			res.send({
				code: -1,
				msg: '获取所有API请求次数失败'
			})
		}
	}
	async allApiRecord(req, res, next){
		const date = req.params.date;
		const offset = req.params.offset;
		const limit = req.params.limit;
		if (!date || !offset || !limit) {
			console.log('参数错误')
			res.send({
				code: -1,
				msg: '参数错误'
			})
			return
		}
		try{
			const allRecord = await StatisModel.find({date}, '-_id -__v').limit(Number(limit)).skip(Number(offset))
			res.send({
				code:0,
				data:allRecord
			})
		}catch(err){
			console.log('获取所有API请求信息失败');
			res.send({
				code: -1,
				msg: '获取所有API请求信息失败'
			})
		}
	}
	async userCount(req, res, next){
		const date = req.params.date;
		if (!date) {
			console.log('参数错误')
			res.send({
				code: -1,
				msg: '参数错误'
			})
			return
		}
		try{
			const count = await UserInfoModel.find({registe_time: eval('/^' + date + '/gi')}).count()
			res.send({
				code: 0,
				data:count,
			})
		}catch(err){
			console.log('获取当天注册人数失败');
			res.send({
				code: -1,
				msg: '获取当天注册人数失败'
			})
		}
	}
	async adminCount(req, res, next){
		const date = req.params.date;
		if (!date) {
			console.log('参数错误')
			res.send({
				code: -1,
				msg: '参数错误'
			})
			return
		}
		try{
			const count = await AdminModel.find({create_time: eval('/^' + date + '/gi')}).count()
			res.send({
				code: 0,
				data:count,
			})
		}catch(err){
			console.log('获取当天注册管理员人数失败');
			res.send({
				code: -1,
				msg: '获取当天注册管理员人数失败'
			})
		}
	}
}

export default new Statis()