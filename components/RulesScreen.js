import React, { useEffect, useRef } from "react";

function RulesScreen({ onRulesButtonClicked }) {
    const validateButtonRef = useRef(null);
    const rulesParagraphRef = useRef(null);

    useEffect(() => {
        if (validateButtonRef.current) {
            validateButtonRef.current.addEventListener("click", handleRulesButtonClicked);
        }
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

    return (
        <section id={"rulesScreen"}>
            <h1>Explication des règles en cours</h1>
            <button ref={validateButtonRef}>J'ai compris</button>
            <p className={"paragraph"} ref={rulesParagraphRef}></p>
        </section>
    );
}

export default RulesScreen;
