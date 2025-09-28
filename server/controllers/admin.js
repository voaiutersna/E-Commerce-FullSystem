const prisma = require('../config/prisma')

exports.changeOrderStatus = async ( req , res) =>{
    try{
        // const { orderId , orderStatus } = req.body. // destructuring
        const orderId = req.body.orderId
        const orderStatus = req.body.orderStatus

        //change status order (Completed)
        const orderUpdate = await prisma.order.update({
            where:{id : orderId },
            data: { orderStatus: orderStatus}
        })
        res.json(orderUpdate)
    }catch(error){
        console.log(error)
        res.status(500).json({message:"Server error"})
    }
}

exports.geOrderAdmin = async (req , res ) => {
    try{
        const orders = await prisma.Order.findMany({ //findMany() ก็จะได้ตารางของ Order pure เลยทั้งหมดทุก record และ feild
            include:{ //แสดง product
                product:{
                    include:{
                        products:true}
            },
            orderby:{ //แสดง user info
                select:{
                    id:true,
                    email:true,
                    address:true
                }
            }
        }
        })

        res.json(orders)
    }catch(error){
        console.log(error)
        res.status(500).json({message:"Server error"})
    }
}