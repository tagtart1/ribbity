import "../styles/Home.css";
import { signOutUser } from "./firebaseHelperFns";

const Home = () => {
  return (
    <div className="home-container">
      <button onClick={signOutUser}>Sign Out</button>
    </div>
  );
};

export default Home;
