import React, { useEffect, useRef } from "react";
import { url } from "../pages/_app";

function RulesScreen({ socket, onRulesButtonClicked }) {
    const validateButtonRef = useRef(null);
    const rulesParagraphRef = useRef(null);

    useEffect(() => {

        if (validateButtonRef.current) {
            validateButtonRef.current.addEventListener("click", handleRulesButtonClicked);
        }

        socket.on("teamReady", handleTeamReady);

        return () => {
            if (validateButtonRef.current) {
                validateButtonRef.current.removeEventListener("click", handleRulesButtonClicked);
            }
            socket.off("teamReady", handleTeamReady);
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

    function handleTeamReady() {
        if (rulesParagraphRef.current) {
            rulesParagraphRef.current.textContent = "Les règles ont été expliquées";
        }
    }

    return (
        <section id={"rulesScreen"}>
            <h1>Explication des règles en cours</h1>
            <button ref={validateButtonRef}>J'ai compris</button>
            <p className={"paragraph"} ref={rulesParagraphRef}></p>
        </section>
    );
}

export default RulesScreen;
