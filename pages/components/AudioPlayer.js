import React from 'react';

const AudioPlayer = () => {
    return (
        <audio controls>
            <source src="/audio/Corbeau.mov" type="audio/mov" />
        </audio>
    );
};

export default AudioPlayer;