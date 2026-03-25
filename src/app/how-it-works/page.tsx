export default function HowItWorksPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold text-gray-800 text-center">
        このアプリの仕組み
      </h1>
      <p className="text-center text-gray-500">
        Next.js + Vercel で作られたこのアプリの構造を解説します
      </p>

      <Section title="1. 全体の流れ">
        <Code>{`ブラウザ → Vercel Edge Network → Next.js Server Component → 静的HTML
                                                    ↓
                                            runteq_videos.json（動画データ）
                                            questions.ts（Q&Aデータ）
                                            /public/infographics/（画像）`}</Code>
      </Section>

      <Section title="2. ファイル構成">
        <Code>{`youtube-list/
├── src/
│   ├── app/                    ← App Router（ページ定義）
│   │   ├── page.tsx            ← トップページ (/)
│   │   ├── layout.tsx          ← 全ページ共通レイアウト
│   │   ├── videos/
│   │   │   ├── page.tsx        ← 動画一覧 (/videos)
│   │   │   └── [id]/page.tsx   ← 動画詳細 (/videos/:id)
│   │   ├── questions/
│   │   │   └── page.tsx        ← Q&A (/questions)
│   │   └── how-it-works/
│   │       └── page.tsx        ← この解説ページ
│   ├── lib/
│   │   ├── videos.ts           ← 動画データの読み込み・カテゴリ分類
│   │   └── questions.ts        ← Q&Aデータ
│   └── runteq_videos.json      ← YouTube動画データ（130本）
├── public/
│   └── infographics/           ← NotebookLMで生成した画像
└── package.json`}</Code>
      </Section>

      <Section title="3. Rails vs Next.js 比較">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">概念</th>
                <th className="px-4 py-2 text-left">Rails</th>
                <th className="px-4 py-2 text-left">Next.js</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr>
                <td className="px-4 py-2">ルーティング</td>
                <td className="px-4 py-2">config/routes.rb</td>
                <td className="px-4 py-2">app/フォルダ構造</td>
              </tr>
              <tr>
                <td className="px-4 py-2">ビュー</td>
                <td className="px-4 py-2">.html.erb</td>
                <td className="px-4 py-2">.tsx (React)</td>
              </tr>
              <tr>
                <td className="px-4 py-2">コントローラー</td>
                <td className="px-4 py-2">app/controllers/</td>
                <td className="px-4 py-2">Server Component内で直接</td>
              </tr>
              <tr>
                <td className="px-4 py-2">モデル</td>
                <td className="px-4 py-2">ActiveRecord</td>
                <td className="px-4 py-2">lib/内のTS関数</td>
              </tr>
              <tr>
                <td className="px-4 py-2">CSS</td>
                <td className="px-4 py-2">Tailwind (ビルド)</td>
                <td className="px-4 py-2">Tailwind (自動)</td>
              </tr>
              <tr>
                <td className="px-4 py-2">デプロイ</td>
                <td className="px-4 py-2">Render (複雑)</td>
                <td className="px-4 py-2">Vercel (push即デプロイ)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-lg font-bold text-orange-700 mb-4">{title}</h2>
      {children}
    </section>
  );
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <pre className="bg-gray-900 text-green-400 font-mono text-sm p-4 rounded-lg overflow-x-auto whitespace-pre">
      {children}
    </pre>
  );
}
