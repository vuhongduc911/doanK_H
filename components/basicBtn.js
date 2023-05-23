import { useEffect, useRef, useContext } from 'react'
import { patchData } from '../utils/fetchData'
import { DataContext } from '../store/GlobalState'
import { updateItem } from '../store/Actions'

const basicBtn = ({ order }) => {
    const refPaypalBtn = useRef()
    const { state, dispatch } = useContext(DataContext)
    const { auth, orders } = state

    useEffect(() => {
        paypal.Buttons({
            createOrder: function(data, actions) {
                // Chức năng này thiết lập các chi tiết của giao dịch, bao gồm số tiền và chi tiết mục hàng.
                return actions.order.create({
                    purchase_units: [{
                        amount: {
                            value: order.total+(order.total > 5 ? 0 : 1)
                        }
                    }]
                });
            },
            onApprove: function(data, actions) {
                // This function captures the funds from the transaction.
                dispatch({ type: 'NOTIFY', payload: { loading: true } })

                return actions.order.capture().then(function(details) {

                    patchData(`order/payment/${order._id}`, {
                            paymentId: details.payer.payer_id
                        }, auth.token)
                        .then(res => {
                            if (res.err) return dispatch({ type: 'NOTIFY', payload: { error: res.err } })

                            dispatch(updateItem(orders, order._id, {
                                ...order,
                                paid: true,
                                dateOfPayment: details.create_time,
                                paymentId: details.payer.payer_id,
                                method: 'Basic'
                            }, 'ADD_ORDERS'))

                            return dispatch({ type: 'NOTIFY', payload: { success: res.msg } })
                        })
                        // Chức năng này hiển thị thông báo giao dịch thành công cho người mua của bạn.
                        
                });
            }
        }).render(refPaypalBtn.current);
    }, [])

    return ( 
        <div ref={refPaypalBtn}></div>
    )
}

export default basicBtn