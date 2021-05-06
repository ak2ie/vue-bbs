/**
 * スレッド作成レスポンス
 */
export class ThreadCreateResponse {
  /**
   * スレッドID
   */
  public ID: string;
  /**
   * 作成成否
   */
  public IsError: boolean;

  constructor(isError: boolean, id: string) {
    this.IsError = isError;

    if (id === "") {
      throw new Error("IDが空");
    }
    this.ID = id;
  }
}
