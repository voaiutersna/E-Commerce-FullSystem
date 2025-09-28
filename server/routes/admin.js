const express = require('express');
const router = express.Router();

const { authCheck , adminCheck} = require('../middlewares/authCheck')
const { changeOrderStatus , geOrderAdmin } = require('../controllers/admin')
router.put('/admin/order-status',authCheck,adminCheck,changeOrderStatus)
router.get('/admin/orders',authCheck,adminCheck,geOrderAdmin)

module.exports = router