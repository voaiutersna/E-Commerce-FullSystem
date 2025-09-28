const express = require('express');
const router = express.Router();

//import controller
const { create , list ,removeCategory} = require('../controllers/category')

//@ENDPOINT http://localhost:5001/api/category
// router.get('/category',(req,res)=>{
//     //callback function
//     res.send("Category page")
// })

router.post('/category',create)
router.get('/category' ,list)
router.delete('/category/:id',removeCategory)


module.exports = router; //อย่าลืม export ออกไปด้วย