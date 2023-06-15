import { useState, useEffect } from 'react';
import socket from "prop-types/prop-types";

const animalNames = [
    'Chat',
    'Chien',
    'Lion',
    'Tigre',
    'Ours',
    'Souris',
    'Éléphant',
    'Girafe',
    'Hibou',
    'Papillon'
];

const playerNames = ['Joueur 1', 'Joueur 2', 'Joueur 3'];

const TurnByTurn = () => {
    const [cards, setCards] = useState([]);
    const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
    const [selectedCards, setSelectedCards] = useState([]);
    const [message, setMessage] = useState('');
    const [timer, setTimer] = useState(10);
    const [validationEnabled, setValidationEnabled] = useState(false);

    useEffect(() => {
        const initialCards = animalNames.map(name => ({
            name,
            selected: false,
            selectedBy: null
        }));

        setCards(initialCards);
    }, []);

    useEffect(() => {
        let interval;

        if (currentPlayerIndex === 0 || currentPlayerIndex === 1) {
            interval = setInterval(() => {
                setTimer(prevTimer => prevTimer - 1);
            }, 1000);
        }

        if (timer === 0) {
            handlePlayerChange();
        }

        return () => clearInterval(interval);
    }, [currentPlayerIndex, timer]);

    useEffect(() => {
        const remainingDeselectedCards = cards.filter(card => !card.selected);

        if (currentPlayerIndex === 2 && remainingDeselectedCards.length === 1) {
            setValidationEnabled(true);
        } else {
            setValidationEnabled(false);
        }
    }, [cards, currentPlayerIndex]);

    const handleCardClick = index => {
        const card = cards[index];

        if (card.selected && card.selectedBy !== currentPlayerIndex) {
            if (currentPlayerIndex === 1 || currentPlayerIndex === 2) {
                card.selected = false;
                card.selectedBy = null;
                setSelectedCards(prevSelectedCards =>
                    prevSelectedCards.filter(cardIndex => cardIndex !== index)
                );
            } else {
                setMessage('Cette carte a été sélectionnée par un autre joueur.');
            }
            return;
        }

        if (card.selected) {
            card.selected = false;
            card.selectedBy = null;
            setSelectedCards(prevSelectedCards =>
                prevSelectedCards.filter(cardIndex => cardIndex !== index)
            );
        } else {
            if (
                (currentPlayerIndex === 0 || currentPlayerIndex === 1) &&
                selectedCards.length < 3
            ) {
                card.selected = true;
                card.selectedBy = currentPlayerIndex;
                setSelectedCards(prevSelectedCards => [...prevSelectedCards, index]);
            } else if (currentPlayerIndex === 2) {
                card.selected = true;
                card.selectedBy = currentPlayerIndex;
                setSelectedCards(prevSelectedCards => [...prevSelectedCards, index]);
            } else {
                setMessage(
                    `Le joueur ${currentPlayerIndex + 1} a déjà sélectionné ${
                        currentPlayerIndex === 2 ? '9' : '3'
                    } cartes.`
                );
            }
        }

        setCards([...cards]);
    };

    const handlePlayerChange = () => {
        setCurrentPlayerIndex(prevIndex => (prevIndex + 1) % playerNames.length);
        setSelectedCards([]);
        setMessage('');
        setTimer(10);
    };

    const handleValidation = () => {
        setIsValueSubmit(true)
        socket.emit("animalChosen", Number(lastCard.id))
    };

    const currentPlayerName = playerNames[currentPlayerIndex];

    return (
        <div className="flex flex-col items-center justify-center bg-gray-200 min-h-screen">
            <h1 className="text-3xl font-bold mb-4">Turn By Turn</h1>
            <h2 className="text-xl mb-2">Joeur en cours: {currentPlayerName}</h2>
            {currentPlayerIndex === 0 || currentPlayerIndex === 1 ? (
                <div className="mb-4">Timer: {timer}</div>
            ) : null}
            <div className="grid grid-cols-3 gap-4">
                {cards.map((card, index) => (
                    <div
                        key={index}
                        className={`card relative w-32 h-32 bg-blue-500 text-white flex items-center justify-center p-4 rounded cursor-pointer transform ${
                            card.selected ? 'bg-green-500' : ''
                        } ${card.eliminated ? 'opacity-50' : ''}`}
                        onClick={() => handleCardClick(index)}
                    >
                        {card.name}
                    </div>
                ))}
            </div>
            {message && <p className="text-red-500 mt-2">{message}</p>}
            {currentPlayerIndex === 2 && validationEnabled && (
                <button
                    className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
                    onClick={handleValidation}
                >
                    Valider la sélection
                </button>
            )}
        </div>
    );
};

export default TurnByTurn;
