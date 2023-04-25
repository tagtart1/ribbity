import "../../styles/ShowPasswordCheckbox.css";

interface ShowPasswordCheckboxProps {
  passwordInputRef: any;
}

const ShowPasswordCheckbox = ({
  passwordInputRef,
}: ShowPasswordCheckboxProps) => {
  const toggleShowPassword = () => {
    if (passwordInputRef.current) {
      if (passwordInputRef.current.type === "password") {
        passwordInputRef.current.type = "text";
      } else {
        passwordInputRef.current.type = "password";
      }
    }
  };

  return (
    <div className="show-password-checkbox-container">
      <input
        type="checkbox"
        id="show-password-checkbox"
        onChange={toggleShowPassword}
      />
      <label htmlFor="show-password-checkbox">Show password</label>
    </div>
  );
};

export default ShowPasswordCheckbox;
