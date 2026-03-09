import { useState } from "react";

const FeedbackHeader = () => <h1>Give Feedback</h1>;
const StatisticsHeader = () => <h1>Statistics</h1>;

const StatisticLine = (props) => {
  const { text, value } = props;

  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  );
};

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
      <table>
        <tbody>
          <StatisticLine text="good" value={good} />
          <StatisticLine text="neutral" value={neutral} />
          <StatisticLine text="bad" value={bad} />
          <StatisticLine text="all" value={total} />
          <StatisticLine
            text="average"
            value={((good - bad) / total).toFixed(2)}
          />
          <StatisticLine
            text="positive"
            value={((good / total) * 100).toFixed(2) + " %"}
          />
        </tbody>
      </table>
    </div>
  );
};

const Button = (props) => {
  const { onClick, text } = props;
  return <button onClick={onClick}>{text}</button>;
};

const App = () => {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  return (
    <div>
      <FeedbackHeader />
      <Button onClick={() => setGood(good + 1)} text="good" />
      <Button onClick={() => setNeutral(neutral + 1)} text="neutral" />
      <Button onClick={() => setBad(bad + 1)} text="bad" />
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  );
};

export default App;
