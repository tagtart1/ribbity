import "../styles/SignUpModal.css";
import googleLogo from "../media/google-icon.svg";

import { signIn } from "./firebaseHelperFns";

const SignUpModal = () => {
  return (
    <div className="signup-modal-container">
      <h2 className="signup-modal-header">New to Tweety?</h2>
      <p className="signup-misc-text">
        Sign up now to get your own personalized timeline!
      </p>
      <button className="signup-google-button" onClick={signIn}>
        <img
          src={googleLogo}
          alt="google logo"
          className="signup-modal-icon"
        ></img>
        <span>Sign up with Google</span>
      </button>
      <button className="signup-generic-button">Create account</button>
      <p className="signup-misc-text">
        By signing up, you agree to the <a href=" ">Terms of Service</a> and
        <a href=" "> Privacy Policy</a>, including <a href=" "> Cookie Use.</a>
      </p>
    </div>
  );
};

export default SignUpModal;
