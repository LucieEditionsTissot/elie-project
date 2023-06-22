import React, { useEffect, useState } from 'react';
import VideoPlayer from '../components/VideoPlayer';
import AudioPlayer from '../components/AudioPlayer';
import io from "socket.io-client";
import * as url from "url";




let connected = false;


const Client3 = () => {
    const [currentScenario, setCurrentScenario] = useState(null);
    const [audioLoaded, setAudioLoaded] = useState(false);
    const [videoLoaded, setVideoLoaded] = useState(false);
    const [currentAudio, setCurrentAudio] = useState(null);
    const [currentVideo, setCurrentVideo] = useState(null);
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
    const [currentAudioIndex, setCurrentAudioIndex] = useState(0);

    let currentScenarioToPlay = 0;

    let scenario1 = {
       audios : "audio/Corbeau.mov",
        videos : "video/Ambience.mp4"
    }

    let scenario2 = {
        audios : "audio/loup.mov",
        videos : null

    }
    let scenarios3 = {
        audios: ['audio/10animaux.mp3'],
        videos: ['video/Anim_Ambiance_Map01.mp4'],
    };
    let scenario4 = {
        audios: ['audio/Indice_01.mp3'],
        videos: ['video/indices/indice1/LC_A_intro_indice_01.mp4', 'video/indices/indice1/LC_B_anim_indice_01.mp4', 'video/indices/indice1/LC_C_outro_indice_01.mp4'],

    };
    let scenario5 = {
        audios: ['audio/Indice_01.mp3'],
        videos: ['video/indices/indice1/LC_B_anim_indice_01.mp4'],
    };
    let scenario6 = {
        audios: ['audio/Indice_01.mp3'],
        videos: ['video/indices/indice1/LC_B_anim_indice_01.mp4'],
    };
    let scenario7 = {
        audios: ['audio/Indice_01.mp3'],
        videos: ['video/indices/indice1/LC_B_anim_indice_01.mp4'],
    };
    let scenario8 = {
        audios: ['audio/Indice_01.mp3'],
        videos: ['video/indices/indice1/LC_B_anim_indice_01.mp4'],
    };
    let scenario9 = {
        audios: ['audio/Indice_01.mp3'],
        videos: ['video/indices/indice1/LC_B_anim_indice_01.mp4'],
    };
    let scenario10 = {
        audios: ['audio/Indice_01.mp3'],
        videos: ['video/indices/indice1/LC_B_anim_indice_01.mp4'],
    };
    let scenario11 = {
        audios: ['audio/Indice_01.mp3'],
        videos: ['video/indices/indice1/LC_B_anim_indice_01.mp4'],
    };
    let scenario12 = {
        audios: ['audio/Indice_01.mp3'],
        videos: ['video/indices/indice1/LC_B_anim_indice_01.mp4'],
    };
    let scenario13 = {
        audios: ['audio/Indice_01.mp3'],
        videos: ['video/indices/indice1/LC_B_anim_indice_01.mp4'],
    };
    let scenario14 = {
        audios: ['audio/Indice_01.mp3'],
        videos: ['video/indices/indice1/LC_B_anim_indice_01.mp4'],
    };
    let scenarios = [scenario1 ,scenario2, scenarios3, scenario4, scenario5, scenario6, scenario7, scenario8, scenario9,  scenario10, scenario11, scenario12, scenario13, scenario14]

let socketClient3Ref;
    useEffect(() => {
        socketClient3Ref.current = io(url);
        const socketClient3 = socketClient3Ref.current;

        socketClient3.on('connect', function () {
            console.log("Client 3 connected");
            connected = true;
        });
        socketClient3.on('disconnect', function () {
            console.log("Client 3 disconnected");
            connected = false;
        });
        socketClient3.on("reloadClient", () => {
            window.location.reload();
        });
        if(connected) {
            socketClient3.emit('registerAnimationClient');
        }

    socketClient3.on('scenario', (scenario) => {
            setCurrentScenario(scenario);

            setVideoLoaded(false);


            const videoElement = document.createElement('video');
            videoElement.src = scenario.videos[0];
            videoElement.addEventListener('loadeddata', () => {
                setVideoLoaded(true);
            });


            setCurrentVideo(videoElement);

            if (scenario.videos.length > 1) {
                setCurrentVideoIndex(0);
            }
            if (scenario.audios.length > 1) {
                setCurrentAudioIndex(0);
            }
        });


        if(currentAudio) {
            currentAudio.play();
        }
        if (currentVideo) {
           currentVideo.play();
        }
        if (currentScenario && videoLoaded && currentScenario.videos.length > 1) {
            const videoCount = currentScenario.videos.length;

            const handleVideoEnded = () => {
                setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videoCount);

            };

            const videoElement = document.createElement('video');
            videoElement.src = currentScenario.videos[currentVideoIndex];
            videoElement.addEventListener('loadeddata', () => {
                setVideoLoaded(true);
                videoElement.play();
                videoElement.addEventListener('ended', handleVideoEnded);
            });

            return () => {
                videoElement.removeEventListener('ended', handleVideoEnded);
                videoElement.pause();
            };
        }
        return () => {
           if (currentVideo) {
               currentVideo.pause();
           }
        };


    }, [currentVideo, currentAudio]);

    console.log(scenarios[currentScenarioToPlay].audios)

    console.log(scenarios[currentScenarioToPlay].videos)

    return (
            <>

                    <div>
                        {scenarios[currentScenarioToPlay].audios &&
                        <AudioPlayer src={scenarios[currentScenarioToPlay].audios} />
                        }
                        {scenarios[currentScenarioToPlay].videos &&
                         <VideoPlayer src={scenarios[currentScenarioToPlay].videos} className="fixed top-0 left-0 w-screen h-screen" />
                        }
                    </div>

            </>
    );
};

export default Client3;
