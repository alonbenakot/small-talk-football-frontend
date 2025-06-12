import { motion } from "framer-motion";
import ArticlesList from "../components/features/articles/ArticlesList.tsx";
import { useAuthStore } from "../store/store.ts";
import ErrorBlock from "../components/ui/error-block/ErrorBlock.tsx";
import { Link, useLoaderData, useSearchParams } from "react-router-dom";
import { formatString } from "../utils/FormatUtil.ts";
import { ArticleLoaderOutput } from "../routes/loaders/ArticleLoader.ts";
import Button from "../components/ui/button/Button.tsx";

export type ArticleFilter = "published" | "pending";

function getOppositeFilter(articlesFilter: ArticleFilter) {
  return articlesFilter === "pending" ? "published" : "pending";
}

const ArticlesPage = () => {
  const { selectedUser } = useAuthStore();
  const [searchParams] = useSearchParams();
  const filter: ArticleFilter =
    (searchParams.get("filter") as ArticleFilter) || "published";
  const { data: articles, error } = useLoaderData<ArticleLoaderOutput>();
  const buttonText = formatString(getOppositeFilter(filter));

  return (
    <motion.div
      className="max-w-5xl mx-auto px-4 py-8 space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="relative mb-6">
        <motion.h2
          className="text-3xl font-bold text-gray-800 text-center"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          {`${formatString(filter)} Articles`}
        </motion.h2>

        {selectedUser?.userIndications.pendingArticles && (
          <motion.div
            className="absolute right-0 top-1/2 -translate-y-1/2"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Link to={`?filter=${getOppositeFilter(filter)}`}>
              <Button buttonType="primary">{buttonText}</Button>
            </Link>
          </motion.div>
        )}
      </div>

      {error && (
        <motion.div
          className="flex justify-center items-center w-full h-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <ErrorBlock title="Article Error" message={error} />
        </motion.div>
      )}

      {!error && articles && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <ArticlesList articles={articles} />
        </motion.div>
      )}
    </motion.div>
  );
};

export default ArticlesPage;
