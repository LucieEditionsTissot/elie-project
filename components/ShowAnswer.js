import React from "react";

function ShowAnswer({ correctAnswer }) {
    return (
        <div className="show-answer">
            <h4>Carte sélectionnée :</h4>
            <p>{correctAnswer}</p>
        </div>
    );
}

export default ShowAnswer;