// utils/amadeusTokenManager.ts
import axios from "axios";

const AMADEUS_API_KEY = process.env.EXPO_PUBLIC_AMADEUS_API_KEY;
const AMADEUS_API_SECRET = process.env.EXPO_PUBLIC_AMADEUS_API_SECRET;

export async function getAmadeusAccessToken(): Promise<string | null> {
  let accessToken: string | null = null;
  let tokenExpiresAt: number | null = null;

  const now = Date.now();

  // Return cached token if still valid
  if (accessToken && tokenExpiresAt && now < tokenExpiresAt) {
    return accessToken;
  }

  const tokenRes = await axios.post(
    `${process.env.EXPO_PUBLIC_AMADEUS_BASE_URL}/v1/security/oauth2/token`,
    new URLSearchParams({
      grant_type: "client_credentials",
      client_id: AMADEUS_API_KEY!,
      client_secret: AMADEUS_API_SECRET!,
    }),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  accessToken = tokenRes.data.access_token;
  const expiresIn = tokenRes.data.expires_in; // seconds

  tokenExpiresAt = now + expiresIn * 1000 - 60 * 1000; // refresh 1 min early

  return accessToken;
}
