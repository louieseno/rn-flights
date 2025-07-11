import { City } from "@/model/City";
import axios from "axios";
import { useEffect } from "react";
import { getAmadeusAccessToken } from "./useFetchAmadeusToken";

type Props = {
  debouncedQuery: string;
  setCities: React.Dispatch<React.SetStateAction<City[]>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

// Cache format
const cityAirportCache = new Map<string, City[]>();

const useFetchCities = ({ debouncedQuery, setCities, setLoading }: Props) => {
  useEffect(() => {
    const controller = new AbortController();

    const fetch = async () => {
      if (!debouncedQuery || debouncedQuery.length < 2) {
        setCities([]);
        return;
      }

      if (cityAirportCache.has(debouncedQuery)) {
        const cached = cityAirportCache.get(debouncedQuery)!;
        setCities(cached);
        return;
      }

      setLoading(true);
      try {
        const token = await getAmadeusAccessToken();

        const res = await axios.get(
          `${process.env.EXPO_PUBLIC_AMADEUS_BASE_URL}/v1/reference-data/locations/cities`,
          {
            params: {
              keyword: debouncedQuery,
              max: 10,
              include: "AIRPORTS",
            },
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/vnd.amadeus+json",
            },
            signal: controller.signal,
          }
        );

        const responseData = res.data;

        const cities: City[] = responseData.data.map((item: any) => ({
          name: item.name,
          iataCode: item.iataCode,
          address: item.address,
          geoCode: item.geoCode,
          relationships: item.relationships,
        }));

        cityAirportCache.set(debouncedQuery, cities);
        setCities(cities);
      } catch (err) {
        console.error("Error fetching cities and airports:", err);
      } finally {
        setLoading(false);
      }
    };

    fetch();
    return () => controller.abort();
  }, [debouncedQuery]);
};

export default useFetchCities;
