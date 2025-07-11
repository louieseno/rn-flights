import { AuthContext } from "@/utils/AuthenticationContext";
import { Redirect, Stack } from "expo-router";
import { useContext } from "react";
import { Button } from "react-native";
import { AutocompleteDropdownContextProvider } from "react-native-autocomplete-dropdown";

export default function RootLayout() {
  const authState = useContext(AuthContext);

  if (!authState.isReady) {
    return null;
  }

  if (!authState.isLoggedIn) {
    return <Redirect href="/login" />;
  }

  return (
    <AutocompleteDropdownContextProvider>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: "#000000",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: "RN Flights",
            headerRight: () => (
              <Button title="Logout" onPress={authState.logout} />
            ),
          }}
        />
      </Stack>
    </AutocompleteDropdownContextProvider>
  );
}
