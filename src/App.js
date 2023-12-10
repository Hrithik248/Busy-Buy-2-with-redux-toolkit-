// Importing CSS styles for the entire application
import './App.css';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Spinner from 'react-spinner-material';
import spinnerStyle from './styles/Spinner.module.css';
import "react-toastify/dist/ReactToastify.css";

// Importing React components and pages
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Navbar from './components/Navbar';
import CartPage from './pages/CartPage';
import ErrorPage from './pages/ErrorPage';
import { useDispatch, useSelector } from 'react-redux';
import { authSelector, listenToAuthChanges } from './redux/slices/userAuthSlice';
import HomePage from './pages/HomePage';
import OrdersPage from './pages/OrdersPage';

// React functional component for the main App
function App() {
    // Redux hooks for state management
    const userDetails = useSelector(authSelector);
    const dispatch = useDispatch();
    //loading untill user is set
    const { isLoading } = useSelector(authSelector);

    // Creating a router for navigation using react-router-dom
    const router = createBrowserRouter([
        {
            path: '/',
            element: <Navbar />,
            errorElement: <ErrorPage />,
            children: [
                { path: '/', element: <HomePage /> },
                { path: 'sign_in', element: userDetails.user ? <Navigate to='/' /> : <SignIn /> },
                { path: 'sign_up', element: userDetails.user ? <Navigate to='/' /> : <SignUp /> },
                { path: 'cart', element: userDetails.user ? <CartPage /> : <Navigate to='/' /> },
                { path: 'orders', element: userDetails.user ? <OrdersPage /> : <Navigate to='/' /> }
            ]
        }
    ]);

    // Using useEffect to dispatch an action to listen to authentication changes
    useEffect(() => {
        dispatch(listenToAuthChanges());
    }, []);

    // Rendering the main structure of the App
    return (
        <>
            {/* Conditional rendering of a loading spinner while user details are being loaded */}
            {userDetails.isLoading ? (
                <Spinner radius={200} stroke={5} className={spinnerStyle.spinner} color={'#2874f0'} visible={isLoading} />
            ) : (
                <>
                    {/* ToastContainer for displaying notifications */}
                    <ToastContainer />
                    {/* Providing the router for navigation */}
                    <RouterProvider router={router} />
                </>
            )}
        </>
    );
}

// Exporting the App component as the default export
export default App;

