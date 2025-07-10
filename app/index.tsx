import { useForm, Controller } from "react-hook-form";
import { View, Text, ActivityIndicator, StyleSheet, FlatList, TextInput, Button } from "react-native";
import { useState } from "react";
import DateInput from "@/components/DateInput";
import { Flight } from "@/model/Flight";
import TripTypeDropdown from "@/components/TripTypeDropdown";

type FormValues = {
  tripType: 'oneway' | 'roundtrip';
  from: string;
  to: string;
  departDate: Date;
  returnDate: Date;
};

export default function Page() {
  const currentDate = new Date();
  const tomorrow = new Date(currentDate.getTime());
  tomorrow.setDate(currentDate.getDate() + 1);

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormValues>({
    defaultValues: {
      tripType: 'oneway',
      from: '',
      to: '',
      departDate: currentDate,
      returnDate: tomorrow,
    },
  });

  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (data: FormValues) => {
    setError(null);
    setLoading(true);
    setFlights([]);

    try {
      // fetch logic here
    } catch (err) {
      setError('Failed to fetch flights.');
    } finally {
      setLoading(false);
    }
  };

  const renderFlight = ({ item }: { item: Flight }) => (
    <View style={styles.flightCard}>
      <Text style={styles.airline}>{item.airline} - {item.flightNumber}</Text>
      <Text style={styles.route}>From {item.origin} → {item.destination}</Text>
      <Text>{item.departureTime} - {item.arrivalTime}</Text>
      <Text style={styles.price}>{item.price}</Text>
    </View>
  );

  // Watch field values
  const tripType = watch("tripType");
  const from = watch("from");
  const to = watch("to");
  const departDate = watch("departDate");

  const isFormComplete = tripType && from && to && departDate;

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Search Flights</Text>
      <Controller
        control={control}
        name="tripType"
        render={({ field: { onChange, value } }) => (
          <TripTypeDropdown value={value} onChange={onChange} />
        )}
      />
    
      <Controller
        control={control}
        name="from"
        rules={{ required: "Origin is required" }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder="From (e.g. MNL)"
            style={styles.input}
            value={value}
            onChangeText={onChange}
          />
        )}
      />
      {errors.from && <Text style={styles.error}>{errors.from.message}</Text>}

      <Controller
        control={control}
        name="to"
        rules={{ required: "Destination is required" }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder="To (e.g. CEB)"
            style={styles.input}
            value={value}
            onChangeText={onChange}
          />
        )}
      />
      {errors.to && <Text style={styles.error}>{errors.to.message}</Text>}
      <View style={{ flexDirection: "row", justifyContent:"space-between"}}>
        <Controller
          control={control}
          name="departDate"
          rules={{ required: "Departure date is required" }}
          render={({ field: { value, onChange } }) => (
            <DateInput label="Departure Date" value={value} onChange={onChange} />
          )}
        />
        {errors.departDate && <Text style={styles.error}>{errors.departDate.message}</Text>}

        <Controller
          control={control}
          name="returnDate"
          render={({ field: { value, onChange } }) => (
            <DateInput label="Return Date (optional)" value={value} onChange={onChange} />
          )}
        />
        {errors.returnDate && <Text style={styles.error}>{errors.returnDate.message}</Text>}
      </View>
      
      <Button 
        title="Search"
        onPress={handleSubmit(onSubmit)}
        disabled={!isFormComplete || loading}
      />

      {loading && <ActivityIndicator style={{ marginTop: 20 }} />}
      {error && <Text style={styles.error}>{error}</Text>}

      <FlatList
        data={flights}
        renderItem={renderFlight}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingVertical: 16 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 50,
    flex: 1,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginVertical: 6,
    borderRadius: 6,
    borderColor: '#ccc',
  },
  error: {
    color: 'red',
    marginTop: 10,
  },
  flightCard: {
    padding: 14,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  airline: {
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 4,
  },
  route: {
    marginBottom: 4,
  },
  price: {
    marginTop: 6,
    fontWeight: 'bold',
    color: '#007BFF',
  },
});
