import Button from "../components/ui/button/Button.tsx";
import ArticlesList from "../components/features/articles/ArticlesList.tsx";
import { useAuthStore } from "../store/store.ts";
import { useEffect, useState } from "react";
import useApi from "../utils/hooks/use-api.ts";
import { getPendingArticles, getPublishedArticles } from "../utils/api/http.ts";
import ArticleModel from "../components/features/articles/models/ArticleModel.ts";
import Loader from "../components/ui/loader/Loader.tsx";
import ErrorBlock from "../components/ui/error-block/ErrorBlock.tsx";

export type ArticleFilter = 'Published' | 'Pending';

function deriveButtonText(articlesFilter: "Published" | "Pending") {
  return articlesFilter === 'Pending' ? 'Published' : 'Pending';
}

const ArticlesPage = () => {
  const {selectedUser} = useAuthStore();
  const [filter, setFilter] = useState<ArticleFilter>('Published');
  const {
    invokeApi,
    fetchedData: articles,
    isLoading,
    error
  } = useApi<ArticleModel[]>(filter === 'Published' ? getPublishedArticles : getPendingArticles);

  useEffect(() => {
    const fetchData = async () => {
      await invokeApi();
    };
    fetchData();
  }, [filter, invokeApi]);

  const buttonText = deriveButtonText(filter);

  const handleArticleToggle = () => {
    setFilter((prevState) => deriveButtonText(prevState));
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <h2 className="text-3xl font-bold mb-3 text-gray-800 text-center">
        { `${ filter } Articles` }
      </h2>
      { isLoading &&
        <div className="flex justify-center items-center w-full h-40">
          <Loader/>
        </div>
      }

      { error &&
        <div className="flex justify-center items-center w-full h-40">
          <ErrorBlock title={ "ERROR_TITLE" } message={ "ERROR_MSG" }/>
        </div>
      }

      { !isLoading && !error && (
        <>
          <div className="flex flex-col items-center justify-between gap-4">
            { selectedUser?.userIndications.pendingArticles && (
              <Button buttonType="primary" onClick={ handleArticleToggle }>
                { buttonText }
              </Button>
            ) }
          </div>

          <ArticlesList articles={ articles?.data }/>
        </>
      ) }
    </div>
  )
}

export default ArticlesPage;