import React from "react";
import Frame from "./Frame";

function StartScreen({ onClick }) {
    return (
        <>
            <Frame color={"green"} text={"Introduction"}/>

            <div className="relative h-full w-full flex flex-col justify-center items-center" id="startScreen">

                <div className="flex flex-row justify-between items-center">

                    <img src={"images/logo-blue.svg"} alt="Logo" className="logo"/>

                    <h1>Découvrir les interactions du monde vivat</h1>

                </div>

                <h2>Bienvenue !</h2>
                <p>Prêt à commencer l'expérience ?</p>
                <button onClick={onClick}>Commencer</button>
            </div>

        </>
    );
}

export default StartScreen;