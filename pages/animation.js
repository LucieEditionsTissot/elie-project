import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import Head from 'next/head';
import VideoPlayer from '../pages/components/VideoPlayer';
import SelectThemeRandomly from "./components/SelectThemeRandomly";
import ShowRules from "./components/ShowRules";
import ThemeExplanation from "./components/ThemeExplanation";
import ShowMap from "./components/ShowMap";

const socket = io('localhost:3000')

const Client3 = () => {

    const themes = ['Mutualisme', 'Predation', 'Commensalisme'];
    const [rules, setRules] = useState([]);
    const [themeExplanation, setThemeExplanation] = useState([]);
    const [animation, setAnimation] = useState(null);
    const [animationTime, setAnimationTime] = useState(null);
    const [animationQuestion, setAnimationQuestion] = useState(null);
    const [currentTurn, setCurrentTurn] = useState(0); // 0: Visuel, 1: Sonore
    const [selectedTheme, setSelectedTheme] = useState('');
    const [showIndices, setShowIndices] = useState([]);
    const [indices, setIndices] = useState([]);

    useEffect(() => {
        socket.emit('registerAnimationClient');

        socket.on('teamsAreDoneShowRules',  (rules) => {
            document.querySelector('#rules').classList.remove('hide');
            setRules(rules)
        })

        socket.on('rulesAreDoneSelectThemeRandomly',  () => {
            getThemeRandomly()
            hideAndShowSection('#rules', '#theme')
        })

        socket.on('themeIsSelectedShowThemeExplanation', (explanation) => {
            setThemeExplanation(explanation);
            hideAndShowSection('#theme', '#themeExplanation');
        });

        socket.on('startTurnByTurn', () => {
            hideAndShowSection('#themeExplanation', '#map');
            setTimeout(() => {
                setShowIndices(true);
            }, 3000);
        });

        socket.on('animation',  (animationData) => {
            if (animation === null) {
                setAnimation(animationData['animation'])
            }
            if (animationTime === null) {
                setAnimationTime(animationData['time'])
                setTimeout(() => {
                    const data = [animationData['question'], animationData['answers'], animationData['correctAnswer']]
                    socket.emit('animationIsDoneAskQuestion', data)
                }, animationData['time'] * 1000)
            }
            if (animationQuestion === null) {
                setAnimationQuestion(animationData['question'])
            }
            if (animationAnswers === []) {
                setAnimationAnswers(animationData['answers'])
            }
            if (animationCorrectAnswer === null) {
                setAnimationCorrectAnswer(animationData['correctAnswer'])
            }
        })


    }, []);

    const handleNextTurn = () => {
        setCurrentTurn((prevTurn) => (prevTurn + 1) % 2);
    };

    return (
        <>
            <Head>
                <title>Animation</title>
            </Head>

            <ShowRules rules={rules}/>

            <SelectThemeRandomly themes={themes} selectedTheme={selectedTheme}/>

            <ThemeExplanation explanation={themeExplanation}/>

            <ShowMap
                animation={animation}
                currentTurn={currentTurn}
                onNextTurn={handleNextTurn}
            />

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
        const data = [selectedTheme, randomIndex]
        socket.emit('themeIsRandomlyChosen', data);
        console.log("Theme choisi : ", selectedTheme);
    }

    function hideAndShowSection(hideSection, showSection) {
        document.querySelector(hideSection).classList.add('hide');
        document.querySelector(showSection).classList.remove('hide');
    }

};

export default Client3;
