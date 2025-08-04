import { useCallback, useState } from "react";
import { Link, useLoaderData } from "react-router-dom";
import { useLangStore } from "../store/store.ts";
import UserForm from "../components/features/auth/user-form/UserForm.tsx";
import { motion } from "framer-motion";
import HomeSectionBlock from "./HomeSectionBlock.tsx";
import { HomeLoaderOutput } from "../routes/loaders/HomeLoader.ts";
import { formatParams } from "../utils/FormatUtil.ts";

const Home = () => {
  const { selectedLang } = useLangStore();
  const [isSignUpButtonClicked, setIsSignUpButtonClicked] = useState(false);
  const { articles, cheatCards }: HomeLoaderOutput = useLoaderData();

  const offsideOneliner = selectedLang === "british"
    ? "Haaland didn't do no fucking offside, did he?! That judge was a bloody fucking wanker if you ask me."
    : "Gosh darn it! Haaland never went behind the defence line! He would never do something like that, bless his soul.";

  const toggleForm = useCallback(() => {
    setIsSignUpButtonClicked(prev => !prev);
  }, []);

  const sections = ["intro", "pickTeam", "membership", "articles", "cheatCards"];

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className="max-w-4xl mx-auto p-6 scrollbar-thumb-gray-400 scrollbar-track-gray-100"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <h1 className="text-3xl font-bold text-center text-slate-300 mb-6">
        Make Small Talk Like a Fan
      </h1>

      {isSignUpButtonClicked && (
        <UserForm
          isOpenModal={isSignUpButtonClicked}
          setIsOpenModal={toggleForm}
          initialFormType="signup"
        />
      )}

      <motion.div
        className="space-y-5 text-lg text-gray-900"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {sections.map((type) => (
          <motion.p
            key={type}
            className="bg-gray-200 p-4 rounded-lg shadow-sm"
            variants={itemVariants}
          >
            <HomeSectionBlock
              type={type}
              toggleForm={toggleForm}
              articles={articles.data}
              cheatCards={cheatCards.data}
            />
          </motion.p>
        ))}

        <motion.div
          className="p-5 bg-gray-100 rounded-lg"
          variants={itemVariants}
        >
          <p>
            With our{" "}
            <Link to="../one-liners" className="link">
              One Liners
            </Link>{" "}
            feature, you’ll get a quick summary of last night's games, complete with a one-liner to impress your
            friends. For example, if Manchester City had a goal disallowed for{" "}
            <Link to={ `../cheat-cards/${cheatCards.data.find(card => formatParams(card.title) === 'offside')?.id}` } className="link">
              offside
            </Link>, you might say:
          </p>
          <blockquote className="italic text-gray-800 mt-2 px-4 py-2 border-l-4 border-emerald-700">
            "{offsideOneliner}"
          </blockquote>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Home;
