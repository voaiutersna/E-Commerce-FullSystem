//โหลดclient ของ prisma มาใช้
const prisma = require('../config/prisma') //import ตัวแปร prisma ที่เรา export มาจากไฟล์ config/prisma.js

exports.create = async (req, res) => {
    try {
        const { title, description, price, quantity, categoryId, images } = req.body //ดึงข้อมูล จาก req.body ที่ client ส่งมา
        // console.log(title,description,price,quantity,images)
        const product = await prisma.product.create({
            data: {
                titile: title, //ไอซ้าย คือ feild ใน databse , อันขวา คือ สิ่งที่รับมาจาก client (user requestไป)
                description: description,
                price: parseFloat(price), //parseFloat() แปลง string เป็น float
                quantity: parseInt(quantity),
                categoryId: parseInt(categoryId), //ต้องมีค่า categoryId ถึงจะสร้าง productได้ จะได้รู้ว่าอยู่ในหมวดหมู่ไหน
                images: {
                    create: images.map((item) => ({
                        asset_id: item.asset_id,
                        public_id: item.public_id,
                        url : item.url,
                        secure_url : item.secure_url
                    })
                    )
                    }
                }
                
        })
        // id, titile, description, price, sold, quantity, createdAt, updatedAt, categoryId
        res.send("Create product page In controllers")
    } catch (error) {
        console.error('Create product error:', error?.code, error?.message, error)
        res.status(500).json({ message: "Server Error" })
    }
}

// findFirst → ได้ 1 record (object เดี่ยว)

// findMany → ได้ หลาย record (array ของ object)


// include ใน Prisma ก็คือการ ดึงข้อมูลของความสัมพันธ์ (relation) มาด้วยครับ

// ปกติถ้าเรา query table หลัก (เช่น product) ข้อมูลที่ได้ก็จะมีเฉพาะฟิลด์ของ product เอง แต่ถ้าเราอยากให้มันดึงข้อมูลจากตารางที่เกี่ยวข้อง (เช่น category, images) มาด้วย ก็ต้องใช้ include

//วิธี get parameter จาก path
//วิธีที่ 1 req.params.id (เหมาะกับ path ที่มี parameter เดียว เช่น /product/:id)
    //req.params.id คือการดึง id ที่มากับ path เช่น /product/123 ก็จะได้ 123 ออกมา
    // const productid = req.params.id
        
//วิธีที่ 2 destructuring assignment เช่น const { id } = req.params (เหมาะกับ path ที่มีหลาย parameter เช่น /product/:id/:categoryId)
    // const { id } = req.params

exports.list = async (req, res) => {
    //ปกติถ้าเรา query table หลัก (เช่น product) ข้อมูลที่ได้ก็จะมีเฉพาะฟิลด์ของ product เอง แต่ถ้าเราอยากให้มันดึงข้อมูลจากตารางที่เกี่ยวข้อง (เช่น category, images) มาด้วย ก็ต้องใช้ include
    
    try {
        const { count } = req.params
        const product = await prisma.product.findMany({
            take : parseInt(count), //เอาจำนวน record ตามที่ user request มา
            orderBy: { createdAt: "desc" }, //เรียงลำดับจากใหม่ไปเก่า
            include: { //ดึงข้อมูลความสัมพันธ์ (relation) มาด้วย จอย table
                category: true, //ดึงข้อมูล category ที่เกี่ยวข้องกับ product ด้วย
                images: true //ดึงข้อมูล images ที่เกี่ยวข้องกับ product ด้วย
            }
    })
        res.send(product)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Server Error" })
    }

}

exports.read = async (req, res) => {
    //ปกติถ้าเรา query table หลัก (เช่น product) ข้อมูลที่ได้ก็จะมีเฉพาะฟิลด์ของ product เอง แต่ถ้าเราอยากให้มันดึงข้อมูลจากตารางที่เกี่ยวข้อง (เช่น category, images) มาด้วย ก็ต้องใช้ include
    
    try {
        //วิธี get parameter จาก path
        //วิธีที่ 1 req.params.id (เหมาะกับ path ที่มี parameter เดียว เช่น /product/:id)
        //req.params.id คือการดึง id ที่มากับ path เช่น /product/123 ก็จะได้ 123 ออกมา
        const productid = req.params.id
        
        //วิธีที่ 2 destructuring assignment เช่น const { id } = req.params (เหมาะกับ path ที่มีหลาย parameter เช่น /product/:id/:categoryId)
        // const { id } = req.params

        const product = await prisma.product.findFirst({
            where: { id: parseInt(productid)} //เงื่อนไข where
            ,include: {
                category: true,
                images: true
            }
    })
        res.send(product)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Server Error" })
    }

}

