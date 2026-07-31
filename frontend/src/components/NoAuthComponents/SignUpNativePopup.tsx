import CloseCross from "../../media/svg/CloseCross";
import "../../styles/SignUpNativePopup.css";
import ReactDOM from "react-dom";

import SignUpNativeSignupOptions from "./SignUpNativeSignupOptions";
import CreateAccount from "./CreateAccount";
import { useEffect, useState } from "react";
import LogInAccountOptions from "./LogInAccountOptions";
import { motion, AnimatePresence, Variants } from "framer-motion";
interface SignUpNativePopupProps {
  isVisible: boolean;
  setOwnVisibility: Function;
  openAsLogin: boolean;
  showCreateAccountInitial?: boolean;
}

const SignUpNativePopup = ({
  isVisible,
  setOwnVisibility,
  openAsLogin,
  showCreateAccountInitial,
}: SignUpNativePopupProps) => {
  const [showCreateAccount, setShowCreateAccount] = useState<boolean>(false);
  const [toggleLogInPanel, setToggleLogInPanel] =
    useState<boolean>(openAsLogin);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const contentVariants: Variants = {
    hidden: { scale: 0 },
    visible: { scale: 1 },
  };

  useEffect(() => {
    setToggleLogInPanel(openAsLogin);
  }, [openAsLogin]);

  useEffect(() => {
    if (isVisible) document.documentElement.style.overflowY = "hidden";
    else document.documentElement.style.overflowY = "visible";

    return () => {
      document.documentElement.style.overflowY = "visible";
    };
  }, [isVisible]);

  const popupRoot = document.getElementById("popup-root");
  if (!popupRoot) return null;
  return ReactDOM.createPortal(
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="signup-native-popup-container"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={containerVariants}
          role="dialog"
          aria-modal="true"
        >
          <motion.div
            className="signup-native-popup-main"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={contentVariants}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
          >
            <button
              className="close-button"
              onClick={() => {
                setOwnVisibility(false);
                setShowCreateAccount(false);
              }}
              aria-label="close popup"
            >
              <CloseCross />
            </button>
            {toggleLogInPanel ? (
              <LogInAccountOptions setToggleLogInPanel={setToggleLogInPanel} />
            ) : showCreateAccount || showCreateAccountInitial ? (
              <CreateAccount />
            ) : (
              <SignUpNativeSignupOptions
                setShowCreateAccount={setShowCreateAccount}
                setToggleLogInPanel={setToggleLogInPanel}
              />
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    popupRoot
  );
};

export default SignUpNativePopup;
