import { AuthProvider } from "@/utils/AuthenticationContext";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function ProtectedLayout() {
  return (
    <AuthProvider>
      <StatusBar style={"auto"} />;
      <Stack>
        <Stack.Screen
          name="login"
          options={{
            headerShown: false,
            animation: "none",
          }}
        />
        <Stack.Screen
          name="register"
          options={{
            headerShown: false,
            animation: "none",
          }}
        />
        <Stack.Screen
          name="(protected)"
          options={{
            headerShown: false,
            animation: "none",
          }}
        />
      </Stack>
    </AuthProvider>
  );
}
