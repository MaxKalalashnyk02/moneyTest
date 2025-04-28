# Money Manager

A React Native mobile application for tracking and managing personal finances. Track expenses, manage multiple accounts, and monitor your financial activity with ease.

## Features

- Multi-account management with different currencies
- Expense tracking categorized by type
- Financial summaries and data visualization
- Light and dark theme support
- Secure authentication

## Backend Service

This project uses **Supabase** as the backend service for several reasons:

- **Open source** - Provides greater transparency and community support
- **PostgreSQL database** - Enterprise-grade relational database for data integrity
- **Real-time capabilities** - Subscription-based data changes with minimal setup
- **Built-in authentication** - Secure user management with minimal configuration
- **Simplified API** - Intuitive interface similar to Firebase but with SQL power
- **Cost-effective** - Generous free tier for development and small applications

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- React Native environment setup (follow [React Native CLI Quickstart](https://reactnative.dev/docs/environment-setup))
- Supabase account (free tier available at [supabase.com](https://supabase.com))

### Environment Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/MoneyManager.git
cd MoneyManager
```

2. Install dependencies:
```bash
npm install
# or
yarn
```

3. Create a `.env` file in the project root with your Supabase credentials:
```
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key
```

4. Database setup:
   - Create a new Supabase project
   - Set up the following tables:
     - Account (id, name, currency, balance, color, user_id)
     - Expense (id, title, amount, category, date, account_id, user_id)
   - Enable Row Level Security (RLS) for proper data isolation

### Running the app

#### Using npm

Start Metro Bundler:
```bash
npm start
```

For iOS:
```bash
npm run ios
# or
npx pod-install ios
npx react-native run-ios
```

For Android:
```bash
npm run android
# or
npx react-native run-android
```

#### Using yarn

Start Metro Bundler:
```bash
yarn start
```

For iOS:
```bash
yarn ios
# or
npx pod-install ios
npx react-native run-ios
```

For Android:
```bash
yarn android
# or
npx react-native run-android
```

If build fails, you can try building and running directly with Xcode or Android Studio.

## Project Structure

- `/src/contexts` - React contexts for global state management
- `/src/screens` - UI screens organized by feature
- `/src/hooks` - Custom React hooks
- `/src/services` - API services for backend communication
- `/src/utils` - Utility and helper functions
- `/src/navigation` - Navigation configuration
- `/src/theme` - Styling and theme definitions

## Known Issues and Limitations

I am not aware of any issues or limitations in the current implementation.
