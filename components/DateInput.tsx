import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import { Text, View, Pressable, Platform } from "react-native";

interface Props {
  label: string;
  value: Date;
  minimumDate?: Date;
  maximumDate?: Date;
  required?: boolean;
  onChange: (date: Date) => void;
}

const DateInput: React.FC<Props> = ({
  label,
  value,
  minimumDate,
  maximumDate,
  required = false,
  onChange,
}) => {
  const [showPicker, setShowPicker] = useState(false);

  const handleChange = (_: any, selectedDate?: Date) => {
    setShowPicker(false); // always hide after selection or cancel

    if (selectedDate) {
      onChange(selectedDate);
    }
  };

  return (
    <View style={{ marginVertical: 8 }}>
      <Text style={{ marginBottom: 4 }}>
        {label}
        {required && <Text style={{ color: "red" }}>*</Text>}
      </Text>

      <Pressable
        style={{
          borderWidth: 1,
          padding: 12,
          borderRadius: 6,
          borderColor: "#ccc",
        }}
        onPress={() => setShowPicker(!showPicker)}
      >
        <Text>{value.toDateString()}</Text>
      </Pressable>

      {showPicker && (
        <DateTimePicker
          value={value}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleChange}
        />
      )}
    </View>
  );
};

export default DateInput;
