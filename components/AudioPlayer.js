import React, { useEffect, useRef } from 'react';
import { Howl } from 'howler';

const AudioPlayer = ({ src }) => {
    const soundRef = useRef(null);

    useEffect(() => {
        const sound = new Howl({ src: [src] });
        soundRef.current = sound;

        sound.play();

        return () => {
            sound.stop();
        };
    }, [src]);

    return null;
};

export default AudioPlayer;