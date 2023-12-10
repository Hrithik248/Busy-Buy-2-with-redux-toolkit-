// Importing necessary modules and styles
import style from '../styles/IncDecBtn.module.css';
import { handleAddToCart, handleRemoveFromCart } from '../redux/slices/cartSlice';
import { useDispatch } from 'react-redux';

// Functional component for rendering an increment/decrement button for quantity control
export default function IncDecBtn(props) {
    // Destructuring values from the component props
    const { qty, product } = props;
    
    // Accessing the dispatch function from Redux to dispatch actions
    const dispatch = useDispatch();

    return (
        <div className={style.btnCon}>
            {/* Decrement button with an icon, invoking handleRemoveFromCart on click */}
            <img
                src='https://cdn-icons-png.flaticon.com/128/56/56889.png'
                alt="Decrement"
                onClick={() => dispatch(handleRemoveFromCart({ id: product.id }))}
            />

            {/* Displaying the current quantity */}
            {qty}

            {/* Increment button with an icon, invoking handleAddToCart on click */}
            <img
                src='https://cdn-icons-png.flaticon.com/128/1237/1237946.png'
                alt="Increment"
                onClick={() => dispatch(handleAddToCart({ id: product.id }))}
            />
        </div>
    );
}
