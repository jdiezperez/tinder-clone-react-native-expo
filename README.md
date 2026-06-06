# Tinder Clone

A fully functional mobile dating application inspired by Tinder, built with React Native, Expo, and a Node.js backend. This project features real-time chatting, a swipeable deck of profiles, and a complete authentication flow.

## Features

- **Authentication:** User registration and login using JWT.
- **Profile Management:** Set up your profile and upload photos.
- **Discover:** Swipe left (pass) or right (like) on user profiles using a dynamic card deck.
- **Matching System:** Automatically detects mutual likes and creates matches.
- **Real-time Chat:** Instant messaging with matches powered by Socket.io.

## Tech Stack

### Frontend (Mobile App)
- **React Native** (v0.81.5)
- **Expo** (~54.0.18)
- **React Navigation** (Native Stack for routing)
- **React Native Deck Swiper** (For the Tinder-like card swiping experience)
- **Socket.io Client** (Real-time communication)
- **Axios** (API requests)
- **AsyncStorage** (Local session management)

### Backend
- **Node.js & Express** (Server framework)
- **Prisma ORM** (Database interaction and schema management)
- **PostgreSQL** (Database)
- **Socket.io** (WebSocket server for real-time chat)
- **JSON Web Tokens (JWT)** (Authentication)
- **Bcrypt** (Password hashing)

## Project Structure

```
tinder-clone/
├── backend/                # Node.js Express server
│   ├── prisma/             # Prisma schema and migrations
│   ├── src/                # Backend source code
│   │   ├── middleware/     # Custom middleware (e.g., auth verification)
│   │   ├── routes/         # Express API routes
│   │   └── index.js        # Server entry point
│   ├── .env                # Backend environment variables
│   └── package.json
├── src/                    # React Native frontend source code
│   ├── context/            # React context (State management)
│   ├── navigation/         # Navigation configuration
│   └── screens/            # Application screens
│       ├── ChatScreen.js
│       ├── HomeScreen.js   # Swiping interface
│       ├── LoginScreen.js
│       ├── MatchesScreen.js
│       ├── PhotoManagerScreen.js
│       ├── ProfileScreen.js
│       └── RegisterScreen.js
├── App.js                  # Frontend entry point
├── app.json                # Expo configuration
└── package.json            # Frontend dependencies
```

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Expo Go](https://expo.dev/go) app installed on your iOS or Android device (for physical device testing)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Create a `.env` file in the `backend` folder based on `.env copy` and add your database URL and JWT secret:
   ```env
   DATABASE_URL="your_prisma_postgres_database_url"
   JWT_SECRET="your_secret_key"
   ```
4. Initialize Prisma and apply migrations:
   ```bash
   npx prisma generate
   npx prisma db push
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Open a new terminal and navigate to the project root (if not already there):
   ```bash
   cd tinder-clone
   ```
2. Install frontend dependencies:
   ```bash
   npm install
   ```
3. Update the API URL:
   Ensure that the Axios base URL and Socket.io connection URL in your frontend code (likely in `src/api` or `src/context`) point to your local backend server's IP address (e.g., `http://<your-ip-address>:3000`). *Note: `localhost` may not work when testing on a physical device.*
4. Start the Expo server:
   ```bash
   npm start
   ```
5. Scan the QR code with the **Expo Go** app on your physical device, or press `a` for Android emulator / `i` for iOS simulator.

## Contributing

Contributions, issues, and feature requests are welcome!

## 📝 License

This project is licensed under the ISC License.
