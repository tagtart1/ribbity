import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SignUpModal from "./SignUpModal";

import "../styles/ExplorePage.css";
import ExplorePanel from "./ExplorePanel";
import MainNavTabsNoAuth from "./MainNavTabsNoAuth";
import SignUpFooter from "./SignUpFooter";

const ExplorePage = () => {
  const [testName, setTestName] = useState<string>("loading...");

  useEffect(() => {});

  return (
    <div className="home-noauth">
      <ExplorePanel />
    </div>
  );
};
export default ExplorePage;
