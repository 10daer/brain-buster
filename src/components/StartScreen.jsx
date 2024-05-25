function StartScreen({ difficulty, highScore, num, dispatch }) {
  return (
    <div className="start">
      <h2>Welcome To The React Quiz</h2>
      <h3>{num} questions to test your react mastery</h3>

      <p className="highScore-record"> Current HighScore : {highScore}</p>

      <div className="start-footer">
        <div className="difficulty">
          Select a difficulty level
          <select
            value={difficulty}
            onChange={(e) =>
              dispatch({ type: "set Difficulty", payload: e.target.value })
            }
          >
            <option value="beginner1">Beginner</option>
            <option value="intermediate2">Intermediate</option>
            <option value="advanced3">Advanced</option>
            <option value="professional4">Professional</option>
          </select>
        </div>
        <button
          className="btn btn-ui"
          onClick={() => dispatch({ type: "Start" })}
        >
          Let&apos;s Start
        </button>
      </div>
    </div>
  );
}

export default StartScreen;
