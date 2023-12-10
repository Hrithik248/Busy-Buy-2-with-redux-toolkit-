import { useDispatch, useSelector } from 'react-redux';
import style from '../styles/OrdersPage.module.css';
import { fetchOrdersThunk, ordersLoadingSelector, ordersSelector } from '../redux/slices/ordersSlice';
import { useEffect } from 'react';
import Spinner from 'react-spinner-material';
import spinnerStyle from '../styles/Spinner.module.css';
import { selectProductEntities } from '../redux/slices/productsSlice';
export default function OrdersPage(){
    //getting order details from cart and orders context
    const ordersEntities=useSelector(ordersSelector);
    const orders=Object.values(ordersEntities);
    const products=useSelector(selectProductEntities);
    const isLoading=useSelector(ordersLoadingSelector);
    const dispatch=useDispatch();
    useEffect(()=>{
        dispatch(fetchOrdersThunk());
    },[])
    return (
        isLoading?<Spinner radius={200} stroke={5} className={spinnerStyle.spinner} color={'#2874f0'} visible={isLoading} />:
        (orders.length===0?<h2>You have not ordered anything yet !</h2>:
        <div className={style.ordersCon} >
            <h2>Your Orders</h2>
            {orders.map((order,ind)=>(
                <div className={style.order} key={ind} >
                    <h3>Ordered On: {order.timestamp}</h3>
                    <table className={style.orderTable} >
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Price</th>
                                <th>Qty</th>
                                <th>Total Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                order.order.map((item,ind)=>(
                                    <tr key={ind}>
                                        <td>{products[item.id].name}</td>
                                        <td>{products[item.id].price}</td>
                                        <td>{item.qty}</td>
                                        <td>{products[item.id].price*item.qty}</td>
                                    </tr>
                                ))
                            }
                            <tr>
                                <td colSpan="3">Total</td>
                                <td>
                                {order.order.reduce((total, item) => total + products[item.id].price * item.qty, 0)}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            ))}
        </div>)
    )
}