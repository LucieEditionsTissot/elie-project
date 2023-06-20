import React from "react";
import Frame from "./Frame";

function StartScreen({ onClick }) {
    return (
        <>
            <Frame color={"green"} text={"Elie"}/>

            <div className="relative h-full w-full flex flex-col justify-center items-center" id="startScreen">

                <div className="flex flex-row justify-center items-center">

                    <img src={"images/logo-blue.svg"} alt="Logo" className="logo"/>

                    <h1>Découvrir<br/>les interactions du monde vivat</h1>

                </div>

                <div className="start-button" onClick={onClick}>

                    <img src={"images/start-button-icon.svg"} alt="start button"/>

                    <p>Commencer</p>

                </div>

            </div>

        </>
    );
}

export default StartScreen;