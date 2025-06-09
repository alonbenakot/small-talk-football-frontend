import Button from "../components/ui/button/Button.tsx";
import ArticlesList from "../components/features/articles/ArticlesList.tsx";
import { useAuthStore } from "../store/store.ts";
import { useEffect, useState } from "react";
import Loader from "../components/ui/loader/Loader.tsx";
import ErrorBlock from "../components/ui/error-block/ErrorBlock.tsx";
import { useLoaderData, useNavigate, useNavigation, useSearchParams } from "react-router-dom";
import { formatString } from "../utils/FormatUtil.ts";
import { ArticleLoaderOutput } from "../routes/loaders/ArticleLoader.ts";

export type ArticleFilter = 'published' | 'pending';

function deriveButtonText(articlesFilter: ArticleFilter) {
  return articlesFilter === 'pending' ? 'published' : 'pending';
}

const ArticlesPage = () => {
  const {selectedUser} = useAuthStore();
  const [searchParams] = useSearchParams();
  const initialFilter: ArticleFilter = (searchParams.get("filter") as ArticleFilter) || "published";
  const [filter, setFilter] = useState<ArticleFilter>(initialFilter);
  const navigation = useNavigation();
  const navigate = useNavigate();
  const {data: articles, error} = useLoaderData<ArticleLoaderOutput>();
  const isLoading = navigation.state === "loading";

  useEffect(() => {
    const current = searchParams.get("filter");
    if (current !== filter) {
      navigate(`?filter=${ filter }`, {replace: true});
    }
  }, [filter, searchParams, navigate]);

  const handleArticleToggle = () => {
    setFilter((prevState) => deriveButtonText(prevState));
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <h2 className="text-3xl font-bold mb-3 text-gray-800 text-center">
        { `${ formatString(filter) } Articles` }
      </h2>
      { isLoading &&
        <div className="flex justify-center items-center w-full h-40">
          <Loader/>
        </div>
      }

      { error &&
        <div className="flex justify-center items-center w-full h-40">
          <ErrorBlock title={ "Article Error" } message={ error }/>
        </div>
      }

      { !isLoading && !error && (
        <>
          <div className="flex flex-col items-center justify-between gap-4">
            { selectedUser?.userIndications.pendingArticles && (
              <Button buttonType="primary" onClick={ handleArticleToggle }>
                { deriveButtonText(filter) }
              </Button>
            ) }
          </div>

          <ArticlesList articles={ articles }/>
        </>
      ) }
    </div>
  )
}

export default ArticlesPage;