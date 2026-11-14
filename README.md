# LankaBus Compass

An offline bus route and stop guide for Sri Lanka, built with React Native (Expo) for ICA 03.

LankaBus Compass covers 88 stops across all 25 districts and 44 major routes, all stored on the
device. Search by route number or town, filter by bus type, fare or province, view timetables and
stop details, find direct or connecting buses between any two stops, and save favourites with
personal notes. It works without an internet connection and uses no public APIs or online databases.

## Features
- 8 screens: Home, Routes, Route Details, Stops, Stop Details, Trip Finder, Stop Picker, Saved
- Local JSON dataset of stops and routes (`src/data`)
- Search by route number, town, stop or district
- Filters: bus type, fare range, province
- Route details with ordered stops, estimated times, next bus and full timetable
- Stop details with all routes serving the stop
- Trip Finder with direct, one-change and two-change journeys
- Favourites, notes, recent items and last trip saved with AsyncStorage

## Tech stack
React Native, Expo, React Navigation (bottom tabs and stack), AsyncStorage

## Run it
```bash
npm install
npx expo start
```
Scan the QR code with Expo Go.

## Project structure
- `App.js`: navigation
- `src/data/`: stops.json, routes.json
- `src/screens/`: all screens
- `src/components/`: reusable UI
- `src/context/`: app state and storage
- `src/utils/`: search, time and storage helpers

## Data note
The dataset is hand-made for this assignment. Fares and timings are approximate and not for real travel planning.
