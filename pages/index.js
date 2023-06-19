import React, {useState, useEffect} from "react";
import io from "socket.io-client";
import Head from "next/head";
import TurnByTurn from "../components/TurnByTurn";

const socket = io("localhost:3000", {
    query: {group: "teacher"},
});


export default function TeacherTablet() {
    const [selectedTheme, setSelectedTheme] = useState("");
    const [themes, setThemes] = useState([]);
    const [reponsesCorrectes, setReponsesCorrectes] = useState([]);

    useEffect(() => {
        socket.on('themes', (themes) => {
            setThemes(themes);
        });
        socket.on("reloadClient", () => {
            window.location.reload();
        });
        socket.on('reponsesCorrectes', (reponsesCorrectes) => {
            setReponsesCorrectes(reponsesCorrectes);
            console.log('Bonnes réponses :', reponsesCorrectes);
        });
        return () => {
            socket.off('themes');
        };
    }, []);

    const handleThemeChoice = (theme, e) => {
        e.target.classList.add("selected");
        socket.emit("themeChoisi", theme);
        setSelectedTheme(theme);
        console.log("Thème choisi : ", theme);
    };

    return <>
        <Head>
            <title>Tablette professeur</title>
        </Head>

    </>
};
