import api from "./api";

const authService = {
signup:async(userData)=>{
        const response = await api.post("/artDummies/signup",userData);
        if(response){
            localStorage.setItem("token",response.data.token);
            localStorage.setItem("user",JSON.stringify(response.data));
            console.log("Signup successful:", response.data);
            alert("Signup successful! You can now log in.");
            console.log(response.data.error); // Log the error message if it exists
        }
        return response.data;
},
login:async(credentials)=>{
        const response = await api.post('/artDummies/login',credentials);
        if(response.data.token){
            localStorage.setItem('token',response.data.token);
            localStorage.setItem('user',JSON.stringify(response.data));
        }
        return response.data;
},
logout:()=>{
    localStorage.removeItem('token');
    localStorage.removeItem('user');
},
deleteAccount:async(userId)=>{
const response = await api.delete(`/artDummies/deleteUser/${userId}`);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return response.data;
},
getCurrentUser:()=>{
    const userStr = localStorage.getItem('user');
     if (!userStr || userStr === "undefined") {
        return null;
    }
    try {
        return JSON.parse(userStr);
    } catch (e) {
        console.error("Invalid user data in localStorage", e);
        return null;
    }
},
isAuthenticated:()=>{
    return !!localStorage.getItem('token');
}
};

export default authService;