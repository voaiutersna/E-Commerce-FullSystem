// step1 : import express
const express = require('express'); //ประกาศตัวแปร express เพื่อเรียกใช้ express module
//ประกาศตัวแปร app เพื่อเรียกใช้ express function
const app = express();
const morgan = require('morgan'); //import morgan
const cors = require('cors'); //เป็นการอณุญาติให้ server ของเรา สามารถรับ request จาก client ที่อยู่คนละ host ได้

const {readdirSync} = require('fs'); //import readdirSync จาก fs module

// import router ไฟล์ต่างๆ 
// const authRouter = require('./routes/auth'); //impoprt auth router
// const categoryRouter = require('./routes/category'); //import category router
// app.use('/api',authRouter) //ถ้าเราใช้ app.use('/api',authRouter) หมายความว่า เราจะใช้ router ที่เราimport มา โดยมี path ต้นทางคือ /api
// app.use('/api',categoryRouter)

//middleware (ตัวกลาง) ใน Express middleware คือฟังก์ชันที่ทำงาน ระหว่าง request ของ client → response ของ server
app.use(morgan('dev')); //morgan = middleware สำเร็จรูป เอาไว้ log ข้อมูล request
app.use(express.json()); //middleware สำเร็จรูปของ express เอาไว้แปลงข้อมูล json ที่ client ส่งมาให้เป็น object ใน js 
app.use(cors()); //ใช้ cors เป็น middleware เพื่อ อณุญาติให้ server ของเรา สามารถรับ request จาก client ที่อยู่คนละ host ได้



//ดึงไฟล์ route ทั้งหมดในโฟลเดอร์ routes มาใช้
console.log(readdirSync('./routes')) //ทดสอบว่าอ่านไฟล์ในโฟลเดอร์ routes ได้ไหม (จะได้ array ของชื่อไฟล์ในโฟลเดอร์ routes ออกมา)
readdirSync('./routes').map((item)=> app.use('/api',require('./routes/'+item))) 


//step3 : Router เมื่อมีการ request เข้ามา ที่ path /api ก็จะแสดง res.send("Respone from server...")
// app.post('/api',(req,res)=>{ //get method ใช้สำหรับดึงข้อมูล
//     //callback function
//     // 1.กรณีไม่ได้เอา req ใส่ตัวแปร
//     // console.log("มีการส่งrequestมา | ข้อมูลคือ ",req.body); //แสดงข้อมูลที่ client ส่งมา ซึ่งการ req มาเป็น  json ก็ต้อง แปลงก่อน ด้วย express.json() ไม่งั้นจะเป็น undefined

//     // 2.กรณีเอา req ใส่ตัวแปร
//     const {username,password} = req.body;
//     console.log("มีการส่งrequestมา | ข้อมูลคือ ",username,password);

//     res.send("Respone from server...")
// })


// step2 : start server
//listen(port, [hostname], [backlog], [callback])
// ใช้ทำอะไร?
// เปิดให้ server เริ่มฟัง request ที่วิ่งเข้ามาผ่าน port/host ที่กำหนด
// เป็นจุดเริ่มต้นที่ทำให้ server online
// ถ้าไม่เรียก .listen() server จะไม่เริ่มทำงาน
//callback ใน .listen() มีไว้เพื่อ สั่งให้ทำงานบางอย่างทันทีหลังจาก server เริ่มฟังพอร์ตสำเร็จแล้ว

app.listen(5001,()=>{
    console.log("Server is running on port 5001");
})

















// cd เข้าไฟล์ แล้ว node filename.js
// กด control + c ทุกครั้งเด้อที่จะรันใหม่ (วิธีรันปกติ)

//ถ้าใช้ การรันแบบ nodemon
//npx nodemon server.js