import { useState, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { toast } from "react-hot-toast";
import "../../styles/RibbityGreenPopup.css";

import ReactDOM from "react-dom";

interface RibbityGreenPopupProps {
  isVisible: boolean;
  setOwnVisibility: Function;
}

const RibbityGreenPopup = ({
  isVisible,
  setOwnVisibility,
}: RibbityGreenPopupProps) => {
  const popupRoot: HTMLElement | null = document.getElementById("popup-root");

  const notifySuccess = () => toast("You are now verified!.");
  const notifyError = () =>
    toast.error("Something went wrong with your verification.");

  const fadeVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const scaleVariants: Variants = {
    hidden: { scale: 0 },
    visible: { scale: 1 },
  };

  useEffect(() => {
    if (isVisible) document.documentElement.style.overflowY = "hidden";
    else document.documentElement.style.overflowY = "visible";

    return () => {
      document.documentElement.style.overflowY = "visible";
    };
  }, [isVisible]);

  if (!popupRoot) return null;
  return ReactDOM.createPortal(
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="ribbity-green-popup-container"
          variants={fadeVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <motion.div
            className="ribbity-green-popup-main"
            variants={scaleVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
          ></motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    popupRoot
  );
};

export default RibbityGreenPopup;
