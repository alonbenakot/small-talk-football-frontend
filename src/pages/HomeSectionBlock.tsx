import { Link } from "react-router-dom";
import ArticleModel from "../components/features/articles/models/ArticleModel.ts";
import CheatCardModel from "../components/features/cheat-cards/models/CheatCardModel.ts";
import { formatParams } from "../utils/FormatUtil.ts";


type SectionBlockProps = {
  type: string;
  toggleForm: () => void;
  articles: ArticleModel[];
  cheatCards: CheatCardModel[];
};

const HomeSectionBlock = ({type, toggleForm, articles, cheatCards}: SectionBlockProps) => {
  const findArticle = (title: string) =>
    articles.find(article => formatParams(article.title) === formatParams(title));

  const findCheatCard = (title: string) =>
    cheatCards.find(card => formatParams(card.title) === formatParams(title));

  switch (type) {
    case "intro":
      return (
        <>No idea about football? Want everyone to think that you do?
          We will teach you everything you need to know so you can impress your
          co-workers, your loved ones, and even random people in the elevator!
        </>
      );

    case "pickTeam": {
      const pickATeamArticle = findArticle("How to pick a team?");
      return (
        <>
          First up - you need to pick a team. Not a simple choice, and a true football fan will tell you that a team is
          for life.
          { pickATeamArticle && (
            <> Check out{ " " }
              <Link to={ `../articles/${ pickATeamArticle.id }` } className="link">
                { pickATeamArticle.title }
              </Link>{ " " }
              Now that you have a team, take a look at the rest of the site!
            </>
          ) }
        </>
      );
    }

    case "membership":
      return (
        <>
          By{ " " }
          <button
            onClick={ toggleForm }
            className="link cursor-pointer"
            aria-label="Sign up to become a member"
          >
            becoming a member
          </button>
          { " " }
          you can learn the ropes even faster and help other future fans!
          Submit your own articles and one-liners and get ranked based on them.
        </>
      );

    case "articles": {
      const saudiArticle = findArticle("What's going on with the Saudi League?");
      const partnerArticle = findArticle("How to Turn Your Partner into a Football Fan");
      return (
        <>
          You can read additional{ " " }
          <Link to="../articles" className="link">articles</Link>{ " " }
          to dive into more complex concepts like{ " " }
          { saudiArticle && (
            <Link to={ `../articles/${ saudiArticle.id }` } className="link">
              { saudiArticle.title }
            </Link>
          ) }{ " " }
          or{ " " }
          { partnerArticle && (
            <Link to={ `../articles/${ partnerArticle.id }` } className="link">
              { partnerArticle.title }
            </Link>
          ) }.
        </>
      );
    }

    case "cheatCards": {
      const offsideCard = findCheatCard("offside");
      const varCard = findCheatCard("VAR in Football: The Impact of Video Assistant Referee");
      return (
        <>
          Feeling overwhelmed? No worries! Our{ " " }
          <Link to="../cheat-cards" className="link">
            Cheat Cards
          </Link>{ " " }
          break everything down into bite-sized chunks, so you can easily
          look up terms like{ " " }
          { offsideCard && (
            <Link to={ `../cheat-cards/${ offsideCard.id }` } className="link">
              offside
            </Link>
          ) }{ " " }
          or{ " " }
          { varCard && (
            <Link to={ `../cheat-cards/${ varCard.id }` } className="link">
              VAR
            </Link>
          ) }.
        </>
      );
    }

    default:
      return null;
  }
};

export default HomeSectionBlock;
