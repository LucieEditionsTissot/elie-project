import React, {useEffect, useRef, useState} from 'react';
import VideoPlayer from '../components/VideoPlayer';
import AudioPlayer from '../components/AudioPlayer';
import io from "socket.io-client";
import * as url from "url";

const Client3 = () => {
    const [audioLoaded, setAudioLoaded] = useState(false);
    const [videoLoaded, setVideoLoaded] = useState(false);
    const [currentAudio, setCurrentAudio] = useState(null);
    const [currentVideo, setCurrentVideo] = useState(null);
    const [isScenarioDone, setIsScenarioDone] = useState(false);
    const socketClient3Ref = useRef(null);
    const [currentScenarioToPlay, setCurrentScenarioToPlay] = useState(0);
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
    const allMediaFiles = [
        "audio/SonsAmbiance.mp3",
        "audio/Regles.mp3",
        "video/Anim_Ambiance.mp4",
        "video/Rules.mp4",
        'audio/LeMutualisme.mp3',
        'video/ChoixDuTheme.mp4',
        'audio/MutualismeInfo.mp3',
        'video/LeMutualisme.mp4',
        'audio/Indice_01.mp3',
        'video/indices/indice1/LC_A_intro_indice_01.mp4',
        'video/indices/indice1/LC_B_anim_indice_01.mp4',
        'video/indices/indice2/LC_B_anim_indice_02.mp4',
        "audio/Indice_02.mp3",
    ];

    function preloadMedia(files) {
        const promises = files.map((file) => {
            return new Promise((resolve, reject) => {
                const media = new Audio(file);
                media.addEventListener("canplaythrough", () => {
                    resolve();
                });
                media.addEventListener("error", () => {
                    reject(new Error(`Failed to preload media: ${file}`));
                });
            });
        });

        return Promise.all(promises);
    }

    const scenario1 = {
        videos: ["video/Anim_Ambiance.mp4"]
    };

    const scenario2 = {
        audios: "audio/Regles.mp3",
        videos: ["video/Rules.mp4"]
    };

    const scenarios3 = {
        videos: ['video/ChoixDuTheme.mp4'],
    };

    const scenario4 = {
        videos: ['video/LeMutualisme.mp4'],
    };

    const scenario5 = {
        audios: "audio/Indice_01.mp3",
        videos: ['video/indices/indice1/LC_B_anim_indice_01.mp4'],
    };

    const scenario6 = {
        videos: ['video/indices/indice1/LC_B_anim_indice_01.mp4'],
    };

    const scenario7 = {
        audios: "audio/Indice_02.mp3",
        videos: ['video/indices/indice2/LC_B_anim_indice_02.mp4'],
    };

    const scenario8 = {
        videos: ['video/indices/indice2/LC_B_anim_indice_02.mp4'],
    };

    const scenario9 = {
        audios: ['audio/Indice_03.mp3'],
        videos: ['video/indices/indice3/LC_B_anim_indice_03.mp4'],
    };

    const scenario10 = {
        videos: ['video/indices/indice3/LC_B_anim_indice_03.mp4'],
    };

    const scenario11 = {
        audios: ['audio/Indice_01.mp3'],
        videos: ['video/indices/indice1/LC_B_anim_indice_01.mp4'],
    };

    const scenario12 = {
        audios: ['audio/Indice_01.mp3'],
        videos: ['video/indices/indice1/LC_B_anim_indice_01.mp4'],
    };

    const scenario13 = {
        audios: ['audio/Indice_01.mp3'],
        videos: ['video/indices/indice1/LC_B_anim_indice_01.mp4'],
    };

    const scenario14 = {
        audios: ['audio/Indice_01.mp3'],
        videos: ['video/indices/indice1/LC_B_anim_indice_01.mp4'],
    };

    const scenarios = [
        scenario1,
        scenario2,
        scenarios3,
        scenario4,
        scenario5,
        scenario6,
        scenario7,
        scenario8,
        scenario9,
        scenario10,
        scenario11,
        scenario12,
        scenario13,
        scenario14
    ];

    const cleanup = () => {
        if (currentAudio) {
            currentAudio.pause();
            setCurrentAudio(null);
        }
        if (currentVideo) {
            currentVideo.pause();
            setCurrentVideo(null);
        }
    };

    useEffect(() => {
        socketClient3Ref.current = io(url);
        const socketClient3 = socketClient3Ref.current;

        socketClient3.on('connect', function () {
            console.log("Client 3 connected");
        });

        socketClient3.on('disconnect', function () {
            console.log("Client 3 disconnected");
        });

        socketClient3.on("reloadClient", () => {
            window.location.reload();
        });

        socketClient3.on("teamsAreDoneShowRules", () => {
            setCurrentScenarioToPlay((prevScenario) => prevScenario + 1);
        });
        socketClient3.on("setIndice2Screen", () => {
            setCurrentScenarioToPlay((prevScenario) => prevScenario + 1);
        });
        socketClient3.on("setIndice3Screen", () => {
            setCurrentScenarioToPlay((prevScenario) => prevScenario + 1);
        });

        socketClient3.on("scenarioDone", () => {
            setIsScenarioDone(true);
        });

        socketClient3.on("audioEnded", () => {
            console.log("Audio ended");
        });

        socketClient3.on("videoEnded", () => {
            console.log("Video ended");
        });

        return () => {
            cleanup();
            socketClient3.disconnect();
        };

    }, [currentScenarioToPlay]);

    const handleAudioEnded = () => {
        if (currentScenarioToPlay === 4) {
        } else {
            currentAudio.loop = true;
            currentAudio.play();
        }
    }

    const handleVideoEnded = () => {
        if (currentScenarioToPlay === 1 && scenarios[currentScenarioToPlay].videos.length === 1) {
            console.log("La bande vidéo est terminée.");
            socketClient3Ref.current.emit("rulesAreUnderstood");
            setCurrentScenarioToPlay((prevScenario) => prevScenario + 1);
        } else if (currentScenarioToPlay === 2 && scenarios[currentScenarioToPlay].videos.length === 1) {
            socketClient3Ref.current.emit("explain");
            setCurrentScenarioToPlay((prevScenario) => prevScenario + 1);
            currentVideo.pause();
        } else if (currentScenarioToPlay === 3 && scenarios[currentScenarioToPlay].videos.length === 1) {
            socketClient3Ref.current.emit("introIndice1");
            setCurrentScenarioToPlay((prevScenario) => prevScenario + 1);
            currentVideo.pause();
        } else if (currentScenarioToPlay === 4 && scenarios[currentScenarioToPlay].videos.length === 1) {
            socketClient3Ref.current.emit("gameOn");
            setCurrentScenarioToPlay((prevScenario) => prevScenario + 1);
        }
        else if (currentScenarioToPlay === 6 && scenarios[currentScenarioToPlay].videos.length === 1) {
                socketClient3Ref.current.emit("getCurrentGameData");
                setCurrentScenarioToPlay((prevScenario) => prevScenario + 1);
        } else {
            if (currentVideo) {
                currentVideo.play();
                currentVideo.loop = true;
            }
        }
    };

console.log(scenarios[currentScenarioToPlay].videos)
    useEffect(() => {
        const currentScenario = scenarios[currentScenarioToPlay];

        if (currentScenario.audios) {
            const audioElement = new Audio(currentScenario.audios);
            setCurrentAudio(audioElement);
            setAudioLoaded(false);

            audioElement.addEventListener("canplaythrough", () => {
                setAudioLoaded(true);
            });

            audioElement.removeEventListener("ended", handleAudioEnded);
        } else {
            setCurrentAudio(null);
        }

        if (currentScenario.videos) {
            const videoElement = document.createElement("video");
            videoElement.src = currentScenario.videos[currentVideoIndex];
            videoElement.className = "fixed top-0 left-0 w-screen h-screen";
            setCurrentVideo(videoElement);
            setVideoLoaded(false);

            videoElement.addEventListener("canplaythrough", () => {
                setVideoLoaded(true);
            });

            videoElement.addEventListener("ended", handleVideoEnded);

            document.body.appendChild(videoElement);
        } else {
            setCurrentVideo(null);
        }

        return cleanup;
    }, [currentScenarioToPlay, currentVideoIndex]);

    useEffect(() => {
        if (currentAudio) {
            currentAudio.play();
        }
        if (currentVideo) {
            currentVideo.play();
        }

    }, [currentAudio, currentVideo]);

    useEffect(() => {
        let isMounted = true;

        preloadMedia(allMediaFiles)
            .then(() => {
                if (isMounted) {
                    setAudioLoaded(true);
                    setVideoLoaded(true);
                }
            })
            .catch((error) => {
                console.error("Failed to preload media:", error);
            });

        return () => {
            isMounted = false;
            cleanup();
        };
    }, []);

    return (
        <>
            <div>

                {scenarios[currentScenarioToPlay].audios &&
                    audioLoaded &&
                    !currentAudio && (
                        <AudioPlayer src={scenarios[currentScenarioToPlay].audios}/>
                    )}
                {scenarios[currentScenarioToPlay].videos &&
                    videoLoaded &&
                    !currentVideo && (
                        <VideoPlayer
                            src={scenarios[currentScenarioToPlay].videos[currentVideoIndex]}
                            className="fixed top-0 left-0 w-screen h-screen"
                        />
                    )}
            </div>
        </>
    );
};

export default Client3;
