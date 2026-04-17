# 新PCセットアップガイド: RUNTEQ YouTube 毎朝7時自動チェック

## 概要

RUNTEQ公式YouTubeチャンネルの新着動画を毎朝7時に自動チェックし、以下を実行するシステムです。

1. YouTube RSSフィード（またはチャンネルページ）から新着動画を検出
2. `runteq_videos.json` / `video_dates.json` / `seen_video_ids.txt` を更新
3. NotebookLMにソースとして追加
4. インフォグラフィックを生成
5. Q&Aを追加（`questions.ts`）
6. Vercelにデプロイ

---

## Step 1: リポジトリのクローンと親ディレクトリの確認

```bash
# このリポジトリをクローン（youtube-listアプリ）
git clone https://github.com/susumuiwamoto1717-stack/runteq-youtube-list-next.git youtube-list
cd youtube-list
npm install
```

### 親ディレクトリの構成（youtube-list の1つ上）

以下のファイルが youtube-list と同じ階層に必要です。旧PCからコピーしてください。

```
202_Youtube/
  check_new_videos.sh        # メインスクリプト（毎朝7時実行）
  runteq_videos.json          # 全動画データ（787件）
  seen_video_ids.txt          # 既知動画ID（787件）
  check_log.txt               # 実行ログ
  youtube-list/               # ← このリポジトリ
    src/
      runteq_videos.json      # アプリ用コピー
      video_dates.json        # 日付データ
    public/infographics/      # インフォグラフィック画像
```

---

## Step 2: 必要なツールのインストール

```bash
# Node.js（Next.js用）
# 既にインストール済みなら不要

# Vercel CLI
npm i -g vercel
vercel login  # susumuiwamoto1717@gmail.com でログイン

# nlm CLI（NotebookLM用）
pip install notebooklm-cli
# または
pipx install notebooklm-cli

# nlm 認証（Gmail: susumuiwamoto1717@gmail.com）
nlm login
# プロファイル名「gmail」でログインする
```

---

## Step 3: パスの特定と check_new_videos.sh の修正

新PCでのプロジェクトパスを確認してください。

```bash
# 実際のパスを確認
pwd
# 例: /Users/susumu.iwamoto/Documents/XXXXX/202_Youtube
```

`check_new_videos.sh` の中のパスは `SCRIPT_DIR` で自動解決されるので、スクリプト自体の修正は不要です。

---

## Step 4: launchd plist の作成（毎朝7時自動実行）

以下のファイルを作成してください。**パスは新PCに合わせて修正が必要です。**

```bash
# パスを変数に設定（ここを新PCのパスに変更）
YOUTUBE_DIR="/Users/susumu.iwamoto/Documents/XXXXX/202_Youtube"
```

```bash
cat > ~/Library/LaunchAgents/com.runteq.youtube-checker.plist << EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.runteq.youtube-checker</string>
    <key>ProgramArguments</key>
    <array>
        <string>/bin/bash</string>
        <string>${YOUTUBE_DIR}/check_new_videos.sh</string>
    </array>
    <key>StartCalendarInterval</key>
    <dict>
        <key>Hour</key>
        <integer>7</integer>
        <key>Minute</key>
        <integer>0</integer>
    </dict>
    <key>StandardOutPath</key>
    <string>${YOUTUBE_DIR}/launchd_stdout.log</string>
    <key>StandardErrorPath</key>
    <string>${YOUTUBE_DIR}/launchd_stderr.log</string>
    <key>EnvironmentVariables</key>
    <dict>
        <key>PATH</key>
        <string>/usr/local/bin:/usr/bin:/bin:/opt/homebrew/bin:/Users/susumu.iwamoto/.local/bin</string>
        <key>CHANNEL_ID</key>
        <string>UCwjx6ZG4pwCvAPSozYEWymA</string>
        <key>SEEN_FILE</key>
        <string>${YOUTUBE_DIR}/seen_video_ids.txt</string>
    </dict>
</dict>
</plist>
EOF
```

### launchd を登録・起動

