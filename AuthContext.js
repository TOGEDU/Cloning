import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(null);

  useEffect(() => {
    const loadToken = async () => {
      const token = await AsyncStorage.getItem("authToken");
      console.log(token);
      if (token) {
        setAuthToken(token);
      }
    };

    loadToken();
  }, []);

  const login = async (token) => {
    setAuthToken(token);
    await AsyncStorage.setItem("authToken", token);
  };

  const logout = async () => {
    setAuthToken(null);
    await AsyncStorage.removeItem("authToken");
  };

  return (
    <AuthContext.Provider value={{ authToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
