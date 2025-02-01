import Button from "../../../components/button/Button.tsx";

const LoggedOutArea = () => {

  const handleLogin = () => {
    console.log('login');
  }
  const handleSignUp = () => {
    console.log('signup');
  }

  return (
    <div className="flex items-center gap-4">
      <Button buttonType="cta" onClick={handleLogin}>Log In</Button>
      <Button buttonType="cta" onClick={handleSignUp}>Sign Up</Button>
    </div>
  )
}
export default LoggedOutArea;