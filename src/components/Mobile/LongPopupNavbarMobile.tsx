import { useNavigate } from "react-router-dom";
import CloseCross from "../../media/svg/CloseCross";
import "../../styles/LongPopupNavbarMobile.css";
import ReactDOM from "react-dom";
import ProfileIcon from "../../media/svg/ProfileIcon";
import TweetyBlueIcon from "../../media/svg/TweetyBlueIcon";
import NotifcationsIcon from "../../media/svg/NotificationsIcon";
import MessagesIcon from "../../media/svg/MessagesIcon";
import { signOutUser } from "../../scripts/firebaseHelperFns";
import BookmarksIcon from "../../media/svg/BookmarksIcon";
import { useEffect } from "react";
import { AnimatePresence, motion, Variants } from "framer-motion";

interface LongPopupNavbarMobileProps {
  isVisible: boolean;
  setVisibility: Function;
  mainUser: any;
}

const LongPopupNavbarMobile = ({
  isVisible,
  setVisibility,
  mainUser,
}: LongPopupNavbarMobileProps) => {
  const navigate = useNavigate();

  const closePopup = () => {
    setVisibility(false);
  };

  const closePopupOffside = (e: any) => {
    if (e.target === e.currentTarget) {
      closePopup();
    }
  };

  const handleResizeClose = () => {
    if (window.innerWidth > 500) {
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

  const popupRoot = document.getElementById("popup-root");
  if (!popupRoot) return null;
  return ReactDOM.createPortal(
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="popup-mobile-nav-container "
          onClick={closePopupOffside}
          initial="hidden"
          animate="visible"
          exit="hidden"
          transition={{ duration: 0.25 }}
          variants={fadeIn}
        >
          <motion.div
            className="popup-mobile-nav-main"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={slideIn}
            transition={{ duration: 0.5 }}
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
              <li onClick={() => navigate(`/${mainUser.userHandle}`)}>
                <ProfileIcon />
                <h2>Profile</h2>
              </li>
              <li>
                <TweetyBlueIcon />
                <h2>Tweety Blue</h2>
              </li>
              <li>
                <NotifcationsIcon />
                <h2>Notificatons</h2>
              </li>
              <li>
                <MessagesIcon />
                <h2>Messages</h2>
              </li>
              <li>
                <BookmarksIcon />
                <h2>Bookmarks</h2>
              </li>
            </ul>
            <div className="popup-mobile-nav-misc">
              <p onClick={signOutUser}>Logout</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    popupRoot
  );
};

export default LongPopupNavbarMobile;
