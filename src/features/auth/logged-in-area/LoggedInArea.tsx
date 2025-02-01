import User from "../models/User.ts";
import Button from "../../../components/button/Button.tsx";

const LoggedInArea = () => {
  const user: User = {
    email: "alon@gmail.com",
    id: 0,
    firstName: "Alon ",
    lastName: "Benakot",
    priorFootballKnowledge: false
  };

  const handleLogout = () => {
    console.log("log out")
  }
  return (
    <div className="flex items-center gap-4">
      <h4 className="text-slate-300">Hi { user.firstName }</h4>
      <Button buttonType="primary" onClick={ handleLogout }>Logout</Button>
    </div>
  )
}
export default LoggedInArea;