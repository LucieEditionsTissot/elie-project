import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import Head from 'next/head';
import VideoPlayer from '../components/VideoPlayer';
import AudioPlayer from '../components/AudioPlayer';
import Images from "../components/Images";
import {url} from "./_app";


const socket = io(url);
let connected = false;


const Client3 = () => {
    const [currentScenario, setCurrentScenario] = useState(null);
    const [audioLoaded, setAudioLoaded] = useState(false);
    const [videoLoaded, setVideoLoaded] = useState(false);
    const [currentAudio, setCurrentAudio] = useState(null);
    const [currentVideo, setCurrentVideo] = useState(null);
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
    const [currentAudioIndex, setCurrentAudioIndex] = useState(0);
    const [scenario7Ended, setScenario7Ended] = useState(false);

    let currentScenarioToPlay = 0;



    let scenario1 = {
       audios : "audio/SonsAmbiance.mov",
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


    useEffect(() => {

        socket.on('connect', function () {
            console.log("Client 3 connected");
            connected = true;
        });
        socket.on('disconnect', function () {
            console.log("Client 3 disconnected");
            connected = false;
        });
        socket.on("reloadClient", () => {
            window.location.reload();
        });
        if(connected) {
            socket.emit('registerAnimationClient');
        }
    }, []);

    useEffect(() => {

        //socket.on('scenario', (scenario) => {
          //  setCurrentScenario(scenario);

           // setVideoLoaded(false);
           // setScenario7Ended(false);


           // const videoElement = document.createElement('video');
            //videoElement.src = scenario.videos[0];
           // videoElement.addEventListener('loadeddata', () => {
             //   setVideoLoaded(true);
            //});


            //setCurrentVideo(videoElement);

           // if (scenario.videos.length > 1) {
             //   setCurrentVideoIndex(0);
           // }
            //if (scenario.audios.length > 1) {
              //  setCurrentAudioIndex(0);
            //}

   //
    }, []);

    useEffect(() => {
        if(currentAudio) {
            currentAudio.play();
        }
        if (currentVideo) {
           currentVideo.play();
        }

        return () => {
           if (currentVideo) {
               currentVideo.pause();
           }
        };
    }, [currentVideo], [currentAudio]);

    useEffect(() => {
        if (currentScenario && videoLoaded && currentScenario.videos.length > 1) {
            const videoCount = currentScenario.videos.length;

            const handleVideoEnded = () => {
                setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videoCount);

                if (currentScenario && currentScenario.id === 7) {
                    setScenario7Ended(true);
                    socket.emit('scenario7Ended');
                }
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
    }, [currentScenarioToPlay, videoLoaded, currentVideoIndex]);

    useEffect(() => {

        if (scenario7Ended) {
            socket.emit("loop")
        }
    }, [scenario7Ended]);

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
