import ReactDOM from "react-dom";
import "../../styles/SignupPopup.css";
import { signIn } from "../../scripts/firebaseHelperFns";
import { useContext } from "react";
import AppContext from "../AppContext";
import { useNavigate } from "react-router-dom";
import DislikeIconFilled from "../../media/svg/DislikeIconFilled";
import CloseCross from "../../media/svg/CloseCross";
import LikeIconFilled from "../../media/svg/LikeIconFilled";
import FollowUserHollow from "../../media/svg/FollowUserHollow";

interface SignupPopupProps {
  userName: string;
  visibility: boolean;
  setOwnVisibility: Function;
  popupType: string;
}

const SignupPopup = ({
  userName,
  visibility,
  setOwnVisibility,
  popupType,
}: SignupPopupProps) => {
  const { setMainUser, loadingHandler }: any = useContext(AppContext);

  const icons: any = {
    dislike: <DislikeIconFilled />,
    like: <LikeIconFilled />,
    follow: <FollowUserHollow />,
  };

  const headerTexts: any = {
    dislike: "Dislike a Twat to share the love.",
    like: "Like a Twat to share the love.",
    follow: `Follow ${userName} to see what they share on Tweety.`,
  };

  const paraTexts: any = {
    dislike: `Join Tweety now to let ${userName} know you dislike their Twat.`,
    like: `Join Tweety now to let ${userName} know you like their Twat.`,
    follow: "Sign up so you never miss their Twats.",
  };

  const navigate = useNavigate();
  const popupRoot = document.getElementById("popup-root");

  const signInHandle = async () => {
    const newUser = await signIn(loadingHandler);
    if (newUser) setMainUser(newUser);
    navigate("/home");
  };

  const handleClickAwayCancel = (e: any) => {
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
          <button className="log-in-button" onClick={signInHandle}>
            Log in
          </button>
          <button className="sign-up-button" onClick={signInHandle}>
            Sign up
          </button>
        </div>
      </section>
    </div>,
    popupRoot
  );
};

export default SignupPopup;
