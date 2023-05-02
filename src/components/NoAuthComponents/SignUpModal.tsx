import "../../styles/SignUpModal.css";
import googleLogo from "../../media/google-icon.svg";

import { signIn } from "../../scripts/firebaseHelperFns";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { RibbityUser } from "../../Ribbity.types";
import SignUpNativePopup from "./SignUpNativePopup";
import { useState } from "react";

interface SignUpModalProps {
  setCurrentUser: Function;
  setIsLoadingUser: Function;
}

const SignUpModal = ({
  setCurrentUser,
  setIsLoadingUser,
}: SignUpModalProps) => {
  const navigate: NavigateFunction = useNavigate();
  const signInHandle = async (): Promise<void> => {
    const newUser: RibbityUser | null | undefined = await signIn(
      setIsLoadingUser
    );
    if (newUser) setCurrentUser(newUser);

    navigate("/home");
  };

  const [openSignupForm, setOpenSignupForm] = useState<boolean>(false);

  return (
    <aside className="signup-modal-container">
      <h2 className="signup-modal-header">New to Ribbity?</h2>
      <p className="signup-misc-text">
        Sign up now to get your own personalized timeline!
      </p>
      <button className="signup-google-button" onClick={signInHandle}>
        <img
          src={googleLogo}
          alt="google logo"
          className="signup-modal-icon"
        ></img>
        <span>Sign up with Google</span>
      </button>
      <button
        className="signup-generic-button"
        onClick={() => setOpenSignupForm(true)}
      >
        Create account
      </button>
      <p className="signup-misc-text">
        By signing up, you agree to the <a href=" ">Terms of Service</a> and
        <a href=" "> Privacy Policy</a>, including <a href=" "> Cookie Use.</a>
      </p>
      <SignUpNativePopup
        isVisible={openSignupForm}
        setOwnVisibility={setOpenSignupForm}
        openAsLogin={false}
        showCreateAccountInitial={true}
      />
    </aside>
  );
};

export default SignUpModal;
