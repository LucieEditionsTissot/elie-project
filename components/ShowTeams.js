import React, {useEffect, useRef} from "react";
import io from 'socket.io-client';
import {url} from "../pages/_app";
import config from '../config';
import Frame from "./Frame";

const socket = io(url);

function ShowTeams({ teamSelected, onTeamSelected, handleClickOnValidateTeam }) {

    const cardRefs = useRef([]);

    useEffect(() => {
        cardRefs.current = cardRefs.current.slice(0, config.teams.length);
    }, []);

    function handleClickOnTeam(index) {
        if (teamSelected === null) {
            const cards = cardRefs.current;
            const selectedCard = cards[index];
            cards.forEach((card) => card.classList.remove("selected"));
            selectedCard.classList.add("selected");
        }
    }

    function handleClickOnValidateButton(props) {
        console.log(teamSelected)
        if (teamSelected === null) {
            const selectedCard = cardRefs.current.find(card => card.classList.contains("selected"));
            if (selectedCard && !selectedCard.classList.contains("selectedByOtherTeam")) {
                const teamIndex = selectedCard.id;
                onTeamSelected(teamIndex);
            }
        }
    }

    socket.on("teamChosen", function (index) {
        const selectedCard = cardRefs.current.find(card => card.id === index);
        if (selectedCard && !selectedCard.classList.contains("selectedByOtherTeam")) {
            cardRefs.current.forEach(card => card.classList.remove("selectedByOtherTeam"));
            selectedCard.classList.add("selectedByOtherTeam");
        }
    });

    useEffect(() => {
        if (teamSelected !== null) {
            socket.emit("teamChosen", teamSelected, { excludeSelf: true });
            const button = document.querySelector("#teams .button-next")
            if (!button.classList.contains("disabled")) {
                handleClickOnValidateTeam()
                button.classList.add("disabled")
            }
        }
    }, [teamSelected]);

    return (
        <section id="teams">
            <Frame color={"green"} crop={false} text={"Introduction"}/>

            <div className="template-wrapper">

                <div className="top-part">

                    <div className="left-part">
                        <h3>Pour commencer,</h3>
                        <h3>Choisissez votre équipe !</h3>
                    </div>
                    <div className="button-next flex flex-row justify-center items-center rounded-full" onClick={() => handleClickOnValidateButton()}>
                        <p>Suivant</p>
                        <img src={"images/next-icon-wheat.svg"} alt="Next icon"/>
                    </div>

                </div>

                <div className="bottom-part teams-wrapper">

                    {Object.keys(config.teams).map((teamName, index) => (
                        <div ref={ref => (cardRefs.current[index] = ref)} key={index} id={index} className="card" onClick={() => handleClickOnTeam(index)}>
                            <h2 className="team-name">{teamName}</h2>
                            <ul>
                                {config.teams[teamName].map((member, index) => (
                                    <li key={index}>{member}</li>
                                ))}
                            </ul>
                            <img src={"images/logo-crop-leaves.svg"} alt="Logo" className="logo"/>
                        </div>
                    ))}

                </div>

            </div>

        </section>
    );
}

export default ShowTeams;


