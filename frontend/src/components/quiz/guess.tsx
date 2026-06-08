"use client";

import { useEffect, useState } from "react";

const allWords = [
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "A",
  "After",
  "Again",
  "Against",
  "Age",
  "All",
  "Alone",
  "Also",
  "And",
  "Ask",
  "At",
  "B",
  "Be",
  "Beautiful",
  "Before",
  "Best",
  "Better",
  "Busy",
  "But",
  "Bye",
  "C",
  "Can",
  "Cannot",
  "Change",
  "College",
  "Come",
  "Computer",
  "D",
  "Day",
  "Distance",
  "Do Not",
  "Do",
  "Does Not",
  "E",
  "Eat",
  "Engineer",
  "F",
  "Fight",
  "Finish",
  "From",
  "G",
  "Glitter",
  "Go",
  "God",
  "Gold",
  "Good",
  "Great",
  "H",
  "Hand",
  "Hands",
  "Happy",
  "Hello",
  "Help",
  "Her",
  "Here",
  "His",
  "Home",
  "Homepage",
  "How",
  "I",
  "Invent",
  "It",
  "More",
  "My",
  "N",
  "Name",
  "Next",
  "Not",
  "Now",
  "O",
  "Of",
  "On",
  "Our",
  "Out",
  "P",
  "Pretty",
  "Q",
  "R",
  "Right",
  "S",
  "Sad",
  "Safe",
  "See",
  "Self",
  "Sign",
  "Sing",
  "So",
  "Sound",
  "Stay",
  "Study",
  "T",
  "Talk",
  "Television",
  "Thank You",
  "Thank",
  "That",
  "They",
  "This",
  "Those",
  "Time",
  "To",
  "Type",
  "U",
  "Us",
  "V",
  "W",
  "Walk",
  "Wash",
  "Way",
  "We",
  "Welcome",
  "What",
  "When",
  "Where",
  "Which",
  "Who",
  "Whole",
  "Whose",
  "Why",
  "Will",
  "With",
  "Without",
  "Words",
  "Work",
  "World",
  "Wrong",
  "X",
  "Y",
  "You",
  "Your",
  "Yourself",
  "Z",
];

const getRandomElements = (array: string[], count: number) => {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const QuizGame = () => {
  const [currentWord, setCurrentWord] = useState("");
  const [options, setOptions] = useState<string[]>([]);
  const [, setScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);

  useEffect(() => {
    generateQuestion();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleAnswer(null); // time out
          return 10;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentWord]);

  const generateQuestion = () => {
    const word = allWords[Math.floor(Math.random() * allWords.length)];
    const wrongOptions = getRandomElements(
      allWords.filter((w) => w !== word),
      3
    );
    const allOptions = getRandomElements([word, ...wrongOptions], 4);

    setCurrentWord(word);
    setOptions(allOptions);
    setTimeLeft(10);
  };

  const handleAnswer = (selected: string | null) => {
    if (selected === currentWord) {
      setScore((prev) => prev + 1);
    }
    setQuestionCount((prev) => prev + 1);
    generateQuestion();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-purple-600 to-indigo-800 text-white">
      {/* Question Section */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-lg p-6 text-center">
        <div className="bg-purple-500 text-white text-sm font-bold py-2 px-4 rounded-full mb-4">
          Question {questionCount + 1} / 10
        </div>

        {currentWord && (
          <video
            src={`/assets/signs/${currentWord}.mp4`}
            width={300}
            height={300}
            className="mx-auto mb-6 rounded-lg shadow-md"
            controls
            autoPlay
            loop
            muted
          />
        )}

        <p className="text-lg font-bold text-gray-800 mb-6">
          What does this sign represent?
        </p>

        <div className="grid grid-cols-2 gap-4">
          {options.map((option, idx) => (
            <button
              key={idx}
              className="bg-gray-100 text-gray-800 py-3 px-6 rounded-lg font-semibold hover:bg-green-500 hover:text-white transition-all"
              onClick={() => handleAnswer(option)}
            >
              {option.replace("_", " ")}
            </button>
          ))}
        </div>

        {/* Timer */}
        <div className="mt-6">
          <div className="relative w-full h-4 bg-gray-300 rounded-full overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-green-500 transition-all"
              style={{ width: `${(timeLeft / 10) * 100}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-700 mt-2">
            Time Left: <strong>{timeLeft}s</strong>
          </p>
        </div>
      </div>
    </div >
  );
};

export default QuizGame;