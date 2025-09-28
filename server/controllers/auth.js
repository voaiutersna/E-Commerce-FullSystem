//โหลดclient ของ prisma มาใช้
const prisma = require('../config/prisma') //import ตัวแปร prisma ที่เรา export มาจากไฟล์ config/prisma.js
const bcrypt = require('bcryptjs') //import bcryptjs มาใช้
const jwt = require('jsonwebtoken') //import jsonwebtoken มาใช้สร้าง token


exports.register = async (req,res)=>{
    //callback function
    const { email,password } = req.body //ดึงข้อมูล email กับ password จาก req.body ที่ client ส่งมา
    console.log(email,password)
    try{
        // res.send("Register page In controllers") //res.send() รับได้แค่พารามิเตอร์เดียว
        
        //step1 validate data
        if (!email){
            return res.status(400).json({message:"Email is required"}) //ถ้าไม่มี email ให้ส่ง status 400 กับ json message กลับไป
        }
        if (!password){
            return res.status(400).json({message:"Password is required"}) //ถ้าไม่มี password ให้ส่ง status 400 กับ json message กลับไป
        }

        //step2 check email in database (มีแล้วหรือยัง)
        const user = await prisma.user.findFirst({
            where:{
                email:email //ค้นหา user ที่มี email ตรงกับ email ที่ client ส่งมา
            }
        })
        if(user){ //ถ้าเจอ user ที่มี email (จากuser table) ตรงกับ email ที่ client ส่งมา
            return res.status(400).json({message:"Email is already exists"})
        }

        //step3 hash password (เข้ารหัส password)
        const hashPassword = await bcrypt.hash(password,10) //ใช้ bcryptjs ในการ hash password โดยใช้ saltRounds = 10
        console.log("hashPassword: ",hashPassword)

        //step4 save user in database
        const newUser = await prisma.user.create({
            data:{
                email:email,
                password:hashPassword //เก็บรหัสผ่านที่ถูกเข้ารหัสแล้วลง database
            }
        })
        res.send("Register successfully")
    }catch(error){
        console.log(error)
        res.status(500).json({ message: "Server Error" })
    }
}

exports.login = async (req,res)=>{
    //callback function
    try{
        //รับ email กับ password จาก req.body ที่ client ส่งมา
        const {email,password} = req.body
        console.log(email,password)

        //step1 check email
        const user = await prisma.user.findFirst({
            where:{email:email}
        })
        if(!user || !user.enabled){ //ถ้าไม่เจอ user ที่มี email (จากuser table) ตรงกับ email ที่ client ส่งมา หรือ user ถูก disabled
            return res.status(400).json({message:"User not found or User disabled"})
        }
        //step2 password
        const isMatch = await bcrypt.compare(password,user.password) //เปรียบเทียบ password ที่ client ส่งมา กับ password ที่เก็บใน database (ซึ่งถูกเข้ารหัสแล้ว)
        if (isMatch === false){ //ถ้า password ไม่ตรงกัน
            return res.status(400).json({message:"Password is incorrect!"})
        }
        //step3 create payload
        const payload = { //ข้อมูลที่เราต้องการเก็บใน token ไว้เพื่อใช้ตรวจสอบสิทธิ์การเข้าถึงข้อมูลต่างๆ
            id: user.id,
            email: user.email,
            role : user.role
        }
        console.log(payload)
        //step4 generate token (jwt)
        jwt.sign(payload,process.env.SECRET,{
            expiresIn: '1d' //1 day
        },(err,token)=>{
            if(err){
                return res.status(500).json({message:"server error"})
            }
            res.json({payload, token}) //ส่ง payload กับ token กลับไปให้ client
        })
    }catch(error){
        console.log(error)
        res.status(500).json({ message: "Server Error" })
    }
}

exports.currentUser = async (req,res)=>{
    //callback function
    try{
        res.send("Current user page In controllers")
    }catch(error){
        console.log(error)
        res.status(500).json({ message: "Server Error" })
    }
}


