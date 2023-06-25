import React, { useEffect, useRef } from 'react';
import Frame from "./Frame";
import config from "../config";

function Answer({ animalName, isCorrect }) {
    useEffect(() => {
        const bottomPart = document.querySelector("#answer .bottom-part");
        setTimeout(() => {
            bottomPart.classList.add("is-active");
        }, 3000);
    }, []);

    return (
        <section id="answer">
            <Frame color={"green"} crop={false} text={"Mutualisme"} />

            <div className="template-wrapper">
                <div className="top-part">
                    <div className="left-part">
                        <h3>
                            <span>{animalName}</span>
                        </h3>
                        <h3>est-ce l'espèce qui correspond ?</h3>
                    </div>
                </div>

                <div className="bottom-part answer">
                    <div className="animal">
                        {/* Afficher les autres informations de l'animal si nécessaire */}
                        {isCorrect && (
                            <img
                                src={"images/good-answer.svg"}
                                alt="Good answer icon"
                                className="icon"
                            />
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Answer;
