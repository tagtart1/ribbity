import { collection, getDocs, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SignUpModal from "./SignUpModal";
import { db } from "../scripts/firebaseConfig";

const Home = () => {
  const [testName, setTestName] = useState<string>("loading...");

  useEffect(() => {});

  return (
    <div>
      <SignUpModal />

      <Link to={"/test-route"}>Test Route</Link>
    </div>
  );
};
export default Home;
