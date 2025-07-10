import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { useFetchCities } from "@/app/hooks/useFetchCities";
import { City } from "@/model/City";
import {
  AutocompleteDropdown,
  AutocompleteDropdownItem,
} from "react-native-autocomplete-dropdown";

type Props = {
  label: string;
  onSelect: (city: City) => void;
};

export default function LocationAutocomplete({ label, onSelect }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<City[]>([]);
  const [loading, setLoading] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const dataSet: AutocompleteDropdownItem[] = results.map((result) => ({
    id: result.id.toString(),
    title: `${result.city}, ${result.country}`,
  }));

  // Debounce input
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 800);
    return () => clearTimeout(timer);
  }, [query]);

  // Fetch Cities
  useFetchCities({ debouncedQuery, setLoading, setResults });

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
        onSelectItem={(item) => {
          if (!item) return;
          const city = results.find(
            (result) => result.id.toString() == item.id
          );
          if (!city) return;
          onSelect(city);
          setQuery(`${city.city}, ${city.country}`);
          setResults([]);
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
