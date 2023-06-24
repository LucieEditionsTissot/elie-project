import React, {useEffect, useRef, useState} from "react";
import Frame from "./Frame";
import config from "../config";

function TurnByTurn(props) {

    const [stateOfTheGame, setStateOfTheGame] = useState(null);
    const [maxNumberOfCard, setMaxNumberOfCard] = useState(3);
    const [data, setData] = useState([]);
    const [randomTheme, setRandomTheme] = useState("");
    const [animals, setAnimals] = useState({});
    const [correctAnswer, setCorrectAnswer] = useState("");
    const [isValueSubmit, setIsValueSubmit] = useState(false);

    useEffect(() => {
        setData(props.data)
        setRandomTheme(props.data[0])
        const animalData = props.data[1]
        if (animalData) {
            setAnimals(animalData[props.groupName]["animals"])
            setCorrectAnswer(animalData[props.groupName]["answer"])
        }
    }, [props.data])

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

    }

    function handleClickOnValidateButton() {
        const lastCard = document.querySelectorAll(".animal:not(.hidden)")
        if (lastCard.length === 1 && isValueSubmit === false) {
            setIsValueSubmit(true)
            props.socket.emit("animalChosen", Number(lastCard.id))
        }

    }

    return (
        <section id="turnByTurn">

            <Frame color={"green"} crop={false} text={randomTheme}/>

            <div className="template-wrapper">

                <div className="top-part">
                    <div className="left-part">
                        <h3 onClick={() => console.log(animals)}>Masquez 3 espèces</h3>
                        <h6>Qui ne correspondent pas à l'indice</h6>
                    </div>
                    <div className="button-next flex flex-row justify-center items-center rounded-full">
                        <p>Suivant</p>
                        <img src={"images/next-icon-wheat.svg"} alt="Next icon"/>
                    </div>
                </div>

                <div className="bottom-part animal-wrapper">

                    {animals !== undefined && animals.length > 0 && (
                        animals.map((animal, index) => (
                            <div key={index} id={index} className="animal" onClick={(e) => handleFlipCard(e)}>
                                <p>{animal.name}</p>
                            </div>
                        ))
                    )}

                </div>

            </div>

        </section>
    );
}

export default TurnByTurn;