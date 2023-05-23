import React, {useEffect, useRef, useState} from "react";
import io from 'socket.io-client';

const socket = io("localhost:3000");

function ShowMap(props) {

    return (
        <section id={"map"} className={"hide"}>

            <h1>Map</h1>

            {props.animation !== null &&

                <h5>{props.animation}</h5>

            }

        </section>
    )
}

export default ShowMap;
