import "../styles/SignUpFooter.css";

interface SignUpFooterProps {
  signedIn?: boolean;
}

const SignUpFooter = ({ signedIn }: SignUpFooterProps) => {
  return !signedIn ? (
    <div className="signup-footer-container">
      <div className="signup-text-group">
        <h1>Don't miss what's happening</h1>
        <p>People on Tweety are the first to know.</p>
      </div>
      <div className="signup-button-group">
        <button className="login-button">Log in</button>
        <button className="signup-button">Sign up</button>
      </div>
    </div>
  ) : null;
};

export default SignUpFooter;
