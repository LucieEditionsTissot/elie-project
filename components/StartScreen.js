import React from "react";

function StartScreen({ onClick }) {
    return (
        <div>
            <h2>Bienvenue !</h2>
            <p>Prêt à commencer l'expérience ?</p>
            <button onClick={onClick}>Commencer</button>
        </div>
    );
}

export default StartScreen;