import React, {useEffect, useRef, useState} from "react";

function ThemeExplanation(props) {

    return (
        <section id={"themeExplanation"} className={"hide"}>

            <h1>Explication du thème</h1>

            <h3>{props.explanation}</h3>

        </section>
    )
}

export default ThemeExplanation;
