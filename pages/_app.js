import '../styles/style.css'
import '../styles/globals.css';
import React from "react";
import Head from "next/head";

export const url = "172.28.59.45:3000"

function MyApp({Component, pageProps}) {

    return (
        <>
            <Head>
                <title>ELIE</title>
                <meta name="apple-mobile-web-app-capable" content="yes"/>
                <meta name="mobile-web-app-capable" content="yes"/>
            </Head>
            <Component {...pageProps} />
        </>
    )
}

export default MyApp
