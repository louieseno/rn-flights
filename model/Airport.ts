export interface Airport {
  name: string;
  iataCode: string;
  address: {
    countryCode: string;
    stateCode: string;
  };
  geoCode: {
    latitute: number;
    longtitude: number;
  };
}
