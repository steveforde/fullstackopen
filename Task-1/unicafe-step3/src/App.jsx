import { useState } from "react";

const Statistics = (props) => {
  const { good, neutral, bad } = props;
  const total = good + neutral + bad;
  return (
    <div>
      <h1>Statistics</h1>
      <p>good {good}</p>
      <p>neutral {neutral}</p>
      <p>bad {bad}</p>
      <p>all {total}</p>
      <p>average {total === 0 ? 0 : ((good - bad) / total).toFixed(13)}</p>
      <p>positive {total === 0 ? 0 : ((good / total) * 100).toFixed(13)} %</p>
    </div>
  );
};

const App = () => {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  return (
    <div>
      <h1>Give Feedback</h1>
      <button onClick={() => setGood(good + 1)}>good</button>
      <button onClick={() => setNeutral(neutral + 1)}>neutral</button>
      <button onClick={() => setBad(bad + 1)}>bad</button>

      {/* This is the "Dry" way—passing data to your component */}
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  );
};

export default App;
