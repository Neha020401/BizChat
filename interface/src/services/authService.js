import api from "./api";

const authService = {
signup:async(userDate)=>{
        const response = await api.post("/auth/signup",userDate);
        if(response.date.token){
            localStorage.setItem("token",response.data.token);
            localStorage.setItem("user",JSON.stringify(response.data.user));
        }
        return response.data;
},
login:async(credentials)=>{
        const response = await api.post('auth/login',credentials);
        if(response.date.token){
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
    return userStr ? JSON.parse(userStr) : null;
},
isAuthenticated:()=>{
    return !!localStorage.getItem('token');
}
};

export default authService;