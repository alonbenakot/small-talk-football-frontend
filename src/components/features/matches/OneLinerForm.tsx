import Input from "../../ui/input/Input.tsx";
import {Scale, Sparkles} from "lucide-react";
import MatchModel, {TeamType} from "./models/MatchModel.ts";
import Button from "../../ui/button/Button.tsx";
import {useForm} from "react-hook-form";
import {useNavigate} from "react-router-dom";
import {motion} from "framer-motion";

const titleVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
};

const groupVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.15,
    },
  },
};

const optionVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
};

const actionRowVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, delay: 0.3 } },
};

type Props = {
  match: MatchModel;
  isLoading: boolean;
  onSubmit: (data: OneLinerFormData) => void;
};

export type OneLinerFormData = {
  team: TeamType | "NEUTRAL";
};

export const NEUTRAL = "NEUTRAL";

const OneLinerForm = ({ onSubmit, match, isLoading }: Props) => {
  const navigate = useNavigate();

  const { register, handleSubmit, watch } = useForm<OneLinerFormData>({
    defaultValues: { team: NEUTRAL },
  });

  const selectedTeam = watch("team");

  const options = [
    {
      label: "Keep it Neutral",
      id: "neutral",
      radioValue: NEUTRAL,
      icon: <Scale className="w-6 h-6 text-slate-600" />,
    },
    {
      label: match.homeTeam.name,
      id: "homeTeam",
      radioValue: TeamType.HOME,
      icon: (
          <img
              src={match.homeTeam.crest}
              alt={`${match.homeTeam.name} crest`}
              className="w-8 h-8 object-contain"
          />
      ),
    },
    {
      label: match.awayTeam.name,
      id: "awayTeam",
      radioValue: TeamType.AWAY,
      icon: (
          <img
              src={match.awayTeam.crest}
              alt={`${match.awayTeam.name} crest`}
              className="w-8 h-8 object-contain"
          />
      ),
    },
  ];

  return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <form onSubmit={handleSubmit(onSubmit)}>

          <motion.h1
              className="mb-4 text-xl font-semibold text-zinc-800"
              variants={titleVariants}
              initial="hidden"
              animate="visible"
          >
            Choose a team you support and adjust the language
          </motion.h1>

          <motion.div
              className="space-y-3 mb-6"
              variants={groupVariants}
              initial="hidden"
              animate="visible"
          >
            {options.map((opt) => (
                <motion.div key={opt.id} variants={optionVariants}>
                  <Input
                      label={opt.label}
                      id={opt.id}
                      radioValue={opt.radioValue}
                      radio
                      checked={selectedTeam === opt.radioValue}
                      iconImg={opt.icon}
                      {...register("team")}
                  />
                </motion.div>
            ))}
          </motion.div>

          <motion.div
              className="flex flex-col sm:flex-row justify-between gap-2"
              variants={actionRowVariants}
              initial="hidden"
              animate="visible"
          >
            <motion.div
                className="flex-1"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
            >
              <Button
                  buttonType="cta"
                  type="submit"
                  className="w-full flex items-center justify-center gap-2"
                  disabled={isLoading}
              >
                {isLoading ? "Generating..." : "Generate One-Liner!"}
                <Sparkles className="w-4 h-4" />
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                  buttonType="secondary"
                  type="button"
                  className="w-full text-sm py-2"
                  onClick={() => navigate(-1)}
              >
                Back to Matches
              </Button>
            </motion.div>
          </motion.div>
        </form>
      </div>
  );
};

export default OneLinerForm;
