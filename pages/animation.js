import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import Head from 'next/head';
import VideoPlayer from '../components/VideoPlayer';
import AudioPlayer from '../components/AudioPlayer';

const socket = io('http://localhost:3000');

const Client3 = () => {
    const [currentScenario, setCurrentScenario] = useState(null);
    const [audioLoaded, setAudioLoaded] = useState(false);
    const [videoLoaded, setVideoLoaded] = useState(false);
    const [currentAudio, setCurrentAudio] = useState(null);
    const [currentVideo, setCurrentVideo] = useState(null);

    useEffect(() => {
        socket.emit('registerAnimationClient');
    }, []);

    useEffect(() => {
        socket.on('scenario', (scenario) => {
            setCurrentScenario(scenario);
            setAudioLoaded(false);
            setVideoLoaded(false);

            const audioElement = new Audio(scenario.audios[0]);
            audioElement.addEventListener('canplaythrough', () => {
                setAudioLoaded(true);
            });

            const videoElement = document.createElement('video');
            videoElement.src = scenario.videos[0];
            videoElement.addEventListener('loadeddata', () => {
                setVideoLoaded(true);
            });

            setCurrentAudio(audioElement);
            setCurrentVideo(videoElement);
        });
    }, []);

    if (!currentScenario || !audioLoaded || !videoLoaded) {
        return (
            <>
                <Head>
                    <title>Animation</title>
                </Head>

                <div>Pas chargé</div>
            </>
        );
    }

    return (
        <>
            <Head>
                <title>Animation</title>
            </Head>

            <div>
                {currentScenario && currentScenario.id === 1 && (
                    <div>
                        <AudioPlayer src={currentScenario.audios} />
                        <VideoPlayer src={currentScenario.videos} />
                    </div>
                )}

                {currentScenario && currentScenario.id === 2 && (
                    <div>
                        <AudioPlayer src={currentScenario.audios} />
                        <VideoPlayer src={currentScenario.videos} />
                    </div>
                )}

                {currentScenario && currentScenario.id === 3 && (
                    <div>
                        <AudioPlayer src={currentScenario.audios} />
                        <VideoPlayer src={currentScenario.videos} />
                    </div>
                )}

                {currentScenario && currentScenario.id === 4 && (
                    <div>
                        <AudioPlayer src={currentScenario.audios} />
                        <VideoPlayer src={currentScenario.videos} />
                    </div>
                )}
            </div>
        </>
    );
};

export default Client3;











