import { useLoaderData, useNavigate, useParams } from "react-router-dom";
import { ArticleLoaderOutput } from "../../../routes/loaders/ArticleLoader.ts";
import ArticleModel from "./models/ArticleModel.ts";
import ErrorBlock from "../../ui/error-block/ErrorBlock.tsx";
import Button from "../../ui/button/Button.tsx";
import { formatParams } from "../../../utils/FormatUtil.ts";

const getChosenArticle = (articles: ArticleModel[], articleId: string) =>
  articles.find(article => article.id === articleId) ||
  articles.find(article => article.title.toLowerCase().replace(/\?/g, '') === formatParams(articleId));


const NOT_FOUND_MSG = "The selected article cannot be found. Some things just aren't meant to be.";

const ArticleView = () => {
  const {id} = useParams();
  const {data: articles, error} = useLoaderData<ArticleLoaderOutput>();
  const navigate = useNavigate();
  const article = getChosenArticle(articles, id as string);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      { error && (
        <ErrorBlock title="Article Error" message={ NOT_FOUND_MSG }/>
      ) }

      { article && !error && (
        <div className="bg-white shadow-md rounded-2xl p-6 space-y-4">
          <h3 className="text-3xl font-bold text-gray-800">{ article.title }</h3>
          <h5 className="text-lg text-gray-600 font-medium italic">
            { article.author }
          </h5>
          <p className="text-gray-700 leading-relaxed">{ article.text }</p>
          <Button buttonType="primary" onClick={() => navigate(-1)}>Back</Button>
        </div>
      ) }

      { !error && !article && (
        <ErrorBlock title="Article Error" message={ NOT_FOUND_MSG }/>
      ) }
    </div>
  );
};

export default ArticleView;
