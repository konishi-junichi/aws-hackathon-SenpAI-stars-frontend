# AWS Cognito Integration

## Overview
This application now uses AWS Cognito for user authentication. Users must log in with valid Cognito credentials before accessing the dashboard and AI mentors.

## Required Environment Variables
Make sure to set these in your `.env.local` file:

```bash
NEXT_PUBLIC_AWS_REGION=your-aws-region
NEXT_PUBLIC_COGNITO_USER_POOL_ID=your-user-pool-id
NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID=your-client-id
NEXT_PUBLIC_COGNITO_IDENTITY_POOL_ID=your-identity-pool-id
```

## Authentication Flow
1. User visits the application and sees the login screen
2. User enters email and password
3. Credentials are validated against AWS Cognito User Pool
4. On successful authentication, user is redirected to the dashboard
5. Authentication state is persisted in localStorage
6. User can logout from the dashboard header

## Components Modified
- `LoginScreen.tsx`: Now integrates with Cognito authentication
- `AppV2.tsx`: Manages authentication state and routing
- `DashboardV2.tsx`: Added logout button
- `lib/amplify.ts`: Cognito authentication logic

## Features
- Real AWS Cognito authentication
- Loading states during login
- Error handling for failed authentication
- Persistent login sessions
- Secure logout functionality