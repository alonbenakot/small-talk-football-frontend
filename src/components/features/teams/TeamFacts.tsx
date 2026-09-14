import {motion} from "motion/react";
import {Trophy} from "lucide-react";
import {FormEntry, Standing, TeamFacts as TeamFactsModel} from "./models/TeamOneLiner.ts";
import NextFixtureLink from "./NextFixtureLink.tsx";
import {formatString, ordinal} from "../../../utils/FormatUtil.ts";

type Props = {
  facts: TeamFactsModel;
};

const resultClass: Record<FormEntry["result"], string> = {
  WIN: "bg-emerald-600",
  DRAW: "bg-gray-400",
  LOSS: "bg-red-600",
};

const standingLine = (standing: Standing) =>
    `${ordinal(standing.position)} · ${standing.points} pts · ${standing.playedMatches} played · ` +
    `${standing.overall.wins}W-${standing.overall.draws}D-${standing.overall.losses}L`;

const standingTiles = (standing: Standing): [string, string][] => [
  ["Position", ordinal(standing.position)],
  ["Points", `${standing.points}`],
  ["Played", `${standing.playedMatches}`],
  ["W-D-L", `${standing.overall.wins}-${standing.overall.draws}-${standing.overall.losses}`],
];

const TeamFacts = ({facts}: Props) => {
  const standings = Object.values(facts.standings);
  const primary = standings.find((s) => s.competition === facts.primaryCompetition) ?? standings[0];
  const secondary = standings.find((s) => s !== primary);

  return (
      <motion.div
          className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 mt-4"
          initial={{opacity: 0, y: 10}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.5}}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center">
            <Trophy className="w-5 h-5 text-white"/>
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Club facts</h2>
            {facts.coach && <p className="text-sm text-gray-600">Coach: {facts.coach}</p>}
          </div>
        </div>

        {primary &&
            <section className="mb-6">
              <h3 className="text-sm font-semibold text-emerald-600 uppercase tracking-wide mb-3">
                {formatString(primary.competition)}
              </h3>
              <dl className="grid grid-cols-4 gap-2 sm:gap-3">
                {standingTiles(primary).map(([label, value]) => (
                    <div key={label} className="bg-gray-50 rounded-xl p-3 text-center shadow-sm">
                      <dd className="text-xl sm:text-2xl font-bold text-gray-900">{value}</dd>
                      <dt className="text-xs text-gray-600">{label}</dt>
                    </div>
                ))}
              </dl>
              {secondary &&
                  <p className="mt-3 text-sm text-gray-600">
                    <span className="font-semibold text-gray-900">{formatString(secondary.competition)}:</span>{" "}
                    {standingLine(secondary)}
                  </p>
              }
            </section>
        }

        {facts.recentForm.length > 0 &&
            <section className="mb-6">
              <h3 className="text-sm font-semibold text-emerald-600 uppercase tracking-wide mb-3">
                Recent form{" "}
                <span className="normal-case tracking-normal font-normal text-gray-600">
                  (how the last five games went, newest first — W win, D draw, L loss)
                </span>
              </h3>
              <ul className="flex flex-wrap gap-x-5 gap-y-3">
                {facts.recentForm.slice(0, 5).map((entry) => (
                    <li key={entry.date} className="flex flex-col items-center gap-1 min-w-16 whitespace-nowrap">
                      <span
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${resultClass[entry.result]}`}
                      >
                        {entry.result.charAt(0)}
                      </span>
                      <span className="text-xs text-gray-900 font-semibold">{entry.score}</span>
                      <span className="text-xs text-gray-600">
                        {entry.home ? "vs" : "at"} {entry.opponent}
                      </span>
                    </li>
                ))}
              </ul>
            </section>
        }

        {facts.nextFixture &&
            <section className="pt-4 border-t border-slate-200">
              <NextFixtureLink fixture={facts.nextFixture}/>
            </section>
        }
      </motion.div>
  );
};

export default TeamFacts;
