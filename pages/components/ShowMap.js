import React, {useEffect, useRef, useState} from "react";

function ShowMap(props) {

    return (
        <section id={"map"} className={"hide"}>

            <h1>Map</h1>

            {props.animation !== null &&

                <video src={props.animation} autoPlay loop></video>

            }

        </section>
    )
}

export default ShowMap;
