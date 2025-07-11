import DateInput from "@/components/DateInput";
import LocationAutocomplete from "@/components/LocationAutoComplete";
import RenderFlight from "@/components/RenderFlight";
import TripTypeDropdown from "@/components/TripTypeDropdown";
import useFetchFlights from "@/hooks/useFetchFlights";
import { City } from "@/model/City";
import { Flight, Itinerary } from "@/model/Flight";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Button,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

type FormValues = {
  tripType: "One Way" | "Round Trip";
  from: City | null;
  to: City | null;
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
      tripType: "Round Trip",
      from: null,
      to: null,
      departDate: currentDate,
      returnDate: tomorrow,
    },
  });

  // Watch field values
  const tripType = watch("tripType");
  const from = watch("from");
  const to = watch("to");
  const departDate = watch("departDate");
  const returnDate = watch("returnDate");

  const isFormComplete = tripType && from && to && departDate;
  const isRoundTrip = tripType == "Round Trip";

  const { loading, error, fetchFlights } = useFetchFlights();
  const [allFlights, setAllFlights] = useState<Flight | null>(null);

  const onSubmit = async (_: FormValues) => {
    const departureIds = from?.relationships.map((rel) => rel.id) || [];
    const arrivalIds = to?.relationships.map((rel) => rel.id) || [];

    const combinations = departureIds.flatMap((dep) =>
      arrivalIds.map((arr) => ({ dep, arr }))
    );

    const departDateStr = departDate.toISOString().split("T")[0];
    const returnDateStr = isRoundTrip
      ? returnDate?.toISOString().split("T")[0]
      : undefined;

    const flightPromises = combinations.map(({ dep, arr }) =>
      fetchFlights({
        departureId: dep,
        arrivalId: arr,
        tripType,
        departDate: departDateStr,
        returnDate: returnDateStr,
      })
    );

    const results = await Promise.allSettled(flightPromises);

    const allTopFlights: Itinerary[] = [];
    const allOtherFlights: Itinerary[] = [];

    for (const result of results) {
      if (result.status === "fulfilled" && result.value) {
        const flight: Flight = result.value;
        allTopFlights.push(...(flight.itineraries.topFlights || []));
        allOtherFlights.push(...(flight.itineraries.otherFlights || []));
      }
    }

    const mergedFlights: Flight = {
      itineraries: {
        topFlights: allTopFlights,
        otherFlights: allOtherFlights,
      },
    };

    setAllFlights(mergedFlights);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Search Flights</Text>
      <Controller
        control={control}
        name="tripType"
        render={({ field: { onChange, value } }) => (
          <TripTypeDropdown onChange={onChange} />
        )}
      />
      <Controller
        control={control}
        name="from"
        rules={{ required: "Origin is required" }}
        render={({ field: { onChange, value } }) => (
          <LocationAutocomplete label={"Origin"} onSelect={onChange} />
        )}
      />
      {errors.from && <Text style={styles.error}>{errors.from.message}</Text>}
      <Controller
        control={control}
        name="to"
        rules={{ required: "Destination is required" }}
        render={({ field: { onChange, value } }) => (
          <LocationAutocomplete label={"Destination"} onSelect={onChange} />
        )}
      />
      {errors.to && <Text style={styles.error}>{errors.to.message}</Text>}
      <View
        style={{
          flexDirection: "row",
          justifyContent: isRoundTrip ? "space-between" : "center",
        }}
      >
        <Controller
          control={control}
          name="departDate"
          rules={{ required: "Departure date is required" }}
          render={({ field: { value, onChange } }) => (
            <DateInput
              label="Departure Date"
              value={value}
              onChange={onChange}
              required
            />
          )}
        />
        {errors.departDate && (
          <Text style={styles.error}>{errors.departDate.message}</Text>
        )}

        {isRoundTrip && (
          <>
            <Controller
              control={control}
              name="returnDate"
              render={({ field: { value, onChange } }) => (
                <DateInput
                  label="Return Date"
                  value={value}
                  onChange={onChange}
                />
              )}
            />
            {errors.returnDate && (
              <Text style={styles.error}>{errors.returnDate.message}</Text>
            )}
          </>
        )}
      </View>
      <Button
        title="Search"
        onPress={handleSubmit(onSubmit)}
        disabled={!isFormComplete || loading}
      />
      {loading && <ActivityIndicator style={{ marginTop: 20 }} />}
      {error && <Text style={styles.error}>{error}</Text>}

      <RenderFlight item={allFlights} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 50,
    flex: 1,
    backgroundColor: "#fff",
  },
  heading: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginVertical: 6,
    borderRadius: 6,
    borderColor: "#ccc",
  },
  error: {
    color: "red",
    marginTop: 10,
  },
  flightCard: {
    padding: 14,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
  },
  airline: {
    fontWeight: "600",
    fontSize: 16,
    marginBottom: 4,
  },
  route: {
    marginBottom: 4,
  },
  price: {
    marginTop: 6,
    fontWeight: "bold",
    color: "#007BFF",
  },
});
