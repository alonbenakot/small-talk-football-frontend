import { Link } from "react-router-dom";
import ArticleCard from "./ArticleCard.tsx";
import ArticleModel from "./models/ArticleModel.ts";
import { motion } from "framer-motion";

type Props = {
  articles: ArticleModel[] | undefined
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1, // Delay between children
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const ArticlesList = ({ articles }: Props) => {
  return (
    <div className="px-4 py-6">
      <motion.ul
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {articles?.map((article: ArticleModel) => (
          <motion.li
            key={article.id}
            className="rounded-2xl shadow-md"
            variants={itemVariants}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <Link to={`${article.id}`}>
            <ArticleCard
              id={article.id}
              title={article.title}
              author={article.author}
              text={article.text}
              published={article.published}
            />
            </Link>
          </motion.li>
        ))}
      </motion.ul>
    </div>
  );
};

export default ArticlesList;
