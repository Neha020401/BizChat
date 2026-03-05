import React from "react";
import {useAuth} from '../hooks/useAuth';

const Dashboard = () => {
    const {isAuthenticated} = useAuth();
    return(
        <div>
            <h2>Welcome Back, {user?.name}!</h2>
        <p>Role: {user?.role}</p>
        <p>Email: {user?.email}</p>
             <div>
                <ul>
                  <li>
                <span>Status: {isAuthenticated ? "Authenticated" : "Not Authenticated"} </span>
                <span> Active Sessions: {isAuthenticated ? "1" : "0"}</span>
                </li>
                <li>Quick Action </li>
                    <li>View Profile</li>
                    <li>Browse Products</li> 
                    <li>My Orders</li>
                    <li>Wishlist</li>
                    <li>Messages</li>
                </ul>

             </div>
          
    </div>
  );
};

export default Dashboard;