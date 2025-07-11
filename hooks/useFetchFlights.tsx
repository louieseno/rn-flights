import { Flight } from "@/model/Flight";
import axios from "axios";
import { useRef, useState } from "react";

type Props = {
  departureId: string | null;
  arrivalId: string | null;
  tripType: "One Way" | "Round Trip";
  departDate: string; // e.g. "2025-07-12"
  returnDate?: string; // e.g. "2025-07-19", optional for one-way
};

const flightCache = new Map<string, Flight>();

const useFetchFlights = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const controllerRef = useRef<AbortController | null>(null);

  const fetchFlights = async ({
    departureId,
    arrivalId,
    tripType,
    departDate,
    returnDate,
  }: Props) => {
    setError(null);

    if (tripType === "One Way" && !departureId) {
      setError("Origin airport required");
      return;
    }

    if (tripType === "Round Trip" && (!departureId || !arrivalId)) {
      setError("Both origin and destination airports are required");
      return;
    }

    const cacheKey = `${departureId}-${arrivalId}`;
    const cached = flightCache.get(cacheKey);
    if (cached) {
      return cached;
    }

    const controller = new AbortController();
    controllerRef.current = controller;
    setLoading(true);

    try {
      const response = await axios.get(
        "https://google-flights2.p.rapidapi.com/api/v1/searchFlights",
        {
          params: {
            departure_id: departureId,
            arrival_id: arrivalId,
            outbound_date: departDate,
            return_date: tripType === "Round Trip" ? returnDate : undefined,
            travel_class: "ECONOMY",
            adults: "1",
            show_hidden: "1",
            currency: "USD",
            language_code: "en-US",
            country_code: "US",
          },
          headers: {
            "x-rapidapi-key":
            process.env.EXPO_PUBLIC_FLIGHTS_KEY,
            "x-rapidapi-host": "google-flights2.p.rapidapi.com",
          },
          signal: controller.signal,
        }
      );

      const result: Flight = response.data.data;
      flightCache.set(cacheKey, result);
      return result;
    } catch (err) {
      if (axios.isCancel(err)) return;
      console.error("Error fetching flights:", err);
      setError("Failed to fetch flights.");
    } finally {
      setLoading(false);
    }
  };

  const cancelRequest = () => {
    controllerRef.current?.abort();
  };

  return {
    loading,
    setLoading,
    error,
    setError,
    fetchFlights,
    cancelRequest,
  };
};

export default useFetchFlights;
