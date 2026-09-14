import {motion} from "motion/react";
import SquadPlayer from "./models/SquadPlayer.ts";
import PlayerRow from "./PlayerRow.tsx";
import MessageBlock from "../../ui/message-block/MessageBlock.tsx";

type Props = {
  squad: SquadPlayer[];
  teamId: string;
  notablePlayerIds: string[];
};

const listVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

// The squad arrives ordered by position, so consecutive rows with the same position form a group.
const groupByPosition = (squad: SquadPlayer[]) =>
    squad.reduce<{ position: string; players: SquadPlayer[] }[]>((groups, player) => {
      const last = groups[groups.length - 1];
      if (last?.position === player.position) {
        last.players.push(player);
      } else {
        groups.push({position: player.position, players: [player]});
      }
      return groups;
    }, []);

const Squad = ({squad, teamId, notablePlayerIds}: Props) => {
  if (squad.length === 0) {
    return <MessageBlock title="No squad yet" message="This team's squad has not been loaded. Check back soon."/>;
  }

  // Players with no recorded appearances go into a "Rest of the squad" group at the end instead of their position.
  const featured = squad.filter((p) => p.matchesPlayed !== null);
  const notFeatured = squad.filter((p) => p.matchesPlayed === null);
  const groups = [
    ...groupByPosition(featured),
    ...(notFeatured.length > 0 ? [{position: "Rest of the squad", players: notFeatured}] : []),
  ];

  return (
      <div>
        {groups.map((group) => (
            <section key={group.position}>
              <h3 className="text-lg font-bold text-slate-300 mt-6 mb-2 mx-2">{group.position}</h3>
              <motion.ul initial="hidden" animate="visible" variants={listVariants}>
                {group.players.map((player) => (
                    <motion.li
                        key={player.id}
                        variants={itemVariants}
                        transition={{ type: "spring", stiffness: 280, damping: 22 }}
                    >
                      <motion.div whileHover={{ scale: 1.02 }}>
                        <PlayerRow
                            player={player}
                            teamId={teamId}
                            notable={notablePlayerIds.includes(player.id)}
                        />
                      </motion.div>
                    </motion.li>
                ))}
              </motion.ul>
            </section>
        ))}
      </div>
  );
};

export default Squad;
