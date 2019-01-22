'use strict';

import express from 'express'
import BaseComponent from '../prototype/baseComponent'
import CityHandle from '../controller/common/cities'
import Captchas from '../controller/common/captchas'
const baseHandle = new BaseComponent();
const router = express.Router();

router.get('/cities', CityHandle.getCity);
router.get('/cities/:id', CityHandle.getCityById);
router.get('/exactaddress', CityHandle.getExactAddress);
router.get('/pois/:geohash', CityHandle.pois);

router.post('/addimg/:type', baseHandle.uploadImg);
router.post('/captchas', Captchas.getCaptchas);

 
export default router