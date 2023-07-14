import '@/styles/globals.scss'
import { AppWrapper } from '@/context/AppContext';
import { WindowTitlebar } from '@/components/windowTitlebar'
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';


export default function App({ Component, pageProps }) {
  // localStorage.clear() // Used to force clear storage during development
  return (
    <AppWrapper>
      <WindowTitlebar />
      <Navigation />
      <main>
        <Component {...pageProps} />
      </main>
      <Footer />
    </AppWrapper>
  )
}
