import '../styles/style.css'
import '../styles/globals.css';
import React from "react";
import Head from "next/head";

export const url = "192.168.1.137:3000"

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
