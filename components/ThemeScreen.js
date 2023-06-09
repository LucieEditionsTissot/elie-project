import React, {useEffect, useRef, useState} from "react";


function ThemeScreen({onThemesButtonClicked}) {
    function handleThemesButtonClicked() {
        onThemesButtonClicked(true)
        const validateButton = document.querySelector("#themesScreen button")
        validateButton.style.display = "none"
        const rulesParagraph = document.querySelector("#themesScreen .paragraph")
        rulesParagraph.textContent = `( En attente de l'autre équipe )`
    }

    return (
        <section id={"themeScreen"} className={"hide"}>

            <h1>Selection du thème en cours de manière aléatoire</h1>
            <button onClick={() => handleThemesButtonClicked()}>J'ai compris</button>

        </section>
    )
}

export default ThemeScreen;
