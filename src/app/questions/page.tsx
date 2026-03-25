"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { TAGS } from "@/lib/questions";
import type { Question } from "@/lib/questions";

// 初期データ
import { getQuestions } from "@/lib/questions";
const initialQuestions = getQuestions();

const STORAGE_KEY = "runteq-youtube-list-questions";

const CATEGORY_COLORS: Record<string, string> = {
  AI: "bg-purple-100 text-purple-700",
  転職: "bg-green-100 text-green-700",
  学習: "bg-amber-100 text-amber-700",
  技術: "bg-cyan-100 text-cyan-700",
  キャリア: "bg-orange-100 text-orange-700",
};

function loadQuestions(): Question[] {
  if (typeof window === "undefined") return initialQuestions;
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) return JSON.parse(saved);
  return initialQuestions;
}

function saveQuestions(questions: Question[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(questions));
}

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    setQuestions(loadQuestions());
  }, []);

  function handleDelete(id: string) {
    if (!confirm("この質問を削除しますか？")) return;
    const updated = questions.filter((q) => q.id !== id);
    setQuestions(updated);
    saveQuestions(updated);
  }

  function handleAdd(q: Omit<Question, "id">) {
    const newQ: Question = { ...q, id: Date.now().toString() };
    const updated = [newQ, ...questions];
    setQuestions(updated);
    saveQuestions(updated);
    setShowForm(false);
  }

  function handleUpdate(id: string, data: Omit<Question, "id">) {
    const updated = questions.map((q) => (q.id === id ? { ...data, id } : q));
    setQuestions(updated);
    saveQuestions(updated);
    setEditingId(null);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">Q&A</h1>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
          }}
          className="bg-orange-500 text-white text-sm px-4 py-2 rounded-md hover:bg-orange-600 transition cursor-pointer"
        >
          {showForm ? "キャンセル" : "+ 質問を追加"}
        </button>
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

      {/* 追加フォーム */}
      {showForm && (
        <QuestionForm
          onSubmit={handleAdd}
          onCancel={() => setShowForm(false)}
          submitLabel="質問を追加する"
        />
      )}

      {/* 質問リスト */}
      {questions.length > 0 ? (
        <div className="space-y-3">
          {questions.map((q, i) => (
            <div key={q.id}>
              {editingId === q.id ? (
                <QuestionForm
                  initial={q}
                  onSubmit={(data) => handleUpdate(q.id, data)}
                  onCancel={() => setEditingId(null)}
                  submitLabel="更新する"
                />
              ) : (
                <details className="bg-white rounded-lg border border-gray-200 group">
                  <summary className="flex items-center gap-3 px-5 py-4 cursor-pointer hover:bg-orange-50 transition list-none">
                    <span className="text-xs text-gray-400 w-6 text-right">
                      {i + 1}
                    </span>
                    {q.tag && (
                      <span
                        className={`shrink-0 text-xs font-medium px-2 py-0.5 rounded ${CATEGORY_COLORS[q.tag] || "bg-gray-100 text-gray-600"}`}
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
                    <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                      <button
                        onClick={() => setEditingId(q.id)}
                        className="text-xs text-orange-500 hover:text-orange-700 transition cursor-pointer"
                      >
                        ✏ 編集
                      </button>
                      <button
                        onClick={() => handleDelete(q.id)}
                        className="text-xs text-red-400 hover:text-red-600 transition cursor-pointer"
                      >
                        🗑 削除
                      </button>
                    </div>
                  </div>
                </details>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center text-gray-500">
          まだ質問がありません。「+ 質問を追加」から質問を投稿しましょう。
        </div>
      )}
    </div>
  );
}

function QuestionForm({
  initial,
  onSubmit,
  onCancel,
  submitLabel,
}: {
  initial?: Question;
  onSubmit: (data: Omit<Question, "id">) => void;
  onCancel: () => void;
  submitLabel: string;
}) {
  const [tag, setTag] = useState(initial?.tag || "");
  const [body, setBody] = useState(initial?.body || "");
  const [youtubeAnswer, setYoutubeAnswer] = useState(
    initial?.youtube_answer || "",
  );
  const [runteqAnswer, setRunteqAnswer] = useState(
    initial?.runteq_answer || "",
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim()) return alert("質問内容を入力してください");
    onSubmit({
      body,
      tag,
      youtube_answer: youtubeAnswer,
      runteq_answer: runteqAnswer,
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-lg border border-gray-200 p-6 space-y-5"
    >
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          タグ
        </label>
        <div className="flex flex-wrap gap-3">
          {TAGS.map((t) => (
            <label
              key={t}
              className="inline-flex items-center gap-1.5 cursor-pointer"
            >
              <input
                type="radio"
                name="tag"
                value={t}
                checked={tag === t}
                onChange={() => setTag(t)}
                className="accent-orange-500"
              />
              <span className="text-sm text-gray-700">{t}</span>
            </label>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          質問内容
        </label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
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
          value={youtubeAnswer}
          onChange={(e) => setYoutubeAnswer(e.target.value)}
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
          value={runteqAnswer}
          onChange={(e) => setRunteqAnswer(e.target.value)}
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
          {submitLabel}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="text-sm text-gray-500 hover:text-gray-700 cursor-pointer"
        >
          キャンセル
        </button>
      </div>
    </form>
  );
}
