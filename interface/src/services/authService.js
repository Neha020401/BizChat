import api from "./api";

const authService = {
signup:async(userDate)=>{
        const response = await api.post("/verifyuser/signup",userDate);
        if(response.data.token){
            localStorage.setItem("token",response.data.token);
            localStorage.setItem("user",JSON.stringify(response.data));
        }
        return response.data;
},
login:async(credentials)=>{
        const response = await api.post('/verifyuser/login',credentials);
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