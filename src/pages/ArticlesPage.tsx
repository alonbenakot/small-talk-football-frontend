import { motion } from "framer-motion";
import ArticlesList from "../components/features/articles/ArticlesList.tsx";
import { useAuthStore } from "../store/store.ts";
import ErrorBlock from "../components/ui/error-block/ErrorBlock.tsx";
import { Link, useLoaderData, useNavigate, useSearchParams } from "react-router-dom";
import { formatString } from "../utils/FormatUtil.ts";
import { ArticleLoaderOutput } from "../routes/loaders/ArticlesLoader.ts";
import Button from "../components/ui/button/Button.tsx";
import { useEffect, useRef } from "react";
import ProtectedButton from "../components/ui/button/ProtectedButton.tsx";

export type ArticleFilter = "published" | "pending";

function getOppositeFilter(articlesFilter: ArticleFilter) {
  return articlesFilter === "pending" ? "published" : "pending";
}

const ArticlesPage = () => {
  const {selectedUser} = useAuthStore();
  const [searchParams] = useSearchParams();
  const {dispatchTriggerArticleInd} = useAuthStore();
  const filter: ArticleFilter =
    (searchParams.get("filter") as ArticleFilter) || "published";
  const {data: articles, error} = useLoaderData<ArticleLoaderOutput>();
  const navigate = useNavigate();
  const buttonText = formatString(getOppositeFilter(filter));
  const hasRunNoPending = useRef(false);

  useEffect(() => {
    if (filter === "pending" && !articles && !hasRunNoPending.current) {
      hasRunNoPending.current = true;
      dispatchTriggerArticleInd(false);
      navigate(`?filter=published`, {replace: true});
    }
  }, [filter, articles, dispatchTriggerArticleInd, navigate]);

  return (
    <motion.div
      className="max-w-5xl mx-auto px-4 py-6 sm:py-8 space-y-6"
      initial={ {opacity: 0, y: 20} }
      animate={ {opacity: 1, y: 0} }
      transition={ {duration: 0.4} }
    >
      <div className="mb-6">
        <motion.h2
          className="text-2xl sm:text-3xl font-bold text-slate-300 text-center mb-4"
          initial={ {opacity: 0, y: -10} }
          animate={ {opacity: 1, y: 0} }
          transition={ {duration: 0.3, delay: 0.1} }
        >
          { `${ formatString(filter) } Articles` }
        </motion.h2>

        <div className="flex justify-center gap-4 sm:grid sm:grid-cols-3 sm:gap-6 sm:items-center">
          <div className="sm:col-start-1 sm:row-start-1 sm:justify-self-start">
            <ProtectedButton
              onClick={ () => navigate("post-article") }
              buttonType="cta"
            >
              Post Article
            </ProtectedButton>
          </div>

          { (selectedUser?.userIndications?.pendingArticles || filter === 'pending') && (
            <motion.div
              className="sm:col-start-3 sm:row-start-1 sm:justify-self-end"
              initial={ {opacity: 0, x: 10} }
              animate={ {opacity: 1, x: 0} }
              transition={ {duration: 0.3, delay: 0.2} }
            >
              <Link to={ `?filter=${ getOppositeFilter(filter) }` }>
                <Button buttonType="primary">{ buttonText }</Button>
              </Link>
            </motion.div>
          ) }
        </div>
      </div>

      { error && (
        <motion.div
          className="flex justify-center items-center w-full h-32 sm:h-40"
          initial={ {opacity: 0} }
          animate={ {opacity: 1} }
          transition={ {duration: 0.3} }
        >
          <ErrorBlock title="Article Error" message={ error }/>
        </motion.div>
      ) }

      { !error && articles && (
        <motion.div
          initial={ {opacity: 0} }
          animate={ {opacity: 1} }
          transition={ {duration: 0.3, delay: 0.1} }
        >
          <ArticlesList articles={ articles }/>
        </motion.div>
      ) }
    </motion.div>
  );
};

export default ArticlesPage;