/**
 * 投稿
 */
export class Comment {
  /**
   * 投稿者
   */
  public name: string;
  /**
   * 投稿日時
   */
  public createdAt: Date;
  /**
   * 本文
   */
  public text: string;
  /**
   * コンストラクタ
   * @param {string} name 投稿者
   * @param {string} text 本文
   * @param {Date} createdAt 投稿日時
   */
  public constructor(name: string, text: string, createdAt = new Date()) {
    this.name = name;
    this.text = text;
    this.createdAt = createdAt;
  }
}
