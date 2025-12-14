# Larry Butter (React Native / Expo)

Mobile Harry Potter app built with **React Native + Expo Router**.  
The app shows **Characters** and **Spells** from an external API and lets you save them as **Favourites**.

## What you can do
- Browse **Characters** and **Spells** (FlatList)
- Open **detail pages** (routing)
- Add/remove **favourites**
- Pick a **profile image** for a character (Image Picker)
- Get a **notification** when something is favourited/unfavourited

## Tech used
- React Native + Expo
- Expo Router (tabs + detail screens)
- NativeWind (styling)
- AsyncStorage (persist favourites + images)
- Supabase (store favourite characters per device)
- Expo Image Picker
- Expo Notifications

## APIs (GET)
- Characters: `https://sampleapis.assimilate.be/harrypotter/characters`
- Spells: `https://sampleapis.assimilate.be/harrypotter/spells`

## Where data is stored
- **Favourite Characters** → Supabase table `favourite_characters` (linked to `device_id`)
- **Favourite Spells** → AsyncStorage (`favouriteSpells`)
- **Picked character images** → AsyncStorage map (`character_images_v1`)

## Requirements checklist
- [x] 3+ screens with routing (Tabs + detail screens)
- [x] FlatList used
- [x] External API GET requests
- [x] Persistent storage (AsyncStorage)
- [x] Shared state via Context (FavouritesContext)
- [x] External service used (Supabase)
- [x] 2+ Expo components (ImagePicker + Notifications)
- [x] UX styling applied

## Run
```bash
npm install
npx expo start --tunnel
