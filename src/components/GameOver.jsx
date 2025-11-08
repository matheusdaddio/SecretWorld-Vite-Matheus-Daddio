import "./GameOver.css";

const GameOver = ({ retry, score, pickedWord }) => {
  const highScore = localStorage.getItem("highscore") || 0;

  return (
    <div className="gameover">
      <h1>Fim de jogo! 😵</h1>
      <p>
        A sua pontuação foi: <span>{score}</span>!
      </p>
      <p>
        Pontuação Máxima: <span>{highScore}</span> 👑
      </p>
      <p>
        A palavra correta era: <span className="correct-word">{pickedWord}</span>
      </p>
      <button onClick={retry}>Tentar Novamente 🔄</button>
    </div>
  );
};

export default GameOver;
