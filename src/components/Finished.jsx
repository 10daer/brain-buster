function Finished({ point, hscore, prevHigh, maxPoint, dispatch }) {
  const percentage = (point / maxPoint) * 100;
  let emoji;
  if (percentage >= 1) emoji = "😞";
  if (percentage >= 25) emoji = "😔";
  if (percentage >= 50) emoji = "😊";
  if (percentage >= 75) emoji = "🍾";
  if (percentage === 100) emoji = "🏅";
  return (
    <>
      <p className="result">
        {emoji} You Scored {point} Out Of {maxPoint} Points (
        {Math.ceil(percentage)})%
      </p>
      <p className="highscore">
        {prevHigh < hscore
          ? `You have a new HighScore: ${hscore} Points 🥳🍾🏅`
          : `Your total score is ${hscore} Points `}
      </p>
      <button
        className="btn btn-ui"
        onClick={() => {
          localStorage.setItem("HighScore", hscore);
          dispatch({ type: "Restart" });
        }}
      >
        Restart Quiz
      </button>
    </>
  );
}

export default Finished;
