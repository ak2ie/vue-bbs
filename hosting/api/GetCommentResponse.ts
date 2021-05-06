import { Comment } from "./Comment";

/**
 * コメント取得レスポンス
 */
export class GetCommentResponse {
  /**
   * スレッドタイトル
   */
  public Title: string;
  /**
   * スレッドの説明
   */
  public Description: string;
  /**
   * 全投稿
   */
  public Comments: Array<Comment>;

  public constructor(
    title: string,
    description: string,
    comments: Array<Comment>
  ) {
    this.Title = title;
    this.Description = description;
    this.Comments = comments;
  }
}
