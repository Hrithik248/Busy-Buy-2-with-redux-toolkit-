import './App.css';
import './App.css';
import { createBrowserRouter,Navigate,RouterProvider } from 'react-router-dom';
//import { ToastContainer } from 'react-toastify';
//import "react-toastify/dist/ReactToastify.css";
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Navbar from './components/Navbar';
//import HomePage from './pages/HomePage';
//import CartPage from './pages/CartPage';
//import  OrdersPage  from './pages/OrdersPage';
//import ErrorPage from './pages/ErrorPage';
import { useDispatch, useSelector } from 'react-redux';
import { authSelector, listenToAuthChanges } from './redux/slices/userAuthSlice';
import HomePage from './pages/HomePage';
import { useEffect } from 'react';
function App() {
    const userDetails=useSelector(authSelector);
    const dispatch=useDispatch();
    console.log(userDetails)
    const router=createBrowserRouter([
        {path:'/',
        element:<Navbar/>,
        //errorElement:<ErrorPage/>,
        children:[
          {path:'/',element:<HomePage/>},
          {path:'sign_in',element:userDetails.user?<Navigate to='/' />:<SignIn/> },
          {path:'sign_up',element:userDetails.user?<Navigate to='/' />:<SignUp/>},
          {path:'cart',element:<></>},
          {path:'orders',element:<></>}
        ]
        }
      ]);
      useEffect(()=>{
        dispatch(listenToAuthChanges());
      },[])
     return (<>
     {userDetails.isLoading?<></>:<RouterProvider router={router} />}
     </>); 
}

export default App;
