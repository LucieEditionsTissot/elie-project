import React, {useEffect, useRef, useState} from "react";

function RulesScreen({onRulesButtonClicked}) {

    function handleRulesButtonClicked() {
        onRulesButtonClicked(true)
        const validateButton = document.querySelector("#rulesScreen button")
        validateButton.style.display = "none"
        const rulesParagraph = document.querySelector("#rulesScreen .paragraph")
        rulesParagraph.textContent = `( En attente de l'autre équipe )`
    }

    return (
        <section id={"rulesScreen"} className={"hide"}>

            <h1>Explication des règles en cours</h1>

            <button onClick={() => handleRulesButtonClicked()}>J'ai compris</button>

            <p className={"paragraph"}></p>

        </section>
    )
}

export default RulesScreen;
