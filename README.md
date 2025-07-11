# ✈️ rn-flights Mobile App

A React Native mobile app that helps users search for flights — inspired by Google Flights. Built with Expo, location-based search, and sign-up authentication.

## 📱 Features

- 🔍 Search for flights by city
- 📅 Select departure and return dates
- ✅ User sign-up and basic auth (local-only)

## 🚀 Tech Stack

- **React Native (Expo)**
- **Expo Router**
- **TypeScript**
- **Amadeus API**
- **Google Flights Scraping (due to Sky-Scrapper API limitations)**

> ❗️Note: Sky-Scrapper API only allows 20 requests/month on the free tier, so this app uses data from Google Flights for demo purposes.

## 🧪 How to Run

### Local Auth Server

To start the local server in port 3000 run the following:

```bash
cd rn-flights/server
npm install
npm run mock-db
```

### Expo App

```bash
cd rn-flights
npm install
npx expo start
```
