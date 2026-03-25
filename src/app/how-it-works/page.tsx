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
│   │   │   ├── VideoList.tsx   ← クライアントコンポーネント（検索・フィルタ）
│   │   │   └── [id]/page.tsx   ← 動画詳細 (/videos/:id)
│   │   ├── questions/
│   │   │   ├── page.tsx        ← Q&A (/questions)
│   │   │   └── new/page.tsx    ← 質問追加フォーム
│   │   └── how-it-works/
│   │       └── page.tsx        ← この解説ページ
│   ├── lib/
│   │   ├── videos.ts           ← 動画データの読み込み・カテゴリ分類
│   │   └── questions.ts        ← Q&Aデータ
│   ├── runteq_videos.json      ← YouTube動画データ（130本）
│   └── video_dates.json        ← 動画の公開日データ
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

      {/* コード分析レポート */}
      <Section title="4. コード分析レポート（BUD分析）">
        <p className="text-sm text-gray-700 mb-4">
          このアプリのコードを{" "}
          <strong>B（ボトルネック）・U（不必要）・D（重複）</strong>{" "}
          の3観点で分析した結果です。
        </p>

        <h3 className="text-sm font-bold text-gray-800 mt-4 mb-2">
          設計の鍵（5つ）
        </h3>
        <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
          <li>
            <strong>DBなし静的JSON駆動</strong> —
            runteq_videos.jsonがDB代わり。インフラコストゼロ
          </li>
          <li>
            <strong>ファイルベースルーティング</strong> —
            フォルダ構造＝URLパス。routes.rb不要
          </li>
          <li>
            <strong>Server Component統合</strong> —
            コントローラーとビューが1ファイルに融合
          </li>
          <li>
            <strong>キーワード自動分類</strong> —
            辞書＋ループで130本を自動カテゴリ分け
          </li>
          <li>
            <strong>layout.tsx共通UI管理</strong> —
            Railsのapplication.html.erbと同じ役割
          </li>
        </ul>

        <h3 className="text-sm font-bold text-gray-800 mt-6 mb-2">
          改善ポイント
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-3 py-2 text-left">分類</th>
                <th className="px-3 py-2 text-left">指摘</th>
                <th className="px-3 py-2 text-left">状態</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr className="bg-green-50">
                <td className="px-3 py-2">U 不必要</td>
                <td className="px-3 py-2">
                  URL手動パース(split)が脆弱 → URL API使用
                </td>
                <td className="px-3 py-2 text-green-700 font-bold">修正済</td>
              </tr>
              <tr className="bg-green-50">
                <td className="px-3 py-2">U 不必要</td>
                <td className="px-3 py-2">
                  マジックナンバー134 → MAX_VIDEOS定数化
                </td>
                <td className="px-3 py-2 text-green-700 font-bold">修正済</td>
              </tr>
              <tr>
                <td className="px-3 py-2">D 重複</td>
                <td className="px-3 py-2">
                  CategoryBadge色マッピングが2箇所に重複
                </td>
                <td className="px-3 py-2 text-orange-600">次回対応</td>
              </tr>
              <tr>
                <td className="px-3 py-2">U 不必要</td>
                <td className="px-3 py-2">
                  Q&AデータがTS内にハードコード → JSON分離
                </td>
                <td className="px-3 py-2 text-orange-600">次回対応</td>
              </tr>
              <tr>
                <td className="px-3 py-2">B ボトルネック</td>
                <td className="px-3 py-2">getVideo()がO(N)線形探索 → Map化</td>
                <td className="px-3 py-2 text-gray-400">
                  見送り（130件で問題なし）
                </td>
              </tr>
              <tr>
                <td className="px-3 py-2">B ボトルネック</td>
                <td className="px-3 py-2">
                  fs.existsSync()が同期的 → Set事前生成
                </td>
                <td className="px-3 py-2 text-gray-400">
                  見送り（ビルド時のみ）
                </td>
              </tr>
              <tr>
                <td className="px-3 py-2">U 不必要</td>
                <td className="px-3 py-2">
                  categoryCountsがビュー層に漏れている
                </td>
                <td className="px-3 py-2 text-gray-400">見送り（実害なし）</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-sm font-bold text-gray-800 mt-6 mb-2">学び 3選</h3>
        <ol className="text-sm text-gray-700 space-y-2 list-decimal list-inside">
          <li>
            <strong>DBを捨てる設計判断</strong> —
            JSONファイルがアプリ全体を駆動する。「このデータ、本当にDB必要？」という判断ができるようになる
          </li>
          <li>
            <strong>フォルダ構造＝アプリ設計図</strong> — App
            Routerではフォルダを作ってpage.tsxを置くだけ。routes.rb → controller
            → viewの3ステップが1ステップに
          </li>
          <li>
            <strong>辞書＋ループで自動分類</strong> —
            キーワードを追加するだけで分類ルール拡張可能。手動タグ付け不要
          </li>
        </ol>
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
