import React,{useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Signup =()=>{

    const [formData,setFormData] = useState({
        name:'',
        email:'',
        password:'',
        role:'BUYER',
        phone:'',
        bio:''
    })

    const [error, setError] = useState('');
    const [loading,setLoading] = useState(false);

    const {signup} = useAuth();
    const navigate = useNavigate();

    const handleChange=(e)=>{
        const {name, value} = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    }


    const validateForm = () => {
    if(!formData.name || !formData.email || !formData.password) {   
    setError('Please fill in all required fields');
    return false;
    }

    if(formData.password.length < 6) {
    setError('Password must be at least 6 characters long');
    return false;
    }

    if(formData.password !== formData.confirmPassword) {
    setError('Passwords do not match');
    return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(formData.email)) {
    setError('Please enter a valid email address');
    return false;
    }

    return true;
}

    const handleSubmit = async (e)=>{
        e.preventDefault();
        setError('');
        setLoading(true);   
        try{
            await signup(formData);
            navigate("/dashboard");
        }catch(err){
            setError(err.response?.data || "Signup failed. Please try again.");
        }finally{
            setLoading(false);
        }
    }



    return(
        <div>
<h4>
    Create your account to get started with BizChat!
    <span> OR {' '}</span> 
    <Link to="/login">Already have an account? Login</Link>
</h4>

{
    error && <div className="error">{error}</div>
}

<form>
    <label>Name:</label>
    <input type="text" name="name" value={formData.name} onChange={handleChange} required />

    <label>Email:</label>
    <input type="email" name="email" value={formData.email} onChange={handleChange} required />

    <label>Password:</label>
    <input type="password" name="password" value={formData.password} onChange={handleChange} required />

    <label>I want to</label>
     <select
    id="role"
    name="role"
    value={formData.role}
    onChange={handleChange}
    required
  >
    <option value="BUYER">Buy artwork</option>
    <option value="SELLER">Sell artwork</option>
    <option value="BOTH">Both buy and sell</option>
  </select>

  <label>Phone Number <span>(Optional)</span>:</label>
  <input type="text" name="phone" value={formData.phone} onChange={handleChange} />

  <label>Bio <span>(Optional)</span>:</label>
  <textarea name="bio" value={formData.bio} onChange={handleChange} />

    <button type="submit" onClick={handleSubmit} disabled={loading}>
        {loading ? 'Creating account...' : 'Sign Up'}
    </button>

</form>
        </div>
    )
}