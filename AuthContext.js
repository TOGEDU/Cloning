import React, { createContext, useState, useEffect, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwtDecode from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(null);
  const timeoutId = useRef(null);

  useEffect(() => {
    const loadToken = async () => {
      const token = await AsyncStorage.getItem("authToken");
      if (token) {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        
        if (decodedToken.exp < currentTime) {
          // 토큰이 만료되었으면 자동 로그아웃
          await logout();
          console.log("Token expired, user logged out");
        } else {
          setAuthToken(token);
          const timeout = (decodedToken.exp - currentTime) * 1000;
          timeoutId.current = setTimeout(() => {
            logout();
          }, timeout);
        }
      }
    };

    loadToken();

    return () => {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
    };
  }, []);

  const login = async (token) => {
    setAuthToken(token);
    await AsyncStorage.setItem("authToken", token);

    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
    }

    const timeout = (decodedToken.exp - currentTime) * 1000;
    timeoutId.current = setTimeout(() => {
      logout();
    }, timeout);
  };

  const logout = async () => {
    setAuthToken(null);
    await AsyncStorage.removeItem("authToken");
    console.log("User logged out");

    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
      timeoutId.current = null;
    }
  };

  return (
    <AuthContext.Provider value={{ authToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
