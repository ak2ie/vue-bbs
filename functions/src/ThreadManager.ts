import { Thread } from "./Thread";
import { Comment } from "./Comment";
import * as admin from "firebase-admin";

/**
 * スレッド
 */
export class ThreadManager {
  /**
   * 全スレッドを取得する
   * @return {Promise<Array<Thread>>} スレッド一覧
   */
  public async getAllThreads(): Promise<Array<Thread>> {
    const threadRef = await admin.firestore()
      .collection("VueBBS")
      .doc("Thread")
      .collection("List")
      .get();
    const threads: Array<Thread> = [];
    if (threadRef.empty) {
      return threads;
    }
    for (const record of threadRef.docs) {
      threads.push(new Thread(
        record.id,
        record.data().title,
        record.data().description,
        record.data().name,
        record.data().createdAt.toDate()
      ));
    }
    return threads;
  }

  /**
   * 個別スレッドの全投稿を取得する
   * @param {string} threadId スレッドID
   * @return {Promise<Array<Comment>>} 投稿一覧
   */
  public async getAllComments(threadId: string): Promise<Array<Comment>> {
    const comments: Array<Comment> = [];

    const threadRef = await admin.firestore()
      .collection("VueBBS")
      .doc("Thread")
      .collection("List")
      .doc(threadId)
      .collection("comments")
      .get();
    if (threadRef.empty) {
      return comments;
    }

    for (const comment of threadRef.docs) {
      comments.push(new Comment(
        comment.data().name,
        comment.data().text,
        comment.data().createdAt.toDate()
      ));
    }
    return comments;
  }

  /**
   * スレッドを作成する
   * @param {string} title スレッドタイトル
   * @param {string} name 作成者
   * @param {string} description スレッド説明
   * @param {string} ipAddress リクエスト元IPアドレス
   * @return {Promise<Thread>} 作成したスレッドの情報
   */
  public async createThread(
    title: string, name: string, description: string, ipAddress: string
  ): Promise<Thread> {
    if (!this.canCreateThread(
      title, name, description, ipAddress
    )) {
      throw new Error("");
    }
    // FireStoreに保存
    const doc = await admin.firestore()
      .collection("VueBBS")
      .doc("Thread")
      .collection("List")
      .add({
        title: title,
        name: name,
        description: description,
        createdAt: new Date(),
      });
    // 返却データ生成のため、作成したスレッドの情報を取得
    const threadSnapshot = await doc.get();
    const thread = threadSnapshot.data();
    if (typeof thread === "undefined") {
      // 型不正の対策
      throw new Error();
    }
    return new Thread(
      doc.id,
      thread.title,
      thread.description,
      thread.name,
      thread.createdAt.toDate()
    );
  }

  /**
   * スレッド作成可否を判断する
   * @param {string} title スレッドタイトル
   * @param {string} name 作成者
   * @param {string} description スレッド説明
   * @param {string} ipAddress リクエスト元IPアドレス
   * @return {boolean} 作成可否（true: 可能、false: 不可）
   */
  private canCreateThread(
    title: string, name: string, description: string, ipAddress: string
  ): boolean {
    const regexp = new RegExp("死ね|殺す");
    if (regexp.test(title) || regexp.test(name) || regexp.test(description)) {
      return false;
    }
    if (ipAddress === "") {
      return false;
    }
    console.log(`スレッド作成可能: title=${title}, name=${name}, ` +
      `description=${description}, ipAddress=${ipAddress}`);
    return true;
  }

  /**
   * スレッドに投稿する
   * @param {string} threadId スレッドID
   * @param {string} name 投稿者名
   * @param {string} text 投稿本文
   * @return {boolean} 投稿結果（true: 正常、false: 異常）
   */
  public async postComment(
    threadId: string, name: string, text: string
  ): Promise<boolean> {
    if (!this.canPostComment(name, text)) {
      return false;
    }
    await admin.firestore()
      .collection("VueBBS")
      .doc("Thread")
      .collection("List")
      .doc(threadId)
      .collection("comments")
      .add({
        name: name,
        text: text,
        createdAt: new Date(),
      });

    return true;
  }

  /**
   * 投稿できるかを判断する
   * @param {string} name 投稿者名
   * @param {string} text 投稿本文
   * @return {boolean} true:投稿可能 false:投稿不可
   */
  private canPostComment(name: string, text: string): boolean {
    const regexp = new RegExp("死ね|殺す");
    if (regexp.test(name) || regexp.test(text)) {
      return false;
    }
    return true;
  }

  /**
   * スレッド情報を取得する
   * @param {string} threadId スレッドID
   * @return {Thread} スレッド情報（投稿は含まない）
   */
  public async getThread(threadId: string): Promise<Thread> {
    const threadRef = await admin.firestore()
      .collection("VueBBS")
      .doc("Thread")
      .collection("List")
      .doc(threadId)
      .get();
    if (!threadRef.exists) {
      throw new Error();
    }
    const thread = threadRef.data();
    if (typeof thread === "undefined") {
      throw new Error();
    }
    return new Thread(
      threadId,
      thread.title,
      thread.description,
      thread.name,
      thread.createdAt.toDate()
    );
  }
}
