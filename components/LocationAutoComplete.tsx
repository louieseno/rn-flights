import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import useFetchCities from "@/hooks/useFetchCities";
import { City } from "@/model/City";
import {
  AutocompleteDropdown,
  AutocompleteDropdownItem,
} from "react-native-autocomplete-dropdown";

type Props = {
  label: string;
  onSelect: (value: City | null) => void;
};

export default function LocationAutocomplete({ label, onSelect }: Props) {
  const [query, setQuery] = useState("");
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const dataSet: AutocompleteDropdownItem[] = cities.map((city) => ({
    id: city.address.stateCode,
    title: `${city.name} - (${city.iataCode || city.address.stateCode})`,
  }));

  // Debounce input
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 800);
    return () => clearTimeout(timer);
  }, [query]);

  // Fetch Cities and Airports
  useFetchCities({
    debouncedQuery,
    setLoading,
    setCities,
  });

  return (
    <View style={styles.container}>
      <Text style={{ marginBottom: 4 }}>
        {label}
        <Text style={{ color: "red" }}>*</Text>
      </Text>
      <AutocompleteDropdown
        loading={loading}
        clearOnFocus={false}
        closeOnBlur={true}
        closeOnSubmit={false}
        onChangeText={setQuery}
        emptyResultText={`Search ${label}`}
        onClear={() => {
          onSelect(null);
          setCities([]);
        }}
        onSelectItem={(item) => {
          if (!item) return;
          const city = cities.find((city) => city.address.stateCode == item.id);
          if (!city) return;
          onSelect(city);
        }}
        dataSet={dataSet}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
  },
  dropdown: {
    maxHeight: 150,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    marginTop: 4,
    backgroundColor: "#fff",
  },
  item: {
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
});
