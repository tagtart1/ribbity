import { useNavigate } from "react-router-dom";
import FrogIconLogo from "../Misc/FrogIconLogo";
import GoogleLogoIcon from "../../media/svg/GoogleLogoIcon";
import AppContext from "../AppContext";

import { useContext } from "react";
import { RibbityUser } from "../../Ribbity.types";
import { signIn } from "../../scripts/firebaseHelperFns";

interface AppContextProps {
  setMainUser: Function;
  loadingHandler: Function;
}

interface SignUpNativeSignupOptionsProps {
  setShowCreateAccount: Function;
  setToggleLogInPanel: Function;
}

const SignUpNativeSignupOptions = ({
  setShowCreateAccount,
  setToggleLogInPanel,
}: SignUpNativeSignupOptionsProps) => {
  const { setMainUser, loadingHandler }: AppContextProps =
    useContext(AppContext);

  const navigate = useNavigate();

  const googleSignInHandle = async (): Promise<void> => {
    const newUser: RibbityUser | null | undefined = await signIn(
      loadingHandler
    );
    if (newUser) setMainUser(newUser);
    navigate("/home");
  };

  return (
    <>
      <FrogIconLogo />
      <h1>Join Ribbity Today</h1>
      <div className="action-buttons">
        <button className="signup-google" onClick={googleSignInHandle}>
          <GoogleLogoIcon />
          Sign up with Google
        </button>
        <div className="or-seperator">
          <span>or</span>
        </div>
        <button
          onClick={() => setShowCreateAccount(true)}
          className="signup-native-button"
        >
          Create account
        </button>
        <p className="disclaimer-text">
          By signing up, you agree to the{" "}
          <span className="fake-link">Terms of Service </span> and{" "}
          <span className="fake-link">Privacy Policy</span>, including{" "}
          <span className="fake-link">Cookie Use.</span>
        </p>
      </div>
      <p className="login-suggestion-text">
        Have an account already?{" "}
        <span
          className="switch-to-login-button"
          onClick={() => {
            setToggleLogInPanel(true);
          }}
        >
          Log in
        </span>
      </p>
    </>
  );
};

export default SignUpNativeSignupOptions;
