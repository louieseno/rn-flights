export interface Flight {
  itineraries: {
    topFlights: Itinerary[];
    otherFlights: Itinerary[];
  };
}
export interface Itinerary {
  departure_time: string;
  arrival_time: string;
  duration: { raw: number; text: string };
  price: string;
  airline_logo: string;
  flights: {
    departure_airport: {
      airport_name: string;
      airport_code: string;
      time: string;
    };
    arrival_airport: {
      airport_name: string;
      airport_code: string;
      time: string;
    };
    duration: { raw: number; text: string };
    airline: string;
    airline_logo: string;
    flight_number: string;
    aircraft: string;
    seat: string;
    legroom: string;
    extensions: string[];
  }[];
}
