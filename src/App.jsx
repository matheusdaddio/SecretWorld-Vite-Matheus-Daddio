import { useCallback, useEffect, useState } from "react";

// components
import StartScreen from "./components/StartScreen.jsx";
import Game from "./components/Game";
import GameOver from "./components/GameOver";

// styles
import "./App.css";

// data
import { wordsList } from "./data/words";

const stages = [
  { id: 1, name: "start" },
  { id: 2, name: "game" },
  { id: 3, name: "end" },
];

function App() {
  const [gameStage, setGameStage] = useState(stages[0].name);
  const [words] = useState(wordsList);

  const [pickedWord, setPickedWord] = useState("");
  const [pickedCategory, setPickedCategory] = useState("");
  const [letters, setLetters] = useState([]);

  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([]);
  const [guesses, setGuesses] = useState();
  const [score, setScore] = useState(0);
  const [difficulty, setDifficulty] = useState("easy");

  // Função que busca uma palavra aleatória da API ou usa fallback local
  const fetchRandomWord = async () => {
    try {
      const response = await fetch("https://api.dicionario-aberto.net/random");
      const data = await response.json();

      // Tentativas de pegar a palavra em diferentes formatos possíveis
      const word =
        data?.entry?.form?.representation ||
        data?.entry?.orth ||
        data?.form?.representation ||
        data?.form ||
        data?.word ||
        null;

      if (!word || typeof word !== "string") {
        throw new Error("Palavra inválida retornada pela API");
      }

      const category = "aleatório - api";
      return { word, category };
    } catch (error) {
      console.warn("⚠️ Falha ao buscar palavra da API, usando fallback local:", error);

      // Fallback se a API falhar
      const categories = Object.keys(wordsList);
      const category = categories[Math.floor(Math.random() * categories.length)];
      const word =
        wordsList[category][
          Math.floor(Math.random() * wordsList[category].length)
        ];
      return { word, category };
    }
  };

  // Inicia o jogo
  const startGame = useCallback(async (selectedDifficulty) => {
    setDifficulty(selectedDifficulty);
    setGuessedLetters([]);
    setWrongLetters([]);

    const { category, word } = await fetchRandomWord();
    const wordLetters = word.split("").map((l) => l.toLowerCase());

    setPickedCategory(category);
    setPickedWord(word);
    setLetters(wordLetters);

    // Define vidas conforme dificuldade
    if (selectedDifficulty === "easy") {
      setGuesses(5);
    } else if (selectedDifficulty === "hard") {
      setGuesses(3);
    }

    setGameStage(stages[1].name);
  }, []);

  // Pega próxima palavra sem reiniciar tudo
  const nextWord = useCallback(async () => {
    setGuessedLetters([]);
    setWrongLetters([]);

    const { word, category } = await fetchRandomWord();
    const wordLetters = word.split("").map((l) => l.toLowerCase());

    setPickedCategory(category);
    setPickedWord(word);
    setLetters(wordLetters);
  }, []);

  // Verifica letra escolhida
  const verifyLetter = (letter) => {
    const normalizedLetter = letter.toLowerCase();

    if (
      guessedLetters.includes(normalizedLetter) ||
      wrongLetters.includes(normalizedLetter)
    ) {
      return;
    }

    if (letters.includes(normalizedLetter)) {
      setGuessedLetters((actualGuessedLetters) => [
        ...actualGuessedLetters,
        normalizedLetter,
      ]);
    } else {
      setWrongLetters((actualWrongLetters) => [
        ...actualWrongLetters,
        normalizedLetter,
      ]);
      setGuesses((actualGuesses) => actualGuesses - 1);
    }
  };

  // Reinicia o jogo
  const retry = () => {
    setScore(0);
    setGuesses(5);
    setGameStage(stages[0].name);
  };

  // Derrota
  useEffect(() => {
    if (guesses === 0) {
      const currentHighScore = parseInt(localStorage.getItem("highscore")) || 0;

      if (score > currentHighScore) {
        localStorage.setItem("highscore", score);
      }

      setGuessedLetters([]);
      setWrongLetters([]);
      setGameStage(stages[2].name);
    }
  }, [guesses, score]);

  // Vitória → próxima palavra
  useEffect(() => {
    const uniqueLetters = [...new Set(letters)];

    if (letters.length > 0 && guessedLetters.length === uniqueLetters.length) {
      setScore((actualScore) => actualScore + 100);
      nextWord();
    }
  }, [guessedLetters, letters, nextWord]);

  return (
    <div className="App">
      {gameStage === "start" && <StartScreen startGame={startGame} />}
      {gameStage === "game" && (
        <Game
          verifyLetter={verifyLetter}
          pickedWord={pickedWord}
          pickedCategory={pickedCategory}
          letters={letters}
          guessedLetters={guessedLetters}
          wrongLetters={wrongLetters}
          guesses={guesses}
          score={score}
        />
      )}
      {gameStage === "end" && (<GameOver retry={retry} score={score} pickedWord={pickedWord} />)}
    </div>
  );
}

export default App;