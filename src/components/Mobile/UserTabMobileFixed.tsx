import { useContext, useState } from "react";
import "../../styles/UserTabMobileFixed.css";
import AppContext from "../AppContext";
import LongPopupNavbarMobile from "./LongPopupNavbarMobile";

import FrogIconLogo from "../Misc/FrogIconLogo";
import { RibbityUser } from "../../Ribbity.types";

interface AppContextProps {
  mainUser: RibbityUser;
}

const UserTabMobileFixed = () => {
  const { mainUser }: AppContextProps = useContext(AppContext);

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
