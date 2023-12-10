// Importing necessary modules and components
import { useNavigate } from 'react-router-dom';
import style from '../styles/ProductCard.module.css';
import IncDecBtn from './IncDecBtn';
import { useDispatch, useSelector } from 'react-redux';
import { authSelector } from '../redux/slices/userAuthSlice';
import { cartEntitiesSelector, handleAddToCart } from '../redux/slices/cartSlice';
import {  selectProductById } from '../redux/slices/productsSlice';

// Functional component for rendering individual product cards
export default function ProductCard({id}) {
    // Destructuring values from custom hooks and component props
    const { user } = useSelector(authSelector);
    //console.log(user);
    const dispatch=useDispatch();
    const cart  = useSelector(cartEntitiesSelector);
    //console.log(cart,useSelector(cartSelector));
    const product =useSelector(selectProductById(id));
    //console.log('rpodu ',product);
    // Extracting quantity information from the cart for the current product
    const qty = cart && cart[id] ? cart[id].qty : null;
    //console.log(user,cart,product,qty);
    // Accessing the navigation function from react-router-dom
    const navigate = useNavigate();
    return (
        product&&
        <div className={style.cardCon}>
            {/* Displaying the product image */}
            <img className={style.prodImage} src={product.image} alt={product.name} />

            {/* Displaying the product name, truncating if it exceeds a certain length */}
            <p className={style.prodName}>
                {product.name.length > 65 ? product.name.substring(0, 65) + '...' : product.name}
            </p>

            {/* Displaying the product price */}
            <h3>&#x20B9; {product.price}</h3>

            {/* Checking if the product is already in the cart and rendering appropriate UI */}
            {qty ? (
                <IncDecBtn qty={qty} product={product} />
            ) : (
                //navigate user to sign in page if user not logged in else add the item to cart
                <button
                    className={style.addBtn}
                    onClick={() => (user ? dispatch(handleAddToCart({id})) : navigate('/sign_in'))}
                >
                    Add to Cart
                </button>
            )}
        </div>
    );
}
