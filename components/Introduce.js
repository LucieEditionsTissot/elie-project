import React from "react";

const Introduce = ({ onNextClick }) => {
    const handleNextClick = () => {
       socket.emit('showTeams')
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
