import { useLoaderData, useNavigate, useParams } from "react-router-dom";
import { ArticleLoaderOutput } from "../../../routes/loaders/ArticleLoader.ts";
import ArticleModel from "./models/ArticleModel.ts";
import ErrorBlock from "../../ui/error-block/ErrorBlock.tsx";
import Button from "../../ui/button/Button.tsx";
import { formatParams } from "../../../utils/FormatUtil.ts";
import { useAuthStore } from "../../../store/store.ts";

const getChosenArticle = (articles: ArticleModel[], articleId: string) =>
  articles.find(article => article.id === articleId) ||
  articles.find(article => article.title.toLowerCase().replace(/\?/g, '') === formatParams(articleId));


const NOT_FOUND_MSG = "The selected article cannot be found. Some things just aren't meant to be.";

const ArticleView = () => {
  const {id} = useParams();
  const {data: articles, error} = useLoaderData<ArticleLoaderOutput>();
  const navigate = useNavigate();
  const article = getChosenArticle(articles, id as string);
  const {selectedUser} = useAuthStore();

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      { error && (
        <ErrorBlock title="Article Error" message={ NOT_FOUND_MSG }/>
      ) }

      { article && !error && (
        <div className="bg-white shadow-md rounded-2xl p-6 space-y-4">
          <h3 className="text-3xl font-bold text-gray-800">{ article.title }</h3>
          <h5 className="text-lg text-gray-800 font-medium italic">
            { article.author }
          </h5>

          { article.text.split('\\n\\n').map((paragraph) => (
            <p key={ paragraph } className="text-gray-800 leading-relaxed mb-4">
              { paragraph }
            </p>
          )) }
          <div className="flex justify-between">
            <Button buttonType="primary" onClick={ () => navigate(-1) }>Back</Button>
            { selectedUser?.role === 'ADMIN' && <Button buttonType="primary" onClick={ () => navigate(-1) }>Publish</Button> }
          </div>
        </div>
      ) }

      { !error && !article && (
        <ErrorBlock title="Article Error" message={ NOT_FOUND_MSG }/>
      ) }
    </div>
  );
};

export default ArticleView;
