import React, { useEffect, useRef, useState } from "react";
import { url } from "../pages/_app";

function RulesScreen({ socket, onRulesButtonClicked }) {
    const validateButtonRef = useRef(null);
    const rulesParagraphRef = useRef(null);
    const [teamIsReady, setTeamIsReady] = useState(false);

    useEffect(() => {
        if (validateButtonRef.current) {
            validateButtonRef.current.addEventListener("click", handleRulesButtonClicked);
        }

        socket.on("teamIsReady", handleTeamIsReady);

        return () => {
            if (validateButtonRef.current) {
                validateButtonRef.current.removeEventListener("click", handleRulesButtonClicked);
            }
            socket.off("teamIsReady", handleTeamIsReady);
            socket.disconnect();
        };
    }, []);

    function handleRulesButtonClicked() {
        onRulesButtonClicked(true);
        if (validateButtonRef.current) {
            validateButtonRef.current.style.display = "none";
        }
        if (rulesParagraphRef.current) {
            rulesParagraphRef.current.textContent = "( En attente de l'autre équipe )";
        }
    }

    function handleTeamIsReady() {
        setTeamIsReady(true);
        if (rulesParagraphRef.current) {
            rulesParagraphRef.current.textContent = "Les règles ont été expliquées";
        }
    }

    return (
        <section id={"rulesScreen"}>
            <h1>Explication des règles en cours</h1>
            <button ref={validateButtonRef}>J'ai compris</button>
            <p className={"paragraph"} ref={rulesParagraphRef}></p>
            {teamIsReady && <p>Équipe prête</p>}
        </section>
    );
}

export default RulesScreen;

