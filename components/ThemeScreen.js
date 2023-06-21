import React, { useEffect, useState } from "react";
import socket from 'socket.io-client';
import { url } from "../pages/_app";

function ThemeScreen({ themeSelected }) {
    const [selectedTheme, setSelectedTheme] = useState(null);

    useEffect(() => {

        socket.on("themeSelected", handleThemeSelected);

        return () => {
            socket.off("themeSelected", handleThemeSelected);
            socket.disconnect();
        };
    }, []);

    function handleThemeSelected(theme) {
        setSelectedTheme(theme);
    }

    return (
        <section id="themeScreen">
            <h1>Selection du thème en cours de manière aléatoire</h1>
            {selectedTheme && <h2>Thème sélectionné : {selectedTheme}</h2>}
        </section>
    );
}

export default ThemeScreen;
