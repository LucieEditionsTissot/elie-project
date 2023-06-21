import React from "react";

const ThemeExplanationScreen = ({socket, themeSelected }) => {
        return (
            <section id="themeExplanationScreen">
                <h1>{themeSelected}</h1>
            </section>
        );
};

export default ThemeExplanationScreen;

