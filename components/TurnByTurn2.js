import {useEffect, useState, useRef} from "react";
import Frame from "./Frame";

function TurnByTurn2({socket, data, client, groupName, hiddenCards, currentIndex}) {
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

            socket.emit("introIndice3");
            socket.emit("stopAudioClient");

            const hiddenCardsElements = Array.from(document.querySelectorAll(".animal"));
            hiddenCardsElements.forEach((cardElement, index) => {
                if (cardElement.classList.contains("hidden") && !hiddenCardsRef.current.includes(index.toString())) {
                    hiddenCardsRef.current.push(index.toString());
                }
            });

            socket.emit("updateHiddenCards" + client, hiddenCardsRef.current);
            socket.emit("updateGameIndex", nextGameIndex);

            if (nextGameIndex >= 1) {
                const updatedData = {
                    hiddenCards: Array.from(document.querySelectorAll(".animal")).reduce((hiddenCards, card) => {
                        if (card.classList.contains("hidden")) {
                            hiddenCards.push(card.id);
                        }
                        return hiddenCards;
                    }, []),
                    currentIndex: nextGameIndex,
                };
                socket.emit("updateGameData", updatedData);
            }

            setStateOfTheGame([...stateOfTheGame]);
            buttonNext.classList.add("disabled");
        }
    }

    return (
        <section id="turnByTurn">
            <Frame color={"green"} crop={false} text={randomTheme}/>
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
                                <img src={"images/lock.svg"} alt="lock icon" className="lock"/>
                            </div>
                        ))}
                </div>
            </div>
        </section>
    );
}

export default TurnByTurn2;
