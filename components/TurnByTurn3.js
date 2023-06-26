import {useEffect, useState, useRef} from "react";
import Frame from "./Frame";
import Indicator from "./Indicator";
import answer from "./Answer";

function TurnByTurn3({socket, data, client, groupName, hiddenCards, currentIndex}) {
    const [stateOfTheGame, setStateOfTheGame] = useState([]);
    const [maxNumberOfCard, setMaxNumberOfCard] = useState(3);
    const [dataAnimals, setData] = useState(data);
    const [randomTheme, setRandomTheme] = useState(data[0]);
    const [animals, setAnimals] = useState(data[1][groupName]["animals"]);
    const [correctAnswer, setCorrectAnswer] = useState(data[1][groupName]["answer"]);
    const [currentGameIndex, setCurrentGameIndex] = useState(0);
    const hiddenCardsRef = useRef(hiddenCards);

    useEffect(() => {
        setStateOfTheGame(stateOfTheGame.slice(1));
    }, []);

    useEffect(() => {
        hiddenCardsRef.current = hiddenCards[client]
        const hiddenCardsElements = document.querySelectorAll(".animal")
        hiddenCardsRef.current.forEach((cardId) => {
            const cardElement = hiddenCardsElements[Number(cardId)];
            if (cardElement) {
                cardElement.classList.add("locked");
            }
        })
    }, [hiddenCards]);

    function handleFlipCard(e) {
        const element = e.target.closest(".animal");
        const allCards = document.querySelectorAll(".animal");
        let allHiddenCards = document.querySelectorAll(".animal.hidden");

        if (!element.classList.contains('locked')) {
            if (allHiddenCards.length < maxNumberOfCard) {
                element.classList.toggle("hidden");
            } else {
                if (element.classList.contains("hidden")) {
                    element.classList.remove("hidden");
                }
            }
        }

        const numberOfHiddenCard = document.querySelectorAll(".animal.hidden").length;
        const buttonNext = document.querySelector(".button-next");
        if (numberOfHiddenCard === 3) {
            buttonNext.classList.remove("disabled")
        } else {
            buttonNext.classList.add("disabled")
        }

    }

    function handleClickOnNextButton() {
        const buttonNext = document.querySelector(".button-next");

        if (!buttonNext.classList.contains("disabled")) {
            const nextGameIndex = currentGameIndex + 1;
            setCurrentGameIndex(nextGameIndex);
            const lastAnimalId = document.querySelector("#turnByTurn .animal:not(.hidden):not(.locked)").id;
            let isCorrect = false
            console.log("last id", lastAnimalId, correctAnswer)
            if (correctAnswer === Number(lastAnimalId)) {
                isCorrect = true
            }
            const data = [client, animals[lastAnimalId], isCorrect]
            socket.emit("animalChosen", data);

            const hiddenCardsElements = Array.from(document.querySelectorAll(".animal"));
            hiddenCardsElements.forEach((cardElement, index) => {
                if (cardElement.classList.contains("hidden") && !hiddenCardsRef.current.includes(index.toString())) {
                    hiddenCardsRef.current.push(index.toString());
                }
            });

            setStateOfTheGame([...stateOfTheGame]);
            buttonNext.classList.add("disabled");
        }
    }

    return (
        <section id="turnByTurn">
            <Frame color={"green"} crop={true} text={randomTheme}/>
            <div className="template-wrapper">
                <div className="top-part">
                    <div className="left-part">
                        <h3>Masquez 3 espèces</h3>
                        <h6>Qui ne correspondent pas à l'indice</h6>
                    </div>
                    <div
                        className="button-next flex flex-row justify-center items-center rounded-full disabled"
                        onClick={handleClickOnNextButton}
                    >
                        <p>Suivant</p>
                        <img src={"images/next-icon-wheat.svg"} alt="Next icon"/>
                    </div>
                </div>
                <div className="bottom-part animal-wrapper">
                    {animals !== undefined &&
                        animals.length > 0 &&
                        animals.map((animal, index) => (
                            <div key={index} id={index} className="animal" onClick={(e) => handleFlipCard(e)}>
                                <img src={"images/animals/" + animal.icon} alt="Animal icon"/>
                                <p>{animal.name}</p>
                            </div>
                        ))}
                </div>
            </div>
            <Indicator/>
        </section>
    );
}

export default TurnByTurn3;
