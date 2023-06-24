import React, {useEffect, useRef, useState} from "react";
import config from '../config';
import Frame from "./Frame";

function ShowTeams({socket, teamSelected, onTeamSelected, client}) {
    const cardRefs = useRef([]);
    useEffect(() => {
        if (socket) {
            socket.on("teamChosen", function (index) {
                const cardSelectedByAnotherTeam = document.querySelector("#teams .card[id='" + index + "']")
                if (cardSelectedByAnotherTeam) {
                    cardSelectedByAnotherTeam.classList.add("selectedByOtherTeam");
                }
            });
        }
    }, []);

    function handleClickOnTeam(index) {
        if (teamSelected === null) {
            const cards = cardRefs.current;
            const selectedCard = cards[index];
            if (selectedCard && !selectedCard.classList.contains("selectedByOtherTeam")) {
                if (selectedCard.classList.contains("selected")) {
                    selectedCard.classList.remove("selected");
                } else {
                    cards.forEach((card) => card.classList.remove("selected"));
                    selectedCard.classList.add("selected");
                }
            }
        }
    }

    function handleClickOnValidateButton() {
        const selectedCard = cardRefs.current.find((card) => card.classList.contains("selected"));
        if (selectedCard && !selectedCard.classList.contains("selectedByOtherTeam")) {
            const teamIndex = selectedCard.id;
            onTeamSelected(teamIndex)
            const button = document.querySelector("#teams .button-next");
            if (button) {
                button.classList.add("disabled");
            }
        }
    }

    return (
        <section id="teams">

            <Frame color={"green"} crop={false} text={"Introduction"}/>

            <div className="template-wrapper">

                <div className="top-part">
                    <div className="left-part">
                        <h3>Pour commencer,</h3>
                        <h3>Choisissez votre équipe !</h3>
                    </div>
                    <div className="button-next flex flex-row justify-center items-center rounded-full"
                         onClick={() => handleClickOnValidateButton()}>
                        <p>Suivant</p>
                        <img src={"images/next-icon-wheat.svg"} alt="Next icon"/>
                    </div>
                </div>

                <div className="bottom-part teams-wrapper"> 
                  
                  {Object.keys(config.teams).map((teamName, index) => (
                    
                        <div ref={ref => (cardRefs.current[index] = ref)} key={index} id={index}
                             className={`card ${client === 1 ? "blue" : "red"}`}
                             onClick={() => handleClickOnTeam(index)}><h2 className="team-name">{teamName}</h2>
                            <ul> {
                                config.teams[teamName].map((member, index) => (
                                    <li key={index}>{member}</li>
                                ))}
                            </ul>
                            <svg width="71" height="95" viewBox="0 0 71 95" fill="#D8D6C8"
                                 xmlns="http://www.w3.org/2000/svg" className={"logo"}>
                                <g opacity="0.5">
                                    <path
                                        d="M43.6061 67.8287C36.5729 80.5629 22.3506 86.777 9.02631 82.9386C8.91055 82.9048 8.79116 82.859 8.67942 82.7971C8.27717 82.5743 7.97015 82.1919 7.83263 81.7111C7.65143 81.105 7.77402 80.4548 8.14585 79.9728C8.22175 79.8733 8.29381 79.7817 8.37334 79.6942L8.39246 79.6542L9.32356 78.6728L9.33886 78.6409C9.33886 78.6409 9.35396 78.629 9.36524 78.6251C10.3704 77.351 11.5191 76.3282 12.7154 75.4229C11.286 75.6731 9.79117 75.7253 8.17836 75.5908C7.99858 75.5924 7.79262 75.5896 7.5605 75.5825L6.82285 75.5685C6.67689 75.5584 6.53093 75.5484 6.38135 75.5263C5.79791 75.4459 5.2962 75.0568 5.04333 74.5021C4.79407 73.9594 4.80795 73.3198 5.07529 72.8002L5.09824 72.7523C8.87793 65.9138 14.8205 60.7587 21.8303 58.2378C28.765 55.736 36.3092 55.9588 43.0778 58.8473C44.1034 59.2838 44.8853 60.1113 45.2866 61.1832C45.6953 62.2592 45.6647 63.4459 45.212 64.5304C44.7401 65.6548 44.1971 66.7702 43.6059 67.8488L43.6061 67.8287Z"/>
                                    <path
                                        d="M4.22307 53.4022C3.68735 53.7933 3.00527 53.8404 2.42787 53.5308C1.85792 53.2253 1.47458 52.6084 1.44397 51.9239C1.43128 51.6943 1.41496 51.4526 1.40227 51.2231C1.38676 50.9009 1.36762 50.5666 1.35211 50.2445C1.34909 50.172 1.3497 50.1116 1.3503 50.0513C1.37848 49.4802 1.3845 48.8767 1.39837 48.237C1.40822 47.6254 1.42573 46.9979 1.44685 46.3824C1.01503 47.2458 0.557246 48.0848 0.11073 48.9198L-0.255667 49.607C-0.255667 49.607 -0.293914 49.687 -0.320488 49.7228C-0.495433 49.9901 -0.659101 50.2535 -0.826393 50.5047C-0.970939 50.7281 -1.12676 50.9554 -1.26748 51.1708C-1.63267 51.7373 -2.25375 52.0509 -2.88611 51.994C-3.15548 51.9662 -3.41297 51.8742 -3.63624 51.7303C-3.94507 51.529 -4.20056 51.2357 -4.35056 50.8796C-4.5994 50.2967 -4.83316 49.702 -5.04839 49.1276C-8.02716 41.0146 -8.19949 32.018 -5.5408 23.8001C-2.90546 15.6705 2.31651 8.79127 9.18356 4.44141C10.1974 3.79918 11.36 3.63382 12.4615 3.97067C13.5778 4.31577 14.4949 5.11695 15.0417 6.23908C15.6364 7.43832 16.167 8.69303 16.6337 9.96297C19.4701 17.7039 19.766 26.3239 17.4512 34.2365C15.175 42.0289 10.4668 48.8386 4.23051 53.4063L4.22307 53.4022Z"/>
                                    <path
                                        d="M31.2876 49.3707C30.6446 49.4517 30.0193 49.1547 29.6399 48.5933C29.2653 48.0392 29.1899 47.3016 29.4563 46.6791C29.5435 46.4692 29.6327 46.2467 29.7199 46.0367C29.8444 45.7432 29.9708 45.4372 30.0952 45.1437C30.1236 45.0779 30.15 45.0247 30.1765 44.9714C30.4464 44.4788 30.7106 43.9464 30.9973 43.3858C31.2684 42.8481 31.5531 42.3001 31.8358 41.7647C31.0824 42.3161 30.3164 42.833 29.5622 43.352L28.9423 43.7797C28.9423 43.7797 28.8741 43.8317 28.8352 43.8503C28.5653 44.0005 28.3072 44.1529 28.051 44.2927C27.8269 44.4191 27.5912 44.5433 27.374 44.6645C26.807 44.9857 26.1215 44.9554 25.5849 44.591C25.3579 44.4325 25.1689 44.223 25.0326 43.9845C24.845 43.6525 24.7441 43.2655 24.7638 42.8751C24.7931 42.2344 24.8408 41.5907 24.8963 40.9743C25.7337 32.2978 29.4399 24.2311 35.3234 18.2613C41.1484 12.3581 48.7317 8.84869 56.6894 8.40014C57.8643 8.3339 58.9666 8.76459 59.7993 9.61041C60.6416 10.471 61.1114 11.6371 61.1152 12.9041C61.1284 14.2634 61.0608 15.6399 60.9301 16.9983C60.126 25.274 56.6911 33.0679 51.2435 38.9378C45.8817 44.7202 38.784 48.4231 31.2924 49.3781L31.2876 49.3707Z"/>
                                </g>
                            </svg>
                        </div>
                        
                    ))}

                </div>
            </div>

        </section>);
}

export default ShowTeams;