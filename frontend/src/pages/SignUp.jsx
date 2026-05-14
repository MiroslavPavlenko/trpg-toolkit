import SignUpForm from "../components/SignUpForm";
import TopBar from "../components/TopBar";
import "../style/SignUp.css";
function SignUp() {
  return (
    <div className="signup-page">
      <TopBar />
      <main className="signup-main">
        <SignUpForm />
      </main>
    </div>
  );
}

export default SignUp;
