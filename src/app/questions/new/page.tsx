import Link from "next/link";
import { TAGS } from "@/lib/questions";

export default function NewQuestionPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-xl font-bold text-gray-800">質問を追加</h1>
      <form className="bg-white rounded-lg border border-gray-200 p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            タグ
          </label>
          <div className="flex flex-wrap gap-3">
            {TAGS.map((tag) => (
              <label
                key={tag}
                className="inline-flex items-center gap-1.5 cursor-pointer"
              >
                <input
                  type="radio"
                  name="tag"
                  value={tag}
                  className="accent-orange-500"
                />
                <span className="text-sm text-gray-700">{tag}</span>
              </label>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            質問内容
          </label>
          <textarea
            name="body"
            rows={3}
            placeholder="例：AI時代に必要なプログラミングスキルとは何ですか？"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-y"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-orange-600 mb-1">
            📺 YouTube (NotebookLM) の回答
          </label>
          <textarea
            name="youtube_answer"
            rows={8}
            placeholder="NotebookLMからの回答を貼り付けてください..."
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-y"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-orange-700 mb-1">
            🤖 ロボらんてくんZの回答
          </label>
          <textarea
            name="runteq_answer"
            rows={8}
            placeholder="ロボらんてくんZからの回答を貼り付けてください..."
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-y"
          />
        </div>
        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="bg-orange-500 text-white text-sm px-6 py-2.5 rounded-md hover:bg-orange-600 cursor-pointer transition"
          >
            質問を追加する
          </button>
          <Link
            href="/questions"
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            キャンセル
          </Link>
        </div>
      </form>
    </div>
  );
}
