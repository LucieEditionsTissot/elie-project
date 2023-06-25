import { useEffect, useState, useRef } from "react";
import Frame from "./Frame";

function TurnByTurn3({ socket, data, client, groupName, hiddenCards, currentIndex }) {
    const [stateOfTheGame, setStateOfTheGame] = useState([]);
    const [maxNumberOfCard, setMaxNumberOfCard] = useState(3);
    const [dataAnimals, setData] = useState([]);
    const [randomTheme, setRandomTheme] = useState("");
    const [animals, setAnimals] = useState({});
    const [correctAnswer, setCorrectAnswer] = useState("");
    const [isValueSubmit, setIsValueSubmit] = useState(false);
    const [currentGameIndex, setCurrentGameIndex] = useState(0);
    const hiddenCardsRef = useRef(hiddenCards);

    useEffect(() => {
        setData(data);
        setStateOfTheGame(stateOfTheGame.slice(1));
        setRandomTheme(data[0]);
        const animalData = data[1];
        if (animalData) {
            setAnimals(animalData[groupName]["animals"]);
            setCorrectAnswer(animalData[groupName]["answer"]);
        }
        const el = document.querySelector("#step");
        el.innerHTML = "Suivant";
    }, [data]);

    useEffect(() => {
        hiddenCardsRef.current = hiddenCards;
    }, [hiddenCards]);

    useEffect(() => {
        if (currentIndex > 0) {
            const hiddenCardsElements = Array.from(document.querySelectorAll(".animal"));
            hiddenCardsRef.current.forEach((cardId) => {
                const cardElement = hiddenCardsElements[cardId];
                if (cardElement) {
                    cardElement.classList.add("hidden");
                }
            });
        }
    }, [currentIndex]);

    function handleFlipCard(e) {
        const element = e.target.closest(".animal");
        const allCards = document.querySelectorAll(".animal");

        if (!isValueSubmit) {
            if (!element.classList.contains("hidden") || allCards.length < maxNumberOfCard) {
                element.classList.toggle("hidden");
            }
        }
    }

    function handleClickOnNextButton() {
        const nextGameIndex = currentGameIndex + 1;
        setCurrentGameIndex(nextGameIndex);
            socket.emit("animalChosen");

        const hiddenCardsElements = Array.from(document.querySelectorAll(".animal"));
        hiddenCardsElements.forEach((cardElement, index) => {
            if (cardElement.classList.contains("hidden") && !hiddenCardsRef.current.includes(index.toString())) {
                hiddenCardsRef.current.push(index.toString());
            }
        });

        setStateOfTheGame([...stateOfTheGame]);
    }
    return (
        <section id="turnByTurn">
            <Frame color={"green"} crop={false} text={randomTheme} />
            <div className="template-wrapper">
                <div className="top-part">
                    <div className="left-part">
                        <h3 onClick={() => console.log(animals)}>Masquez 3 espèces</h3>
                        <h6>Qui ne correspondent pas à l'indice</h6>
                    </div>
                    <div
                        className="button-next flex flex-row justify-center items-center rounded-full"
                        onClick={handleClickOnNextButton}
                    >
                        <p id="step"></p>
                        <img src={"images/next-icon-wheat.svg"} alt="Next icon" />
                    </div>
                </div>
                <div className="bottom-part animal-wrapper">
                    {animals !== undefined &&
                        animals.length > 0 &&
                        animals.map((animal, index) => (
                            <div
                                key={index}
                                id={index}
                                className={`animal ${hiddenCards.includes(index.toString()) ? "hidden" : ""}`}
                                onClick={(e) => handleFlipCard(e)}
                            >
                                <p>{animal.name}</p>
                            </div>
                        ))}
                </div>
            </div>
        </section>
    );
}

export default TurnByTurn3;
