const express = require('express')
const router = express.Router()

//import controller
const { create ,list,update,removeProduct,listby,searchFilters,read} = require('../controllers/product')

//@ENDPOINT http://localhost:5000/api/product
router.post('/product',create) //argument 1 คือ path , argument 2 คือ controller ที่จะไปทำงาน
router.get('/products/:count',list)
router.put('/product/:id',update)
router.get('/product/:id',read)
router.delete('/product/:id',removeProduct)
router.post('/productby',listby)
router.post('/search/filters',searchFilters)


module.exports = router;