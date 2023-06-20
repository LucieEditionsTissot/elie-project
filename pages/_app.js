import '../styles/style.css'
import '../styles/globals.css';

export const url = "172.20.10.2:3000"

function MyApp({Component, pageProps}) {
    return (
        <>
            <Component {...pageProps} />
        </>
    )
}

export default MyApp
