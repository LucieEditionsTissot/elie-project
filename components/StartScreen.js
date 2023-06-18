import React, { useEffect, useRef, useState } from "react";

function StartScreen({ onstartButtonClicked }) {
    const validateButtonRef = useRef(null);
    const rulesParagraphRef = useRef(null);

    function handleStartButtonClicked() {
        onstartButtonClicked(true);
        if (validateButtonRef.current) {
            validateButtonRef.current.style.display = "none";
        }
        if (rulesParagraphRef.current) {
            rulesParagraphRef.current.textContent = "( En attente de l'autre équipe )";
        }
    }

    return (
        <section id={"startScreen"} className={"hide"}>
            <h1>Selection du thème en cours de manière aléatoire</h1>
            <button ref={validateButtonRef} onClick={() => handleStartButtonClicked()}>
                Commencer
            </button>
        </section>
    );
}