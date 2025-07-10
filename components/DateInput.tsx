import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { Platform, Pressable, Text, View } from 'react-native';

interface Props {
  label: string;
  value: Date;
  onChange: (date: Date) => void;
}

const DateInput: React.FC<Props> = ({ label, value, onChange }) => {
  const [showPicker, setShowPicker] = useState(false);

  const handleChange = (_: any, selectedDate?: Date) => {
    if(!selectedDate) return;
    onChange(selectedDate);
  };

  return (
    <View style={{ marginVertical: 8, alignItems:"center" }}>
      <Text style={{ marginBottom: 4 }}>{label}</Text>
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
