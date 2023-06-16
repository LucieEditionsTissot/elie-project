import React, { useEffect } from "react";
import io from "socket.io-client";
import PropTypes from "prop-types";

const socket = io("localhost:3000");

const ThemeExplanationScreen = () => {
    useEffect(() => {
        // Émettre l'événement 'themeIsRandomlyChosen' au montage du composant
        socket.emit("themeIsRandomlyChosen");

        // Écoute de l'événement 'themeExplanationFinished'
        socket.on("themeExplanationFinished", () => {
            // Lorsque l'explication du thème est terminée, émettre l'événement 'startTurnByTurn'
            socket.emit("startTurnByTurn");
        });

        // Nettoyage de l'écoute de l'événement lors du démontage du composant
        return () => {
            socket.off("themeExplanationFinished");
        };
    }, []);

    return (
        <section id="themeExplanationScreen">
            <h1>Explication du thème en cours</h1>
        </section>
    );
};

export default ThemeExplanationScreen;
