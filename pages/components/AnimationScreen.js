import React, {useEffect, useRef, useState} from "react";
import io from 'socket.io-client';

const socket = io("localhost:3000");

function AnimationScreen() {

    return (
        <section id={"animationScreen"} className={"hide"}>

            <h1>Animation en cours</h1>

        </section>
    )
}

export default AnimationScreen;
