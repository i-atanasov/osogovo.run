import Layout from './Components/Layout/Layout';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from '@vercel/speed-insights/react';
import Router from './Components/Router/Router';
import './App.css';

export default function App() {
  const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID || '';

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <Layout>
          <Router />
          <Analytics />
          <SpeedInsights />
      </Layout>
    </GoogleOAuthProvider>
  );
}