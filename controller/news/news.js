'use strict';

import BaseComponent from '../../prototype/baseComponent'
import https from 'https';
import formidable from 'formidable'
import NewsModel from '../../models/news/news'
import dtime from 'time-formater'

const jdkey = '888fc96f79882a6205f53f6d7ceab0d6';
const jdapi = 'https://way.jd.com';

class News extends BaseComponent{
	constructor(){
		super()
		this.getNewsCount = this.getNewsCount.bind(this)
		this.getNewsList = this.getNewsList.bind(this)
		this.getNewsDetail = this.getNewsDetail.bind(this)
		this.addNews = this.addNews.bind(this)
		this.editNews = this.editNews.bind(this)
		this.pullJDNewsType = this.pullJDNewsType.bind(this)
		this.pullJDNews = this.pullJDNews.bind(this)
		this.getJDNews = this.getJDNews.bind(this)
	}
	async addNews(req,res,next){
		// const admin_id = req.params.admin_id;
		// if (!admin_id || !Number(admin_id)) {
		// 	console.log('用户ID格式不正确')
		// 	res.send({
		// 		status: -1,
		// 		message: '用户ID无效',
		// 	})
		// 	return 
		// }
		const form = new formidable.IncomingForm();
		form.parse(req, async (err, fields, files) => {
			//const {title, sub_title, type,description,sort,admin_id} = fields;
			try{
				if (!fields.admin_id) {
					throw new Error('用户ID无效');
				}
			}catch(err){
				console.log('用户ID格式不正确', err.message);
				res.send({
					code: -1,
					msg: err.message
				})
				return
			}
			const newNews = {
				title: fields.title,
				sub_title: fields.sub_title,
				type: fields.type,
				description: fields.description,
				sort: fields.sort,
				update_user:fields.admin_id,
				update_time:dtime().format('YYYY-MM-DD HH:mm:ss'),
			}
			try{
				await NewsModel.create(newNews);
				res.send({
					code: 0,
					msg: '添加资讯成功',
				});
			}catch(err){
				console.log('保存资讯到数据库失败', err);
				res.send({
					code: -1,
					msg: '添加资讯失败'
				})
			}
		})
	}

	async editNews(req,res,next){
		const form = new formidable.IncomingForm();
		form.parse(req, async (err, fields, files) => {
			const {_id,title, sub_title, type,description,sort,admin_id} = fields;
			
			try{
				var newData = {
					title:title,
					sub_title:sub_title,
					type:type,
					description:description,
					sort:sort,
					update_user:admin_id,
					update_time: dtime().format('YYYY-MM-DD HH:mm:ss'),
				}
				await NewsModel.findByIdAndUpdate({_id}, {$set: newData})
				res.send({
					code: 0,
					msg: '资讯修改成功',
				})
			}catch(err){
				console.log(err.message, err);
				res.send({
					code: -1,
					msg: '资讯修改失败',
				})
			}
		})
	}

	async delNews(req,res,next){
		const form = new formidable.IncomingForm();
		form.parse(req, async (err, fields, files) => {
			const {ids} = fields;
			
		})
	}

	async getNewsList(req, res, next){
		try{
			const {limit=0, offset=0,tab=''} = req.query;
			if(!Number(limit)){
				throw new Error('limit参数错误')
			}else if(typeof Number(offset) !== 'number'){
				throw new Error('offset参数错误')
			}
			const news = await NewsModel.find({}).sort({sort: -1}).limit(Number(limit)).skip(Number(offset));
			
			res.send({
				code: 0,
				data:news,
			});
			
		}catch(err){
			console.log(err.message, err);
			res.send({
				code: -1,
				msg: err.message
			})
			return 
		}
	}
	async getNewsDetail(req, res, next){

		try{
			const {tid, uid=0} = req.query;
			if(!tid){
				throw new Error('tid参数错误')
			}
			
			const detail = await NewsModel.findById(tid);
			
			res.send({
				code: 0,
				data:detail,
			});
		}catch(err){
			console.log(err.message, err);
			res.send({
				code: -1,
				msg: err.message
			})
			return 
		}
	}

	async getNewsCount(req, res, next){
		try{
			const count = await NewsModel.find({}).count();
			res.send({
				code: 0,
				data:count,
			})
		}catch(err){
			console.log('获取资讯数量失败', err);
			res.send({
				code: -1,
				msg: '获取资讯数量失败'
			})
		}
	}

	// 拉取京东新闻分类
	async pullJDNewsType(req,res,next){
		https.get(jdapi+'/channel?key='+jdkey, (res) => {
			res.on('data', (d) => {
				res.send({
					code: 0,
					data:d,
				})
			})
		}).on('error', (e) => {
		  console.error(e);
		});
	}

	// 拉取京东新闻列表
	async pullJDNews(req,res,next){

	}

	// 获取京东新闻列表
	async getJDNews(req,res,next){

	}
}

export default new News()