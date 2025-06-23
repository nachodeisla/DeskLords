import React, { useEffect, useState } from 'react';
import { Paper } from '@mui/material';
import './PlayerHand.css';

function PlayerHand({ cartas, mana, turn, onPlayCard, setDraggingType, setPendingCard, setFloatingMessage }) {
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [longPressCardId, setLongPressCardId] = useState(null);
  const [longPressTimeout, setLongPressTimeout] = useState(null);

  useEffect(() => {
    if (turn.phase !== 'hand') {
      setSelectedCardId(null);
    }
  }, [turn.phase]);

  const total = cartas.length;

 const handleClick = (carta) => {
  if (turn.whose !== 'user' || turn.phase !== 'hand') {
    setFloatingMessage('Solo puedes jugar cartas durante tu fase de mano!');
    return;
  }

  if (selectedCardId === carta._id) {
    if (carta.type === 'equipement' || carta.type === 'spell') {
      setSelectedCardId(null);
      setPendingCard(null); // Limpia si haces doble clic
      return;
    }

    if (carta.cost > mana) {
      setFloatingMessage(`Mana insuficiente! Coste: ${carta.cost}, Tienes: ${mana}`);
      return;
    }

    onPlayCard(carta);
    setSelectedCardId(null);
    setPendingCard(null);
  } else {
    setSelectedCardId(carta._id);

    if (carta.cost > mana) {
      setFloatingMessage(`Mana insuficiente! Coste: ${carta.cost}, Tienes: ${mana}`);
      return;
    }

    if (carta.type === 'equipement' || carta.type === 'spell') {
      setPendingCard({ id: carta._id, type: carta.type, cost: carta.cost });
      return;
    }

    // Si es criatura, la jugamos directamente
    onPlayCard(carta);
    setSelectedCardId(null);
    setPendingCard(null);
  }
};


  return (
    <>
      <div className="player-hand">
        {cartas.map((carta, index) => {
          const centerIndex = (total - 1) / 2;
          const offset = Math.round(index - centerIndex);
          const offsetClass = `player-offset-${offset}`;
          const isHovered = hoveredIndex === index && longPressCardId !== carta._id;
          const isSelected = selectedCardId === carta._id;

          return (
            <div
              key={carta._id}
              className={`card-container ${offsetClass} ${longPressCardId === carta._id ? 'long-pressed-container' : ''}`}
            >
              <Paper
                className={`card ${isHovered ? 'hovered' : ''} ${isSelected ? 'selectedToUse' : ''} ${longPressCardId === carta._id ? 'long-pressed' : ''}`}
                elevation={24}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                draggable={turn.whose === 'user' && turn.phase === 'hand'}
                onDragStart={(e) => {
                  setHoveredIndex(null);
                  if (turn.whose === 'user' && turn.phase === 'hand') {
                    if (carta.cost > mana) {
                      setFloatingMessage(`Mana insuficiente! Coste: ${carta.cost}, Tienes: ${mana}`);
                      return;
                    }

                    setDraggingType(carta.type); // ✅ se registra el tipo arrastrado
                    e.dataTransfer.setData('application/json', JSON.stringify({
                      id: carta._id,
                      type: carta.type,
                      cost: carta.cost,
                    }));
                  } else {
                    setFloatingMessage('No puedes jugar cartas fuera de tu fase de mano!!');
                  }
                }}
                onDragEnd={() => setDraggingType(null)} // ✅ se limpia al soltar
                onTouchStart={() => {
                  setHoveredIndex(null);
                  const timeoutId = setTimeout(() => {
                    setLongPressCardId(carta._id);
                  }, 500);
                  setLongPressTimeout(timeoutId);
                }}
                onTouchEnd={() => {
                  clearTimeout(longPressTimeout);
                  setLongPressCardId(null);
                }}
                onTouchCancel={() => {
                  clearTimeout(longPressTimeout);
                  setLongPressCardId(null);
                }}
                onClick={() => handleClick(carta)}
              >
                <img
                  src={carta.front_image}
                  alt={`Carta ${index + 1}`}
                  className="card-image"
                />
              </Paper>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default PlayerHand;
