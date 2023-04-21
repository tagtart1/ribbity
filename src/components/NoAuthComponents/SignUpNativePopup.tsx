import CloseCross from "../../media/svg/CloseCross";
import "../../styles/SignUpNativePopup.css";
import ReactDOM from "react-dom";
import FrogIconLogo from "../Misc/FrogIconLogo";
import GoogleLogoIcon from "../../media/svg/GoogleLogoIcon";
import { signIn } from "../../scripts/firebaseHelperFns";
import { RibbityUser } from "../../Ribbity.types";
import { NavigateFunction, useNavigate } from "react-router-dom";
import AppContext from "../AppContext";
import { useContext } from "react";
import SignUpNativeSignupOptions from "./SignUpNativeSignupOptions";
import CreateAccount from "./CreateAccount";

interface SignUpNativePopupProps {
  isVisible: boolean;
  setOwnVisibility: Function;
}

const SignUpNativePopup = ({
  isVisible,
  setOwnVisibility,
}: SignUpNativePopupProps) => {
  const navigate: NavigateFunction = useNavigate();

  const popupRoot = document.getElementById("popup-root");
  if (!popupRoot || !isVisible) return null;
  return ReactDOM.createPortal(
    <div className="signup-native-popup-container">
      <div className="signup-native-popup-main">
        <div
          className="close-button"
          onClick={() => {
            setOwnVisibility(false);
          }}
        >
          <CloseCross />
        </div>
        <CreateAccount />
      </div>
    </div>,
    popupRoot
  );
};

export default SignUpNativePopup;
