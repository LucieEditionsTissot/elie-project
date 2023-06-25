import React, { useEffect, useRef } from 'react';
import Frame from "./Frame";
import config from "../config";

function Answer({socket, client, animalChosen }) {

    useEffect(() => {
        const bottomPart = document.querySelector("#answer .bottom-part");
        setTimeout(() => {
            bottomPart.classList.add("is-active");
            setTimeout(() => {
                socket.emit("undestrandInteraction");
            }, 5000);
        }, 3000);
    }, []);

    return (
        <section id="answer">
            <Frame color={"green"} crop={false} text={"Mutualisme"} />

            <div className="template-wrapper">
                <div className="top-part">
                    <div className="left-part">
                        <h3>
                            <span>{animalChosen[client][0]["fullName"]}</span>
                        </h3>
                        <h3>est-ce l'espèce qui correspond ?</h3>
                    </div>
                </div>

                <div className="bottom-part answer">
                    <div className="animal">

                        <img src={"images/animals/" + animalChosen[client][0]["icon"]} alt="animal icon"/>

                        <p>{animalChosen[client][0]["name"]}</p>

                        {animalChosen[client][1] === true ?
                            <img src={"images/good-answer.svg"} alt="Good answer icon" className="icon"/>
                            :
                            <img src={"images/wrong-answer.svg"} alt="Bad answer icon" className="icon"/>
                        }

                    </div>
                </div>
            </div>
        </section>
    );
}

export default Answer;
