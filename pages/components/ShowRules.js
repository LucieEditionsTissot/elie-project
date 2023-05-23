import React, {useEffect, useRef, useState} from "react";
import io from 'socket.io-client';

const socket = io("localhost:3000");

function ShowRules(props) {

    return (
        <section id={"rules"} className={"hide"}>

            <h1>Affichage des règles blablabla</h1>

            <ul>
                {Object.values(props.rules).map((rule, index) => (
                    <li key={index}>{rule}</li>
                ))}
            </ul>

        </section>
    )
}

export default ShowRules;
