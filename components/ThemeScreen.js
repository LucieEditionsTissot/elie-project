import React, { useRef } from "react";

function ThemeScreen({ onThemesButtonClicked }) {
    const validateButtonRef = useRef(null);
    const rulesParagraphRef = useRef(null);

    function handleThemesButtonClicked() {
        onThemesButtonClicked(true);
        if (validateButtonRef.current) {
            validateButtonRef.current.style.display = "none";
        }
        if (rulesParagraphRef.current) {
            rulesParagraphRef.current.textContent = "( En attente de l'autre équipe )";
        }
    }

    return (
        <section id="themeScreen">
            <h1>Selection du thème en cours de manière aléatoire</h1>
            <button ref={validateButtonRef} onClick={handleThemesButtonClicked}>
                J'ai compris
            </button>
        </section>
    );
}

export default ThemeScreen;

