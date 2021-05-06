/**
 * スレッド
 */
export class Thread {
  /**
   * 作成者名
   */
  public Name: string;
  /**
   * スレッドタイトル
   */
  public Title: string;
  /**
   * 作成日時
   */
  public createdAt: Date;
  /**
   * ID
   */
  public Id: string;
  /**
   * 説明
   */
  public Description: string;

  /**
   * コンストラクタ
   * @param {string} id FireStore ドキュメントID
   * @param {string} title スレッド名
   * @param {string} description 説明
   * @param {string} name 作成者名
   * @param {Date} createdAt 作成日時
   */
  public constructor(
    id: string,
    title: string,
    description: string,
    name: string,
    createdAt = new Date()
  ) {
    if (typeof id === "undefined" || id === "") {
      throw new Error("IDが無効:" + id);
    }
    if (title === "") {
      throw new Error("タイトルが無効:" + title);
    }
    this.Id = id;
    this.Name = name;
    this.Description = description;
    this.createdAt = createdAt;
    this.Title = title;
  }
}
