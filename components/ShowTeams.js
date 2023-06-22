import React, { useEffect, useRef } from "react";
import socket from 'socket.io-client';
import teams from '../config';

function ShowTeams({ teamSelected, onTeamSelected }) {
    const cardRefs = useRef([]);
    useEffect(() => {

        socket.current.on("teamChosen", function (index) {
            const selectedCard = cardRefs.current.find(card => card.id === index);
            if (selectedCard && !selectedCard.classList.contains("selectedByOtherTeam")) {
                cardRefs.current.forEach(card => card.classList.remove("selectedByOtherTeam"));
                selectedCard.classList.add("selectedByOtherTeam");
            }
        });

    }, []);

    useEffect(() => {
        cardRefs.current = cardRefs.current.slice(0, teams.teams.length);
    }, []);

    function handleClickOnTeam(index) {
        if (teamSelected === null) {
            const cards = cardRefs.current;
            const selectedCard = cards[index];
            cards.forEach((card) => card.classList.remove("selected"));
            selectedCard.classList.add("selected");
            onTeamSelected(index);
        }
    }

    function handleClickOnValidateButton() {
        const selectedCard = cardRefs.current.find(card => card.classList.contains("selected"));
        if (selectedCard && !selectedCard.classList.contains("selectedByOtherTeam")) {
            const teamIndex = selectedCard.id;
            onTeamSelected(teamIndex);

            if (teamIndex % 2 === 0) {
                socket.emit("teamChosenGroupeOne", teamIndex);
            } else {
                socket.emit("teamChosenGroupeTwo", teamIndex);
            }
        }
    }

    useEffect(() => {
        if (teamSelected !== null) {
            socket.current.emit("teamChosen", teamSelected, { excludeSelf: true });
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
