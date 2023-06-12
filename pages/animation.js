import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import Head from 'next/head';
import VideoPlayer from '../components/VideoPlayer';
import AudioPlayer from '../components/AudioPlayer';

const socket = io('localhost:3000');

const Client3 = () => {
    const [currentAudio, setCurrentAudio] = useState(null);
    const [currentVideo, setCurrentVideo] = useState(null);
    const [contextStarted, setContextStarted] = useState(false);

    useEffect(() => {
        socket.emit("registerAnimationClient");

        socket.on('loadMap', (data) => {
            console.log('Loading map:', data);
        });

        socket.on('loadAudio', (data) => {
            console.log('Loading audio:', data);
            setCurrentAudio(data);

            if (!contextStarted) {
                document.addEventListener('click', startAudioContext);
                document.addEventListener('keydown', startAudioContext);
                document.addEventListener('touchstart', startAudioContext);
            }
        });

        socket.on('pauseAudio', (data) => {
            console.log('Pausing audio:', data);
            setCurrentAudio(null);
        });

        socket.on('loadVideo', (data) => {
            console.log('Loading video:', data);
            setCurrentVideo(data);
        });

        socket.on('pauseVideo', (data) => {
            console.log('Pausing video:', data);
            setCurrentVideo(null);
        });

        setTimeout(() => {
            socket.emit('startAmbiance');
        }, 10000);

        return () => {

            document.removeEventListener('click', startAudioContext);
            document.removeEventListener('keydown', startAudioContext);
            document.removeEventListener('touchstart', startAudioContext);
        };
    }, []);


    const startAudioContext = () => {
        if (contextStarted) return;

        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const context = new AudioContext();
        context.resume().then(() => {
            console.log('Audio context started');
            setContextStarted(true);
        });
    };

    return (
        <>
            <Head>
                <title>Animation</title>
            </Head>

            <div>
                {currentAudio && <AudioPlayer src={currentAudio.url} />}
                {currentVideo && <VideoPlayer src={currentVideo.url} />}
            </div>
        </>
    );
};

export default Client3;







