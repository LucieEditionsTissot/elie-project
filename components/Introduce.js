import React, { useEffect } from "react";
import Frame from "./Frame";
import Deco from "./Deco";
import socket from 'socket.io-client';
import { url } from "../pages/_app";

function Introduce({ onClick }) {

    function handleClick() {
        const button = document.querySelector(".button-next-intro");
        if (!button.classList.contains("disabled")) {
            onClick();
            button.classList.add("disabled");
        }
    }

    return (
        <>
            <section id="introduce">
                <Frame color={"green"} crop={false} text={"Introduction"} />
                <div id={"dialog"}>
                    <div className="flex flex-col justify-center items-start">
                        <p>Salut ! Je suis <span>Elie,</span><br/>je vais vous accompagner tout au long de cette partie !</p>
                        <p>Appuyez sur "<span>SUIVANT</span>"<br/> pour continuer.</p>
                        <img src={"images/logo-rounded.svg"} alt="Logo rounded icon" className="logo"/>
                    </div>
                </div>
                <div className="button-next-intro flex flex-row justify-center items-center rounded-full"
                     onClick={() => handleClick()}>
                    <p>Suivant</p>
                    <img src={"images/next-icon-wheat.svg"} alt="Next icon"/>
                </div>
                <Deco/>

            </section>
        </>

    );
};

export default Introduce;
