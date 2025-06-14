import { useState } from "react";
import { Link } from "react-router-dom";
import { useLangStore } from "../store/store.ts";
import UserForm from "../components/features/auth/user-form/UserForm.tsx";

const britishOffsideOneliner = "Haaland didn't do no fucking offside, did he?! That judge was a bloody fucking wanker if you ask me.";
const americanOffsideOneliner = "Gosh darn it! Haaland never went behind the defence line! He would never do something like that, bless his soul.";

const Home = () => {
  const {selectedLang} = useLangStore();
  const [isSignUpButtonClicked, setIsSignUpButtonClicked] = useState<boolean>(false);
  const offsideOneliner = selectedLang === "british" ? britishOffsideOneliner : americanOffsideOneliner;

  const toggleForm = () => {
    setIsSignUpButtonClicked(prevState => !prevState);
  }
  return (
    <div className="max-w-4xl mx-auto p-6 scrollbar-thumb-gray-400 scrollbar-track-gray-100">
      <h1 className="text-3xl font-bold text-center text-zinc-800 mb-6">
        Small Talk Football ⚽ <br/> Make Small Talk Like a Pro
      </h1>

      { isSignUpButtonClicked &&
        <UserForm
          isOpenModal={ isSignUpButtonClicked }
          setIsOpenModal={ toggleForm }
          initialFormType="signup"/>
      }

      <div className="space-y-5 text-lg text-gray-700">
        <p className="bg-gray-100 p-4 border-l-4 border-emerald-600 rounded-lg shadow-sm">
          No idea about football? Want everyone to think that you do? We will teach you everything you need to know
          so you can impress your co-workers, your loved ones, and even random people in the elevator!
        </p>


        <p className="bg-gray-100 p-4 border-l-4 border-emerald-600 rounded-lg shadow-sm">
          First up - you need to pick a team. Not a simple choice, and a true football fan will tell you that a team is
          for life.
          Check out{ " " }
          <Link to="../articles/how-to-pick-a-team" className="link">
            How to pick a team?
          </Link>
          { " " }Now that you have a team, take a look at the rest of the site!
        </p>

        <p className="p-5 bg-gray-100 border-l-4 border-emerald-600 rounded-lg shadow-sm">
          By{ " " }
          <button onClick={ toggleForm } className="link cursor-pointer">becoming a member</button>
          { " " }
          you can learn the ropes even faster and help other future fans!
          Submit your own articles and one-liners and get ranked based on them.
        </p>

        <p className="p-5 bg-gray-100 border-l-4 border-emerald-600 rounded-lg shadow-sm">
          You can read additional
          { " " }<Link to="../articles" className="link">articles</Link>{ " " }
          to dive into more complex concepts like{ " " }
          <Link to="../articles/what's-going-on-with-the-saudi-league?" className="link">
            What's going on with the Saudi League?
          </Link>{ " " }
          or{ " " }
          <Link to="../articles/how-to-turn-your-partner-into-a-football-fan" className="link">
            How to Turn Your Partner into a Football Fan
          </Link>.
        </p>

        <p className="bg-gray-100 border-l-4 border-emerald-600 p-4 rounded-lg shadow-sm">
          Feeling overwhelmed? No worries! Our{ " " }
          <Link to="../infos" className="link">
            Cheat Cards
          </Link>{ " " }
          break everything down into bite-sized chunks, so you can easily look up terms like{ " " }
          <Link to="../infos/offside" className="link">offside</Link>
          { " " }or{ " " }
          <Link to="../infos/var" className="link">VAR</Link>.
        </p>

        <div className="p-5 border-l-4 border-emerald-600 bg-gray-100 rounded-lg">
          <p>
            With our{ " " }
            <Link to="../one-liners" className="link">
              One Liners
            </Link>{ " " }
            feature, you’ll get a quick summary of last night's games, complete with a one-liner to impress your
            friends.
            For example, if Manchester City had a goal disallowed for{ " " }
            <Link to="../infos/offside" className="link">
              offside
            </Link>, you might say:
          </p>
          <blockquote className="italic text-gray-800 mt-2 px-4 py-2 border-l-4 border-gray-500">
            "{ offsideOneliner }"
          </blockquote>
        </div>
      </div>
    </div>
  );
};

export default Home;
