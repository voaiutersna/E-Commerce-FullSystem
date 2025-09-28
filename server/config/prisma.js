//ไฟล์นี้ใช้สำหรับตั้งค่าและเชื่อมต่อกับฐานข้อมูลโดยใช้ Prisma ORM
//โหลด PrismaClient จากไฟล์ที่สร้างขึ้นในโฟลเดอร์ generated
const { PrismaClient } = require('../generated/prisma') //import PrismaClient class จากไฟล์ที่สร้างขึ้นในโฟลเดอร์ generated

//สร้าง instance ของ PrismaClient
const prisma = new PrismaClient() //ใช้prisma client เพื่อเชื่อมต่อกับ database

module.exports = prisma //ใช้ export ตัวแปร prisma ออกไป เพื่อให้ไฟล์อื่นๆ สามารถ import ไปใช้ได้