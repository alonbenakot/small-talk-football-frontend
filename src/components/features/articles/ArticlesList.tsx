import ArticleCard from "./ArticleCard.tsx";
import ArticleModel from "./models/ArticleModel.ts";

type Props = {
  articles: ArticleModel[] | undefined
}

const ArticlesList = ({articles}: Props) => {

  return (
    <div className="px-4 py-6">
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        { articles?.map((article: ArticleModel) => {
          return (
            <li key={ article.id } className="rounded-2xl shadow-md">
              <ArticleCard
                id={ article.id }
                title={ article.title }
                author={ article.author }
                text={ article.text }
                published={ article.published }
              />
            </li>
          );
        }) }
      </ul>
    </div>
  );
}
export default ArticlesList;