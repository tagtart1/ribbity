import { useState, useEffect, ReactNode, useContext } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { toast } from "react-hot-toast";
import "../../styles/RibbityGreenPopup.css";

import ReactDOM from "react-dom";
import CloseCross from "../../media/svg/CloseCross";

import RibbityVerifyBadge from "../../media/TexturedVerifiedBadgeImage.png";
import GreenCheckMark from "../../media/GreenCheckMarkImage.png";
import { RibbityUser } from "../../Ribbity.types";
import AppContext from "../AppContext";
import {
  DocumentReference,
  Query,
  QuerySnapshot,
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../scripts/firebaseConfig";
import Spinner from "./Spinner";
import { useNavigate } from "react-router-dom";

interface RibbityGreenPopupProps {
  isVisible: boolean;
  setOwnVisibility: Function;
}

interface TabProps {
  activeTab: number;
  children: ReactNode;
  setActiveTab: Function;
  tabNum: number;
}

interface AppContextProps {
  mainUser: RibbityUser;
  setMainUser: Function;
}

const RibbityGreenPopup = ({
  isVisible,
  setOwnVisibility,
}: RibbityGreenPopupProps) => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { mainUser, setMainUser }: AppContextProps = useContext(AppContext);
  const popupRoot: HTMLElement | null = document.getElementById("popup-root");
  const navigate = useNavigate();
  const notifySuccess = () => toast("You are now verified!");
  const notifyError = () =>
    toast.error("Something went wrong with your verification.");
  const notifyUnverified = () => toast("You are no longer verified!");
  const fadeVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };
  const scaleVariants: Variants = {
    hidden: { scale: 0 },
    visible: { scale: 1 },
  };

  const giveUserVerificationBadge = async (): Promise<void> => {
    const mainUserDocRef: DocumentReference = doc(db, "user-info", mainUser.id);
    // Update isVerified field to true in the user's document
    setIsLoading(true);

    let verificationStatus = mainUser.isVerified ? false : true;
    try {
      await updateDoc(mainUserDocRef, {
        isVerified: verificationStatus,
      });
      // To avoid refethcing the data we can just set the state directly for a faster solution
      setMainUser((prevUser: RibbityUser) => ({
        ...prevUser,
        isVerified: verificationStatus,
      }));
      // Update all the user's ribbits with isVerified field to true
      const q: Query = query(
        collection(db, "ribbits"),
        where("handle", "==", mainUser.userHandle)
      );
      const ribbits: QuerySnapshot = await getDocs(q);
      ribbits.forEach(async (docSnap: any) => {
        const docRef: DocumentReference = doc(db, "ribbits", docSnap.id);
        await updateDoc(docRef, {
          isVerified: verificationStatus,
        });
      });
    } catch (error) {
      notifyError();
      setIsLoading(false);
      return;
    }
    if (verificationStatus) {
      notifySuccess();
    } else notifyUnverified();
    if (window.location.pathname === `/${mainUser.userHandle}`) {
      navigate(`/${mainUser.userHandle}/ribbits`);
    } else {
      navigate(`/${mainUser.userHandle}`);
    }

    setOwnVisibility(false);
    setIsLoading(false);
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
          role="dialog"
          aria-modal="true"
        >
          <motion.div
            className="ribbity-green-popup-main"
            variants={scaleVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
          >
            <div className="top-header">
              <button
                className="close-button"
                onClick={(e) => {
                  setOwnVisibility();
                  document.documentElement.style.overflowY = "visible";
                }}
                aria-label="close popup"
              >
                <CloseCross />
              </button>
              <div className="ribbity-green-header-text">
                <span>Green</span>
              </div>
            </div>
            {isLoading ? (
              <div className="loading-spinner">
                <Spinner />
              </div>
            ) : (
              <div className="ribbity-green-content">
                <div className="ribbity-green-briefing-section">
                  <p>
                    {mainUser.isVerified
                      ? `Looks like you are already verified. Pretty cool isn't it? Click the button again to go back to being a chump`
                      : ` Ribbity users can simply get this super awesome green
                    checkmark once they click that button at the bottom.`}
                  </p>
                  <img src={RibbityVerifyBadge} alt="Verified badge" />
                </div>
                <div className="ribbity-green-pricing-bar">
                  <Tab
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    tabNum={0}
                  >
                    Free <span className="discounted-pricing ">SAVE 100%</span>
                  </Tab>
                  <Tab
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    tabNum={1}
                  >
                    Ultra-Free
                  </Tab>
                </div>
                <div className="ribbity-green-feature-box">
                  <div className="top">
                    <span>Green</span>
                    <img src={GreenCheckMark} alt="Green Checkmark" />
                  </div>
                  <ul className="feature-list">
                    <li>Look cool to others with your badge.</li>
                    <li>
                      All you have to do is click the button below. Yes, really
                      – do it now! You won't regret it!
                    </li>
                    <li>
                      It's also FREE, unlike our competitors who charge
                      $8/month.
                    </li>
                    <li>
                      Sadly, there are no additional features – at least not
                      yet.
                    </li>
                    <li>
                      Come on, click the button below. There's no going back!
                    </li>
                  </ul>
                </div>
                <button
                  className="toggle-verification-button"
                  onClick={giveUserVerificationBadge}
                >
                  {mainUser.isVerified ? "Unverify me! " : "Verify me!"}
                </button>
                <p className="tos-text">
                  By subscribing, you agree to our{" "}
                  <span className="fake-link">Absolutely Nothing</span> policy.
                  Subscriptions don't auto renew as this is free, as described
                  in the Absolutely Nothing policy. Cancel anytime. A verified
                  phone number is not required to be verified. If you don't like
                  the badge then come back here to get rid of it.
                </p>
                <div className="grainy-rectangle"></div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    popupRoot
  );
};

const Tab = ({ activeTab, children, setActiveTab, tabNum }: TabProps) => {
  return (
    <div
      className={`pricing-option ${activeTab === tabNum ? "selected" : ""}`}
      onClick={() => setActiveTab(tabNum)}
    >
      {children}
    </div>
  );
};

export default RibbityGreenPopup;
