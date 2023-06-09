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
            setRules(rules);
            hideAndShowSection(rulesRef, themeRef);
        });

        socket.on('rulesAreDoneSelectThemeRandomly', () => {
            getThemeRandomly();
            hideAndShowSection(rulesRef, themeRef);
        });

        socket.on('themeIsSelectedShowThemeExplanation', (explanation) => {
            setThemeExplanation(explanation);
            hideAndShowSection(themeRef, themeExplanationRef);
        });

        socket.on('startTurnByTurn', () => {
            hideAndShowSection(themeExplanationRef, null);
            setShowIndices(true);
        });

        socket.on('animation', (animationData) => {
            setAnimation(animationData['animation']);
            setAnimationTime(animationData['time']);
            setTimeout(() => {
                const data = [
                    animationData['question'],
                    animationData['answers'],
                    animationData['correctAnswer'],
                ];
                socket.emit('animationIsDoneAskQuestion', data);
            }, animationData['time'] * 1000);
        });

        socket.on('animationQuestion', (questionData) => {
            setAnimationQuestion(questionData['question']);
            setAnimationAnswers(questionData['answers']);
            setAnimationCorrectAnswer(questionData['correctAnswer']);
        });
    }, []);

    function getThemeRandomly() {
        const randomIndex = Math.floor(Math.random() * themes.length);
        const selectedTheme = themes[randomIndex];
        const data = [selectedTheme, randomIndex];
        socket.emit('themeIsRandomlyChosen', data);
        console.log("Theme choisi : ", selectedTheme);
    }

    function hideAndShowSection(hideSectionRef, showSectionRef) {
        if (hideSectionRef && hideSectionRef.current) {
            hideSectionRef.current.style.display = 'none';
        }
        if (showSectionRef && showSectionRef.current) {
            showSectionRef.current.style.display = 'block';
        }
    }

    return (
        <>
            <Head>
                <title>Animation</title>
            </Head>

            <ShowRules rules={rules} rulesRef={rulesRef} />

            <SelectThemeRandomly
                themes={themes}
                selectedTheme={selectedTheme}
                ref={themeRef}
            />

            <ThemeExplanation
                explanation={themeExplanation}
                ref={themeExplanationRef}
            />

            <div>
                {currentAudio && <AudioPlayer src={currentAudio.url} />}
                {currentVideo && <VideoPlayer src={currentVideo.url} />}
            </div>

            <div className="global-wrapper">
                {animation && (
                    <div>
                        <h5 className="type">Animation</h5>
                        <div>
                            <h6>{animationQuestion}</h6>
                            {animationAnswers.map((answer, index) => (
                                <button key={index}>{answer}</button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default Client3;




