import { City } from "@/model/City";
import axios from "axios";
import { useEffect } from "react";

type Props = {
  debouncedQuery: string;
  setResults: React.Dispatch<React.SetStateAction<City[]>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

// In-memory cache
const cityCache = new Map<string, City[]>();

const useFetchCities = ({ debouncedQuery, setResults, setLoading }: Props) => {
  useEffect(() => {
    const controller = new AbortController();

    const fetchCities = async () => {
      if (!debouncedQuery || debouncedQuery.length < 3) {
        setResults([]);
        return;
      }

      // Check cache first
      if (cityCache.has(debouncedQuery)) {
        setResults(cityCache.get(debouncedQuery)!);
        return;
      }

      setLoading(true);
      try {
        const response = await axios.get(
          "https://wft-geo-db.p.rapidapi.com/v1/geo/cities",
          {
            params: {
              namePrefix: debouncedQuery,
              limit: 5,
              sort: "-population",
            },
            headers: {
              "x-rapidapi-key":
                "f3433cabcamsh76a57c9b445f4c0p1fcae0jsn08fb195ae9bc",
              "x-rapidapi-host": "wft-geo-db.p.rapidapi.com",
            },
            signal: controller.signal,
          }
        );
        const cities: City[] = response.data.data;

        // Cache the result
        cityCache.set(debouncedQuery, cities);

        setResults(cities);
      } catch (err) {
        console.error("Error fetching cities:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
    return () => controller.abort();
  }, [debouncedQuery]);
};

export { useFetchCities };
