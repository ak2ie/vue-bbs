# URL 設計

| メソッド | パスとクエリ              | 処理                     |
| -------- | ------------------------- | ------------------------ |
| GET      | /thread                   | スレッド一覧を返却       |
| POST     | /thread                   | スレッド作成             |
| GET      | /thread/:threadId         | スレッドの投稿一覧を返却 |
| POST     | /thread/:threadId         | スレッドに投稿           |
| GET      | /thread/:threadId/:postId | スレッドの投稿を返却     |
| GET      | /token                    | ワンタイムトークンを返却 |
