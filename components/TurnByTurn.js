import React, { useEffect, useRef, useState } from "react";
import io from 'socket.io-client';
import { randomBytes } from "crypto";
import { pick } from "next/dist/lib/pick";

const socket = io('localhost:3000');

function TurnByTurn(props) {
    const [stateOfTheGame, setStateOfTheGame] = useState(null);
    const [actualIndexOfMembers, setActualIndexOfMembers] = useState(0);
    const [maxNumberOfCard, setMaxNumberOfCard] = useState(3);
    const [globalTimer, setGlobalTimer] = useState(15);

    const [data, setData] = useState([]);
    const [teams, setTeams] = useState([]);
    const [randomTheme, setRandomTheme] = useState("");
    const [teamIndex, setTeamIndex] = useState(null);
    const [actualTeamName, setActualTeamName] = useState("");
    const [actualTeamMembers, setActualTeamMembers] = useState([]);
    const [animals, setAnimals] = useState({});
    const [correctAnswer, setCorrectAnswer] = useState("");
    const [isValueSubmit, setIsValueSubmit] = useState(false);

    const elementRef = useRef(null);
    const allCardsRef = useRef([]);
    const allHiddenCardsRef = useRef([]);
    const validateButtonRef = useRef(null);
    const waitingScreenRef = useRef(null);
    const waitingScreenTextRef = useRef(null);
    const timerWrapperRef = useRef(null);
    const timerRef = useRef(null);
    const answerTextRef = useRef(null);

    useEffect(() => {

        setData(props.data);
        setTeams(props.data[0]);
        console.log(props.data)
        setRandomTheme(props.data[3]);
        setTeamIndex(props.data[Number(props.client)]);
        const animalData = props.data[4];
        if (animalData) {
            setAnimals(animalData[props.groupName]["animals"]);
            setCorrectAnswer(animalData[props.groupName]["answer"]);
        }
    }, [props.data]);

    useEffect(() => {
        if (teams && teamIndex !== null) {
            console.log(teams);
            const teamNames = Object.keys(teams);
            console.log(Object.keys(teams))
            console.log(Object.values(teams)[teamIndex])
            setActualTeamName(teamNames[teamIndex]);
            console.log(teamNames[teamIndex]);
            const teamMembers = Object.values(teams)[teamIndex];
            setActualTeamMembers(teamMembers);
            setStateOfTheGame(0);
        }
    }, [teams, teamIndex]);

    useEffect(() => {
        if (stateOfTheGame !== null) {
            showTipsWaitingScreen("Indice en cours !");
        }
    }, [stateOfTheGame]);

    function handleFlipCard(e) {
        const element = e.target.closest('.animal');
        const allCards = allCardsRef.current;
        let allHiddenCards = allHiddenCardsRef.current;

        if (!isValueSubmit) {
            if (allHiddenCards.length < maxNumberOfCard) {
                element.classList.toggle("hidden");
            } else {
                if (element.classList.contains("hidden")) {
                    element.classList.remove("hidden");
                }
            }
        }

        allHiddenCards = Array.from(elementRef.current.getElementsByClassName("animal hidden"));
        const validateButton = validateButtonRef.current;

        if (allHiddenCards.length === Object.keys(animals).length - 1) {
            validateButton.style.display = "block";
        } else {
            validateButton.style.display = "none";
        }
    }

    function showTipsWaitingScreen(text) {
        const waitingScreen = waitingScreenRef.current;
        const waitingScreenText = waitingScreenTextRef.current;
        waitingScreen.classList.add("is-active");
        waitingScreenText.innerHTML = text;

        console.log("stateOfTheGame", stateOfTheGame);

        setTimeout(() => {
            showPlayerWaitingScreen();
        }, 3000);
    }

    function showPlayerWaitingScreen() {
        const waitingScreen = waitingScreenRef.current;
        const waitingScreenText = waitingScreenTextRef.current;
        waitingScreenText.innerHTML = actualTeamMembers[actualIndexOfMembers] + " à toi de jouer !";
        waitingScreen.classList.add("is-active");

        setTimeout(() => {
            waitingScreen.classList.remove("is-active");
            pickPhaseAndUpdateDependencies();
        }, 3000);
    }

    function pickPhaseAndUpdateDependencies() {
        const timerWrapper = timerWrapperRef.current;
        const timer = timerRef.current;

        if (stateOfTheGame !== null) {
            timer.style.animationDuration = `${globalTimer}s`;
            timer.style.animationPlayState = "running";
        }

        setTimeout(() => {
            timer.style.animationPlayState = "paused";
            if (stateOfTheGame < 1) {
                setStateOfTheGame(stateOfTheGame + 1);
                setActualIndexOfMembers(actualIndexOfMembers + 1);
                if (maxNumberOfCard < 9) {
                    setMaxNumberOfCard(maxNumberOfCard + 3);
                }
            } else {
                setActualIndexOfMembers(actualIndexOfMembers + 1);
                updateWaitingScreenForTheLastTime();
                disableTimer();
                setMaxNumberOfCard(maxNumberOfCard + 3);
            }
        }, globalTimer * 1000);
    }

    function updateWaitingScreenForTheLastTime() {
        const waitingScreen = waitingScreenRef.current;
        const waitingScreenText = waitingScreenTextRef.current;
        waitingScreenText.innerHTML = "Indice en cours !";
        waitingScreen.classList.add("is-active");

        setTimeout(() => {
            if (actualTeamMembers[actualIndexOfMembers + 1]) {
                waitingScreenText.innerHTML = actualTeamMembers[actualIndexOfMembers + 1] + " à toi de jouer !";
            } else {
                waitingScreenText.innerHTML = actualTeamMembers[actualIndexOfMembers] + " à toi de jouer !";
            }
            setTimeout(() => {
                waitingScreen.classList.remove("is-active");
            }, 3000);
        }, 3000);
    }

    function disableTimer() {
        const timerWrapper = timerWrapperRef.current;
        const timer = timerRef.current;
        timerWrapper.style.display = "none";
        timer.style.display = "none";
        timer.style.animationPlayState = "paused";
    }

    function handleClickOnValidateButton() {
        const lastCard = Array.from(elementRef.current.getElementsByClassName("animal:not(.hidden)"));
        const answerText = answerTextRef.current;
        if (lastCard.length === 1 && isValueSubmit === false) {
            setIsValueSubmit(true);
            socket.emit("animalChosen", Number(lastCard[0].id));
            if (Number(lastCard[0].id) === Number(correctAnswer)) {
                answerText.innerHTML = "Bonne réponse !";
            } else {
                answerText.innerHTML = "Mauvaise réponse !";
            }
        }
    }

    return (
        <section id="turnByTurn" className="hide">
            <h1>Équipe {actualTeamName}</h1>

            {actualTeamMembers !== undefined && actualTeamMembers.length > 0 && stateOfTheGame !== null ? (
                <h2>A toi de jouer {actualTeamMembers[actualIndexOfMembers]} !</h2>
            ) : null}

            <div className="animal-wrapper" ref={elementRef}>
                {animals !== undefined && animals.length > 0 ? (
                    animals.map((animal, index) => (
                        <div
                            key={index}
                            id={index}
                            className="animal"
                            onClick={(e) => handleFlipCard(e)}
                        >
                            <p>{animal}</p>
                        </div>
                    ))
                ) : null}
            </div>

            <div className="timer-wrapper" ref={timerWrapperRef}>
                <div className="timer" ref={timerRef}></div>
            </div>

            <div className="validateButton" onClick={handleClickOnValidateButton} ref={validateButtonRef}>
                <p>Validate</p>
            </div>

            <h5 className="answerText" ref={answerTextRef}></h5>

            <div className="waitingScreen" ref={waitingScreenRef}>
                <h4 ref={waitingScreenTextRef}>Premier indice en cours</h4>
            </div>
        </section>
    );
}

export default TurnByTurn;
