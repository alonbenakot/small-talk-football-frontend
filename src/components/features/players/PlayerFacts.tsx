import {Link} from "react-router-dom";
import {motion} from "motion/react";
import {PlayerFacts as PlayerFactsModel} from "./models/PlayerOneLiner.ts";
import {PlayerStats} from "./models/PlayerRecord.ts";
import NextFixtureLink from "../teams/NextFixtureLink.tsx";
import FallbackImage from "../../ui/fallback-image/FallbackImage.tsx";
import {ordinal} from "../../../utils/FormatUtil.ts";

type Props = {
  facts: PlayerFactsModel;
};

const outfieldStats: [keyof PlayerStats, string][] = [
  ["matchesPlayed", "Played"],
  ["goals", "Goals"],
  ["assists", "Assists"],
  ["rating", "Rating"],
  ["shotsTotal", "Shots"],
  ["keyPasses", "Key passes"],
  ["passes", "Passes"],
  ["passesAccurate", "Accurate passes"],
  ["tackles", "Tackles"],
  ["interceptions", "Interceptions"],
  ["clearances", "Clearances"],
  ["duelsTotal", "Duels"],
  ["duelsWon", "Duels won"],
  ["yellowCards", "Yellow cards"],
  ["redCards", "Red cards"],
];

const goalkeeperStats: [keyof PlayerStats, string][] = [
  ["saves", "Saves"],
  ["insideBoxSaves", "Saves in the box"],
  ["goalsConceded", "Goals conceded"],
];

const badgeClass = "text-xs font-semibold rounded-full px-3 py-1 text-emerald-600 bg-emerald-100";

const contributionDate = (date: string) =>
    new Date(date).toLocaleDateString("en-GB", {day: "2-digit", month: "2-digit", year: "2-digit"});

const contributionLine = (goals: number, assists: number) =>
    [goals > 0 && `${goals}G`, assists > 0 && `${assists}A`].filter(Boolean).join(" ");

const PlayerFacts = ({facts}: Props) => {
  const isGoalkeeper = facts.position === "Goalkeepers";
  const stats = (isGoalkeeper ? [...outfieldStats, ...goalkeeperStats] : outfieldStats)
      .filter(([key]) => facts.season[key] !== null && facts.season[key] !== "");
  const topScorer = facts.leagueScorerRank !== null && facts.leagueScorerRank <= 5;

  return (
      <motion.div
          className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 mt-4"
          initial={{opacity: 0, y: 10}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.5}}
      >
        <div className="flex items-center gap-3 mb-6">
          <FallbackImage
              src={facts.image}
              alt={facts.name}
              fallback="player"
              className="w-10 h-10 rounded-full shadow object-cover"
          />
          <div>
            <h2 className="text-xl font-bold text-slate-800">Player facts</h2>
            {facts.age && <p className="text-sm text-gray-600">Age: {facts.age}</p>}
          </div>
        </div>

        {(facts.captain || topScorer) &&
            <div className="mb-6 flex flex-wrap gap-2">
              {facts.captain && <span className={badgeClass}>Captain</span>}
              {topScorer && <span className={badgeClass}>{ordinal(facts.leagueScorerRank!)} in the scoring charts</span>}
            </div>
        }

        {facts.team &&
            <Link to={`/teams/${facts.team.id}`} className="mb-6 flex items-center gap-3">
              <FallbackImage
                  src={facts.team.crest}
                  alt={facts.team.name}
                  fallback="crest"
                  className="w-10 h-10 rounded-full shadow object-contain"
              />
              <div className="flex flex-col">
                <span className="font-semibold text-gray-900">{facts.team.name}</span>
                {facts.teamStanding &&
                    <span className="text-sm text-gray-600">
                      {ordinal(facts.teamStanding.position)} · {facts.teamStanding.points} pts
                    </span>
                }
              </div>
            </Link>
        }

        {stats.length > 0 &&
            <section className="mb-6">
              <h3 className="text-sm font-semibold text-emerald-600 uppercase tracking-wide mb-3">This season</h3>
              <dl className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-3">
                {stats.map(([key, label]) => (
                    <div key={key} className="bg-gray-50 rounded-xl p-3 text-center shadow-sm">
                      <dd className="text-xl sm:text-2xl font-bold text-gray-900">{facts.season[key]}</dd>
                      <dt className="text-xs text-gray-600 leading-tight">{label}</dt>
                    </div>
                ))}
              </dl>
            </section>
        }

        {facts.recentContributions.length > 0 &&
            <section className="mb-6">
              <h3 className="text-sm font-semibold text-emerald-600 uppercase tracking-wide mb-3">
                Recent goals and assists
              </h3>
              <ul className="flex flex-col gap-2 text-sm">
                {facts.recentContributions.map((c) => (
                    <li key={c.fixtureId}>
                      <Link to={`/matches/${c.fixtureId}`} className="text-emerald-600 font-semibold">
                        {contributionLine(c.goals, c.assists)} vs {c.opponent} · {contributionDate(c.date)}
                      </Link>
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

export default PlayerFacts;
