import React from "react";
import Frame from "./Frame";
import Deco from "./Deco";

function Conclusion() {
    return (
        <section id="conclusion">
            <Frame color={"green"} crop={false} text={"Conclusion"}/>
            <div id={"dialog"}>
                <div className="flex flex-col justify-center items-center text-center">
                    <h6>Et voilà !</h6>
                    <p>Maintenant, vous savez tout sur le mutualisme entre le loup et le corbeau !</p>
                    <p className="little-text">Mais il vous en reste tant d'autres<br/>à découvrir...</p>
                    <img src={"images/logo-rounded.svg"} alt="Logo rounded icon" className="logo"/>
                </div>
            </div>
            <Deco/>
        </section>
    );
}

export default Conclusion;