exports.update = async (req, res) => {
    try {
        const {title ,description,price,quantity , categoryId ,images } = req.body
        const { id } = req.params
        console.log(title,description,price,quantity,categoryId,images)
        console.log(id)
        // clear images ก่อน
        await prisma.image.deleteMany({ //deletemany เพราะลบหลายๆ record
            where: { id: parseInt(parseInt(id))}
        })
        const product = await prisma.product.update({
            where: { id: parseInt(parseInt(id)) },
            data: {
                titile:title,
                description:description,
                price:price,
                quantity:quantity,
                categoryId:categoryId,
                images: { //เพิ่ม images ใหม่
                    create: images.map((item)=>({
                        asset_id: item.asset_id,
                        public_id: item.public_id,
                        url : item.url,
                        secure_url : item.secure_url
                    }))
                }

            }
        })
        res.send(product)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Server Error" })
    }
}

//ลบ product ต้องลบ images ที่เกี่ยวข้องด้วย
// เพราะ images มี foreign key ไปที่ productId
// ถ้าไม่ลบ images ที่เกี่ยวข้องก่อน จะลบ product ไม่ได้ เพราะติด foreign key constraint
// ต้องลบ images ที่เกี่ยวข้องก่อน แล้วค่อยลบ product
// หรือถ้าใช้ onDelete: 'CASCADE' ใน schema.prisma ตอนสร้างความสัมพันธ์ (relation) ระหว่าง product กับ images
// ก็จะลบ images ที่เกี่ยวข้องอัตโนมัติเมื่อ ลบ product ได้เลย

exports.removeProduct = async (req, res) => {
    try {
        const  productId  = req.params.id
        //กรณีลบแบบไม่ต้อง [ลบ images ที่เกี่ยวข้อง]
        const deleteItem = await prisma.product.delete({
            where:{
                id: parseInt(productId)
            }
        })
        res.send(deleteItem)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Server Error" })
    }
}

// asc = Ascending → เรียงจากน้อย → มาก

// desc = Descending → เรียงจากมาก → น้อย

exports.listby = async (req, res) => {
    try {
        const { sort,order,limit } = req.body
        console.log(sort,order,limit)
        const products = await prisma.product.findMany({
            take: parseInt(limit),
            orderBy: { [sort]: order }, //dynamic sort //desc //asc
            include: {
                category: true,
                images: true
            }
        })
        res.send(products)
// ตัวอย่าง body ที่ client ส่งมา
//{
//     "sort":"price" เรียนตาม price
//     "order":"asc"  เรียงจากน้อยไปมาก
//     "limit":"3"   เอา 3 record
// }

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Server Error" })
    }
}

//search ตาม query
const handleQuey = async (req,res,query) => {
    try{
        const products = await prisma.product.findMany({
            where:{
                titile:{
                    contains: query, //ค้นหาข้อมูลที่มีคำว่า query อยู่ใน title (ไม่ต้องตรงทั้งหมดก็ได้)
                    // mode: "insensitive" //ไม่สนใจตัวพิมพ์เล็กพิมพ์ใหญ่
                }
            },
            include:{
                category:true,
                images:true
            }
        })
        res.send(products)
    }catch(error){
        console.log(error)
        res.status(500).json({message: "Server Error"})
    }
}


const handlePrice = async (req,res,priceRange) => {
    try{
        const products = await prisma.product.findMany({
            where:{
                price: {
                    gte: priceRange[0], //greater than or equal to (มากกว่าหรือเท่ากับ)
                    lte: priceRange[1] //less than or equal to (น้อยกว่าหรือเท่ากับ)
                }
            },include:{
                category:true,
                images:true
            }
        })
        res.send(products)
    }catch(error){
        console.log(error)
        res.status(500).json({message: "Server Error"})
    }
}

// search ตาม category
const handleCategory = async (req,res,categoryId) => {
    try{
        const products = await prisma.product.findMany({
            where:{
                categoryId: {
                    //in ใช้เมื่ออยากเช็คว่า field นั้น อยู่ในลิสต์ค่า
                    in: categoryId.map((id)=>Number(id)) //ถ้า categoryId ที่ส่งมาเป็น array เช่น [1,2] ก็จะค้นหาข้อมูลที่มี categoryId เป็น 1 หรือ 2
                }
                // สมมติ categoryId = ["1", "2"] (array ของ string)
                // .map((id) => Number(id)) → แปลงเป็น [1, 2] (array ของ number) | .map() จะ return เป็น array ใหม่
                // in: [1, 2] → Prisma จะดึงข้อมูลสินค้าที่ มี categoryId เป็น 1 หรือ 2
            }
        })
        res.send(products)
    }catch(error){
        console.log(error)
        res.status(500).json({message: "Server Error"})
    }
}

exports.searchFilters = async (req, res) => {
    try {
        const { query,price,categoryID } = req.body
        if (query) { //{ "query": "mouse" }
            await handleQuey(req,res,query) //ส่ง response กลับไปเลย
        }
        if (price) { // { "price": [100, 600] }
            await handlePrice(req,res,price) //ส่ง response กลับไปเลย
        }
        if (categoryID) { // { "category": [1, 2] }
            await handleCategory(req,res,categoryID)
        }
        
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Server Error" })
    }
}
