import React, {useEffect, useRef, useState} from "react";
import io from 'socket.io-client';
import ShowAnswer from "./ShowAnswer";
import {url} from "../pages/_app";
import teams from '../config';

const socket = io(url);


function TurnByTurn(props) {

    const [stateOfTheGame, setStateOfTheGame] = useState(null);
    const [actualIndexOfMembers, setActualIndexOfMembers] = useState(0);
    const [maxNumberOfCard, setMaxNumberOfCard] = useState(3);
    const [globalTimer, setGlobalTimer] = useState(10);
    const [randomTheme, setRandomTheme] = useState("");
    const [teamIndex, setTeamIndex] = useState(null);
    const [actualTeamName, setActualTeamName] = useState("");
    const [actualTeamMembers, setActualTeamMembers] = useState([]);
    const [animals, setAnimals] = useState({});
    const [correctAnswer, setCorrectAnswer] = useState("");
    const [isValueSubmit, setIsValueSubmit] = useState(false);
    const [isAnimalChosen, setAnimalChosen] = useState(null);

    useEffect(() => {
        setRandomTheme(props.data[3])
        setTeamIndex(props.data[Number(props.client)])
        const animalData = props.data[4]
        if (animalData) {
            setAnimals(animalData[props.groupName]["animals"])
            setCorrectAnswer(animalData[props.groupName]["answer"])
        }
    }, [props.data])

    useEffect(() => {
        if (teamIndex !== null) {
            setActualTeamName(Object.keys(teams)[teamIndex]);
            setActualTeamMembers(Object.values(teams)[teamIndex]);
            setStateOfTheGame(0)
        }
    }, [teams, teamIndex]);

    useEffect(() => {
        if (stateOfTheGame !== null) {
            showTipsWaitingScreen("Indice en cours !");
            if (stateOfTheGame === 1) {
                socket.emit("indice2");
            } else if (stateOfTheGame === 2) {
                socket.off("indice2");
            }
        }
    }, [stateOfTheGame]);

    function handleFlipCard(e) {
        const element = e.target.closest('.animal')
        const allCards = document.querySelectorAll(".animal");
        let allHiddenCards = document.querySelectorAll(".animal.hidden");

        if (!isValueSubmit) {
            if (allHiddenCards.length < maxNumberOfCard) {
                element.classList.toggle("hidden");
            } else {
                if (element.classList.contains("hidden")) {
                    element.classList.remove("hidden");
                }
            }
        }

        allHiddenCards = document.querySelectorAll(".animal.hidden")
        const validateButton = document.querySelector("#turnByTurn .validateButton")

        if (allHiddenCards.length === Object.keys(animals).length - 1) {
            validateButton.style.display = "block"
        } else {
            validateButton.style.display = "none"
        }

    }

    function showTipsWaitingScreen(text) {
        const waitingScreen = document.querySelector(".waitingScreen")
        const waitingScreenText = document.querySelector(".waitingScreen h4")
        if (waitingScreen) {
            waitingScreen.classList.add("is-active")
        }
        if (waitingScreenText) {
            waitingScreenText.innerHTML = text
        }
        console.log("stateOfTheGame", stateOfTheGame)

        setTimeout(() => {
            showPlayerWaitingScreen()
        }, 3000)
    }

    function showPlayerWaitingScreen() {

        const waitingScreen = document.querySelector(".waitingScreen")
        const waitingScreenText = document.querySelector(".waitingScreen h4")
        if (waitingScreen) {
            waitingScreen.classList.add("is-active")
        }
        if (waitingScreenText) {
            waitingScreenText.innerHTML = actualTeamMembers[actualIndexOfMembers] + " à toi de jouer !"
        }

        setTimeout(() => {
            waitingScreen.classList.remove("is-active")
            pickPhaseAndUpdateDependencies()
        }, 3000)

    }

    function pickPhaseAndUpdateDependencies() {
        const timerWrapper = document.querySelector(".timer-wrapper");
        const timer = document.querySelector(".timer");

        if (stateOfTheGame !== null) {
            timer.style.animationDuration = `${globalTimer}s`;
            timer.style.animationPlayState = "running";
        }

        setTimeout(() => {
            timer.style.animationPlayState = "paused";
            if (stateOfTheGame < 1) {
                setStateOfTheGame(stateOfTheGame + 1)
                setActualIndexOfMembers(actualIndexOfMembers + 1)
                if (maxNumberOfCard < 9) {
                    setMaxNumberOfCard(maxNumberOfCard + 3)
                }
            } else {
                setActualIndexOfMembers(actualIndexOfMembers + 1)
                setStateOfTheGame(stateOfTheGame + 1)
                updateWaitingScreenForTheLastTime()
                disableTimer()
                setMaxNumberOfCard(maxNumberOfCard + 3)
            }
        }, globalTimer * 1000);

    }

    function updateWaitingScreenForTheLastTime() {

        const waitingScreen = document.querySelector(".waitingScreen")
        const waitingScreenText = document.querySelector(".waitingScreen h4")
        if (waitingScreen) {
            waitingScreen.classList.add("is-active")
        }
        if (waitingScreenText) {
            waitingScreenText.innerHTML = "Indice en cours !"
        }

        setTimeout(() => {
            if (actualTeamMembers[actualIndexOfMembers + 1] && waitingScreenText) {
                waitingScreenText.innerHTML = actualTeamMembers[actualIndexOfMembers + 1] + " à toi de jouer !"
            } else {
                if (waitingScreenText) {
                    waitingScreenText.innerHTML = actualTeamMembers[actualIndexOfMembers] + " à toi de jouer !"
                }
            }
            setTimeout(() => {
                if (waitingScreen) {
                    waitingScreen.classList.remove("is-active")
                }
            }, 3000)
        }, 3000)

    }

    function disableTimer() {
        const timerWrapper = document.querySelector(".timer-wrapper");
        const timer = document.querySelector(".timer");
        if (timerWrapper) {
            timerWrapper.style.display = "none";
        }
        if (timer) {
            timer.style.display = "none";
            timer.style.animationPlayState = "paused";
        }
    }

    function handleClickOnValidateButton() {
        const lastCard = document.querySelectorAll(".animal:not(.hidden)")
        const answerText = document.querySelector(".answerText")
        if (lastCard.length === 1 && isValueSubmit === false) {
            setIsValueSubmit(true)
            const animalChosen = lastCard[0].innerText;
            setAnimalChosen(animalChosen);
            socket.emit("animalChosen", Number(lastCard[0].id));
        }
    }

    return (
        <section id={"turnByTurn"}>

            <h1>Équipe {actualTeamName}</h1>

            {actualTeamMembers !== undefined && actualTeamMembers.length > 0 && stateOfTheGame !== null ? (
                <h2>A toi de jouer {actualTeamMembers[actualIndexOfMembers]} !</h2>
            ) : null}

            <div className="animal-wrapper">

                {animals !== undefined && animals.length > 0 ? (
                    animals.map((animal, index) => (
                        <div
                            key={index}
                            id={index}
                            className="animal"
                            onClick={(e) => handleFlipCard(e)}
                        >
                            <p>{animal.name}</p>
                        </div>
                    ))
                ) : null}
            </div>

            <div className={"timer-wrapper"}>
                <div className={"timer"}></div>
            </div>

            <div className={"validateButton"} onClick={() => handleClickOnValidateButton()}>
                <p>Validate</p>
            </div>

            {isValueSubmit && isAnimalChosen && <ShowAnswer correctAnswer={isAnimalChosen}/>}

            <div className={"waitingScreen"}>

                <h4>Premier indice en cours</h4>

            </div>

        </section>
    );
}

export default TurnByTurn;