import React,{useState} from 'react';
import {Link, useNavigate} from "react-router-dom";
import { useAuth } from '../../context/AuthContext';

const Login =()=>{
    const [formData,setFormData] = useState({
        email:'',
        password:''
    })

    const [error, setError]= useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange=(e)=>{
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit =async (e)=>{
        e.preventDefault();

        setError('');
        setLoading(true);

        try{
            await login(formData);
            navigate("/dashboard");
        }catch(err){
            setError(err.response?.data || "Login failed. Please try again.");
        }finally{
            setLoading(false);  
    }   };

    return(
<div>
   <h2><span>Login</span> Sign in To BizChat </h2>
   Or{' '}
   <Link to="/signup">Create an account</Link>  
   {
    error && <div className="error">{error}</div>
   }
   <form>
    <label>Email:</label>   
    <input type="email" name="email" value={formData.email} onChange={handleChange} required />
    <label>Password:</label>   
    <input type="password" name="password" value={formData.password} onChange={handleChange} required />
    <button type="submit" onClick={handleSubmit} disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
    </button>
   </form>
</div>
    
    )
}