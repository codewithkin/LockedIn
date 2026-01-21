import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import * as Linking from "expo-linking";
import { router } from "expo-router";
import { authApi, getToken, setToken, removeToken, type User } from "@/lib/api";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string) => Promise<{ success: boolean; message: string }>;
  signOut: () => Promise<void>;
  verifyMagicLink: (token: string) => Promise<{ success: boolean; message: string }>;
  updateProfile: (data: { name?: string; avatarUrl?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    checkAuth();
  }, []);

  // Handle deep links for magic link verification
  useEffect(() => {
    const handleDeepLink = async (event: { url: string }) => {
      const { url } = event;
      const parsed = Linking.parse(url);
      
      if (parsed.path === "auth/verify" && parsed.queryParams?.token) {
        const token = parsed.queryParams.token as string;
        await verifyMagicLink(token);
      }
    };

    // Handle initial URL (app opened via deep link)
    Linking.getInitialURL().then((url) => {
      if (url) {
        handleDeepLink({ url });
      }
    });

    // Handle URLs while app is running
    const subscription = Linking.addEventListener("url", handleDeepLink);

    return () => {
      subscription.remove();
    };
  }, []);

  const checkAuth = async () => {
    try {
      const token = await getToken();
      if (!token) {
        setIsLoading(false);
        return;
      }

      const response = await authApi.getMe();
      setUser(response.user);
    } catch (error) {
      console.log("Auth check failed:", error);
      await removeToken();
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await authApi.requestMagicLink(email);
      return response;
    } catch (error: any) {
      return { success: false, message: error.message || "Failed to send magic link" };
    }
  };

  const verifyMagicLink = async (token: string): Promise<{ success: boolean; message: string }> => {
    try {
      setIsLoading(true);
      const response = await authApi.verifyToken(token);
      
      if (response.success) {
        await setToken(response.token);
        setUser(response.user);
        router.replace("/(drawer)");
        return { success: true, message: "Signed in successfully" };
      }
      return { success: false, message: "Verification failed" };
    } catch (error: any) {
      console.error("Magic link verification failed:", error);
      return { success: false, message: error.message || "Verification failed" };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    await removeToken();
    setUser(null);
    router.replace("/auth/sign-in");
  };

  const updateProfile = async (data: { name?: string; avatarUrl?: string }) => {
    const response = await authApi.updateProfile(data);
    setUser(response.user);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        signIn,
        signOut,
        verifyMagicLink,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
