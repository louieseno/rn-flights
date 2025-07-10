import { StyleSheet, Text, View } from "react-native";
import { SelectList } from "react-native-dropdown-select-list";

type Props = {
  value: "oneway" | "roundtrip";
  onChange: (value: "oneway" | "roundtrip") => void;
};

export default function TripTypeDropdown({ value, onChange }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        Trip Type
        <Text style={{ color: "red" }}>*</Text>
      </Text>
      <SelectList
        setSelected={onChange}
        data={[
          { label: "One Way", value: "One way" },
          { label: "Round Trip", value: "Round Trip" },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    marginBottom: 4,
  },
});
