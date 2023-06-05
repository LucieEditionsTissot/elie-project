import React from "react";

const AudioPlayer = () => {
    return (
        <div style={{ position: "relative", width: "500px", height: "500px", margin: "0 auto", overflow: "hidden"}}>
            <audio
                controls
                src="/audio/Corbeau.mov">
                Your browser does not support the
                <code>audio</code> element.
            </audio>
        </div>
    );
};

export default AudioPlayer;