import { useLoaderData } from "react-router-dom";
import { MatchLoaderOutput } from "../../../routes/loaders/MatchLoader.ts";

const MatchView = () => {
  const {data: match} = useLoaderData<MatchLoaderOutput>();
  return (
    <div className={"bg-gray-200"}>
    <h3>{ match.venue}</h3>
    </div>
  )
}
export default MatchView;