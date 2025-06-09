import ArticleModel from "./models/ArticleModel.ts";


const ArticleCard = ({title, author}: ArticleModel) => {
  return (
    <div
      className="flex flex-col gap-2 p-4 bg-gray-50 rounded-xl shadow-sm hover:border-emerald-600 hover:border-2 transition-all duration-50 h-full">
      <h2 className="text-lg font-bold text-gray-900">{ title }</h2>
      <h4 className="text-sm text-gray-600 italic">{ author }</h4>
    </div>
  )
}
export default ArticleCard;