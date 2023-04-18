import '@/styles/globals.scss'
import type { AppProps } from 'next/app'
import { Prompt } from 'next/font/google';
import {NextFont} from "next/dist/compiled/@next/font";
import store from "@/store";
import { Provider} from 'react-redux';
import Layout from "@/components/layout";

const prompt: NextFont = Prompt({
  weight: ['100', '200','300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin']
})

export default function App({ Component, pageProps }: AppProps) {
  return (<>
    <style jsx global>{`
      html {
        font-family: ${prompt.style.fontFamily};
      }
      button {
        background: none;
        border: none;
        cursor: pointer;
        font-family: ${prompt.style.fontFamily};
      }
    `}</style>
    <Provider store={store}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Provider>
  </>);
}
