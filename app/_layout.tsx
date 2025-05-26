import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";

export const unstable_settings = {
  initialRouteName: "(auth)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) {
      console.error(error);
      throw error;
    }
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen 
          name="club/[id]" 
          options={{ 
            headerShown: true,
            headerTitle: "Book Club",
            headerBackTitle: "Back",
            presentation: "card"
          }} 
        />
        <Stack.Screen 
          name="book/[id]" 
          options={{ 
            headerShown: true,
            headerTitle: "Book Details",
            headerBackTitle: "Back",
            presentation: "card"
          }} 
        />
        <Stack.Screen 
          name="create-club" 
          options={{ 
            headerShown: true,
            headerTitle: "Create Book Club",
            headerBackTitle: "Back",
            presentation: "modal"
          }} 
        />
        <Stack.Screen 
          name="add-book" 
          options={{ 
            headerShown: true,
            headerTitle: "Add Book",
            headerBackTitle: "Back",
            presentation: "modal"
          }} 
        />
      </Stack>
    </>
  );
}