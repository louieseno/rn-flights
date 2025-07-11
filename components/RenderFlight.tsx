import { Flight, Itinerary } from "@/model/Flight";
import { Image, StyleSheet, Text, View } from "react-native";

const RenderFlight = ({ item }: { item: Flight | null }) => {
  if (!item) return;
  const topFlights = item.itineraries.topFlights;
  const otherFlights = item.itineraries.otherFlights;

  const extractTime = (raw: string): string => {
    return raw.split(" ")[1] + " " + raw.split(" ")[2];
  };

  const renderFlightList = (flights: Itinerary[], title: string) => {
    return (
      <View style={styles.flightSection}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <View style={styles.flightsList}>
          {flights.length === 0 ? (
            <Text style={{ color: "#888", fontStyle: "italic", padding: 8 }}>
              No flights available.
            </Text>
          ) : null}
          {flights.map((flight, index) => {
            // Get origin and destination from first and last flight segments
            const originAirport = flight.flights[0]?.departure_airport;
            const destinationAirport =
              flight.flights[flight.flights.length - 1]?.arrival_airport;

            return (
              <View key={index} style={styles.flightItem}>
                <View style={styles.flightInfo}>
                  <Image
                    source={{ uri: flight.airline_logo }}
                    style={styles.airlineLogo}
                    resizeMode="contain"
                  />
                  <View style={styles.timeInfo}>
                    <Text style={styles.timeText}>
                      {extractTime(flight.departure_time)} -{" "}
                      {extractTime(flight.arrival_time)}
                    </Text>
                  </View>
                  <View style={styles.routeInfo}>
                    <Text style={styles.routeText}>
                      {originAirport?.airport_code} -{" "}
                      {destinationAirport?.airport_code}
                    </Text>
                  </View>
                  <View style={styles.priceContainer}>
                    <Text style={styles.priceText}>{`$${flight.price}`}</Text>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.flightContainer}>
      {renderFlightList(topFlights, "TOP FLIGHTS")}
      {renderFlightList(otherFlights, "OTHER FLIGHTS")}
    </View>
  );
};

const styles = StyleSheet.create({
  flightContainer: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 16,
  },
  flightSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  flightsList: {
    gap: 8,
  },
  flightItem: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  flightInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  airlineLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  timeInfo: {
    flex: 2,
    paddingHorizontal: 12,
    fontSize: 12,
  },
  timeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#333",
  },
  routeInfo: {
    flex: 2,
    paddingHorizontal: 12,
  },
  routeText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#666",
  },
  priceContainer: {
    flex: 1,
    alignItems: "flex-end",
  },
  priceText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#007AFF",
  },
});

export default RenderFlight;
