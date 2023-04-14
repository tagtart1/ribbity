import { useContext, useState } from "react";
import "../../styles/UserTabMobileFixed.css";
import AppContext from "../AppContext";
import LongPopupNavbarMobile from "./LongPopupNavbarMobile";
import { AnimatePresence } from "framer-motion";
import FrogIconLogo from "../Misc/FrogIconLogo";

const UserTabMobileFixed = () => {
  const { mainUser }: any = useContext(AppContext);

  const [showNavbar, setShowNavbar] = useState<boolean>(false);
  if (!mainUser.userHandle)
    return (
      <div className="user-tab-mobile-container">
        <FrogIconLogo />
      </div>
    );
  return (
    <div className="user-tab-mobile-container">
      <img
        src={mainUser.profileImgUrl}
        alt="User profile"
        onClick={() => {
          setShowNavbar(true);
        }}
      />

      <LongPopupNavbarMobile
        isVisible={showNavbar}
        setVisibility={setShowNavbar}
        mainUser={mainUser}
      />
    </div>
  );
};

export default UserTabMobileFixed;
