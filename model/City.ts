export interface City {
  name: string;
  iataCode?: string;
  address: {
    countryCode: string;
    stateCode: string;
  };
  geoCode: {
    latitute: number;
    longtitude: number;
  };
  relationships: { id: string; type: string; href: string }[];
}
