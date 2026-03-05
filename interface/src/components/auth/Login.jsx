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
        const {name, value} = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]:value
        }));
 if (error) setError('');
    };

    const handleSubmit =async (e)=>{
        e.preventDefault();

       if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }
    setError('');
        setLoading(true);

        try{
            await login(formData);
            navigate("/dashboard");
        }catch(err){
          
         setError(
        err.response?.data?.message || 
        err.response?.data || 
        'Login failed. Please check your credentials.'
            );
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