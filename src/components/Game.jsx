import { useState, useRef } from "react";
import "./Game.css";

const Game = ({
  verifyLetter,
  pickedCategory,
  letters,
  guessedLetters,
  wrongLetters,
  guesses,
  score,
}) => {
  const [letter, setLetter] = useState("");
  const letterInputRef = useRef(null);
  const alphabet = "abcdefghijklmnopqrstuvwxyz".split("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (letter.trim() === "") return;
    verifyLetter(letter);
    setLetter("");
    letterInputRef.current.focus();
  };

  const handleVirtualKey = (key) => {
    verifyLetter(key);
    letterInputRef.current.focus();
  };

  return (
    <div className="game">
      <p className="points">
        <span>Pontuação:</span> {score}
      </p>

      <h1>Adivinhe a palavra:</h1>

      <h3 className="tip">
        Dica sobre a palavra: <span>{pickedCategory}</span>
      </h3>

      <p>Você ainda tem {guesses} tentativa(s).</p>

      {/* 🟨 CONTAINER PRINCIPAL: palavra + painel lateral */}
      <div className="mainGameArea">
        <div className="wordArea">
          <div className="wordContainer">
            {letters.map((l, i) =>
              guessedLetters.includes(l) ? (
                <span className="letter" key={i}>
                  {l}
                </span>
              ) : (
                <span key={i} className="blankSquare"></span>
              )
            )}
          </div>

          <div className="letterContainer">
            <p>Tente adivinhar uma letra da palavra:</p>

            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="letter"
                maxLength="1"
                onChange={(e) => setLetter(e.target.value)}
                required
                value={letter}
                ref={letterInputRef}
              />
              <button>Jogar!</button>
            </form>

            {/* 🔤 TECLADO VIRTUAL */}
            <div className="virtualKeyboard">
              {alphabet.map((key) => (
                <button
                  key={key}
                  onClick={() => handleVirtualKey(key)}
                  disabled={
                    guessedLetters.includes(key) || wrongLetters.includes(key)
                  }
                  className={
                    guessedLetters.includes(key)
                      ? "guessed"
                      : wrongLetters.includes(key)
                      ? "wrong"
                      : ""
                  }
                >
                  {key.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 🧩 PAINEL LATERAL DE LETRAS USADAS */}
        <div className="usedLettersPanel">
          <h3>Letras usadas:</h3>
          <div className="usedLettersBox">
          {wrongLetters.map((l, i) => (
          <span key={i}>{l}, </span>
        ))}
      </div>
        </div>
      </div>
    </div>
  );
};

export default Game;