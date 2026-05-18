import { useNavigate } from "react-router-dom";
import { useField, useAnecdotes } from "../hooks";

const CreateNew = () => {
  const navigate = useNavigate();
  // Pull the creation database trigger directly out of the custom hook
  const { addAnecdote } = useAnecdotes();

  const contentInput = useField("text");
  const authorInput = useField("text");
  const infoInput = useField("text");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addAnecdote({
      content: contentInput.value,
      author: authorInput.value,
      info: infoInput.value,
      votes: 0,
    });
    navigate("/");
  };

  const handleReset = (e) => {
    e.preventDefault();
    contentInput.reset();
    authorInput.reset();
    infoInput.reset();
  };

  const { reset: resetContent, ...content } = contentInput;
  const { reset: resetAuthor, ...author } = authorInput;
  const { reset: resetInfo, ...info } = infoInput;

  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>
          content: <input {...content} />
        </div>
        <div>
          author: <input {...author} />
        </div>
        <div>
          url info: <input {...info} />
        </div>
        <button type="submit">create</button>
        <button type="button" onClick={handleReset}>
          reset
        </button>
      </form>
    </div>
  );
};

export default CreateNew;
