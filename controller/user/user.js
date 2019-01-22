'use strict';

import AddressComponent from '../../prototype/addressComponent'
import formidable from 'formidable'
import crypto from 'crypto'
import dtime from 'time-formater'
import UserInfoModel from '../../models/user/userInfo'
import UserModel from '../../models/user/user'

class User extends AddressComponent {
	constructor(){
		super()
		this.login = this.login.bind(this);
		this.encryption = this.encryption.bind(this);
		this.chanegPassword = this.chanegPassword.bind(this);
		this.updateAvatar = this.updateAvatar.bind(this);
	}
	async login(req, res, next){
		const form = new formidable.IncomingForm();
		form.parse(req, async (err, fields, files) => {
			const {username, password} = fields;
			try{
				if (!username) {
					throw new Error('用户名参数错误');
				}else if(!password){
					throw new Error('密码参数错误');
				}
			}catch(err){
				console.log('登陆参数错误', err);
				res.send({
					code: -1,
					msg: err.message,
				})
				return
			}
			const newpassword = this.encryption(password);
			try{
				const user = await UserModel.findOne({username});
				//创建一个新的用户
				if (!user) {
					res.send({
						code: -1,
						msg: '暂无用户',
					})
					return 
				}else if (user.password.toString() !== newpassword.toString()) {
					res.send({
						code: -1,
						msg: '密码错误',
					})
					return 
				}else{
					req.session.user_id = user.user_id;
					const userinfo = await UserInfoModel.findOne({user_id: user.user_id}, '-_id');
					res.send({
						code:0,
						data:userinfo
					}) 
				}
			}catch(err){
				res.send({
					code: -1,
					msg: '登陆失败',
				})
			}
		})
	}
	async getInfo(req, res, next){
		const sid = req.session.user_id;
		const qid = req.query.user_id;
		const user_id = sid || qid;
		if (!user_id || !Number(user_id)) {
			res.send({
				code: -1,
				msg: '通过session获取用户信息失败',
			})
			return 
		}
		try{
			const userinfo = await UserInfoModel.findOne({user_id}, '-_id');
			res.send({
				code:0,
				data:userinfo
			}) 
		}catch(err){
			console.log('通过session获取用户信息失败', err);
			res.send({
				code: -1,
				msg: '通过session获取用户信息失败',
			})
		}
	}
	async getInfoById(req, res, next){
		const user_id = req.params.user_id;
		if (!user_id || !Number(user_id)) {
			console.log('通过ID获取用户信息失败')
			res.send({
				code: 0,
				msg: '通过用户ID获取用户信息失败',
			})
			return 
		}
		try{
			const userinfo = await UserInfoModel.findOne({user_id}, '-_id');
			res.send({
				code:0,
				data:userinfo
			}) 
		}catch(err){
			console.log('通过用户ID获取用户信息失败', err);
			res.send({
				code: -1,
				msg: '通过用户ID获取用户信息失败',
			})
		}
	}
	async signout(req, res, next){
		delete req.session.user_id;
		res.send({
			code: 0,
			msg: '退出成功'
		})
	}
	async chanegPassword(req, res, next){
		const form = new formidable.IncomingForm();
		form.parse(req, async (err, fields, files) => {
			const {username, oldpassWord, newpassword, confirmpassword, captcha_code} = fields;
			try{
				if (!username) {
					throw new Error('用户名参数错误');
				}else if(!oldpassWord){
					throw new Error('必须添加旧密码');
				}else if(!newpassword){
					throw new Error('必须填写新密码');
				}else if(!confirmpassword){
					throw new Error('必须填写确认密码');
				}else if(newpassword !== confirmpassword){
					throw new Error('两次密码不一致');
				}
			}catch(err){
				console.log('修改密码参数错误', err);
				res.send({
					code: -1,
					msg: err.message,
				})
				return
			}
			if (cap.toString() !== captcha_code.toString()) {
				res.send({
					code: -1,
					msg: '验证码不正确',
				})
				return
			}
			const md5password = this.encryption(oldpassWord);
			try{
				const user = await UserModel.findOne({username});
				if (!user) {
					res.send({
						code: -1,
						msg: '未找到当前用户',
					})
				}else if(user.password.toString() !== md5password.toString()){
					res.send({
						code: -1,
						msg: '密码不正确',
					})
				}else{
					user.password = this.encryption(newpassword);
					user.save();
					res.send({
						code: 0,
						msg: '密码修改成功',
					})
				}
			}catch(err){
				console.log('修改密码失败', err);
				res.send({
					code: -1,
					msg: '修改密码失败',
				})
			}
		})
	}
	encryption(password){
		const newpassword = this.Md5(this.Md5(password).substr(2, 7) + this.Md5(password));
		return newpassword
	}
	Md5(password){
		const md5 = crypto.createHash('md5');
		return md5.update(password).digest('base64');
	}
	async getUserList(req, res, next){
		const {limit = 20, offset = 0} = req.query;
		try{
			const users = await UserInfoModel.find({}, '-_id').sort({user_id: -1}).limit(Number(limit)).skip(Number(offset));
			res.send(users);
		}catch(err){
			console.log('获取用户列表数据失败', err);
			res.send({
				code: -1,
				msg: '获取用户列表数据失败'
			})
		}
	}
	async getUserCount(req, res, next){
		try{
			const count = await UserInfoModel.count();
			res.send({
				code: 0,
				data:count,
			})
		}catch(err){
			console.log('获取用户数量失败', err);
			res.send({
				code: -1,
				msg: '获取用户数量失败'
			})
		}
	}
	async updateAvatar(req, res, next){
		const sid = req.session.user_id;
		const pid = req.params.user_id;
		const user_id = sid || pid;
		if (!user_id || !Number(user_id)) {
			console.log('更新头像，user_id错误', user_id)
			res.send({
				code: -1,
				msg: 'user_id参数错误',
			})
			return 
		}

		try{
			const image_path = await this.getPath(req);
			await UserInfoModel.findOneAndUpdate({user_id}, {$set: {avatar: image_path}});
			res.send({
				code: 0,
				data:image_path,
			})
		}catch(err){
			console.log('上传图片失败', err);
			res.send({
				code: -1,
				msg: '上传图片失败'
			})
		}
	}
	async getUserCity(req, res, next){
		const cityArr = ['北京', '上海', '深圳', '杭州'];
		const filterArr = [];
		cityArr.forEach(item => {
			filterArr.push(UserInfoModel.find({city: item}).count())
		})
		filterArr.push(UserInfoModel.$where('!"北京上海深圳杭州".includes(this.city)').count())
		Promise.all(filterArr).then(result => {
			res.send({
				code: 0,
				user_city: {
					beijing: result[0],
					shanghai: result[1],
					shenzhen: result[2],
					hangzhou: result[3],
					qita: result[4],
				}
			})
		}).catch(err => {
			console.log('获取用户分布城市数据失败', err);
			res.send({
				code: -1,
				msg: '获取用户分布城市数据失败'
			})
		})
	}
} 

export default new User()