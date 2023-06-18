import React from 'react';

const Images = ({ src }) => {
    const imageStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '90%',
        zIndex: -1,
    };

    return <img src={src} alt="Background Image" style={imageStyle} />;
};

export default Images;
