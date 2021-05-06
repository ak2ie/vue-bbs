import * as express from "express";
import * as cors from "cors";
import * as admin from "firebase-admin";
import { ThreadManager } from "./ThreadManager";

const app = express();

// JSON対応
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

/* --------------------------------------------------------
 *  Firebase初期化
 * -------------------------------------------------------- */
admin.initializeApp();

/* --------------------------------------------------------
 *  API
 * -------------------------------------------------------- */
/* ---------- スレッド一覧 ---------- */
app.get("/thread", async (request, response) => {
  const threadManager = new ThreadManager();
  const threads = await threadManager.getAllThreads();
  const result = [];
  for (const thread of threads) {
    // console.log(`スレッド => {name: ${thread.Name}}`);
    result.push({
      id: thread.Id,
      title: thread.Title,
      name: thread.Name,
      description: thread.Description,
      createdAt: thread.createdAt,
    });
  }
  response.json(result);
});

/* ---------- スレッド作成 ---------- */
app.post("/thread", async (request, response) => {
  const threadManager = new ThreadManager();
  const ip = getIP(request);
  const thread = await threadManager.createThread(
    request.body.title,
    request.body.name,
    request.body.description,
    ip
  );
  console.log("スレッドを作成しました");
  response.json({
    id: thread.Id,
    name: thread.Name,
    title: thread.Title,
    description: thread.Description,
    createdAt: thread.createdAt,
  });
});

/* ---------- 投稿 ---------- */
app.post("/thread/:threadId", async (request, response) => {
  const threadManager = new ThreadManager();
  const isSusscess = await threadManager.postComment(
    request.params.threadId,
    request.body.name,
    request.body.text
  );
  response.send({
    error: !isSusscess,
  });
});

/* ---------- 投稿取得 ---------- */
app.get("/thread/:threadId", async (request, response) => {
  // リクエスト情報チェック
  const threadId = request.params.threadId;
  if (typeof threadId !== "string") {
    response.status(500).send();
    return;
  }
  // 投稿取得
  const threadManager = new ThreadManager();
  const comments = await threadManager.getAllComments(threadId);
  const thread = await threadManager.getThread(threadId);
  // 返却値生成
  const result = {
    title: thread.Title,
    description: thread.Description,
    comments: new Array<Record<string, unknown>>(),
  };
  for (const comment of comments) {
    console.log(`コメント：${comment.name}, 本文：${comment.text}`);
    result.comments.push({
      name: comment.name,
      text: comment.text,
      createdAt: comment.createdAt,
    });
  }
  response.json(result);
});

/**
 * IPアドレスを取得する
 * @param {express.Request} request  Expressのリクエスト
 * @return {string} IPアドレス（取得不可の時は空文字）
 */
function getIP(request: express.Request): string {
  const ip = request.headers["x-forwarded-for"] ||
    request.connection.remoteAddress;
  if (typeof ip === "undefined") {
    return "";
  } else if (typeof ip === "object") {
    return ip[0];
  }
  return ip;
}

module.exports = app;
