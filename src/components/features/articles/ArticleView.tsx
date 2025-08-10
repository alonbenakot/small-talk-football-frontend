import { useLoaderData, useNavigate } from "react-router-dom";
import Button from "../../ui/button/Button.tsx";
import { useAuthStore } from "../../../store/store.ts";
import useApi from "../../../utils/hooks/use-api.ts";
import { deleteArticle, publishArticle, removeArticle, UNAUTHORIZED_MSG } from "../../../utils/api/http.ts";
import { OneArticleLoaderOutput } from "../../../routes/loaders/ArticleLoader.ts";
import ErrorBlock from "../../ui/error-block/ErrorBlock.tsx";
import Spinner from "../../ui/spinner/Spinner.tsx";
import { useState } from "react";
import Notification from "../../ui/modals/Notification.tsx";

type ButtonMode = 'PUBLISH' | 'REMOVE';

const ArticleView = () => {
  const {selectedUser, dispatchTriggerArticleInd} = useAuthStore();
  const {data: article} = useLoaderData<OneArticleLoaderOutput>();
  const buttonMode: ButtonMode = article?.published ? 'REMOVE' : "PUBLISH";
  const {invokeApi, error, isLoading} = useApi(buttonMode === 'PUBLISH' ? publishArticle : removeArticle);
  const {invokeApi: invokeDeleteApi, isLoading: isDeleteLoading} = useApi(deleteArticle);
  const [isDeleteClicked, setIsDeleteClicked] = useState<boolean>(false);
  const adminButtonText = buttonMode === 'PUBLISH' ? 'Publish' : 'Remove';
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

  const handleDeleteButtonClicked = async () => {
    setIsDeleteClicked(true);
  }

  const handleDeleteConfirmation = async () => {
    await invokeDeleteApi(article.id);
    setIsDeleteClicked(false);
    navigate(-1);
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
      { article && (
        <div className="bg-white shadow-md rounded-2xl p-4 sm:p-6 space-y-4 sm:space-y-6">
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 leading-tight">
            { article.title }
          </h3>
          <h5 className="text-base sm:text-lg text-gray-800 font-medium italic">
            { article.author }
          </h5>

          <div className="space-y-4">
            { article.text.split('\n\n').map((paragraph) => (
              <p key={ paragraph } className="text-gray-800 leading-relaxed text-sm sm:text-base">
                { paragraph }
              </p>
            )) }
          </div>

          { error && (
            <div className="mt-4">
              <ErrorBlock title={ 'Error' } message={ UNAUTHORIZED_MSG }/>
            </div>
          ) }

          <div className="pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-3 sm:gap-4">
              <Button
                buttonType="primary"
                onClick={() => navigate(-1)}
                className="w-full sm:w-auto sm:col-start-1"
              >
                Back
              </Button>

              {selectedUser?.role === 'ADMIN' && (
                <div className="flex flex-col sm:flex-row sm:justify-end items-stretch sm:items-center gap-3 sm:gap-4">
                  {isLoading && (
                    <div className="flex justify-center sm:justify-start">
                      <Spinner />
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <Button
                      buttonType="secondary"
                      disabled={isLoading}
                      onClick={handleDeleteButtonClicked}
                      className="w-full sm:w-auto"
                    >
                      Delete
                    </Button>
                    <Button
                      buttonType="primary"
                      disabled={isLoading}
                      onClick={handleAdminButtonClick}
                      className="w-full sm:w-auto"
                    >
                      {adminButtonText}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) }

      { isDeleteClicked && (
        <Notification
          isModalOpen={ isDeleteClicked }
          onClose={ () => setIsDeleteClicked(false) }
          title="Deleting Article"
          text="Are you sure you want to delete this article? Members cannot even see it because it's not published. Once deleted it remains in the void."
        >
          { isDeleteLoading ? (
            <div className="flex justify-center">
              <Spinner/>
            </div>
          ) : (
            <div className="flex gap-3">
              <Button
                buttonType="secondary"
                onClick={ () => setIsDeleteClicked(false) }
              >
                No
              </Button>
              <Button
                buttonType="primary"
                onClick={ handleDeleteConfirmation }
              >
                Yes
              </Button>
            </div>
          ) }
        </Notification>
      )}
    </div>
  );
};

export default ArticleView;