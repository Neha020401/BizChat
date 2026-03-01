import React,{createContext, useState, useContext, useEffect} from "react";
import authService from "../services/authService";

const AuthContext = createContext(null);

export const  AuthProvider = ({children})=>{
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        const userData = authService.getCuurentUser();
        setUser(userData);
        setLoading(false);
    },[])

    const login =  async (credentials) =>{
        const userData = await authService.login(credentials);
        setUser(userData);
        return userData;
    };

   const signup = async (userData)=>{
    const newUser = await authService.signup(userData);
    setUser(newUser);
    return newUser;
   };

   const logout =()=>{
    authService.logout();
    setUser(null);
   };

   const value ={
    user,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
    loading
   };
    return {children};
};

export const useAuth = () =>{
    const context = useContext(AuthContext);
    if(!context){
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}