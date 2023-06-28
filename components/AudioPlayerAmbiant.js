import React, { useEffect, useRef } from 'react';
import { Howl } from 'howler';

const AudioPlayerAmbiant = ({ src }) => {
    const soundRef = useRef(null);

    useEffect(() => {
        const sound = new Howl({
            src: [src],
            html5: true,
            autoplay: true,
            loop: false,
            volume: 1,
            stereo: false,
        });
        soundRef.current = sound;

        sound.play();

        return () => {
            sound.stop();
        };
    }, [src]);

    return null;
};

export default AudioPlayerAmbiant;