import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Home = () => {
const {isAuthenticated} = useAuth();

return(
    <div>
        <h2> Welcome to BizChat </h2>

    <p>Buy and Sell beautiful artwork from talented artists arouhnd the world </p>
    {isAuthenticated ? (
        <Link to="/marketplace"> Explore the Marketplace </Link>
    ) : (   
        <Link to="/dashboard"> Go to Dashboard </Link>
    )}

    <div>
        <div>
           <div> Browse ArtWork</div>
<p>Discover a wide range of stunning artwork from talented artists around the world. Whether you're looking for paintings, sculptures, or digital art, our marketplace has something for everyone.</p>
        </div>
        <div>
            <div> Connect with Artists </div>
            <p>Connect directly with artists to commission custom pieces or collaborate on projects.</p>
        </div>

        <div>
            <div> Easy Checkout</div>
<p>Enjoy a seamless and secure checkout process with multiple payment options.</p>
        </div>
    </div>
    </div>
)
}

export default Home;