import { Stack } from "expo-router";
import { AutocompleteDropdownContextProvider } from "react-native-autocomplete-dropdown";

export default function RootLayout() {
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
        <Stack.Screen name="index" options={{ title: "RN Flights" }} />
      </Stack>
    </AutocompleteDropdownContextProvider>
  );
}
