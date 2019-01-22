'use strict'

import express from 'express'
import News from '../controller/news/news'

const router = express.Router()

router.get('/count', News.getNewsCount)
router.get('/list', News.getNewsList)
router.get('/detail', News.getNewsDetail)
router.post('/add', News.addNews)
router.post('/edit', News.editNews)

router.get('/pullJDNewsType',News.pullJDNewsType)
router.get('/pulljdnews',News.pullJDNews)
router.get('/getjdnews',News.getJDNews)

export default router