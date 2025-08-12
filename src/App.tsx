import Layout from './Components/Layout/Layout';
import { Analytics } from "@vercel/analytics/next"
import Router from './Components/Router/Router';
import './App.css';

export default function App() {
  return (
    <Layout>
        <Router />
        <Analytics />
    </Layout>
  );
}