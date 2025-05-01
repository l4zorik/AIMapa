# AI Mapa

A map application with Auth0 authentication and Supabase database integration.

## Features

- Interactive map using Leaflet
- Authentication with Auth0
- User profile information stored in Supabase
- Synchronization between Auth0 and Supabase

## Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file based on `.env.example` and fill in your Auth0 and Supabase credentials
4. Initialize your Supabase database using the SQL script in `supabase/init.sql`
5. Start the development server:
   ```
   npm run dev
   ```

## Authentication & Data Storage

This application uses Auth0 for authentication and Supabase for data storage. The authentication flow is as follows:

1. User visits the application
2. User is redirected to Auth0 login page
3. After successful authentication, user is redirected to `/overeno`
4. User data is synchronized with Supabase database
5. User is then redirected to the map page

The application uses Supabase to store user profiles and other data. When a user logs in, their Auth0 profile is synchronized with Supabase to ensure data consistency.

## Environment Variables

### Auth0 Configuration
- `AUTH0_SECRET`: A long, randomly generated string for session encryption
- `AUTH0_BASE_URL`: The base URL of your application (e.g., http://localhost:3000)
- `AUTH0_CLIENT_ID`: Your Auth0 client ID
- `AUTH0_ISSUER_BASE_URL`: Your Auth0 domain URL

### Supabase Configuration
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_ANON_KEY`: Your Supabase anonymous key

### Server Configuration
- `PORT`: The port on which the server will run (default: 3000)

## License

MIT
