import React, {
  createContext,
  useState,
  useEffect,
  useRef,
  ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {jwtDecode} from 'jwt-decode';

// 토큰의 디코딩된 형태를 위한 타입 정의
interface DecodedToken {
  exp: number;
  [key: string]: any; // 추가적인 필드가 있을 경우 대비
}

// AuthContext의 타입 정의
interface AuthContextType {
  authToken: string | null;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
}

// AuthContext 생성
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({children}) => {
  const [authToken, setAuthToken] = useState<string | null>(null);
  const timeoutId = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const loadToken = async () => {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        const decodedToken = jwtDecode<DecodedToken>(token);
        const currentTime = Date.now() / 1000;

        if (decodedToken.exp < currentTime) {
          // 토큰이 만료되었으면 자동 로그아웃
          await logout();
          console.log('Token expired, user logged out');
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

  const login = async (token: string) => {
    setAuthToken(token);
    await AsyncStorage.setItem('authToken', token);

    const decodedToken = jwtDecode<DecodedToken>(token);
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
    await AsyncStorage.removeItem('authToken');
    console.log('User logged out');

    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
      timeoutId.current = null;
    }
  };

  return (
    <AuthContext.Provider value={{authToken, login, logout}}>
      {children}
    </AuthContext.Provider>
  );
};
