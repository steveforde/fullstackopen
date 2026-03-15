const Total = ({ parts }) => {
  const total = parts.reduce((sum, part) => sum + part.exercises, 0);

  return (
    <p>
      <strong>Total of {total} Exercises</strong>
    </p>
  );
};

export default Total;
