import React, {useEffect, useRef, useState} from "react";
import io from 'socket.io-client';

const socket = io("localhost:3000");

function ThemeScreen() {

    return (
        <section id={"themeScreen"} className={"hide"}>

            <h1>Selection du thème en cours de manière aléatoire</h1>

        </section>
    )
}

export default ThemeScreen;
