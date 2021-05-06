import { NuxtAxiosInstance } from "@nuxtjs/axios";
import { Comment } from "./Comment";
import { GetCommentResponse } from "./GetCommentResponse";
import { Thread } from "./Thread";
import { ThreadCreateResponse } from "./ThreadCreateResponse";

/**
 * スレッドリポジトリ
 */
export default class ThreadRepository {
  /**
   * axiosインスタンス
   */
  private readonly axios: NuxtAxiosInstance;
  /**
   * APIルートパス
   */
  private rootPath = "/thread";

  /**
   * コンストラクター
   * @param axios axiosインスタンス
   */
  constructor(axios: NuxtAxiosInstance) {
    this.axios = axios;
  }

  /**
   * 全スレッドを取得する
   * @returns スレッド一覧
   */
  public async get(): Promise<Array<Thread>> {
    const response = await this.axios.get(this.rootPath);
    const result = [];
    for (const thread of response.data) {
      result.push(
        new Thread(
          thread.id,
          thread.title,
          thread.description,
          thread.name,
          new Date(thread.createdAt)
        )
      );
    }
    return result;
  }

  /**
   * スレッドを作成する
   * @param {string} title スレッドタイトル
   * @param {string} name 投稿者名
   * @param {string} description スレッド説明
   * @returns 作成したスレッド
   */
  public async create(
    title: string,
    name: string,
    description: string
  ): Promise<ThreadCreateResponse> {
    const result = await this.axios.post(this.rootPath, {
      title,
      name,
      description,
    });

    const id = result.data.id;
    const isError = result.data.error;
    console.log(`isError=${isError}`);
    if (typeof id !== "string" || id === "") {
      throw new Error("スレッドIDが不正:" + id);
    }

    return new ThreadCreateResponse(isError, id);
  }

  /**
   * すべての投稿を取得する
   * @param threadId スレッドID
   * @return {Promise<GetCommentResponse>} 投稿一覧
   */
  public async getComments(threadId: string): Promise<GetCommentResponse> {
    const result = await this.axios.get(`${this.rootPath}/${threadId}`);
    const comments = [];
    for (const comment of result.data.comments) {
      comments.push(
        new Comment(comment.name, comment.text, new Date(comment.createdAt))
      );
    }
    return new GetCommentResponse(
      result.data.title,
      result.data.description,
      comments
    );
  }

  /**
   * スレッドに投稿する
   * @param threadId スレッドID
   * @param name 投稿者名
   * @param text 投稿本文
   * @returns 投稿結果
   */
  public async postComment(threadId: string, name: string, text: string) {
    const result = await this.axios.post(`${this.rootPath}/${threadId}`, {
      name,
      text,
    });
    return result.data;
  }
}
