import React, { useEffect } from "react";
import Frame from "./Frame";
import Deco from "./Deco";

function StartScreen({socket, onClick }) {

    function handleClick() {
        const button = document.querySelector(".start-button");
        if (!button.classList.contains("disabled")) {
            onClick();
            button.classList.add("disabled");
        }
    }

    return (
        <>
            <section id="start">
                <Frame color={"green"} crop={false} text={"Elie"} />

                <div className="relative h-full w-full flex flex-col justify-center items-center" id="startScreen">
                    <div className="flex flex-row justify-center items-center">
                        <img src={"images/logo-blue.svg"} alt="Logo" className="logo" />
                        <h1>Découvrir<br />les interactions du monde vivant</h1>
                    </div>

                    <div className="start-button" onClick={handleClick}>
                        <img src={"images/start-button-icon.svg"} alt="start button" />
                        <p>Commencer</p>
                    </div>
                </div>

                <Deco />
            </section>
        </>
    );
}

export default StartScreen;
