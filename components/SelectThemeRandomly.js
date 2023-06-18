import React, {useEffect, useRef, useState} from "react";

function SelectThemeRandomly(props) {

    return (
        <section id={"theme"}>

            <h1>Selection du thème en cours</h1>

            <ul>
                {props.themes.map((theme, index) => (
                    <li key={index}>{theme}</li>
                ))}
            </ul>

            <h3>{props.selectedTheme}</h3>

        </section>
    )
}

export default SelectThemeRandomly;
