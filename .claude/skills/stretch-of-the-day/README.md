# stretch-of-the-day

日本語解説の YouTube ストレッチ動画を毎日5本(首こり / 肩こり / 姿勢 / お腹 / 腰背中)紹介する Claude skill。

## 起動方法

- `/stretch-of-the-day` を入力、または
- 「今日のストレッチ」「肩こり動画教えて」など自然文で依頼

## 動作

1. `videos.json` を読み込む
2. 当日日付の `day_of_year` で各カテゴリから1本ずつ決定的に選択
3. URL・所要時間・チャンネル・一言コメント付きで提示
4. 必要に応じて WebSearch でハイブリッド検索

## ファイル

- `SKILL.md` — skill 本体(フロントマター + 指示)
- `videos.json` — キュレーション済み YouTube 動画リスト
- `README.md` — このファイル

## 更新

リンク切れや新しいおすすめ動画があれば `videos.json` を PR で更新してください。
