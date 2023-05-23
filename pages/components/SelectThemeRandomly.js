import React, {useEffect, useRef, useState} from "react";
import io from 'socket.io-client';

const socket = io("localhost:3000");

function SelectThemeRandomly(props) {

    return (
        <section id={"theme"} className={"hide"}>

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
