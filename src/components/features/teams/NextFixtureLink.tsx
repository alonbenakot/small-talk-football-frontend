import {Link} from "react-router-dom";
import {NextFixture} from "./models/TeamOneLiner.ts";

type Props = {
  fixture: NextFixture;
};

const kickOff = (fixture: NextFixture) =>
    new Date(fixture.kickOff).toLocaleDateString("en-GB", {day: "2-digit", month: "2-digit", year: "2-digit"});

const NextFixtureLink = ({fixture}: Props) => {
  return (
      <div className="text-sm text-gray-900">
        <span className="text-gray-600">Next: </span>
        <Link to={`/matches/${fixture.fixtureId}`} className="text-emerald-600 font-semibold">
          {fixture.home ? "vs" : "at"} {fixture.opponent} · {kickOff(fixture)}
        </Link>
      </div>
  );
};

export default NextFixtureLink;
