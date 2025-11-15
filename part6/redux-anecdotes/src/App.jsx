import { useSelector } from "react-redux";
import AnecdoteForm from "./components/AnecdoteForm";
import AnecdoteList from "./components/AnecdoteList";
import Filter from './components/Filter'
import Notification from "./components/Notification";

const App = () => {
  const anecdotes = useSelector((state) => state);

  const vote = (id) => {
    console.log("vote", id);
  };

  return (
    <div>
      <h2>Anecdotes</h2>
      <Notification />
      <Filter />
      <AnecdoteList />
      <AnecdoteForm />
    </div>
  );
};

export default App;
