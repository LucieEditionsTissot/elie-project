import React from "react";
import io from "socket.io-client";
import {url} from "../pages/_app";

const socket = io(url);

const Introduce = ({ onNextClick }) => {
    const handleNextClick = () => {
       socket.emit('readyToShowTeams')
    };

    return (
        <div>
            <p>Salut ! je suis elie,</p>
            <p> je vais vous accompagner</p>
            <p> tout au long de cette partie !</p>
                <p>c’est parti, appuie sur “suivant”</p>
            <button onClick={handleNextClick}>Suivant</button>
        </div>
    );
};

export default Introduce;
