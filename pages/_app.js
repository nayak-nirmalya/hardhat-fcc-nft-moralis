import { MoralisProvider } from 'react-moralis'
import Header from '../components/Header'
import Head from 'next/head'
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MoralisProvider initializeOnMount={false}>
        <Header />
        <Component {...pageProps} />
      </MoralisProvider>
    </div>
  )
}

export default MyApp
