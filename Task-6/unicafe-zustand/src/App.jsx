// src/App.jsx
import useFeedbackStore from "./store";

const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>{text}</button>
);

const StatisticLine = ({ text, value }) => (
  <tr>
    <td>{text}</td>
    <td>{value}</td>
  </tr>
);

const Statistics = ({ good, neutral, bad }) => {
  const all = good + neutral + bad;

  if (all === 0) {
    return (
      <div>
        <p>No feedback given</p>
      </div>
    );
  }

  // Calculate stats dynamically based on current store values
  const average = (good * 1 + bad * -1) / all;
  const positive = (good / all) * 100;

  return (
    <table>
      <tbody>
        <StatisticLine text="good" value={good} />
        <StatisticLine text="neutral" value={neutral} />
        <StatisticLine text="bad" value={bad} />
        <StatisticLine text="all" value={all} />
        <StatisticLine text="average" value={average.toFixed(1)} />
        <StatisticLine text="positive" value={`${positive.toFixed(1)} %`} />
      </tbody>
    </table>
  );
};

const App = () => {
  // Grab state from Zustand store
  const { good, neutral, bad } = useFeedbackStore();

  // Grab actions from Zustand store
  const { incrementGood, incrementNeutral, incrementBad, resetFeedback } =
    useFeedbackStore();

  return (
    <div>
      <h2>give feedback</h2>
      <Button handleClick={incrementGood} text="good" />
      <Button handleClick={incrementNeutral} text="neutral" />
      <Button handleClick={incrementBad} text="bad" />
      <Button handleClick={resetFeedback} text="reset stats" />

      <h2>statistics</h2>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  );
};

export default App;
