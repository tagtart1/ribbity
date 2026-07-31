import { NavigateFunction, useNavigate } from "react-router-dom";
import CloseCross from "../../media/svg/CloseCross";
import "../../styles/LongPopupNavbarMobile.css";
import ReactDOM from "react-dom";
import ProfileIcon from "../../media/svg/ProfileIcon";

import NotifcationsIcon from "../../media/svg/NotificationsIcon";
import MessagesIcon from "../../media/svg/MessagesIcon";
import { signOutUser } from "../../scripts/firebaseHelperFns";
import BookmarksIcon from "../../media/svg/BookmarksIcon";
import { useEffect } from "react";
import { AnimatePresence, motion, Variants } from "framer-motion";
import { RibbityUser } from "../../Ribbity.types";
import FrogIconLogo from "../Misc/FrogIconLogo";
import RibbityGreenPopup from "../Misc/RibbityGreenPopup";
import { useState } from "react";
import RibbityVerifyIcon from "../../media/svg/RibbityVerifyIcon";

interface LongPopupNavbarMobileProps {
  isVisible: boolean;
  setVisibility: Function;
  mainUser: RibbityUser;
}

// Type aliases
type ClickDivEvent = React.MouseEvent<HTMLDivElement>;

const LongPopupNavbarMobile = ({
  isVisible,
  setVisibility,
  mainUser,
}: LongPopupNavbarMobileProps) => {
  const navigate: NavigateFunction = useNavigate();
  const [showRibbityGreenPopup, setShowRibbityGreenPopup] =
    useState<boolean>(false);
  const closePopup = (): void => {
    setVisibility(false);
  };

  const handleResizeClose = (): void => {
    if (window.innerWidth > 500) {
      closePopup();
    }
  };

  const closePopupOffside = (e: ClickDivEvent): void => {
    if (e.target === e.currentTarget) {
      closePopup();
    }
  };

  const fadeIn: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const slideIn: Variants = {
    hidden: { x: "-100%" },
    visible: { x: 0 },
  };

  useEffect(() => {
    window.addEventListener("resize", handleResizeClose);
    return () => {
      window.removeEventListener("resize", handleResizeClose);
    };
  }, []);

  const popupRoot: HTMLElement | null = document.getElementById("popup-root");
  if (!popupRoot) return null;
  return ReactDOM.createPortal(
    <AnimatePresence>
      {isVisible && (
        <>
          <motion.div
            className="popup-mobile-nav-container "
            onClick={closePopupOffside}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.25 }}
            variants={fadeIn}
            key="fdjske"
          ></motion.div>
          <motion.nav
            className="popup-mobile-nav-main"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={slideIn}
            transition={{ duration: 0.25 }}
            key="934js"
          >
            <div className="popup-mobile-nav-top">
              <h1>Account info</h1>
              <div className="svg-wrapper" onClick={closePopup}>
                <CloseCross />
              </div>
            </div>
            <div className="popup-mobile-nav-account-info">
              <img
                src={mainUser.profileImgUrl}
                alt="user profile"
                onClick={() => navigate(`/${mainUser.userHandle}`)}
              />
              <p
                className="user-name"
                onClick={() => navigate(`/${mainUser.userHandle}`)}
              >
                {mainUser.userName}
                {mainUser.isVerified ? <RibbityVerifyIcon /> : null}
              </p>

              <p
                className="user-handle"
                onClick={() => navigate(`/${mainUser.userHandle}`)}
              >
                @{mainUser.userHandle}
              </p>
              <div className="follower-counts">
                <div
                  onClick={() => navigate(`/${mainUser.userHandle}/following`)}
                >
                  <span style={{ color: "white" }}>
                    {Object.keys(mainUser.following).length - 1}
                  </span>{" "}
                  Following
                </div>
                <div
                  onClick={() => navigate(`/${mainUser.userHandle}/followers`)}
                >
                  <span style={{ color: "white" }}>
                    {Object.keys(mainUser.followers).length}
                  </span>{" "}
                  Followers
                </div>
              </div>
            </div>
            <ul className="popup-mobile-nav-actual">
              <li
                onClick={() => {
                  setVisibility(false);
                  navigate(`/${mainUser.userHandle}`);
                }}
              >
                <ProfileIcon />
                <h2>Profile</h2>
              </li>
              <li
                onClick={() => {
                  setShowRibbityGreenPopup(true);
                }}
              >
                <FrogIconLogo />
                <h2>Ribbity Blue</h2>
              </li>
              <li onClick={() => navigate(`/notifications`)}>
                <NotifcationsIcon />
                <h2>Notificatons</h2>
              </li>
              <li onClick={() => navigate(`/messages`)}>
                <MessagesIcon />
                <h2>Messages</h2>
              </li>
              <li onClick={() => navigate(`/bookmarks`)}>
                <BookmarksIcon />
                <h2>Bookmarks</h2>
              </li>
            </ul>
            <div className="popup-mobile-nav-misc">
              <p
                onClick={() => {
                  signOutUser();

                  navigate("/");
                }}
              >
                Logout
              </p>
            </div>
          </motion.nav>
        </>
      )}
      <RibbityGreenPopup
        isVisible={showRibbityGreenPopup}
        setOwnVisibility={setShowRibbityGreenPopup}
        key={"d0333"}
      />
    </AnimatePresence>,
    popupRoot
  );
};

export default LongPopupNavbarMobile;
