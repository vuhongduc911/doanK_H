import connectDB from '../../../utils/connectDB'
import Orders from '../../../models/orderModel'

connectDB()

export default async (req, res) => {
  try {
    const orders = await Orders.find({});
    res.status(200).json(orders)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server Error' })
  }
}