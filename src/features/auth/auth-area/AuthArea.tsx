import User from "../models/User.ts";
import LoggedInArea from "../logged-in-area/LoggedInArea.tsx";
import LoggedOutArea from "../logged-out-area/LoggedOutArea.tsx";

const AuthArea = () => {
  const user: User | null =
    null;
    // {
    //   email: "alon@gmail.com",
    //   id: 0,
    //   firstName: "Alon ",
    //   lastName: "Benakot",
    //   priorFootballKnowledge: false
    // };

  return (
    user ? <LoggedInArea/> : <LoggedOutArea/>
  )
}
export default AuthArea;