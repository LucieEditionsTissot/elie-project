import React from "react";

function UnderstandInteraction({ themeSelected }) {
    return (
        <section id="understandInteraction">
            <h1>Compréhension de l'interaction en cours</h1>
            {themeSelected && <h2>Thème sélectionné : {themeSelected}</h2>}
        </section>
    );
}

export default UnderstandInteraction;
