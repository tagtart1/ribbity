import { useContext } from "react";
import "../../styles/SignUpFooter.css";
import AppContext from "../AppContext";
import { signIn } from "../../scripts/firebaseHelperFns";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { RibbityUser } from "../../Ribbity.types";
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

  const navigate: NavigateFunction = useNavigate();

  const signInHandle = async (): Promise<void> => {
    const newUser: RibbityUser | null | undefined = await signIn(
      loadingHandler
    );
    if (newUser) setMainUser(newUser);
    navigate("/home");
  };

  return !signedIn ? (
    <div className="signup-footer-container">
      <div className="footer-block"></div>
      <div className="signup-footer-wrapper">
        <div className="signup-text-group">
          <h1>Don't miss what's happening</h1>
          <p>People on Ribbity are the first to know.</p>
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
