import React, { useEffect, useState } from "react";

function Frame(props) {

    return (
       <div className="frame">
           <img src={"/images/frame-" + props.color + ".png"} alt="Frame" />
           <h3>{props.text}</h3>
       </div>
    );
}

export default Frame;
