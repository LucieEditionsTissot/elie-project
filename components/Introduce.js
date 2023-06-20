import React from "react";

const Introduce = (props) => {

    return (
        <div>
            <p>Salut ! je suis elie,</p>
            <p> je vais vous accompagner</p>
            <p> tout au long de cette partie !</p>
                <p>c’est parti, appuie sur “suivant”</p>
            <button onClick={props.onClick}>Suivant</button>
        </div>
    );
};

export default Introduce;
