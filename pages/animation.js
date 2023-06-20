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

    let currentScenarioToPlay = 1;


   let scnerarios = {
         struct : {
             audios: ['audio/SonsAmbiance.mov'],
             videos: ['video/Ambience.mp4'],
         },
       chooseTheme : {
           audios: ['audio/SonsAmbiance.mov'],
           videos: ['video/Ambience.mp4'],
       },
       themeIsChosen : {
           audios: ['audio/SonsAmbiance.mov'],
           videos: ['video/Anim_Ambiance_Map01.mp4'],
       },
       explanation : {
           audios: ['audio/SonsAmbiance.mov'],
           videos: ['video/Anim_Ambiance_Map01.mp4'],
       },
    }


    let animalsCards = {
        audios: ['audio/10animaux.mp3'],
        videos: ['video/Anim_Ambiance_Map01.mp4'],
    };
    let indice1 = {
        audios: ['audio/Indice_01.mp3'],
        videos: ['video/indices/indice1/LC_A_intro_indice_01.mp4', 'video/indices/indice1/LC_B_anim_indice_01.mp4', 'video/indices/indice1/LC_C_outro_indice_01.mp4'],
    };
    let indice1Loop = {
        audios: ['audio/Indice_01.mp3'],
        videos: ['video/indices/indice1/LC_B_anim_indice_01.mp4'],
    };
    let indice2Client1 = {
        audios: ['audio/Corbeau.mov'],
    };
    let indice2Client2 = {
        audios: ['audio/loup.mov'],
    };
    let interactions = {
        audios: ['audio/LeMutualisme.mp3'],
        videos: ['video/Anim_Ambiance_Map01.mp4'],
    };

    const scenario9 = {
        audios: ['audio/SonsAmbiance.mov'],
        videos: ['video/Anim_Ambiance_Map01.mp4'],
    };
    const scenario10 = {
        audios: ['audio/SonsAmbiance.mov'],
        videos: ['video/Anim_Ambiance_Map01.mp4'],
    };
    const scenario11 = {
        audios: ['audio/SonsAmbiance.mov'],
        videos: ['video/Anim_Ambiance_Map01.mp4'],
    };
    const scenario12 = {
        audios: ['audio/SonsAmbiance.mov'],
        videos: ['video/Anim_Ambiance_Map01.mp4'],
    };

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
           // setAudioLoaded(false);
           // setVideoLoaded(false);
           // setScenario7Ended(false);

            //const audioElement = new Audio(scenario.audios[0]);
            //audioElement.addEventListener('canplaythrough', () => {
              //  setAudioLoaded(true);
            });

           // const videoElement = document.createElement('video');
            //videoElement.src = scenario.videos[0];
           // videoElement.addEventListener('loadeddata', () => {
             //   setVideoLoaded(true);
            //});

            //setCurrentAudio(audioElement);
            //setCurrentVideo(videoElement);

           // if (scenario.videos.length > 1) {
             //   setCurrentVideoIndex(0);
           // }
            //if (scenario.audios.length > 1) {
              //  setCurrentAudioIndex(0);
            //}

   //

    useEffect(() => {
       // if (currentVideo) {
         //   currentVideo.play();
        //}

        return () => {
          //  if (currentVideo) {
            //    currentVideo.pause();
            //}
        };
    }, [currentVideo]);

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
    }, [currentScenario, videoLoaded, currentVideoIndex]);

    useEffect(() => {

        if (scenario7Ended) {
            socket.emit("loop")
        }
    }, [scenario7Ended]);



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
                {currentScenarioToPlay === 1 && (

                    <div>
                        <AudioPlayer src={scnerarios.struct.audios} />
                        <VideoPlayer src={scnerarios.struct.videos} className="fixed top-0 left-0 w-screen h-screen" />
                    </div>
                )}

                {currentScenarioToPlay === 1 && (
                    <div>
                        <AudioPlayer src={currentScenario.audios} />
                        <VideoPlayer src={currentScenario.videos} className="fixed top-0 left-0 w-screen h-screen" />
                    </div>
                )}

                {currentScenarioToPlay === 1 && (
                    <div>
                        <AudioPlayer src={currentScenario.audios} />
                        <VideoPlayer src={currentScenario.videos} className="fixed top-0 left-0 w-screen h-screen" />
                    </div>
                )}

                {currentScenarioToPlay === 1 && (
                    <div>
                        <AudioPlayer src={currentScenario.audios} />
                        <VideoPlayer src={currentScenario.videos} className="fixed top-0 left-0 w-screen h-screen" />
                    </div>
                )}
                {currentScenario && currentScenario.id === 5 && (
                    <div>
                        <AudioPlayer src={currentScenario.audios} />
                        <VideoPlayer src={currentScenario.videos} className="fixed top-0 left-0 w-screen h-screen" />
                    </div>
                )}
                {currentScenario && currentScenario.id === 6 && (
                    <div>
                        <AudioPlayer src={currentScenario.audios} />
                        <VideoPlayer src={currentScenario.videos} className="fixed top-0 left-0 w-screen h-screen" />
                    </div>
                )}
                {currentScenario && currentScenario.id === 7 && (
                    <div>
                        <AudioPlayer src={currentScenario.audios} />
                        <VideoPlayer src={currentScenario.videos[currentVideoIndex]} className="fixed top-0 left-0 w-screen h-screen" />
                    </div>
                )}
                {currentScenario && currentScenario.id === 8 && (
                    <div>
                        <AudioPlayer src={currentScenario.audios} />
                        <VideoPlayer src={currentScenario.videos} className="fixed top-0 left-0 w-screen h-screen" />
                    </div>
                )}
                {currentScenario && currentScenario.id === 9 && (
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
