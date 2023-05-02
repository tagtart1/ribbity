import { useState } from "react";
import "../../styles/SignUpFooter.css";

import SignUpNativePopup from "./SignUpNativePopup";
interface SignUpFooterProps {
  signedIn?: boolean;
}

const SignUpFooter = ({ signedIn }: SignUpFooterProps) => {
  const [openSignupForm, setOpenSignupForm] = useState<boolean>(false);
  const [showLogInPanel, setShowLogInPanel] = useState<boolean>(false);

  return !signedIn ? (
    <footer className="signup-footer-container">
      <div className="footer-block"></div>
      <div className="signup-footer-wrapper">
        <div className="signup-text-group">
          <h1>Don't miss what's happening</h1>
          <p>People on Ribbity are the first to know.</p>
        </div>
        <div className="signup-button-group">
          <button
            className="login-button"
            onClick={() => {
              setShowLogInPanel(true);
              setOpenSignupForm(true);
            }}
          >
            Log in
          </button>
          <button
            className="signup-button"
            onClick={() => {
              setShowLogInPanel(false);
              setOpenSignupForm(true);
            }}
          >
            Sign up
          </button>
        </div>
      </div>
      <SignUpNativePopup
        isVisible={openSignupForm}
        setOwnVisibility={setOpenSignupForm}
        openAsLogin={showLogInPanel}
      />
    </footer>
  ) : null;
};

export default SignUpFooter;
