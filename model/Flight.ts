export interface Flight {
  id: string;
  airline: string;
  airlineLogo: string;
  flightNumber: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  stops: number;
  stopAirports: string[];
  emissionsKg?: number;
  emissionsTag?: string;
  emissionsLevel?: "high" | "avg" | "low";
  price: string;
  priceRaw?: number;
  isTopFlight?: boolean;
}
