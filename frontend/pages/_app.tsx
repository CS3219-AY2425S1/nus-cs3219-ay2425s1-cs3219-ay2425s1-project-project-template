import '@/styles/globals.css'

import { AppProps } from 'next/app'
import Layout from '@/components/layout/layout'
import { Toaster } from 'sonner'

export default function App({ Component, pageProps }: AppProps) {
    return (
        <Layout>
            <Component {...pageProps} />
            <Toaster />
        </Layout>
    )
}
