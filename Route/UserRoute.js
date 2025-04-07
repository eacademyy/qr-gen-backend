const express = require('express')

const router = express.Router()

const {testuser, reguser, loginuser, addlinkqr, getqrlinks, logoutuser, forgetpass, resetpass, deleteqr, editqr,} = require('../Controller/UserController')

const uAuth = require('../Middleware/UserAuthentication')

// http://localhost:5000/userapi/testuser
router.get('/testuser',uAuth,testuser)

// http://localhost:5000/userapi/getqrlinks
router.get('/getqrlinks',uAuth,getqrlinks)

// http://localhost:5000/userapi/deleteqr/:qrid
router.get('/deleteqr/:qrid',uAuth,deleteqr)

// http://localhost:5000/userapi/editqr/:qrid
router.post('/editqr/:qrid',uAuth,editqr)

// http://localhost:5000/userapi/logoutuser
router.get('/logoutuser',uAuth,logoutuser)

// http://localhost:5000/userapi/addlinkqr
router.post('/addlinkqr',uAuth,addlinkqr)

// http://localhost:5000/userapi/reguser
router.post('/reguser',reguser)

// http://localhost:5000/userapi/loguser
router.post('/loguser',loginuser)

// http://localhost:5000/userapi/forgetpass
router.post('/forgetpass',forgetpass)

// http://localhost:5000/userapi/reset-pass/token
router.post('/reset-pass/:token',resetpass)

module.exports = router