import '../styles/globals.css'
import '../styles/filter.css'
import Layout from '../components/Layout'
import { DataProvider } from '../store/GlobalState'

import { Provider as AuthProvider } from 'next-auth/client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';


function MyApp({ Component, pageProps }) {
  const [session, setSession] = useState(null);
  const router = useRouter();
  useEffect(() => {

  }, [session, router]);
  return (
    <AuthProvider session={pageProps.session}>
      <DataProvider>
        <Layout>
          <Component {...pageProps} setSession={setSession} />
        </Layout>
      </DataProvider>
    </AuthProvider>
  )
}

export default MyApp
