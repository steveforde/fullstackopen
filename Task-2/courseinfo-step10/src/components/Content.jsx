import Part from "./Part";
const Content = (props) => (
  <div>
    <div>
      {props.parts.map((part) => (
        <Part key={part.id} part={part} />
      ))}
    </div>
  </div>
);

export default Content;
