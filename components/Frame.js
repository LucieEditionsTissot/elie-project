import React, {useEffect, useState} from "react";
import Deco from "./Deco";

function Frame(props) {

    return (
        <div className={`frame ${props.color === "blue" ? "greenBackground" : ""}`}>
            <img src={`/images/frame-${props.color}${props.crop ? "-crop" : ""}.png`} alt="Frame"/>
            <h3 className={props.color === "blue" ? "blueText" : ""}>{props.text}</h3>
        </div>
    );
}

export default Frame;
