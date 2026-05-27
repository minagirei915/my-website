# Movie ページ改善 設計書

**日付:** 2026-05-27  
**対象:** 海凪 澪 Official Website — Movie ページ

---

## 目的

`movie.html` の動画一覧を、再生リスト URL から最新順の静的カード HTML として生成・表示できるようにする。  
iframe を排除してリロード時の白画面問題を解消し、サムネイル + YouTube リンク方式で安定表示を実現する。

---

## アーキテクチャ

### 更新時フロー

```
node scripts/update-youtube-videos.mjs
  ① YouTube RSS フィード取得（API key 不要）
     URL: https://www.youtube.com/feeds/videos.xml?playlist_id={playlistId}
  ② data/videos.json 更新（最新順ソート・embed フラグ保持）
  ③ movie.html の YT-GRID:START〜YT-GRID:END ブロックを
     静的カード HTML で置換
```

### 閲覧時フロー

```
ブラウザが movie.html を読み込む
  → yt-video-grid に静的カードが並んでいる
  → iframe なし・fetch なし・動画セクションに JS 不要
  → カードクリック → YouTube を新規タブで開く
```

---

## 変更ファイル一覧

| ファイル | 変更内容 |
|---|---|
| `scripts/update-youtube-videos.mjs` | `writeMovieHtml()` 関数を追加し、JSON 保存後に movie.html を書き換える |
| `movie.html` | iframe ブロックを YT-GRID マーカー + 静的カードに差し替え |
| `js/movie-links.js` | 削除（iframe → サムネイル変換が不要になる） |

---

## カード HTML 構造

既存の CSS クラス（`.yt-link-card` / `.yt-link-play` / `.yt-link-badge` / `.yt-caption`）をそのまま使用する。

```html
<!-- YT-GRID:START -->
<div class="yt-video-grid">

  <div class="yt-video-item">
    <div class="yt-embed-wrap">
      <a class="yt-link-card"
         href="https://www.youtube.com/watch?v={videoId}"
         target="_blank" rel="noopener"
         aria-label="{caption} — YouTube で視聴">
        <img src="https://i.ytimg.com/vi/{videoId}/hqdefault.jpg"
             alt="{caption}" loading="lazy" />
        <span class="yt-link-play" aria-hidden="true"></span>
        <span class="yt-link-badge">YouTube</span>
      </a>
    </div>
    <p class="yt-caption">{caption}</p>
  </div>

</div>
<!-- YT-GRID:END -->
```

---

## キャプション自動クリーニング

JSON タイトルから表示用キャプションを生成するルール（優先順位順）：

| パターン | 処理 | 例 |
|---|---|---|
| `(Cover)-海凪 澪×{相手}` で終わる | ` with {相手}` を付けて除去 | `エゴロック / すりぃ with いなみ` |
| `/ 海凪澪×{相手}【...】` を含む | そのブロックを除去、`with {相手}` を末尾追加 | `絶対敵対メチャキライヤー with 晴風えそら` |
| `(Cover)-海凪 澪` で終わる | 除去 | `初恋日記 / 香椎モイミ` |
| スラッシュ前後のスペースが不揃い | 正規化 (`/` → ` / `) | `ワールド・ランプシェード / buzzG` |
| 二重スペース | 単一スペースに正規化 | — |

---

## HTML 更新境界マーカー

`update-youtube-videos.mjs` はこのコメント間だけを置換し、他の HTML は一切変更しない。

```html
<!-- YT-GRID:START -->
...生成されたカード群...
<!-- YT-GRID:END -->
```

---

## embed: false の扱い

新方式ではすべてのカードがサムネイル + YouTube リンクであり iframe を使わない。  
そのため `embed: false` は機能的には不要だが、既存フラグは `videos.json` に保持する（将来の参照用）。

---

## 更新ワークフロー（新曲追加時）

```bash
# RSS から最新データ取得 & movie.html 自動更新
node scripts/update-youtube-videos.mjs

# 確認・コミット
git add data/videos.json movie.html
git commit -m "Update movie list"
git push
```

---

## 制約・前提

- 静的サイト（GitHub Pages）、バックエンドなし
- YouTube RSS フィードは最大 15 件まで返す仕様（現時点 14 件で問題なし）
- API key を使う場合は `YOUTUBE_API_KEY` 環境変数で既存スクリプトが対応済み
- 既存の水色/ガラス調デザイン（CSS）は一切変更しない
