const prisma = require('../config/prisma') //import ตัวแปร prisma ใช้ต่อกับฐานข้อมูล
const { connect } = require('../routes/product')

exports.listuser = async (req, res) => {
    try {
        const users = await prisma.User.findMany({
            select: { 
                //select = บอกว่าจะเอา ฟิลด์ไหนบ้าง จาก record fieldname:true/false
                id:true,
                email:true,
                role:true,
                enabled:true,
                address:true
            }
        })
        res.send(users)
    }catch (error) {
        console.log(error)
        res.status(500).json({message:"Server Error"})
    }
}

exports.changeStatus = async (req,res) =>{
    try{
        const { id , enabled } = req.body;
        const user = await prisma.User.update({
            where:{id:Number(id)},
            data:{enabled: enabled}
        })
        console.log("User info:",user)
        res.send("Update Status successfully")
    }catch{
        console.log(error)
        res.status(500).json({message:"Server error"})
    }
}

exports.changeRole = async (req,res) =>{
    try{
        const { id , role } = req.body
        const user = await prisma.User.update({
            where:{id:Number(id)},
            data:{role:role}
        })
        res.send("Updated role succesfully")
    }catch{
        console.log(error)
        res.status(500).json({message:"Server error"})
    }
}

exports.userCart = async (req,res) =>{
    try{
        const { cart } = req.body
        console.log(cart)

        const user = await prisma.User.findFirst({
            where : {id:Number(req.user.id)}
        })
        console.log("USER information",user)
        
        // Deleted old cart item
        // clear ตระกร้าก่อน
        await prisma.ProductOnCart.deleteMany({
            where : {
                Cart : {
                    orderbyid: user.id
                }
            }
        })

        // Deleted old cart
        // clear ตระกร้าก่อน
        await prisma.Cart.deleteMany({
            where:{orderbyid: user.id}
        })

        let products = cart.map((item)=>({ //cart มาจาก client ที่ req.body ส่งมา ไม่ใช่ของ database
            productId:item.id,
            quantity:item.count,
            price: item.price
        }))


        // console.log("products:",products)
        //products: [
        //   { productId: 1, quantity: 2, price: 100 },
        //   { productId: 5, quantity: 1, price: 200 }
        // ]
        let cartTotal = products.reduce((sum,item)=>(sum + item.price *item.quantity),0) //รวมราคารวมของสินค้าในตะกร้า //0 คือ ค่าเริ่มต้นของ sum
        console.log("cartTotal:",cartTotal)

        //New cart for user
        const newCart = await prisma.Cart.create({
            data: {
                products:{ //create ในส่วนของ table products ด้วย ซึ่งมัน relate กับ ProductOnCart นั้นแหละ ลองดูใน prismaดู
                    create: products
                },
                cartTotal:cartTotal,
                orderbyid: user.id
            }
        })
        console.log("New cart:",newCart)
        res.send("Succesfully added to cart")
    }catch{
        console.log(error)
        res.status(500).json({message:"Server error"})
    }
}

exports.getUserCart = async (req,res) =>{
    try{
        // console.log(req.user.id)
        const cart = await prisma.Cart.findFirst({
            where:{
                orderbyid: Number(req.user.id)
            },include:{ //ใน table cart มี products (1:n) ที่ relate กับ table Product อีก เลยต้อง include ตัวข้างในมาด้วยไม่งั้นเข้าไปไม่ถึง (ดูใน prisma)
                products:{
                    include:{
                        Product:true
                    }
                }
            }
        })
        console.log(cart)
        res.json({
            products: cart.products,
            cartTotal: cart.cartTotal
        })
    }catch{
        console.log(error)
        res.status(500).json({message:"Server error"})
    }
}

exports.emptyCart = async (req,res) =>{
    try{
        const cart = await prisma.Cart.findFirst({
            where : { orderbyid : Number(req.user.id)}
        })

        if (!cart){
            res.status(400).json({message:"Not have any cart in order...."})
        }

        await prisma.ProductOnCart.deleteMany({
            where:{ cartId: cart.id}
        })
        const result = await prisma.Cart.deleteMany({
            where : { orderbyid:Number(req.user.id)}
        })
        // console.log("Result:",result)
        res.json({
            message: "Cart Empty Successfully",
            deleteCount: result.count
        })
    }catch{
        console.log(error)
        res.status(500).json({message:"Server error"})
    }
}

