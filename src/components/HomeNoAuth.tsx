import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SignUpModal from "./SignUpModal";

import "../styles/HomeNoAuth.css";
import ExplorePanel from "./ExplorePanel";
import SectionTabsNoAuth from "./SectionTabNoAuth";
import SignUpFooter from "./SignUpFooter";

const HomeNoAuth = () => {
  const [testName, setTestName] = useState<string>("loading...");

  useEffect(() => {});

  return (
    <div className="home-noauth">
      <SectionTabsNoAuth />

      <ExplorePanel />
      <SignUpModal />
      <SignUpFooter />
    </div>
  );
};
export default HomeNoAuth;
