import React, {useEffect, useRef, useState} from "react";
import io from 'socket.io-client';

const socket = io("localhost:3000");

function ThemeExplanationScreen() {

    return (
        <section id={"themeExplanationScreen"} className={"hide"}>

            <h1>Explication du thème en cours</h1>

        </section>
    )
}

export default ThemeExplanationScreen;
