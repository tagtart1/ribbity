import { useContext } from "react";
import "../../styles/SignUpFooter.css";
import AppContext from "../AppContext";
import { signIn } from "../../scripts/firebaseHelperFns";
import { useNavigate } from "react-router-dom";

interface SignUpFooterProps {
  signedIn?: boolean;
}

interface AppContextProps {
  setMainUser: Function;
  loadingHandler: Function;
}

const SignUpFooter = ({ signedIn }: SignUpFooterProps) => {
  const { setMainUser, loadingHandler }: AppContextProps =
    useContext(AppContext);

  const navigate = useNavigate();

  const signInHandle = async () => {
    const newUser = await signIn(loadingHandler);
    if (newUser) setMainUser(newUser);
    navigate("/home");
  };

  return !signedIn ? (
    <div className="signup-footer-container">
      <div className="footer-block"></div>
      <div className="signup-footer-wrapper">
        <div className="signup-text-group">
          <h1>Don't miss what's happening</h1>
          <p>People on Tweety are the first to know.</p>
        </div>
        <div className="signup-button-group">
          <button className="login-button" onClick={signInHandle}>
            Log in
          </button>
          <button className="signup-button" onClick={signInHandle}>
            Sign up
          </button>
        </div>
      </div>
    </div>
  ) : null;
};

export default SignUpFooter;
