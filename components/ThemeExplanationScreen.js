import React, {useEffect, useState} from "react";
import io from "socket.io-client";
import PropTypes from "prop-types";
import {url} from "../pages/_app";

const socket = io(url);

const ThemeExplanationScreen = ({ themeSelected }) => {
        return (
            <section id="themeExplanationScreen">
                <h1>{themeSelected}</h1>
            </section>
        );
};

export default ThemeExplanationScreen;

