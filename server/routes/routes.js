const express = require('express')
const routeHandlers = require('./routeHandlers')

const router = express.Router()

router.get('/', routeHandlers.homepage_get)
router.get('/login', routeHandlers.login_get)
router.post('/login', routeHandlers.login_post)
router.get('/register', routeHandlers.register_get)
router.post('/register', routeHandlers.register_post)
router.get('/logout', routeHandlers.logout_get)
router.get('/blogs', routeHandlers.blogs_get)
router.get('/allblogs', routeHandlers.allblogs_get)
router.post('/create-blog', routeHandlers.create_blog_post)
router.post('/delete-blog', routeHandlers.delete_post)
router.post('/add-comment', routeHandlers.comments_post)

module.exports = {router}