import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useAnecdotes } from "./hooks";
import CreateNew from "./components/CreateNew";

const Menu = () => {
  const padding = { paddingRight: 5 };
  return (
    <div>
      <Link to="/" style={padding}>
        anecdotes
      </Link>
      <Link to="/create" style={padding}>
        create new
      </Link>
      <Link to="/about" style={padding}>
        about
      </Link>
    </div>
  );
};

const AnecdoteList = () => {
  // Pull data and delete action straight from our custom hook!
  const { anecdotes, deleteAnecdote } = useAnecdotes();

  return (
    <div>
      <h2>Anecdotes</h2>
      <ul>
        {anecdotes.map((anecdote) => (
          <li key={anecdote.id} style={{ marginBottom: "10px" }}>
            "{anecdote.content}" by <strong>{anecdote.author}</strong>
            <button
              onClick={() => deleteAnecdote(anecdote.id)}
              style={{ marginLeft: "15px", color: "red", cursor: "pointer" }}
            >
              delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

const About = () => (
  <div>
    <h2>About anecdote app</h2>
    <p>According to Wikipedia:</p>
    <em>
      An anecdote is a brief, revealing account of an individual person...
    </em>
  </div>
);

const Footer = () => (
  <div>
    Anecdote app for <a href="https://fullstackopen.com/">Full Stack Open</a>.
  </div>
);

const App = () => {
  return (
    <Router>
      <div>
        <h1>Software anecdotes</h1>
        <Menu />

        <Routes>
          <Route path="/" element={<AnecdoteList />} />
          <Route path="/create" element={<CreateNew />} />
          <Route path="/about" element={<About />} />
        </Routes>

        <Footer />
      </div>
    </Router>
  );
};

export default App;
