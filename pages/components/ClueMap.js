import React from "react";
import VideoPlayer from "./VideoPlayer";
import AudioPlayer from "./AudioPlayer";

function ClueMap(props) {
    return (
        <section id={"map"} className={"hide"}>
            <h1>Map</h1>

            {props.clue !== null &&
                (props.clue.includes(".mp4") ? (
                    <VideoPlayer src={props.clue} />
                ) : (
                    <AudioPlayer src={props.clue} />
                ))}
        </section>
    );
}

export default ClueMap;