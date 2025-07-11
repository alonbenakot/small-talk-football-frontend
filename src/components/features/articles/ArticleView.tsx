import { useLoaderData, useNavigate } from "react-router-dom";
import Button from "../../ui/button/Button.tsx";
import { useAuthStore } from "../../../store/store.ts";
import useApi from "../../../utils/hooks/use-api.ts";
import { publishArticle, removeArticle, UNAUTHORIZED_MSG } from "../../../utils/api/http.ts";
import { OneArticleLoaderOutput } from "../../../routes/loaders/ArticleLoader.ts";
import ErrorBlock from "../../ui/error-block/ErrorBlock.tsx";
import Spinner from "../../ui/spinner/Spinner.tsx";

type ButtonMode = 'PUBLISH' | 'REMOVE';

const ArticleView = () => {
  const {selectedUser, dispatchTriggerArticleInd} = useAuthStore();
  const {data: article} = useLoaderData<OneArticleLoaderOutput>();
  const buttonMode: ButtonMode = article?.published ? 'REMOVE' : "PUBLISH";
  const {invokeApi, error, isLoading} = useApi(buttonMode === 'PUBLISH' ? publishArticle : removeArticle);
  const adminButtonText = buttonMode === 'PUBLISH' ? 'Publish' : 'Remove'
  const navigate = useNavigate();

  const handleAdminButtonClick = async () => {
    const wasSuccessful = await invokeApi(article?.id);

    if (wasSuccessful) {
      if (buttonMode === 'REMOVE') {
        dispatchTriggerArticleInd(true);
      }
      navigate(-1);
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      { article && (
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
          { error && <ErrorBlock title={ 'Error' } message={ UNAUTHORIZED_MSG }/> }
          <div className="flex justify-between">
            <Button buttonType="primary" onClick={ () => navigate(-1) }>Back</Button>
            { selectedUser?.role === 'ADMIN' && (
              <>
                {isLoading && <Spinner />}
                <Button buttonType="primary" onClick={handleAdminButtonClick}>
                  {adminButtonText}
                </Button>
              </>
            )}
          </div>
        </div>
      ) }
    </div>
  );
};

export default ArticleView;
