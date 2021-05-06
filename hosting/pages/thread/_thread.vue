<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
      <div>
        <!-------------------- タイトル -------------------->
        <h1>{{ title }}</h1>
        <v-spacer></v-spacer>

        <!-------------------- ボタン類 -------------------->
        <v-chip
          class="ma-2"
          color="indigo"
          text-color="white"
          @click.stop="dialog = true"
        >
          <v-avatar left>
            <v-icon>{{ icon.mdiLeadPencil }}</v-icon>
          </v-avatar>
          投稿
        </v-chip>

        <div>{{ description }}</div>

        <!-------------------- 投稿フォーム -------------------->
        <v-dialog v-model="dialog" max-width="600">
          <v-card>
            <v-card-title>投稿</v-card-title>
            <v-card-text>
              <validation-observer ref="observer">
                <form @submit.prevent>
                  <v-text-field
                    v-model="commentForm.name"
                    label="名前"
                    :disabled="processing"
                  ></v-text-field>
                  <!-- 本文は必須入力 -->
                  <validation-provider
                    v-slot="{ errors }"
                    rules="required"
                    name="本文"
                  >
                    <v-textarea
                      v-model="commentForm.text"
                      label="本文"
                      :error-messages="errors"
                      :disabled="processing"
                    ></v-textarea>
                  </validation-provider>
                </form>
              </validation-observer>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer
              ><v-btn
                color="info"
                text
                class="font-weight-black"
                :loading="processing"
                @click="submit"
                >投稿する</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>

      <!-------------------- 投稿一覧 -------------------->
      <div v-for="(comment, index) in comments" :key="index">
        <p class="mt-5 mb-1">
          <v-icon class="pr-1">{{ icon.mdiAccount }}</v-icon
          >{{ comment.name }}
        </p>
        <p class="pl-5" style="white-space: pre-line">{{ comment.text }}</p>
        <p class="mt-2 text-right text-caption">{{ comment.time }}</p>
      </div>

      <!-------------------- メッセージ表示 -------------------->
      <v-snackbar v-model="snackbar" timeout="2000">
        {{ message }}
      </v-snackbar>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from "vue";
import { mdiAccount, mdiLeadPencil } from "@mdi/js";
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { ValidationProvider, ValidationObserver, extend } from "vee-validate";
import { required } from "vee-validate/dist/rules";

// 日付演算
dayjs.extend(isSameOrBefore);

// バリデーション
extend("required", {
  ...required,
  message: "{_field_}は必須項目です。",
});

export type DataType = {
  icon: any;
  page: number;
  /**
   * スレッドタイトル
   */
  title: string;
  /**
   * スレッドの説明
   */
  description: string;
  /**
   * 全投稿
   */
  comments: Array<{ [key: string]: string }>;
  /**
   * 投稿フォーム表示有無
   */
  dialog: boolean;
  /**
   * 投稿フォーム
   */
  commentForm: {
    /**
     * 投稿者名
     */
    name: string;
    /**
     * 投稿本文
     */
    text: string;
  };
  /**
   * メッセージ表示有無
   */
  snackbar: boolean;
  /**
   * メッセージ本文
   */
  message: string;
  /**
   * 投稿処理有無
   */
  processing: boolean;
};

export default Vue.extend({
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  data(): DataType {
    return {
      icon: { mdiAccount, mdiLeadPencil },
      page: 1,
      title: "",
      description: "",
      comments: [],
      dialog: false,
      commentForm: {
        name: "",
        text: "",
      },
      snackbar: false,
      message: "",
      processing: false,
    };
  },
  head() {
    return {
      title: this.$data.title,
    };
  },
  async mounted() {
    await this.loadCommentsFromAPI();
  },
  methods: {
    /**
     * スレッドに投稿する
     */
    async submit() {
      this.processing = true;
      // バリデーションチェック
      const isValid = await (this.$refs.observer as InstanceType<
        typeof ValidationObserver
      >).validate();
      if (!isValid) {
        // バリデーションエラー
        this.showMessage("入力内容を確認してください。");
        this.processing = false;
        return;
      }

      // 投稿
      const result = await this.$threadRepository.postComment(
        this.$route.params.thread,
        this.commentForm.name,
        this.commentForm.text.replace(/\n/g, "\\n")
      );

      if (result.error) {
        // 投稿失敗
        this.showMessage("投稿できませんでした");
        this.processing = false;
        return;
      }

      // 全投稿を再取得
      await this.loadCommentsFromAPI();

      // フォームをクリアして閉じる
      this.commentForm.text = ""; // 名前は変更しないので消さない
      this.dialog = false;
      (this.$refs.observer as InstanceType<typeof ValidationObserver>).reset(); // 再度フォームを開いた直後のバリデーションエラー防止
      this.processing = false;

      // 投稿完了を通知
      this.showMessage("投稿しました");
    },
    /**
     * すべての投稿を取得し表示する
     */
    async loadCommentsFromAPI() {
      // APIからコメントを取得
      const result = await this.$threadRepository.getComments(
        this.$route.params.thread
      );
      console.log(result);
      // タイトル、スレッドの説明を設定
      this.title = result.Title;
      this.description = result.Description;
      // 投稿を設定
      this.comments = [];
      for (const comment of result.Comments) {
        this.comments.push({
          name: comment.name,
          text: comment.text.replace(/\\n/g, "\n"),
          time: dayjs(comment.createdAt).format("YYYY/MM/DD HH:mm:ss"),
        });
      }
      // 投稿日時が新しい順にソート
      this.comments.sort((x, y) => {
        return dayjs(x.time).isSameOrBefore(y.time) ? 1 : -1;
      });
    },

    /**
     * メッセージを表示する
     * @param {string} message メッセージ文
     */
    showMessage(message: string) {
      this.message = message;
      this.snackbar = true;
    },
  },
});
</script>
