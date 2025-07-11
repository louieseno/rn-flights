import { StyleSheet, Text, View } from "react-native";
import { SelectList } from "react-native-dropdown-select-list";

type Props = {
  onChange: (value: "One Way" | "Round Trip") => void;
};

const data = [
  { value: "One Way", key: "One Way" },
  { value: "Round Trip", key: "Round Trip" },
];
export default function TripTypeDropdown({ onChange }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        Trip Type
        <Text style={{ color: "red" }}>*</Text>
      </Text>
      <SelectList
        defaultOption={{ value: "Round Trip", key: "Round Trip" }}
        setSelected={onChange}
        data={data}
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
