const prisma = require('../config/prisma') //import ตัวแปร prisma ที่เรา export มาจากไฟล์ config/prisma.js

//function สำหรับสร้าง category ใหม่
exports.create = async(req,res) =>{
    try{
        const { name } = req.body //ดึงข้อมูล name จาก req.body ที่ client ส่งมา
        const category = await prisma.category.create({
            data:{
                name: name
            }
        })
        res.send(category)
    }catch(error){
        console.log(error)
        res.status(500).json({ message: "Server Error" })
    }
}

//function สำหรับดึงข้อมูล category ทั้งหมด
exports.list = async(req, res) =>{
    try{
        const category = await prisma.category.findMany() //ดึงข้อมูล category ทั้งหมดจาก database
        res.send(category)
    }catch(error){
        console.log(error)
        res.status(500).json({ message: "Server Error" })
    }
}

//function สำหรับลบ category
exports.removeCategory = async(req, res) =>{
    try{
        //req.params.id คือการดึง id ที่มากับ path เช่น /category/123 ก็จะได้ 123 ออกมา
        const {id} = req.params //req.params คือการดึงพารามิเตอร์ที่มากับ URL เช่น /category/:id
        // console.log("id ที่จะลบคือ ",id)
        const category = await prisma.category.delete({
            where:{
                id: Number(id) //แปลง id ที่ได้จาก req.params.id (string) เป็น number ก่อนนำไปใช้
            }
        })
        res.send(category)
    }catch(error){
        console.log(error)
        res.status(500).json({ message: "Server Error" })
    }
}
