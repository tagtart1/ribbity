import ReactDOM from "react-dom";
import "../../styles/SignupPopup.css";

import DislikeIconFilled from "../../media/svg/DislikeIconFilled";
import CloseCross from "../../media/svg/CloseCross";
import LikeIconFilled from "../../media/svg/LikeIconFilled";
import FollowUserHollow from "../../media/svg/FollowUserHollow";

import { useState } from "react";
import ReRibbitIconColor from "../../media/svg/ReRibbitIconColor";
import SignUpNativePopup from "./SignUpNativePopup";
import FrogIconLogo from "../Misc/FrogIconLogo";
import { Variants, motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";

interface SignupPopupProps {
  userName: string;
  visibility: boolean;
  setOwnVisibility: Function;
  popupType: string;
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
  const [openSignupForm, setOpenSignupForm] = useState<boolean>(false);
  const [openAsLogin, setOpenAsLogin] = useState<boolean>(false);

  const icons: IconsObject = {
    dislike: <DislikeIconFilled />,
    like: <LikeIconFilled />,
    follow: <FollowUserHollow />,
    reribbit: <ReRibbitIconColor />,
    invalidRoute: <FrogIconLogo />,
  };

  const headerTexts: TextsObjects = {
    dislike: "Dislike a Ribbit to share the love.",
    like: "Like a Ribbit to share the love.",
    follow: `Follow ${userName} to see what they share on Ribbity.`,
    reribbit: `Reribbit this to spread the word.`,
    invalidRoute: `Don't miss what's happening`,
  };

  const paraTexts: TextsObjects = {
    dislike: `Join Ribbity now to let ${userName} know you dislike their Ribbit.`,
    like: `Join Ribbity now to let ${userName} know you like their Ribbit.`,
    follow: "Sign up so you never miss their Ribbits.",
    reribbit: `Join Ribbit now to share ${userName}'s Ribbit.`,
    invalidRoute: `People on Ribbity are the first to know.`,
  };

  const wrapperVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const mainVariants: Variants = {
    hidden: { scale: 0 },
    visible: { scale: 1 },
  };

  const popupRoot: HTMLElement | null = document.getElementById("popup-root");

  const handleClickAwayCancel = (e: ClickDivEvent): void => {
    if (e.target === e.currentTarget) {
      setOwnVisibility(false);
      console.log("closing");
    }
  };

  useEffect(() => {
    if (visibility) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [visibility]);

  if (!popupRoot) return null;

  return ReactDOM.createPortal(
    <AnimatePresence>
      {visibility && (
        <motion.div
          className="signup-popup-wrapper"
          onClick={handleClickAwayCancel}
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={wrapperVariants}
          role="dialog"
          aria-modal="true"
        >
          <motion.section
            className="signup-popup-main"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={mainVariants}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
          >
            <div
              className="close-button"
              onClick={(e) => {
                setOwnVisibility(false);
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
          </motion.section>
          <SignUpNativePopup
            isVisible={openSignupForm}
            setOwnVisibility={setOpenSignupForm}
            openAsLogin={openAsLogin}
          />
        </motion.div>
      )}
    </AnimatePresence>,
    popupRoot
  );
};

export default SignupPopup;
