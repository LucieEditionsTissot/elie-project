import React, {useEffect, useRef, useState} from "react";
import io from 'socket.io-client';
import {randomBytes} from "crypto";

const socket = io("localhost:3000");

function TurnByTurn(props) {

    const [stateOfTheGame, setStateOfTheGame] = useState(null);
    const [actualIndexOfMembers, setActualIndexOfMembers] = useState(0);
    const [maxNumberOfCard, setMaxNumberOfCard] = useState(3);
    const [globalTimer, setGlobalTimer] = useState(10);

    const [data, setData] = useState([]);
    const [teams, setTeams] = useState([]);
    const [randomTheme, setRandomTheme] = useState("");
    const [teamIndex, setTeamIndex] = useState(null);
    const [actualTeamName, setActualTeamName] = useState("");
    const [actualTeamMembers, setActualTeamMembers] = useState([]);
    const [animals, setAnimals] = useState({});
    const [correctAnswer, setCorrectAnswer] = useState("");
    const [isValueSubmit, setIsValueSubmit] = useState(false);

    useEffect(() => {
        setData(props.data)
        setTeams(props.data[0])
        setRandomTheme(props.data[3])
        setTeamIndex(props.data[Number(props.client)])
        const animalData = props.data[4]
        if (animalData) {
            setAnimals(animalData[props.groupName]["animals"])
            setCorrectAnswer(animalData[props.groupName]["answer"])
        }
    }, [props.data])

    useEffect(() => {
        if (teams && teamIndex !== null) {
            setActualTeamName(Object.keys(teams)[teamIndex]);
            setActualTeamMembers(Object.values(teams)[teamIndex]);
            setStateOfTheGame(0)
        }
    }, [teams, teamIndex]);

    useEffect(() => {
        gameManager(globalTimer)
    }, [stateOfTheGame]);

    function handleFlipCard(e) {
        const element = e.target.closest('.animal')
        const allCards = document.querySelectorAll(".animal");
        const allHiddenCards = document.querySelectorAll(".animal.hidden");

        if (!isValueSubmit) {
            if (allHiddenCards.length < maxNumberOfCard) {
                element.classList.toggle("hidden");
            } else {
                if (element.classList.contains("hidden")) {
                    element.classList.remove("hidden");
                }
            }
        }

    }

    function gameManager(duration) {
        if (teams && teamIndex !== null) {

            const timerWrapper = document.querySelector(".timer-wrapper");
            const timer = document.querySelector(".timer");
            if (stateOfTheGame !== null) {
                timer.style.animationDuration = `${duration}s`;
                timer.style.animationPlayState = "running";
            }

            setTimeout(() => {
                if (stateOfTheGame < 1) {
                    setStateOfTheGame(stateOfTheGame + 1)
                    setActualIndexOfMembers(actualIndexOfMembers + 1)
                    if (maxNumberOfCard < 9) {
                        setMaxNumberOfCard(maxNumberOfCard + 3)
                    }
                } else {
                    disableTimerAndShowValidateButton()
                    setMaxNumberOfCard(maxNumberOfCard + 3)
                }
            }, duration * 1000);

        }
    }

    function disableTimerAndShowValidateButton() {
        setActualIndexOfMembers(actualIndexOfMembers + 1)
        const timerWrapper = document.querySelector(".timer-wrapper");
        const timer = document.querySelector(".timer");
        timerWrapper.style.display = "none";
        timer.style.display = "none";
        timer.style.animationPlayState = "paused";
        const validateButton = document.querySelector("#turnByTurn .validateButton")
        validateButton.style.display = "block"
    }

    function handleClickOnValidateButton () {
        const lastCard = document.querySelectorAll(".animal:not(.hidden)")
        const answerText = document.querySelector(".answerText")
        if (lastCard.length === 1 && isValueSubmit === false) {
            setIsValueSubmit(true)
            socket.emit("animalChosen", Number(lastCard.id))
            if (Number(lastCard[0].id) === Number(correctAnswer)) {
                answerText.innerHTML = "Bonne réponse !"
            } else {
                answerText.innerHTML = "Mauvaise réponse !"
            }
            console.log(lastCard[0].id, correctAnswer)
        }

    }


    return (
        <section id={"turnByTurn"} className={"hide"}>

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
                            <p>{animal}</p>
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

            <h5 className={"answerText"}></h5>

        </section>
    );
}

export default TurnByTurn;
