import { useState } from "react";
import "./StartScreen.css";

const StartScreen = ({ startGame }) => {
  const [difficulty, setDifficulty] = useState("easy");

  const handleStart = () => {
    startGame(difficulty); // envia a dificuldade escolhida
  };

  return (
    <div className="start">
      <h1>Secret Word</h1>
      <p>Selecione a dificuldade do jogo:</p>

      <form>
        <select
          name="difficulty"
          id="difficulty"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
        >
          <option value="easy">Fácil</option>
          <option value="hard">Difícil</option>
        </select>
      </form>

      <p>Clique no botão abaixo para começar a jogar 👇</p>
      <button onClick={handleStart}>Começar jogo</button>
    </div>
  );
};

export default StartScreen;