```bash
# 古い設定があれば解除
launchctl unload ~/Library/LaunchAgents/com.runteq.youtube-checker.plist 2>/dev/null

# 新しい設定を読み込み
launchctl load ~/Library/LaunchAgents/com.runteq.youtube-checker.plist

# 確認
launchctl list | grep runteq
# 出力例: -  0  com.runteq.youtube-checker （0なら正常）
```

---

## Step 5: フルディスクアクセス権限の設定（重要）

旧PCでは `Operation not permitted` エラーが出ていました。これを防ぐために：

1. **システム設定** > **プライバシーとセキュリティ** > **フルディスクアクセス**
2. 以下を追加（+ ボタン → Cmd+Shift+G でパスを入力）：
   - `/bin/bash`
   - `/usr/bin/env`
   - ターミナルアプリ（Terminal.app または iTerm）
3. チェックをONにする

---

## Step 6: 動作テスト

```bash
# 手動でスクリプトを実行してテスト
cd /path/to/202_Youtube
bash check_new_videos.sh

# ログを確認
cat check_log.txt | tail -5

# エラーログを確認
cat launchd_stderr.log
```

---

## 重要な情報まとめ

### アカウント情報

- **Vercel**: susumu-iwamotos-projects/youtube-list
- **Vercel本番URL**: https://youtube-list-weld.vercel.app
- **GitHub**: https://github.com/susumuiwamoto1717-stack/runteq-youtube-list-next
- **NotebookLM Notebook ID**: `ed2ce43e-49be-439d-9c9e-6ba01fe550b2`
- **NotebookLM プロファイル**: `gmail`（susumuiwamoto1717@gmail.com）
- **YouTubeチャンネルID**: `UCwjx6ZG4pwCvAPSozYEWymA`

### 7ステップワークフロー（手動追加時）

新着動画を手動で追加する場合、以下の7ステップを全て実行すること：

1. `runteq_videos.json` の先頭にエントリ追加（title, url, meta=ISO日付）
2. `seen_video_ids.txt` にvideo IDを追加
3. `youtube-list/src/runteq_videos.json` に同期コピー
4. `youtube-list/src/video_dates.json` にvideo_id: ISO日付を追加（**必須**）
5. NotebookLM (notebook: ed2ce43e, profile: gmail) に `source_add`
6. インフォグラフィック生成 → `youtube-list/public/infographics/{video_id}.png` にDL
7. `vercel --prod --yes` でデプロイ

### Q&A追加ルール

- ファイル: `youtube-list/src/lib/questions.ts`
- 現在の最終ID: **17**（次は18から）
- NotebookLMにクエリして `youtube_answer` を生成
- `runteq_answer` は「ロボランてくんZ」口調で作成
- tagは `["AI", "転職", "学習", "技術", "キャリア", "その他"]` から選択

### RSSフィード問題（2026-04-16時点）

YouTube RSSフィード（`https://www.youtube.com/feeds/videos.xml?channel_id=...`）が404を返すことがあります。代替手段としてチャンネルページ（`https://www.youtube.com/@_runteq_/videos`）からスクレイピングで検出しています。

### Claude Code cronジョブ（セッション限定）

Claude Codeセッション内で `CronCreate` を使って毎朝7時のチェックを登録できますが、セッション終了で消えます（最大7日間）。永続的に動かすには上記のlaunchd設定が必要です。

### 既知の問題と対策

| 問題                               | 対策                                                                |
| ---------------------------------- | ------------------------------------------------------------------- |
| launchd Operation not permitted    | フルディスクアクセスに /bin/bash を追加                             |
| RSSフィード 404                    | チャンネルページからスクレイピングで代替                            |
| インフォグラフィックDL失敗（curl） | `download_artifact` MCP経由でDL（curl直接はGoogle認証でHTML化する） |
| video_dates.json 未登録            | 日付ソートで最下位に沈むので必ず登録する                            |

---

## 現在のデータ状態（2026-04-17時点）

- 動画総数: **787件**
- Q&A数: **17件**（ID: 1〜17）
- インフォグラフィック: public/infographics/ に格納
- 最新動画: 「業界別DX最前線｜製造・物流・金融・医療で今何が起きているか」（2026-04-16）
