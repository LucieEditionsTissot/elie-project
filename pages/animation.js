import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import Head from 'next/head';
import VideoPlayer from '../components/VideoPlayer';
import AudioPlayer from '../components/AudioPlayer';
import Images from "../components/Images";
import Header from "../components/Header";

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

    useEffect(() => {
        if (currentVideo) {
            currentVideo.play();
        }

        return () => {
            if (currentVideo) {
                currentVideo.pause();
            }
        };
    }, [currentVideo]);



    if (!currentScenario || !audioLoaded || !videoLoaded) {
        return (
            <>
                <Images src="/images/0000.png" />
            </>
        );
    }

    return (
        <>
            <div className="relative">

                <div className="absolute inset-0 flex items-center justify-center">
                    <Images src="/images/0000.png" className="w-full h-full" />
                </div>
            </div>

            <div>
                {currentScenario && currentScenario.id === 1 && (
                    <div>
                        <AudioPlayer src={currentScenario.audios} />
                        <VideoPlayer src={currentScenario.videos} className="fixed top-0 left-0 w-screen h-screen" />
                    </div>
                )}

                {currentScenario && currentScenario.id === 2 && (
                    <div>
                        <AudioPlayer src={currentScenario.audios} />
                        <VideoPlayer src={currentScenario.videos} className="fixed top-0 left-0 w-screen h-screen" />
                    </div>
                )}

                {currentScenario && currentScenario.id === 3 && (
                    <div>
                        <AudioPlayer src={currentScenario.audios} />
                        <VideoPlayer src={currentScenario.videos} className="fixed top-0 left-0 w-screen h-screen" />
                    </div>
                )}

                {currentScenario && currentScenario.id === 4 && (
                    <div>
                        <AudioPlayer src={currentScenario.audios} />
                        <VideoPlayer src={currentScenario.videos} className="fixed top-0 left-0 w-screen h-screen" />
                    </div>
                )}
            </div>
        </>
    );
};

export default Client3;
