import React, {useEffect, useRef, useState} from "react";
import io from 'socket.io-client';

const socket = io("localhost:3000");

function RulesScreen() {

    return (
        <section id={"rulesScreen"} className={"hide"}>

            <h1>Explication des règles en cours</h1>

        </section>
    )
}

export default RulesScreen;
