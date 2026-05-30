import {useCallback, useState} from "react";
import {Link, useLoaderData} from "react-router-dom";
import {useLangStore} from "../store/store.ts";
import UserForm from "../components/features/auth/user-form/UserForm.tsx";
import {motion} from "framer-motion";
import {HomeLoaderOutput} from "../routes/loaders/HomeLoader.ts";
import {formatParams} from "../utils/FormatUtil.ts";
import {Lang} from "../components/features/language/Lang.ts";
import {BookOpen, Sparkles, Trophy, Users, Zap} from "lucide-react";
import Button from "../components/ui/button/Button.tsx";

const Home = () => {
  const { selectedLang } = useLangStore();
  const [isSignUpButtonClicked, setIsSignUpButtonClicked] = useState(false);
  const { articles, cheatCards }: HomeLoaderOutput = useLoaderData<HomeLoaderOutput>();

  const offsideOneliner = selectedLang === Lang.BRITISH
    ? "Haaland didn't do no fucking offside, did he?! That judge was a bloody fucking wanker if you ask me."
    : "Gosh darn it! Haaland never went behind the defence line! He would never do something like that, bless his soul.";

  const toggleForm = useCallback(() => {
    setIsSignUpButtonClicked(prev => !prev);
  }, []);

  const findArticle = (title: string) =>
    articles.data.find(article => formatParams(article.title) === formatParams(title));

  const findCheatCard = (title: string) =>
    cheatCards.data.find(card => formatParams(card.title) === formatParams(title));

  const pickATeamArticle = findArticle("How to pick a team?");
  const saudiArticle = findArticle("What's going on with the Saudi League?");
  const partnerArticle = findArticle("How to Turn Your Partner into a Football Fan");
  const offsideCard = findCheatCard("offside");
  const varCard = findCheatCard("VAR in Football: The Impact of Video Assistant Referee");

  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {isSignUpButtonClicked && (
        <UserForm
          isOpenModal={isSignUpButtonClicked}
          setIsOpenModal={toggleForm}
          initialFormType="signup"
        />
      )}

      <motion.section
        className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-100 mb-4 sm:mb-6">
          Make Small Talk Like a Pro
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl text-slate-300 mb-8 sm:mb-10 max-w-3xl mx-auto leading-relaxed">
          No idea about football? Want everyone to think that you do?
          We'll teach you everything you need to know to impress your co-workers, loved ones, and even random people in the elevator!
        </p>
        <Button onClick={toggleForm} buttonType="prominent">
          Get Started
        </Button>
      </motion.section>

      <motion.section
        className="w-full bg-slate-800/50 py-12 sm:py-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-slate-100 mb-10 sm:mb-14">
            Everything You Need to Sound Like a Fan
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <motion.div
              className="bg-slate-700/50 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <div className="bg-emerald-600/20 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-7 h-7 text-emerald-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-100 mb-3">Match One-Liners</h3>
              <p className="text-slate-300 leading-relaxed mb-4">
                Get AI-generated conversation starters for any match. Sound confident discussing last night's game.
              </p>
              <Link to="/matches" className="text-emerald-400 hover:text-emerald-300 font-medium inline-flex items-center">
                Browse Matches →
              </Link>
            </motion.div>

            <motion.div
              className="bg-slate-700/50 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <div className="bg-blue-600/20 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                <Sparkles className="w-7 h-7 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-100 mb-3">Cheat Cards</h3>
              <p className="text-slate-300 leading-relaxed mb-4">
                Quick-reference cards for football terms like{" "}
                {offsideCard && (
                  <Link to={`/cheat-cards/${offsideCard.id}`} className="text-blue-400 hover:underline">
                    offside
                  </Link>
                )}{" "}and{" "}
                {varCard && (
                  <Link to={`/cheat-cards/${varCard.id}`} className="text-blue-400 hover:underline">
                    VAR
                  </Link>
                )}.
              </p>
              <Link to="/cheat-cards" className="text-blue-400 hover:text-blue-300 font-medium inline-flex items-center">
                View Cheat Cards →
              </Link>
            </motion.div>

            <motion.div
              className="bg-slate-700/50 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
            >
              <div className="bg-purple-600/20 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="w-7 h-7 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-100 mb-3">Expert Articles</h3>
              <p className="text-slate-300 leading-relaxed mb-4">
                Dive deeper with community articles on topics like{" "}
                {saudiArticle && (
                  <Link to={`/articles/${saudiArticle.id}`} className="text-purple-400 hover:underline">
                    Saudi League
                  </Link>
                )}.
              </p>
              <Link to="/articles" className="text-purple-400 hover:text-purple-300 font-medium inline-flex items-center">
                Read Articles →
              </Link>
            </motion.div>

            <motion.div
              className="bg-slate-700/50 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.6 }}
            >
              <div className="bg-orange-600/20 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-7 h-7 text-orange-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-100 mb-3">Join the Community</h3>
              <p className="text-slate-300 leading-relaxed mb-4">
                Become a member to submit articles, share one-liners, and help other fans learn.
              </p>
              <button
                onClick={toggleForm}
                className="text-orange-400 hover:text-orange-300 font-medium inline-flex items-center"
              >
                Sign Up Free →
              </button>
            </motion.div>
          </div>
        </div>
      </motion.section>

      <motion.section
        className="w-full py-12 sm:py-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <div className="max-w-screen-lg mx-auto px-4 sm:px-6">
          <div className="bg-gradient-to-br from-slate-800 to-slate-700 p-8 sm:p-10 rounded-2xl shadow-2xl">
            <div className="flex items-start gap-4 mb-6">
              <div className="bg-emerald-600/20 p-3 rounded-lg">
                <Trophy className="w-8 h-8 text-emerald-400" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 mb-2">
                  See It In Action
                </h2>
                <p className="text-slate-300 text-lg">
                  With our{" "}
                  <Link to="/matches" className="text-emerald-400 hover:underline font-medium">
                    Match One-Liner
                  </Link>{" "}
                  feature, you'll get quick summaries and conversation starters. For example, if Manchester City had a goal disallowed for{" "}
                  {offsideCard && (
                    <Link to={`/cheat-cards/${offsideCard.id}`} className="text-emerald-400 hover:underline font-medium">
                      offside
                    </Link>
                  )}
                  , you might say:
                </p>
              </div>
            </div>
            <blockquote className="bg-slate-900/50 border-l-4 border-emerald-500 p-6 rounded-r-lg">
              <p className="text-slate-200 text-lg sm:text-xl italic leading-relaxed">
                "{offsideOneliner}"
              </p>
            </blockquote>
          </div>
        </div>
      </motion.section>

      <motion.section
        className="w-full bg-slate-800/50 py-12 sm:py-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <div className="max-w-screen-lg mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-slate-100 mb-8 sm:mb-10">
            Ready to Get Started?
          </h2>
          <div className="bg-slate-700/50 p-8 sm:p-10 rounded-2xl shadow-lg">
            <div className="space-y-6 text-slate-300 text-lg leading-relaxed">
              <p>
                <span className="font-semibold text-slate-100">Step 1:</span> Pick a team. Not a simple choice — a true football fan will tell you that a team is for life.
                {pickATeamArticle && (
                  <>
                    {" "}Check out{" "}
                    <Link to={`/articles/${pickATeamArticle.id}`} className="text-emerald-400 hover:underline font-medium">
                      {pickATeamArticle.title}
                    </Link>{" "}
                    for guidance.
                  </>
                )}
              </p>
              <p>
                <span className="font-semibold text-slate-100">Step 2:</span> Explore our{" "}
                <Link to="/cheat-cards" className="text-emerald-400 hover:underline font-medium">
                  Cheat Cards
                </Link>{" "}
                to learn the basics, then dive into{" "}
                <Link to="/articles" className="text-emerald-400 hover:underline font-medium">
                  articles
                </Link>{" "}
                for deeper insights.
              </p>
              <p>
                <span className="font-semibold text-slate-100">Step 3:</span> Use{" "}
                <Link to="/matches" className="text-emerald-400 hover:underline font-medium">
                  Match One-Liners
                </Link>{" "}
                to sound confident discussing recent games.
              </p>
              {partnerArticle && (
                <p className="pt-4 border-t border-slate-600">
                  <span className="font-semibold text-slate-100">Bonus:</span> Want to share your newfound knowledge? Read{" "}
                  <Link to={`/articles/${partnerArticle.id}`} className="text-emerald-400 hover:underline font-medium">
                    {partnerArticle.title}
                  </Link>.
                </p>
              )}
            </div>
            <div className="mt-8 text-center">
              <Button onClick={toggleForm} buttonType="prominent">
                Join the Community
              </Button>
            </div>
          </div>
        </div>
      </motion.section>
    </motion.div>
  );
};

export default Home;
