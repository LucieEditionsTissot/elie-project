import React, { useEffect, useState } from "react";

function Deco() {

    return (
        <div id="deco">
            <img src={"images/plant/plant-background.png"} alt="Background" className="background"/>
            <img src={"images/plant/plant-left-green.svg"} alt="Plant left green" className="left-green"/>
            <img src={"images/plant/plant-left-grey.svg"} alt="Plant left grey" className="left-grey"/>
            <img src={"images/plant/plant-right-white.svg"} alt="Plant right white" className="right-white"/>
            <img src={"images/plant/plant-right-grey.svg"} alt="Plant right grey" className="right-grey"/>
        </div>
    );
}

export default Deco;
