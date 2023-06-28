import React, { useEffect, useRef } from 'react';
const AudioPlayer = ({ scenario, src }) => {

    useEffect(() => {
        window.addEventListener("click", () => {
            const audio = document.querySelector("#audio");
            if (audio) {
                audio.autoplay = true
            }
        })
    }, [])

    useEffect(() => {
        const audio = document.querySelector("#audio");
        audio.muted = !(audio && scenario);
    }, [scenario])

    return (
        <audio id={"audio"} src={src} loop muted></audio>
    );
};

export default AudioPlayer;
