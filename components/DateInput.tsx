import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import { Text, View } from "react-native";

interface Props {
  label: string;
  value: Date;
  required?: boolean;
  onChange: (date: Date) => void;
}

const DateInput: React.FC<Props> = ({
  label,
  value,
  required = false,
  onChange,
}) => {
  const [showPicker, setShowPicker] = useState(false);

  const handleChange = (_: any, selectedDate?: Date) => {
    if (!selectedDate) return;
    onChange(selectedDate);
  };

  return (
    <View style={{ marginVertical: 8, alignItems: "center" }}>
      <Text style={{ marginBottom: 4 }}>
        {label}
        {required && <Text style={{ color: "red" }}>*</Text>}
      </Text>
      <DateTimePicker
        value={value}
        mode="date"
        display="default"
        minimumDate={value}
        onChange={handleChange}
      />
    </View>
  );
};

export default DateInput;
