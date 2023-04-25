import { useRef, useContext } from "react";
import GoogleLogoIcon from "../../media/svg/GoogleLogoIcon";
import "../../styles/LogInAccountOptions.css";
import FrogIconLogo from "../Misc/FrogIconLogo";
import { useState, useEffect } from "react";
import { signIn, signInUserNative } from "../../scripts/firebaseHelperFns";
import { toast } from "react-hot-toast";
import ShowPasswordCheckbox from "./ShowPasswordCheckbox";
import Spinner from "../Misc/Spinner";
import AppContext from "../AppContext";
import { useNavigate } from "react-router-dom";
import { RibbityUser } from "../../Ribbity.types";

interface LogInAccountOptionsProps {
  setToggleLogInPanel: Function;
}

interface AppContextProps {
  setMainUser: Function;
  setIsLoadingUser: Function;
}

const LogInAccountOptions = ({
  setToggleLogInPanel,
}: LogInAccountOptionsProps) => {
  const emailInputRef: any = useRef(null);
  const passwordInputRef: any = useRef(null);
  const submitLogInButtonRef: any = useRef(null);
  const { setMainUser, setIsLoadingUser }: AppContextProps =
    useContext(AppContext);
  const [isPasswordEmpty, setIsPasswordEmpty] = useState<boolean>(true);
  const [isEmailEmpty, setIsEmailEmpty] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const notifyLogInError = () => toast.error("Incorrect email or password");

  const navigate = useNavigate();

  const signInHandle = async (): Promise<void> => {
    const newUser: RibbityUser | null | undefined = await signIn(
      setIsLoadingUser
    );
    if (newUser) setMainUser(newUser);

    navigate("/home");
  };

  const handleSubmitLogin = async (e: any): Promise<void> => {
    e.preventDefault();
    if (isEmailEmpty || isPasswordEmpty || isLoading) return;
    setIsLoading(true);
    try {
      await signInUserNative(
        emailInputRef.current.value,
        passwordInputRef.current.value
      );
      navigate("/home");
    } catch (error) {
      notifyLogInError();
    }
    setIsLoading(false);
  };

  const handleEmailChange = (): void => {
    if (emailInputRef.current.value.trim().length === 0) {
      setIsEmailEmpty(true);
    } else setIsEmailEmpty(false);
  };

  const handlePasswordChange = (): void => {
    if (passwordInputRef.current.value.length === 0) {
      setIsPasswordEmpty(true);
    } else setIsPasswordEmpty(false);
  };

  useEffect(() => {
    const checkUnlockSubmitButton = (): void => {
      if (isEmailEmpty || isPasswordEmpty) {
        submitLogInButtonRef.current.classList.add("locked-button");
      } else {
        submitLogInButtonRef.current.classList.remove("locked-button");
      }
    };
    checkUnlockSubmitButton();
  }, [isEmailEmpty, isPasswordEmpty]);

  return (
    <div className="log-in-account-options-main">
      <FrogIconLogo />
      <h1 className="header">Sign in to Ribbity</h1>
      <button className="sign-in-provider-button" onClick={signInHandle}>
        <GoogleLogoIcon />
        Sign in with Google
      </button>
      <div className="or-seperator">
        <span>or</span>
      </div>
      <form className="log-in-input-form">
        <div className="log-in-input-wrapper">
          <input
            type="text"
            id="log-in-email-input"
            placeholder=" "
            ref={emailInputRef}
            onChange={handleEmailChange}
          />
          <label htmlFor="log-in-email-input">Email</label>
        </div>
        <div className="log-in-input-wrapper">
          <input
            type="password"
            id="log-in-password-input"
            placeholder=" "
            ref={passwordInputRef}
            onChange={handlePasswordChange}
          />
          <label htmlFor="log-in-password-input">Password</label>
        </div>
        <ShowPasswordCheckbox passwordInputRef={passwordInputRef} />
        <button
          type="submit"
          className="log-in-form-button"
          onClick={handleSubmitLogin}
          ref={submitLogInButtonRef}
        >
          {isLoading ? <Spinner /> : "Log in"}
        </button>
      </form>
      <p className="sign-up-redirect-call-to-action-text">
        Don't have an account?{" "}
        <span
          className="sign-up-redirect-link"
          onClick={() => setToggleLogInPanel(false)}
        >
          Sign up
        </span>
      </p>
    </div>
  );
};
export default LogInAccountOptions;
