--SETUP--

# ดู package.json ยืนยันว่ามี express อยู่จริง
cat package.json

# ลง dependencies ทั้งหมด (รวม express)
npm install

1. create file .env ระดับ root project(folder server)
   1.1 SECRET = ###############
   1.2 DATABASE_URL="mysql://root:PASSWORD@localhost:3306/DATABASENAME"

2. prisma setup
    # ให้ Prisma คุยกับ DB
    npx prisma db pull (check ว่าconnectได้ไหม)
    npx prisma generate

HOW TO CHECK PASSWORD mysql
ลอง connect:
mysql -u root -p

ใส่:password
ถ้าถูก → เข้าได้
ถ้าผิด → มันจะถามใหม่