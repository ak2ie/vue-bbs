import { ThreadManager } from "../src/ThreadManager";
import * as admin from "firebase-admin";
import { Thread } from "../src/Thread";
import { Comment } from "../src/Comment";

/* -------------------------------------------------------
 * エミュレータを使う設定
 * 　事前に" firebase emulators:start "で起動しておくこと
 * ------------------------------------------------------- */
// firebase接続先をエミュレータに設定
process.env.FIRESTORE_EMULATOR_HOST = "localhost:8080";
// 実際にデータを書込/読取りするので時間がかかるため、タイムアウト防止
jest.setTimeout(1000 * 30);
const PROJECTID_TEST = "test";
admin.initializeApp({
  projectId: PROJECTID_TEST
});

describe("スレッド一覧", () => {
  afterEach(() => {
    // モックを初期化(jest.clearAllMocks()ではモックが消えない)
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  it("正常", async () => {
    // ----- データセットアップ ------
    const mockDate = new Date(2021, 2, 1).toTimeString();
    jest.spyOn(global, "Date").mockReturnValue(mockDate);

    // https://itnext.io/firebase-firestore-unit-testing-with-jest-and-kind-of-typescript-e26874196b1e
    const get = jest.fn(() => ({
      docs: [{
        data: () => ({
          name: "作成者名",
          title: "タイトル",
          description: "説明",
          createdAt: { toDate: () => (new Date()) }
        }),
        id: "firestore_doc_id"
      }],
      empty: false
    }));
    // collection("List")
    const collection = jest.fn((collectionName) => ({
      get
    }));
    // doc("Thread")
    const doc = jest.fn(() => ({
      collection,
    }));
    // collection("VueBBS")
    jest.spyOn(admin.firestore(), "collection").mockReturnValue(({ doc } as unknown) as any);

    // ----- 期待値 ------
    const expected = [
      new Thread("firestore_doc_id", "タイトル", "説明", "作成者名")
    ];

    // ----- メソッド実行 ------
    const threadManager = new ThreadManager();
    const threads = await threadManager.getAllThreads();

    // ----- 結果確認 ------
    expect(threads).toEqual(
      expected
    );
  });
});

describe("スレッド作成", () => {
  afterEach(() => {
    // モックを初期化(jest.clearAllMocks()ではモックが消えない)
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  it("正常", async () => {
    // ----- データセットアップ ------
    const mockDate = new Date(2021, 2, 1).toTimeString();
    jest.spyOn(global, "Date").mockReturnValue(mockDate);

    const get = jest.fn(() => ({
      data: () => ({
        title: "タイトル",
        name: "投稿者名",
        description: "説明",
        createdAt: {
          toDate: () => { (new Date()) }
        }
      })
    }));
    const add = jest.fn(() => ({ get, id: "dummy_id" }));
    // collection("List")
    const collection = jest.fn(() => ({ add }));
    // doc("Thread")
    const doc = jest.fn(() => ({ collection }));
    // collection("VueBBS")
    jest.spyOn(admin.firestore(), "collection").mockReturnValue(({ doc } as unknown) as any);

    // ----- メソッド実行 ------
    const threadManager = new ThreadManager();
    const result = await threadManager.createThread(
      "タイトル", "投稿者名", "説明", "127.0.0.1"
    );

    // ----- 結果確認 ------
    // FireStoreへの保存結果
    expect(add).toHaveBeenCalledWith({
      name: "投稿者名",
      createdAt: new Date(),
      title: "タイトル",
      description: "説明"
    });

    // 返却値
    expect(result).toEqual(new Thread(
      "dummy_id",
      "タイトル",
      "説明",
      "投稿者名"
    ));
  });
});

describe("投稿一覧", () => {
  afterEach(() => {
    // モックを初期化(jest.clearAllMocks()ではモックが消えない)
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  it("正常", async () => {
    // ----- データセットアップ ------
    const mockDate = new Date(2021, 2, 1).toTimeString();
    jest.spyOn(global, "Date").mockReturnValue(mockDate);

    const get = jest.fn(() => ({
      docs: [{
        data: () => ({
          name: "投稿者名",
          text: "本文",
          createdAt: { toDate: () => (new Date()) }
        })
      }],
      empty: false
    }));
    // collection("comments")
    const commentsCollection = jest.fn(() => ({ get }));
    // doc(スレッドID)
    const threadDoc = jest.fn(() => ({ collection: commentsCollection }));
    // collection("List")
    const collection = jest.fn(() => ({ doc: threadDoc }));
    // doc("Thread")
    const doc = jest.fn(() => ({ collection }));
    // collection("VueBBS")
    jest.spyOn(admin.firestore(), "collection").mockReturnValue(({ doc } as unknown) as any);

    // ----- 期待値 ------
    const expected = [
      new Comment("投稿者名", "本文")
    ];

    // ----- メソッド実行 ------
    const threadManager = new ThreadManager();
    const threads = await threadManager.getAllComments("dummy_thread_id");

    // ----- 結果確認 ------
    expect(threads).toEqual(
      expected
    );
  });
});

describe("投稿", () => {
  afterEach(() => {
    // モックを初期化(jest.clearAllMocks()ではモックが消えない)
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  it("正常", async () => {
    // ----- データセットアップ ------
    const mockDate = new Date(2021, 2, 1).toTimeString();
    jest.spyOn(global, "Date").mockReturnValue(mockDate);

    const add = jest.fn();
    // collection("comments")
    const commentsCollection = jest.fn(() => ({ add }));
    // doc(スレッドID)
    const threadListDoc = jest.fn(() => ({ collection: commentsCollection }));
    // collection("List")
    const collection = jest.fn(() => ({ doc: threadListDoc }));
    // doc("Thread")
    const doc = jest.fn(() => ({ collection }));
    // collection("VueBBS")
    jest.spyOn(admin.firestore(), "collection").mockReturnValue(({ doc } as unknown) as any);

    // ----- メソッド実行 ------
    const threadId = "dummy_thread_id";
    const postName = "投稿者名A";
    const text = "本文BBB";
    const threadManager = new ThreadManager();
    await threadManager.postComment(
      threadId,
      postName,
      text
    );

    // ----- 結果確認 ------
    // スレッドが参照され、
    expect(threadListDoc).toHaveBeenCalledWith(threadId);
    // 投稿される
    expect(add).toHaveBeenCalledWith({
      name: postName,
      text: text,
      createdAt: new Date()
    })
  });
});
