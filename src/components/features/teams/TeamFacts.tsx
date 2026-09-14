import {Link} from "react-router-dom";
import {motion} from "motion/react";
import {FormEntry, NextFixture, Standing, TeamFacts as TeamFactsModel} from "./models/TeamOneLiner.ts";
import {formatString} from "../../../utils/FormatUtil.ts";

type Props = {
  facts: TeamFactsModel;
};

const resultClass: Record<FormEntry["result"], string> = {
  WIN: "text-emerald-600",
  DRAW: "text-gray-500",
  LOSS: "text-red-600",
};

const ordinal = (n: number) => {
  const rem = n % 100;
  if (rem >= 11 && rem <= 13) return "th";
  return ["th", "st", "nd", "rd"][n % 10] ?? "th";
};

const standingLine = (standing: Standing) =>
    `${standing.position}${ordinal(standing.position)} · ${standing.points} pts · ${standing.playedMatches} played · ` +
    `${standing.overall.wins}W-${standing.overall.draws}D-${standing.overall.losses}L`;

const kickOff = (fixture: NextFixture) =>
    new Date(fixture.kickOff).toLocaleDateString("en-GB", {day: "2-digit", month: "2-digit", year: "2-digit"});

const TeamFacts = ({facts}: Props) => {
  const primary = facts.standings[facts.primaryCompetition];
  const secondary = Object.values(facts.standings).find((s) => s.competition !== facts.primaryCompetition);

  return (
      <motion.div
          className="bg-white p-6 rounded-lg shadow-md mt-4"
          initial={{opacity: 0, y: 10}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.5}}
      >
        {primary &&
            <div className="mb-4">
              <div className="text-xs text-gray-600">{formatString(primary.competition)}</div>
              <div className="text-gray-900 font-bold text-lg">{standingLine(primary)}</div>
              {secondary &&
                  <div className="text-sm text-gray-600">
                    {formatString(secondary.competition)}: {standingLine(secondary)}
                  </div>
              }
            </div>
        }

        {facts.coach &&
            <div className="mb-4 text-sm text-gray-900">
              <span className="text-gray-600">Coach: </span>{facts.coach}
            </div>
        }

        {facts.recentForm.length > 0 &&
            <div className="mb-4">
              <div className="text-xs text-gray-600 mb-1">Recent form</div>
              <ul className="flex flex-wrap gap-2">
                {facts.recentForm.slice(0, 5).map((entry) => (
                    <li key={entry.date} className="bg-gray-50 rounded-full px-3 py-1 text-xs text-gray-900 shadow-sm">
                      <span className={`font-bold ${resultClass[entry.result]}`}>{entry.result.charAt(0)}</span>
                      {" "}{entry.score} {entry.home ? "vs" : "at"} {entry.opponent}
                    </li>
                ))}
              </ul>
            </div>
        }

        {facts.nextFixture &&
            <div className="text-sm text-gray-900">
              <span className="text-gray-600">Next: </span>
              <Link to={`/matches/${facts.nextFixture.fixtureId}`} className="text-emerald-600 font-semibold">
                {facts.nextFixture.home ? "vs" : "at"} {facts.nextFixture.opponent} · {kickOff(facts.nextFixture)}
              </Link>
            </div>
        }
      </motion.div>
  );
};

export default TeamFacts;
