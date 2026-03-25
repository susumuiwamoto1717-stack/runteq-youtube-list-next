import { getQuestions, TAGS } from "@/lib/questions";

export default function QuestionsPage() {
  const questions = getQuestions();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">Q&A</h1>
      </div>
      <div className="flex flex-wrap gap-1">
        {TAGS.map((tag) => (
          <span
            key={tag}
            className="text-xs px-3 py-1 rounded-full border bg-white text-gray-600 border-gray-300"
          >
            {tag}
          </span>
        ))}
      </div>
      {questions.length > 0 ? (
        <div className="space-y-3">
          {questions.map((q, i) => {
            const c: Record<string, string> = {
              AI: "bg-purple-100 text-purple-700",
              転職: "bg-green-100 text-green-700",
              学習: "bg-amber-100 text-amber-700",
              技術: "bg-cyan-100 text-cyan-700",
              キャリア: "bg-orange-100 text-orange-700",
            };
            return (
              <details
                key={q.id}
                className="bg-white rounded-lg border border-gray-200 group"
              >
                <summary className="flex items-center gap-3 px-5 py-4 cursor-pointer hover:bg-orange-50 transition list-none">
                  <span className="text-xs text-gray-400 w-6 text-right">
                    {i + 1}
                  </span>
                  {q.tag && (
                    <span
                      className={`shrink-0 text-xs font-medium px-2 py-0.5 rounded ${c[q.tag] || "bg-gray-100 text-gray-600"}`}
                    >
                      {q.tag}
                    </span>
                  )}
                  <span className="flex-1 text-sm font-medium text-gray-800">
                    {q.body}
                  </span>
                  <span className="shrink-0 text-gray-400 text-xs group-open:rotate-90 transition-transform">
                    ▶
                  </span>
                </summary>
                <div className="px-5 pb-5 space-y-5 border-t border-gray-100 pt-4">
                  {q.youtube_answer && (
                    <div className="border-l-4 border-orange-400 pl-4">
                      <p className="text-sm font-bold text-orange-600 mb-2">
                        📺 YouTube (NotebookLM)
                      </p>
                      <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                        {q.youtube_answer}
                      </p>
                    </div>
                  )}
                  {q.runteq_answer && (
                    <div className="border-l-4 border-orange-600 pl-4">
                      <p className="text-sm font-bold text-orange-700 mb-2">
                        🤖 ロボらんてくんZ
                      </p>
                      <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                        {q.runteq_answer}
                      </p>
                    </div>
                  )}
                </div>
              </details>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center text-gray-500">
          まだ質問がありません。
        </div>
      )}
    </div>
  );
}
