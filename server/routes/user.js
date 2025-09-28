const express = require('express')
const router = express.Router()

//import controller
const { listuser ,changeStatus , changeRole , userCart ,getUserCart , emptyCart, saveAddress, saveOrder, getOrder} = require('../controllers/user')
const { authCheck, adminCheck } = require('../middlewares/authCheck')
 //argument 1 path , argument 2 controller ที่จะไปทำงาน

 //admin manage
router.get('/users',authCheck,adminCheck,listuser)
router.post('/change-status',authCheck,adminCheck,changeStatus)
router.post('/change-role',authCheck,adminCheck,changeRole)

//user manage
router.post('/user/cart',authCheck,userCart)
router.get('/user/cart',authCheck,getUserCart)
router.delete('/user/cart',authCheck,emptyCart)

router.post('/user/address',authCheck,saveAddress)

router.post('/user/order',authCheck,saveOrder)
router.get('/user/orders',authCheck,getOrder)

module.exports = router;