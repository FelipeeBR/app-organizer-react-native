import React, { useState, useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { Stack, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import '../styles/global.css';

export default function Layout() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const token = await SecureStore.getItemAsync("authToken");
      if (token) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        router.replace("/login");
      }
    };
    checkAuth();
  }, []);

  if(isAuthenticated === null) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      {!isAuthenticated ? (
        <>
          <Stack.Screen name="login" options={{ headerTitle: '', headerShown: false }} />
          <Stack.Screen name="register/register" options={{ headerTitle: '', headerShown: false }} />
        </>
      ) : (
        <Stack.Screen name="(tabs)" options={{ headerTitle: '', headerShown: false }} />
      )}
    </Stack>
  );
}