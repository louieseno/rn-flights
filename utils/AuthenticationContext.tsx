import AsyncStorage from "@react-native-async-storage/async-storage";
import { SplashScreen, useRouter } from "expo-router";
import { createContext, PropsWithChildren, useEffect, useState } from "react";

SplashScreen.preventAutoHideAsync();

const authStorageKey = "auth-key";

type StoredAuthState = {
  isLoggedIn: boolean;
  token: string;
  user: {
    id: string;
    email: string;
  };
};

type AuthState = {
  isLoggedIn: boolean;
  isReady: boolean;
  user: { id: string; email: string } | null;
  token: string | null;
  login: (payload: { token: string; id: string; email: string }) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthState>({
  isLoggedIn: false,
  isReady: false,
  user: null,
  token: null,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: PropsWithChildren) {
  const [isReady, setIsReady] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const router = useRouter();

  const storeAuthState = async (authData: StoredAuthState) => {
    try {
      const jsonValue = JSON.stringify(authData);
      await AsyncStorage.setItem(authStorageKey, jsonValue);
    } catch (error) {
      console.error("Error saving auth data:", error);
    }
  };

  const logIn = ({ token, id, email }: { token: string; id: string; email: string }) => {
    setIsLoggedIn(true);
    setToken(token);
    setUser({ id, email });

    storeAuthState({
      isLoggedIn: true,
      token,
      user: { id, email },
    });

    router.replace("/");
  };

  const logOut = async () => {
    setIsLoggedIn(false);
    setToken(null);
    setUser(null);
    await AsyncStorage.removeItem(authStorageKey);
    router.replace("/login");
  };

  useEffect(() => {
    const getAuthFromStorage = async () => {
      await new Promise((res) => setTimeout(res, 1000)); // optional delay for splash

      try {
        const value = await AsyncStorage.getItem(authStorageKey);
        if (value) {
          const parsed: StoredAuthState = JSON.parse(value);
          setIsLoggedIn(parsed.isLoggedIn);
          setToken(parsed.token);
          setUser(parsed.user);
        }
      } catch (error) {
        console.error("Error loading auth data:", error);
      }

      setIsReady(true);
    };

    getAuthFromStorage();
  }, []);

  useEffect(() => {
    if (isReady) SplashScreen.hideAsync();
  }, [isReady]);

  return (
    <AuthContext.Provider
      value={{
        isReady,
        isLoggedIn,
        user,
        token,
        login: logIn,
        logout: logOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
