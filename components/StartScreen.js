import React, {useEffect, useRef, useState} from "react";


function StartScreen({onstartButtonClicked}) {
    function handleStartButtonClicked() {
        onstartButtonClicked(true)
        const validateButton = document.querySelector("#startScreen button")
        validateButton.style.display = "none"
        const rulesParagraph = document.querySelector("#startScreen .paragraph")
        rulesParagraph.textContent = `( En attente de l'autre équipe )`
    }

    return (
        <section id={"startScreen"} className={"hide"}>

            <h1>Selection du thème en cours de manière aléatoire</h1>
            <button onClick={() => handleStartButtonClicked()}>Commencer</button>

        </section>
    )
}

export default StartScreen;
