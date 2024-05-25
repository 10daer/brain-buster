import { useEffect, useReducer } from "react";
import "./App.css";
import Error from "./components/Error";
import Finished from "./components/Finished";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Loader from "./components/Loader";
import Main from "./components/Main";
import NextQuestion from "./components/NextQuestion";
import Progress from "./components/Progress";
import Question from "./components/Question";
import StartScreen from "./components/StartScreen";
import Timer from "./components/Timer";

const Timersecs = 30;

const initialstate = {
  questions: [],
  status: "loading", // loading, success, error, active, finished,
  index: 0,
  chosenAnswer: null,
  prevHighScore: null,
  point: 0,
  highscore: null,
  time: null,
  defaultNum: 3,
  numOfQuestions: 0,
  difficulty: "beginner1",
};

function reducer(state, action) {
  switch (action.type) {
    case "Success":
      return { ...state, questions: action.payload, status: "success" };

    case "Error":
      return { ...state, status: "error" };

    case "Start":
      return {
        ...state,
        status: "active",
        prevHighScore: state.highscore,
        time: Timersecs * state.questions.length,
      };

    case "set Difficulty":
      return {
        ...state,
        difficulty: action.payload,
        numOfQuestions:
          +action.payload.slice(action.payload.length - 1) * state.defaultNum,
      };

    case "Update HighScore":
      return {
        ...state,
        highscore: action.payload,
        numOfQuestions: state.defaultNum,
      };

    case "chooseAnswer":
      const question = state.questions[state.index];
      return {
        ...state,
        chosenAnswer: action.payload,
        point:
          question.correctOption === action.payload
            ? state.point + question.points
            : state.point,
      };

    case "nextQuestion":
      return { ...state, index: state.index + 1, chosenAnswer: null };

    case "Finish":
      return {
        ...state,
        status: "finished",
        highscore:
          state.point > state.highscore ? state.point : state.highscore,
      };

    case "Restart":
      return {
        ...initialstate,
        status: "success",
        highscore: state.highscore,
        questions: state.questions,
        numOfQuestions: state.defaultNum,
      };

    case "Timer":
      return {
        ...state,
        status: state.time === 0 ? "finished" : state.status,
        time: state.time - 1,
      };

    default:
      throw new Error("Unknown action");
  }
}

export default function App() {
  const [
    {
      questions,
      prevHighScore,
      status,
      index,
      chosenAnswer,
      time,
      point,
      highscore,
      numOfQuestions,
      difficulty,
    },
    dispatch,
  ] = useReducer(reducer, initialstate);

  const max = questions.reduce((prev, curr) => prev + curr.points, 0);

  const processQuestion = (quests, num) => {
    let processedQuestions = [];
    const shuffled = quests.sort(function () {
      return 0.4 - Math.random();
    });

    for (let i = 0; i < 500; i++) {
      const rand = Math.trunc(Math.random() * num);
      if (
        processedQuestions.length < num &&
        !processedQuestions.includes(shuffled[rand])
      )
        processedQuestions.push(shuffled[rand]);
    }

    return processedQuestions;
  };

  useEffect(() => {
    fetch("http://localhost:8000/questions")
      .then((res) => res.json())
      .then((questions) =>
        dispatch({
          type: "Success",
          payload: processQuestion(questions, numOfQuestions),
        })
      )
      .catch((err) => dispatch({ type: "Error" }));
  }, [dispatch, numOfQuestions]);

  useEffect(() => {
    const highScore = localStorage.getItem("HighScore") || 0;
    dispatch({ type: "Update HighScore", payload: highScore });
  }, []);

  return (
    <div className="app">
      <Header />
      <Main>
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "success" && (
          <StartScreen
            highScore={highscore}
            num={numOfQuestions}
            dispatch={dispatch}
            difficulty={difficulty}
          />
        )}
        {status === "active" && (
          <>
            <Progress
              questionNum={numOfQuestions}
              index={index}
              point={point}
              TotalQuestionPoints={max}
              answer={chosenAnswer}
            />
            <Question
              questionBox={questions[index]}
              dispatch={dispatch}
              chosenAnswer={chosenAnswer}
            />
            <Footer>
              <Timer dispatch={dispatch} time={time} />
              <NextQuestion
                answer={chosenAnswer}
                dispatch={dispatch}
                index={index}
                questionNum={numOfQuestions}
              />
            </Footer>
          </>
        )}
        {status === "finished" && (
          <Finished
            point={point}
            maxPoint={max}
            hscore={highscore}
            prevHigh={prevHighScore}
            dispatch={dispatch}
          />
        )}
      </Main>
    </div>
  );
}

// additional features are to keep the highscore so when the user comes back they can still see there previous high score✅
//  also have there prevoius answer available to practise and see their mistakes
// you may allow the user to choose the level of difficulty and number of questions✅
