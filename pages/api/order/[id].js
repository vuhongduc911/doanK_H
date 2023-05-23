import connectDB from '../../../utils/connectDB'
import Orders from '../../../models/orderModel'

connectDB()

export default async (req, res) => {
  switch (req.method) {
    case 'DELETE':
      try {
        const { id } = req.query;
        const order = await Orders.findById(id, 'paid');
        if (order.paid) {
          return res.status(404).json({ success: false, message: 'Cannot delete a paid order' });
        }
        
        const deletedOrder = await Orders.findByIdAndRemove(id);
        if (!deletedOrder) {
          return res.status(404).json({ success: false, message: 'Order not found' });
        }
        
        res.status(204).json({ success: true, message: 'Order deleted successfully' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
      }
      break;
    default:
      res.setHeader('Allow', ['DELETE']);
      res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
}
