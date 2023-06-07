import React from "react";
import ClueMap from "./ClueMap";

function ShowMap(props, clue) {
    return (
        <section id="map" className="hide">
            <h1>Map</h1>

            {clue && <ClueMap clue={clue} />}

            {props.animation && (
                <video src={props.animation} autoPlay loop></video>
            )}
        </section>
    );
}

export default ShowMap;
