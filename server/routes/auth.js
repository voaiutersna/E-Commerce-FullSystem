// 1.import
const express = require('express');
const router = express.Router();

//import controller
const { register ,login ,currentUser,currentAdmin} = require('../controllers/auth');

router.post('/register' ,register) //เมื่อมีการ get ที่ path /register ให้ไปทำงานที่ฟังก์ชัน register ที่เราimport มา
router.post('/login' ,login) //เมื่อมีการ post ที่ path /login ให้ไปทำงานที่ฟังก์ชัน login ที่เราimport มา
router.post('/current-user',currentUser)
router.post('/current-admin',currentUser)


module.exports = router;