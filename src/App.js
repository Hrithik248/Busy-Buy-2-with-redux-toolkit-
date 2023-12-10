import './App.css';
import './App.css';
import { createBrowserRouter,Navigate,RouterProvider } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Spinner from 'react-spinner-material';
import spinnerStyle from './styles/Spinner.module.css';
import "react-toastify/dist/ReactToastify.css";
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Navbar from './components/Navbar';
import CartPage from './pages/CartPage';
import ErrorPage from './pages/ErrorPage';
import { useDispatch, useSelector } from 'react-redux';
import { authSelector, listenToAuthChanges } from './redux/slices/userAuthSlice';
import HomePage from './pages/HomePage';
import { useEffect } from 'react';
import OrdersPage from './pages/OrdersPage';
function App() {
    const userDetails=useSelector(authSelector);
    const dispatch=useDispatch();
    const {isLoading}=useSelector(authSelector)
    const router=createBrowserRouter([
        {path:'/',
        element:<Navbar/>,
        errorElement:<ErrorPage/>,
        children:[
          {path:'/',element:<HomePage/>},
          {path:'sign_in',element:userDetails.user?<Navigate to='/' />:<SignIn/> },
          {path:'sign_up',element:userDetails.user?<Navigate to='/' />:<SignUp/>},
          {path:'cart',element:userDetails.user?<CartPage/>:<Navigate to='/' />},
          {path:'orders',element:userDetails.user?<OrdersPage/>:<Navigate to='/' />}
        ]
        }
      ]);
      useEffect(()=>{
        dispatch(listenToAuthChanges());
      },[])
     return (<>
     {userDetails.isLoading?<Spinner radius={200} stroke={5} className={spinnerStyle.spinner} color={'#2874f0'} visible={isLoading} />:
     <>
     <ToastContainer/>
     <RouterProvider router={router} />
     </>
     }
     </>); 
}

export default App;
