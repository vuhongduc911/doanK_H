import connectDB from '../../../utils/connectDB'
import Orders from '../../../models/orderModel'
import Products from '../../../models/productModel'
import user from '../../../models/userModel'
import auth from '../../../middleware/auth'
import nodemailer from 'nodemailer'
const mongoose = require("mongoose");

connectDB()

export default async(req, res) => {
    switch (req.method) {
        case "POST":
            await createOrder(req, res)
            break;
        case "GET":
            await getOrders(req, res)
            break;
    }
}
const getOrders = async(req, res) => {
    try {
        const result = await auth(req, res)

        let orders;
        if (result.role !== 'admin') {
            orders = await Orders.find({ user: result.id }).populate("user", "-password")
        } else {
            orders = await Orders.find().populate("user", "-password")
        }

        res.json({ orders })
    } catch (err) {
        return res.status(500).json({ err: err.message })
    }
}


const createOrder = async(req, res) => {
    try {
        const result = await auth(req, res)
        const { address, mobile, cart, total } = req.body

        const newOrder = new Orders({
            user: result.id,
            address,
            mobile,
            cart,
            total
        })

        const filteredItems = cart.filter(item => {
            return sold(item._id, item.quantity, item.inStock, item.sold)
        })

        await newOrder.save();

        const id_product = filteredItems.map(item => item._id).join(','); // Tạo chuỗi các _id
        const qty = filteredItems.map(item => item.quantity).join(',');
        const idProductArray = id_product.split(','); // Tách chuỗi ra thành một mảng các _id

        let productList = '';
        let totalCost = 0;
        let priceTaShip=0;
        
        filteredItems.forEach(item => {
          // Calculate the discounted price
          const discountedPrice = item.price * (1 - item.discount / 100);
           priceTaShip = discountedPrice > 5 ? 0 : 1;
        
          productList +=`<p>Tên sản phẩm: ${item.title} &emsp;&emsp; Số lượng: ${item.quantity} &emsp;&emsp; Giá tiền: $${(discountedPrice * item.quantity).toFixed(2)}</p>`;
          totalCost += discountedPrice * item.quantity;
        });
        
        console.log(productList);
        console.log(`Tổng số tiền: $${totalCost.toFixed(2)}`);

       
        const userID = mongoose.Types.ObjectId(result.id);

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "vanhieu981981@gmail.com",
                pass: "zqokbsoflypfdtxm"
            }
        });

        user.findById(userID, function(err, user) {
            const mailOptions = {
                from: "vanhieu981981@gmail.com",
                to: user.email,
                subject: "Đơn đặt hàng",
                text: `Đơn đặt hàng`,
                html: `
                  <div style="max-width: 700px; margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
                    <h2 style="text-align: center; text-transform: uppercase;color: teal;">Cám ơn bạn đã đặt hàng tại NHÀ SÁCH ĐÔNG NAM Á .</h2>
                    <p>Xin chào ${user.name},\n
                    Shop đã nhận được yêu cầu đặt hàng của bạn và đang xử lý nhé. \n   
                    </p>
                    <p>Đơn hàng được giao đến</p>
                    <p>Tên :         ${user.name}</p> 
                    <p>Địa chỉ nhà:  ${req.body.address}</p>
                    <p>Điện thoại: : ${req.body.mobile}</p> 
                    <p>Email:        ${user.email}</p>
                    ${productList}
                    <p>Phí Ship  :&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;$${priceTaShip.toFixed(2)}</p>
                    <p>Tổng số tiền: &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;$${totalCost.toFixed(2)}</p>
                  </div>
                `
            };
            const result_ = transporter.sendMail(mailOptions);
        });

        res.json({
            msg: 'Order success! We will contact you to confirm the order.',
            newOrder
        })

    } catch (err) {
        return res.status(500).json({ err: err.message })
    }
}


const sold = async(id, quantity, oldInStock, oldSold) => {
    await Products.findOneAndUpdate({ _id: id }, {
        inStock: oldInStock - quantity,
        sold: quantity + oldSold
    })
}