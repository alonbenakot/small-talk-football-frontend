import Input from "../../ui/input/Input.tsx";
import {Sparkles} from "lucide-react";
import Button from "../../ui/button/Button.tsx";
import {useForm} from "react-hook-form";
import {useNavigate} from "react-router-dom";
import {motion} from "motion/react";
import {OneLinerOption} from "./models/OneLinerOption.ts";

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

type Props<V extends string> = {
  title: string;
  options: OneLinerOption<V>[];
  defaultValue?: V;
  submitLabel?: string;
  backLabel: string;
  backTo: string | number;
  isLoading: boolean;
  onSubmit: (choice: V | undefined) => void;
};

type OneLinerFormData<V extends string> = {
  choice: V | undefined;
};

const OneLinerForm = <V extends string>({
  title, options, defaultValue, submitLabel = "Generate One-Liner!", backLabel, backTo, isLoading, onSubmit,
}: Props<V>) => {
  const navigate = useNavigate();

  const { register, handleSubmit, watch } = useForm<OneLinerFormData<V>>({
    defaultValues: { choice: defaultValue },
  });

  const selected = watch("choice");

  const goBack = () => typeof backTo === "number" ? navigate(backTo) : navigate(backTo);

  return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <form onSubmit={handleSubmit((data) => onSubmit(data.choice))}>

          <motion.h1
              className="mb-4 text-xl font-semibold text-zinc-800"
              variants={titleVariants}
              initial="hidden"
              animate="visible"
          >
            {title}
          </motion.h1>

          {options.length > 0 &&
              <motion.div
                  className="space-y-3 mb-6"
                  variants={groupVariants}
                  initial="hidden"
                  animate="visible"
              >
                {options.map((opt) => (
                    <motion.div key={opt.value} variants={optionVariants}>
                      <Input
                          label={opt.label}
                          id={opt.value}
                          radioValue={opt.value}
                          radio
                          checked={selected === opt.value}
                          iconImg={opt.icon}
                          {...register("choice")}
                      />
                    </motion.div>
                ))}
              </motion.div>
          }

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
                  buttonType="prominent"
                  type="submit"
                  className="w-full flex items-center justify-center gap-2"
                  disabled={isLoading}
              >
                {isLoading ? "Generating..." : submitLabel}
                <Sparkles className="w-4 h-4" />
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                  buttonType="secondary"
                  type="button"
                  className="w-full h-full text-sm"
                  onClick={goBack}
              >
                {backLabel}
              </Button>
            </motion.div>
          </motion.div>
        </form>
      </div>
  );
};

export default OneLinerForm;
