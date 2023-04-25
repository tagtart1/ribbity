import ReactDOM from "react-dom";
import "../../styles/SignupPopup.css";
import { signIn } from "../../scripts/firebaseHelperFns";
import { useContext } from "react";
import AppContext from "../AppContext";
import { NavigateFunction, useNavigate } from "react-router-dom";
import DislikeIconFilled from "../../media/svg/DislikeIconFilled";
import CloseCross from "../../media/svg/CloseCross";
import LikeIconFilled from "../../media/svg/LikeIconFilled";
import FollowUserHollow from "../../media/svg/FollowUserHollow";
import { RibbityUser } from "../../Ribbity.types";
import { useState } from "react";
import ReRibbitIconColor from "../../media/svg/ReRibbitIconColor";
import SignUpNativePopup from "../NoAuthComponents/SignUpNativePopup";

interface SignupPopupProps {
  userName: string;
  visibility: boolean;
  setOwnVisibility: Function;
  popupType: string;
}

interface AppContextProps {
  setMainUser: Function;
  loadingHandler: Function;
}

type IconsObject = {
  [key: string]: React.ReactNode;
};

type TextsObjects = {
  [key: string]: string;
};

// Type aliases
type ClickDivEvent = React.MouseEvent<HTMLDivElement>;
// Component triggers popup when the user is not signed in and attempts to do actions
const SignupPopup = ({
  userName,
  visibility,
  setOwnVisibility,
  popupType,
}: SignupPopupProps) => {
  const { setMainUser, loadingHandler }: AppContextProps =
    useContext(AppContext);

  const [openSignupForm, setOpenSignupForm] = useState<boolean>(false);
  const [openAsLogin, setOpenAsLogin] = useState<boolean>(false);

  const icons: IconsObject = {
    dislike: <DislikeIconFilled />,
    like: <LikeIconFilled />,
    follow: <FollowUserHollow />,
    reribbit: <ReRibbitIconColor />,
  };

  const headerTexts: TextsObjects = {
    dislike: "Dislike a Ribbit to share the love.",
    like: "Like a Ribbit to share the love.",
    follow: `Follow ${userName} to see what they share on Ribbity.`,
    reribbit: `Reribbit this to spread the word.`,
  };

  const paraTexts: TextsObjects = {
    dislike: `Join Ribbity now to let ${userName} know you dislike their Ribbit.`,
    like: `Join Ribbity now to let ${userName} know you like their Ribbit.`,
    follow: "Sign up so you never miss their Ribbits.",
    reribbit: `Join Ribbit now to share ${userName}'s Ribbit.`,
  };

  const navigate: NavigateFunction = useNavigate();
  const popupRoot: HTMLElement | null = document.getElementById("popup-root");

  const handleClickAwayCancel = (e: ClickDivEvent): void => {
    if (e.target === e.currentTarget && e.buttons === 1) {
      setOwnVisibility();
      document.documentElement.style.overflowY = "visible";
    }
  };

  if (!visibility || !popupRoot) return null;
  document.documentElement.style.overflowY = "hidden";

  return ReactDOM.createPortal(
    <div className="signup-popup-wrapper" onMouseDown={handleClickAwayCancel}>
      <section className="signup-popup-main">
        <div
          className="close-button"
          onMouseDown={(e) => {
            setOwnVisibility();
            document.documentElement.style.overflowY = "visible";
          }}
        >
          <CloseCross />
        </div>
        {icons[popupType]}
        <div className="text-group">
          <h1>{headerTexts[popupType]}</h1>
          <p>{paraTexts[popupType]}</p>
        </div>
        <div className="button-group">
          <button
            className="log-in-button"
            onClick={() => {
              setOpenAsLogin(true);
              setOpenSignupForm(true);
            }}
          >
            Log in
          </button>
          <button
            className="sign-up-button"
            onClick={() => {
              setOpenAsLogin(false);
              setOpenSignupForm(true);
            }}
          >
            Sign up
          </button>
        </div>
      </section>
      <SignUpNativePopup
        isVisible={openSignupForm}
        setOwnVisibility={setOpenSignupForm}
        openAsLogin={openAsLogin}
      />
    </div>,
    popupRoot
  );
};

export default SignupPopup;
