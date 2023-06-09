import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import Head from 'next/head';
import VideoPlayer from '../components/VideoPlayer';
import SelectThemeRandomly from "../components/SelectThemeRandomly";
import ShowRules from "../components/ShowRules";
import ThemeExplanation from "../components/ThemeExplanation";
import AudioPlayer from "../components/AudioPlayer";

const socket = io('localhost:3000');

const Client3 = () => {
    const themes = ['Mutualisme', 'Predation', 'Commensalisme'];
    const [rules, setRules] = useState([]);
    const [themeExplanation, setThemeExplanation] = useState([]);
    const [animation, setAnimation] = useState(null);
    const [animationTime, setAnimationTime] = useState(null);
    const [animationQuestion, setAnimationQuestion] = useState(null);
    const [animationAnswers, setAnimationAnswers] = useState([]);
    const [animationCorrectAnswer, setAnimationCorrectAnswer] = useState(null);
    const [selectedTheme, setSelectedTheme] = useState('');
    const [showIndices, setShowIndices] = useState(false);
    const [indices, setIndices] = useState([]);
    const [events, setEvents] = useState([]);
    const [currentAudio, setCurrentAudio] = useState(null);
    const [currentVideo, setCurrentVideo] = useState(null);
    const rulesRef = useRef(null);
    const themeRef = useRef(null);
    const themeExplanationRef = useRef(null);

    useEffect(() => {
        socket.on('eventList', (eventList) => {
            setEvents(eventList);
        });

        socket.on('loadAudio', (audio) => {
            setCurrentAudio(audio);
        });

        socket.on('loadVideo', (video) => {
            setCurrentVideo(video);
        });

        socket.on('pauseAudio', (audio) => {
            if (currentAudio && currentAudio.id === audio.id) {
                setCurrentAudio(null);
            }
        });
    }, []);

    useEffect(() => {
        socket.emit('registerAnimationClient');

        socket.on('teamsAreDoneShowRules', (rules) => {
            if (rulesRef.current) {
                hideAndShowSection(rulesRef.current, themeRef.current);
            }
            setRules(rules);
        });

        socket.on('rulesAreDoneSelectThemeRandomly', () => {
            getThemeRandomly();
            hideAndShowSection(rulesRef.current, themeRef.current);
        });

        socket.on('themeIsSelectedShowThemeExplanation', (explanation) => {
            setThemeExplanation(explanation);
            hideAndShowSection(themeRef.current, themeExplanationRef.current);
        });

        socket.on('startTurnByTurn', () => {
            hideAndShowSection(themeExplanationRef.current, '#map');
            setTimeout(() => {
                setShowIndices(true);
            }, 3000);
        });

        socket.on('animation', (animationData) => {
            if (animation === null) {
                setAnimation(animationData['animation']);
            }
            if (animationTime === null) {
                setAnimationTime(animationData['time']);
                setTimeout(() => {
                    const data = [animationData['question'], animationData['answers'], animationData['correctAnswer']];
                    socket.emit('animationIsDoneAskQuestion', data);
                }, animationData['time'] * 1000);
            }
            if (animationQuestion === null) {
                setAnimationQuestion(animationData['question']);
            }
            if (animationAnswers.length === 0) {
                setAnimationAnswers(animationData['answers']);
            }
            if (animationCorrectAnswer === null) {
                setAnimationCorrectAnswer(animationData['correctAnswer']);
            }
        });
    }, []);

    return (
        <>
            <Head>
                <title>Animation</title>
            </Head>

            <ShowRules rules={rules} rulesRef={rulesRef} />

            <SelectThemeRandomly themes={themes} selectedTheme={selectedTheme} ref={themeRef} />

            <ThemeExplanation explanation={themeExplanation} ref={themeExplanationRef} />

            <div>
                {currentAudio && <AudioPlayer src={currentAudio.url} />}

                {currentVideo && <VideoPlayer src={currentVideo.url} />}
            </div>

            <div className={"global-wrapper"}>
                <h5 className={"type"}>Animation</h5>

                {showIndices && indices.length > 0 && (
                    <div>
                        <h3>Indices :</h3>

                        <ul>
                            {indices.map((indice, index) => (
                                <li key={index}>{indice}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </>
    );

    function getThemeRandomly() {
        const randomIndex = Math.floor(Math.random() * themes.length);
        const selectedTheme = themes[randomIndex];
        const data = [selectedTheme, randomIndex];
        socket.emit('themeIsRandomlyChosen', data);
        console.log("Theme choisi : ", selectedTheme);
    }

    function hideAndShowSection(hideSection, showSection) {
        hideSection.classList.add('hide');
        showSection.classList.remove('hide');
    }
};

export default Client3;


