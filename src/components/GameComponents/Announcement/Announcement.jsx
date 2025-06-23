import React, { useEffect, useState } from "react";
import "./Announcement.css";

function Announcement({ data, mode, onFinish, forEnd }) {
  const [stage, setStage] = useState("enter");

  useEffect(() => {
    if (!mode) return;

    setStage("enter");

    const timers = [];
    timers.push(setTimeout(() => setStage("center"), 800));
    timers.push(setTimeout(() => setStage("exit"), 1800));
    timers.push(setTimeout(() => onFinish?.(), 2600));

    return () => timers.forEach(clearTimeout);
  }, [mode]);

  if (mode === "vs") {
    return (
      <div className={`announcement-overlay ${stage}`}>
        <div className="vs-container">


 <div className="player-info rival">
            <img
              src={
                data.rival.rivalAvatar ||
                "https://m.media-amazon.com/images/I/51hPfLUZE0L._AC_UL1002_.jpg"
              }
              alt={data.rival.rivalDisplayName}
              className="avatar"
            />
            <span className="name">{data.rival.rivalDisplayName || "Rival"}</span>
          </div>

<div className="vs-img"><img src="Announcement/vs.png" alt=""  className="vs-img"/></div>

          <div className="player-info user">
            <img
              src={
                data.user.playerAvatar ||
                "https://img.freepik.com/fotos-premium/angel-cara-angel-alas_901383-148607.jpg"
              }
              alt={data.user.playerDisplayName}
              className="avatar"
            />
            <span className="name">{data.user.playerDisplayName || "Player"}</span>
          </div>
          
         
        </div>
      </div>
    );
  }

  if (mode === "victory" || mode === "defeat") {
    const imageSrc =
      mode === "victory"
        ? "/Announcement/VICTORIAFINAL.png"
        : "/Announcement/DERROTAFINAL.png";
    const altText = mode === "victory" ? "¡Victoria!" : "Derrota";

    const rewards = forEnd?.rewards || {};
    console.log("tu recompensa", rewards);

    return (
      <div className="announcement-overlay center permanent">
        <div className="final-image-container">
          <img src={imageSrc} alt={altText} className="final-image" />

          {(rewards.exp ||
            rewards.coins ||
            rewards.unlockedDeck ||
            rewards.unlockedMap ||
            rewards.leveledUp) && (
            <div className="rewards-container">
              <h3>Recompensas obtenidas</h3>
              <ul className="rewards-list">
                {rewards.exp > 0 && (
                  <li className="reward-item">+{rewards.exp} EXP</li>
                )}
                {rewards.coins > 0 && (
                  <li className="reward-item">+{rewards.coins} monedas</li>
                )}
                {rewards.leveledUp && (
                  <li className="reward-item">¡Has subido de nivel!</li>
                )}
                {rewards.unlockedDeck && (
                  <li className="reward-item with-image">
                    <img
                      src={rewards.unlockedDeck.image}
                      alt={rewards.unlockedDeck.name}
                      className="reward-thumbnail"
                    />
                    <span>
                      Desbloqueado: {rewards.unlockedDeck.name}
                    </span>
                  </li>
                )}

                {rewards.unlockedMap && (
                  <li className="reward-item with-image">
                    <img
                      src={rewards.unlockedMap.image}
                      alt={rewards.unlockedMap.name}
                      className="reward-thumbnail"
                    />
                    <span>
                      Desbloqueado: {rewards.unlockedMap.name}
                    </span>
                  </li>
                )}
              </ul>
            </div>
          )}

          <button
            className="end-button"
            onClick={() => (window.location.href = "/menu")}
          >
            Volver al menú
          </button>
        </div>
      </div>
    );
  }

  return null;
}

export default Announcement;
