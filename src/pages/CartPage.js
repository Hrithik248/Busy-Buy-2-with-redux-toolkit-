import { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import style from '../styles/CartPage.module.css';
import Spinner from 'react-spinner-material';
import spinnerStyle from '../styles/Spinner.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { cartEntitiesSelector, cartLoadingSelector, placingOrderSelector } from '../redux/slices/cartSlice';
import { addOrderThunk } from '../redux/slices/ordersSlice';
import { selectProductEntities } from '../redux/slices/productsSlice';
import { useNavigate } from 'react-router-dom';

export default function CartPage() {
    // Getting cart and order handler from cart and orders context
    const cart = useSelector(cartEntitiesSelector);
    const placingOrder = useSelector(placingOrderSelector);
    const cartItemsList = Object.keys(cart);
    const navigate = useNavigate();
    const products = useSelector(selectProductEntities);
    const isLoading = useSelector(cartLoadingSelector);

    // Total price
    const [totalPrice, setTotalPrice] = useState(0);
    const dispatch = useDispatch();

    useEffect(() => {
        // Calculate total price whenever cartItems change
        let newTotalPrice = 0;
        for (let id in cart) {
            const product = products[id];
            newTotalPrice += product.price * cart[id].qty;
        }
        setTotalPrice(newTotalPrice);
    }, [cart]);

    return (
        placingOrder ? <h2>Placing order...</h2> :
            isLoading ? <Spinner radius={200} stroke={5} className={spinnerStyle.spinner} color={'#2874f0'} visible={isLoading} /> :
                cartItemsList.length === 0 ? <h2>Your Cart is Empty!</h2> :
                    <div className={style.cartPageCon}>
                        <div className={style.purchaseCard}>
                            <h3>Total Price:- &#x20B9; {totalPrice} /-</h3>
                            {/* Navigate user to orders page after placing order */}
                            <button className={style.purchaseBtn} onClick={() => {
                                dispatch(addOrderThunk());
                                setTimeout(() => navigate('/orders'), 2000)
                            }}>Purchase</button>
                        </div>
                        <div className={style.cartCon}>
                            <div className={style.cartList}>
                                {
                                    // Display ProductCard component for each product in the cart
                                    cartItemsList.map((prodId) => <ProductCard id={prodId} key={prodId} />)
                                }
                            </div>
                        </div>
                    </div>
    );
}
