//middleware สำหรับตรวจสอบการ authentication
//ถ้า user ผ่านการตรวจสอบแล้ว ให้เรียก next() เพื่อไปทำงานใน controller ต่อ
//ถ้าไม่ผ่าน ให้ส่ง res.status(401).send("Unauthorized") กลับไป

const jwt = require('jsonwebtoken')
const prisma = require('../config/prisma')
exports.authCheck = async ( req , res , next) => {
    try{
        //รับ token จาก header
        const headerToken = req.headers.authorization
        console.log("headerToken: ",headerToken)
        
        if(!headerToken){ //No token
            return res.status(401).json({message:"No token, Unauthorized"})
        }
        const token = headerToken.split(" ")[1]
        console.log(token)
        //decode token เพื่อดึงข้อมูล user (ดึงจาก payload ตอนsign in ) และ verify token
        const decode = jwt.verify(token, process.env.SECRET) //ถ้า token ผิดก็จะ error เลย

        //req.user = decoded //เก็บข้อมูล user ที่ได้จาก token ไว้ใน req.user เพื่อให้ controller เอาไปใช้ต่อได้
        req.user = decode
        console.log("req user:",req.user)
        //example req user data (return json)
        //req user: { id: 2, email: 'tt', role: 'user', iat: 1759042105, exp: 1759128505 }

        //check user is in database
        const user = await prisma.user.findFirst({
            where:{
                email: req.user.email
            }
        })

        //check enable account
        if (!user.enabled) {
            return res.status(400).json({message:"This account is not avalible!!!"})
        }

        //if all passed
        next()
    }catch(error){
        console.log(error)
        res.status(500).send("server error")
    }
}

// ทำไม jwt.verify() ได้ข้อมูลทั้งๆ ที่ไม่แตะ Database?
    // JWT เป็นโทเคนแบบ self-contained (มีข้อมูลอยู่ในตัวมันเอง): ตอน login ฝั่งเซิร์ฟเวอร์ sign เอา payload (เช่น { id, email, role }) มาเข้ารหัสและ ลงลายเซ็น ด้วย SECRET แล้วส่งให้ลูกค้า
    // เวลาเรียก API กลับมา คุณทำ jwt.verify(token, SECRET):
    // ตรวจลายเซ็น ว่าโทเคนไม่ถูกแก้ไข (integrity)
    // ถ้าถูกต้อง จะ ถอด payload ออกมาได้เลย → จึง “เห็นข้อมูล” โดย ไม่ต้องไป DB
    // สรุป: การได้ข้อมูลจาก verify คือการอ่าน payload ที่อยู่ในโทเคน ไม่ใช่การดึงจาก DB ครับ
    // หมายเหตุ: jwt.decode(token) แค่ถอดอ่าน payload แต่ไม่ตรวจลายเซ็น; ส่วน jwt.verify() ถอด + ตรวจลายเซ็น

// ทำไมต้องเอา decoded ใส่ req.user?
    // ใส่เพื่อความสะดวกและเป็น มาตรฐานกลางของแอป:
    // ให้ middleware/route ถัดไปเข้าถึงผู้ใช้ได้ง่าย โดยอ่าน req.user แทนที่จะให้ทุกไฟล์ไป verify เองซ้ำๆ
    // ลดการพึ่งพาโทเคนดิบ (ไม่ต้องพก token วิ่งไปทุกที่)
    // โครงสร้างชัดเจน: อะไรที่ “ยืนยันตัวตนแล้ว” จะถูกแนบไว้ที่ req.user เสมอ

exports.adminCheck = async (req,res,next) =>{
    try{
        const { email } = req.user
        console.log("email:",email)
        const adminUser = await prisma.user.findFirst({
            where:{ email: email}
        })
        if(!adminUser || adminUser.role != "admin")
            return res.status(403).json({message:"Access Denied: Admin only..."})
        // console.log(adminUser)
        next()
    }catch(error){
        console.log(error)
        res.status(500).json({message:"Error cannot acces to admin"})
    }
}
