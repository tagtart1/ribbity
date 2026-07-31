import "../../styles/CreateAccount.css";
import { useContext, useEffect, useRef, useState } from "react";
import { createUserNative } from "../../scripts/firebaseHelperFns";
import AppContext from "../AppContext";
import { RibbityUser } from "../../Ribbity.types";
import { useNavigate } from "react-router-dom";
import ShowPasswordCheckbox from "./ShowPasswordCheckbox";

interface AppContextPros {
  loadingHandler: Function;
  setMainUser: Function;
}

const CreateAccount = () => {
  const submitButtonRef: any = useRef(null);
  const nameInputRef: any = useRef(null);
  const emailInputRef: any = useRef(null);
  const passwordInputRef: any = useRef(null);
  const navigate = useNavigate();
  const { loadingHandler, setMainUser }: AppContextPros =
    useContext(AppContext);
  const [isNameValid, setIsNameValid] = useState<boolean>(false);
  const [isEmailValid, setIsEmailValid] = useState<boolean>(false);
  const [isPasswordValid, setIsPasswordValid] = useState<boolean>(false);

  let timer: any;

  useEffect(() => {
    submitButtonRef.current.classList.add("locked-button");
  }, []);

  useEffect(() => {
    // Check when to unlock the submit button after every input function updates the state of the over-all form's validity
    const checkUnlockSubmitButton = (): void => {
      if (!isNameValid || !isEmailValid || !isPasswordValid) {
        submitButtonRef.current.classList.add("locked-button");
      } else {
        submitButtonRef.current.classList.remove("locked-button");
      }
    };
    checkUnlockSubmitButton();
  }, [isNameValid, isEmailValid, isPasswordValid]);

  // Create the account and then set the user state with the app context
  const handleAccountCreation = async (e: any): Promise<void> => {
    e.preventDefault();
    if (!isEmailValid || !isNameValid || !isPasswordValid) return;
    // This function should return a user and set the current with the appContext then ur done bam
    const newUser: RibbityUser | null | undefined = await createUserNative(
      nameInputRef.current.value,
      emailInputRef.current.value,
      passwordInputRef.current.value,
      loadingHandler
    );
    if (newUser) setMainUser(newUser);
    navigate("/home");
  };

  // Checks if the user name is empty
  const handleUsernameValidation = (): void => {
    if (nameInputRef.current) {
      if (!nameInputRef.current.value.replace(/\s/g, "").length) {
        nameInputRef.current.parentElement.parentElement.classList.add(
          "invalid-input",
          "invalid-create-name"
        );
        setIsNameValid(false);
      } else {
        nameInputRef.current.parentElement.parentElement.classList.remove(
          "invalid-input",
          "invalid-create-name"
        );
        setIsNameValid(true);
      }
    }
  };
  // First checks if the email field follows the validity of the HTML element. If valid then it checks if its empty then sets the valid states. If its not valid then it just sets valid state to false and then applies the invalid styles 1 second later
  const handleEmailValidation = (e: any): void => {
    if (emailInputRef.current) {
      if (timer) clearTimeout(timer);
      emailInputRef.current.parentElement.parentElement.classList.remove(
        "invalid-input",
        "invalid-create-email"
      );
      if (!emailInputRef.current.checkValidity()) {
        setIsEmailValid(false);
        console.log("invalid");
        timer = setTimeout(() => {
          // Invalid email
          if (emailInputRef.current.checkValidity()) return;
          setIsEmailValid(false);
          emailInputRef.current.parentElement.parentElement.classList.add(
            "invalid-input",
            "invalid-create-email"
          );
        }, 1000);
      }

      if (emailInputRef.current.checkValidity()) {
        console.log("valid");
        if (timer) clearTimeout(timer);
        emailInputRef.current.parentElement.parentElement.classList.remove(
          "invalid-input",
          "invalid-create-email"
        );
        // Check if its empty
        // Its okay to set the validity to unluck the submit button here because we are already checking for email validity above
        if (!emailInputRef.current.value.replace(/\s/g, "").length) {
          setIsEmailValid(false);
        } else {
          setIsEmailValid(true);
        }
      }
    }
  };
  // First checks if the email field follows the validity of the HTML element. If valid then it checks if its empty then sets the valid states. If its not valid then it just sets valid state to false and then applies the invalid styles 1 second later
  const handlePasswordValidation = (e: any): void => {
    if (passwordInputRef.current) {
      if (timer) clearTimeout(timer);
      passwordInputRef.current.parentElement.parentElement.classList.remove(
        "invalid-input",
        "invalid-create-password"
      );
      if (!passwordInputRef.current.checkValidity()) {
        setIsPasswordValid(false);
        timer = setTimeout(() => {
          // Invalid password
          if (passwordInputRef.current.checkValidity()) return;
          passwordInputRef.current.parentElement.parentElement.classList.add(
            "invalid-input",
            "invalid-create-password"
          );
        }, 1000);
      }

      if (passwordInputRef.current.checkValidity()) {
        if (timer) clearTimeout(timer);

        passwordInputRef.current.parentElement.parentElement.classList.remove(
          "invalid-input",
          "invalid-create-password"
        );
        if (!passwordInputRef.current.value.replace(/\s/g, "").length) {
          console.log("empty pass");
          setIsPasswordValid(false);
        } else {
          setIsPasswordValid(true);
        }
      }
    }
  };

  return (
    <div className="create-account-container">
      <h1>Create your account</h1>
      <form className="create-account-form" onSubmit={handleAccountCreation}>
        <div>
          <div className="create-input-wrapper">
            <input
              type="text"
              maxLength={16}
              id="create-name-input"
              placeholder=" "
              onChange={handleUsernameValidation}
              ref={nameInputRef}
            />
            <label htmlFor="create-name-input">Name</label>
          </div>
        </div>
        <div>
          <div className="create-input-wrapper">
            <input
              type="email"
              id="create-email-input"
              placeholder=" "
              onChange={handleEmailValidation}
              ref={emailInputRef}
            />
            <label htmlFor="create-email-input">Email</label>
          </div>
        </div>
        <div>
          <div className="create-input-wrapper">
            <input
              type="password"
              id="create-password-input"
              placeholder=" "
              onChange={handlePasswordValidation}
              ref={passwordInputRef}
              pattern="(?=.*\d)(?=.*[A-Z])(?=.*[@!$*])[A-Za-z\d@!$*#]{8,}"
              aria-describedby="password-requirements"
            />
            <label htmlFor="create-password-input">Password</label>
            <span id="password-requirements">
              Password requires 1 uppercase, 1 lowercase, 1 number, 1 symbol,
              and a length of 8
            </span>
          </div>
        </div>
        <ShowPasswordCheckbox passwordInputRef={passwordInputRef} />
        <button
          ref={submitButtonRef}
          type="submit"
          className="signup-submit-button"
        >
          Sign up
        </button>
      </form>
    </div>
  );
};

export default CreateAccount;
