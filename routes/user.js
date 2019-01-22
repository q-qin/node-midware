'use strict';

import express from 'express';
import CityHandle from '../controller/common/cities'
import User from '../controller/user/user'
const router = express.Router();

router.get('/pois/:geohash', CityHandle.pois);
router.post('/login', User.login);
router.get('/signout', User.signout);
router.post('/changepassword', User.chanegPassword);

router.get('/user', User.getInfo);
router.get('/user/:user_id', User.getInfoById);
router.get('/user/city/count', User.getUserCity);

router.get('/users/list', User.getUserList);
router.get('/users/count', User.getUserCount);
router.post('/users/:user_id/avatar', User.updateAvatar)


export default router