exports.saveAddress = async (req,res) =>{
    try{
        const newAdress = req.body.address
        // console.log(address)
        const addressUpdate = await prisma.user.update({
            where: {
                id: Number(req.user.id)
            },
            data:{
                address:newAdress
            }
        })

        res.json({message:"Updated address succesfully"})
    }catch{
        console.log(error)
        res.status(500).json({message:"Server error"})
    }
}

exports.saveOrder = async (req,res) =>{
    try{
        //step1 Get user cart
        const userCart = await prisma.Cart.findFirst({
            where:{ orderbyid : req.user.id },
            include: {products:true} // products มี feild  // productId , quantity , price และอื่นๆอีก products ของ cart relate กับ ProductOnCart

        })
        console.log("User cart have",userCart)

        // check cart is empty?
        if(!userCart || userCart.products.length === 0){
            return res.status(400).json({ok:false, message:"Invalid cart "})
        }

        // check quantity product
        for ( const item of userCart.products){
            console.log("loop:",item)
            // loop: { Id: 17, cartId: 9, productId: 5, quantity: 2, price: 69000 }
            // loop: { Id: 18, cartId: 9, productId: 4, quantity: 1, price: 79000 }
            const eachproduct = await prisma.Product.findUnique({
                where: {id: item.productId},
                select: {quantity: true , titile:true} //เอาถ้ามี quantity และ มีชื่อ ,ถ้าเป็น false ก็จะเอามาแสดงเมื่อมันเป็น0
            })
            if (!eachproduct || item.quantity > eachproduct.quantity){
                return res.status(400).json({
                    ok:false,
                    message:`Sorry this ${eachproduct?.titile} is not enough in stock`
                })
            }
            console.log("Each product",eachproduct)

        }

        // Create new order
        const order = await prisma.Order.create({
            data:{//ไปเก็บที่ product ซึ่งก็relateกับ ProductsOnOrder ด้วย ดูใน prisma
                //create product
                product:{ // เราจะเก็บไปใน feild ของ product ด้วย ซึ่งจะlink ไปที่ table ProductsOnOrder
                    create: userCart.products.map((item)=>({
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.price
                    }))
                },orderby:{
                    connect: {id:req.user.id}
                }, cartTotal: userCart.cartTotal
            }
        })
        console.log("Your order is:",order)
        res.send("Successfully order, Thanks for purchase")

        // Update Product (table Product)
            //เตรียมข้อมูล เพราะ update หลาย product เป็น array
        const update = userCart.products.map((item)=>({
            where: { id: item.productId},
            data: {
                quantity : { decrement:item.quantity},
                sold: {increment: item.quantity}
            }
        }))
        console.log("Updated",update)
        
        await Promise.all(
            //update ข้อมูลใน Product แต่ละตัว ex จำนวนsold
            update.map((updated)=>prisma.Product.update(updated))
        );

        // delete cart cascade ทำให้ productoncart ถูกลบไปด้วย
        await prisma.Cart.deleteMany({
            where:{ orderbyid: Number(req.user.id)}
        })

    }catch{
        console.log(error)
        res.status(500).json({message:"Server error"})
    }

}

exports.getOrder = async (req,res) =>{
    try{
        //list orders ออกมา
        const orders = await prisma.Order.findMany({
            where : {orderbyid: Number(req.user.id)},
            include:{
                product:{
                    include:{
                        products:true
                    }
                }
            }
        })
        console.log(orders)

        //if not have any order
        if (orders.length === 0){
            return res.status(500).json({ok:false,message:"Not have any order right now..."})
        }

        res.json({
            ok:true,
            orders
        })
    }catch{
        console.log(error)
        res.status(500).json({message:"Server error"})
    }
}
