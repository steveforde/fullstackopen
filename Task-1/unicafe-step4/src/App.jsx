import { useState } from "react";

const FeedbackHeader = () => <h1>Give Feedback</h1>;
const StatisticsHeader = () => <h1>Statistics</h1>;

const Statistics = (props) => {
  const { good, neutral, bad } = props;
  const total = good + neutral + bad;

  if (total === 0) {
    return (
      <div>
        <StatisticsHeader />
        <p>No feedback given</p>
      </div>
    );
  }

  return (
    <div>
      <StatisticsHeader />
      <p>good {good}</p>
      <p>neutral {neutral}</p>
      <p>bad {bad}</p>
      <p>all {total}</p>
      <p>average {((good - bad) / total).toFixed(13)}</p>
      <p>positive {((good / total) * 100).toFixed(13)} %</p>
    </div>
  );
};

const App = () => {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  return (
    <div>
      <FeedbackHeader />
      <button onClick={() => setGood(good + 1)}>good</button>
      <button onClick={() => setNeutral(neutral + 1)}>neutral</button>
      <button onClick={() => setBad(bad + 1)}>bad</button>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  );
};

export default App;
