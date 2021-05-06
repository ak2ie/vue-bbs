<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
      <!-------------------- タイトル -------------------->
      <h1>掲示板タイトル</h1>
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
        スレッド作成
      </v-chip>
      <!-------------------- スレッド一覧 -------------------->
      <div v-for="(thread, index) in threads" :key="index">
        <router-link :to="'/thread/' + thread.id" class="text-h4">{{
          thread.title
        }}</router-link>
      </div>
      <!-------------------- ページネーション -------------------->
      <div class="text-center">
        <v-pagination v-model="page" :length="60"></v-pagination>
      </div>

      <!-------------------- スレッド作成フォーム -------------------->
      <v-dialog v-model="dialog" max-width="600">
        <v-card>
          <v-card-title>スレッド作成</v-card-title>
          <v-card-text>
            <validation-observer ref="observer">
              <form @submit.prevent>
                <validation-provider
                  v-slot="{ errors }"
                  rules="required"
                  name="タイトル"
                >
                  <v-text-field
                    v-model="threadForm.title"
                    label="タイトル"
                    :disabled="processing"
                    :error-messages="errors"
                  ></v-text-field>
                </validation-provider>
                <v-text-field
                  v-model="threadForm.name"
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
                    v-model="threadForm.text"
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
              >作成する</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-------------------- メッセージ表示 -------------------->
      <v-snackbar v-model="snackbar" timeout="2000">
        {{ message }}
      </v-snackbar>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from "vue";
import { mdiLeadPencil } from "@mdi/js";
import { ValidationProvider, ValidationObserver, extend } from "vee-validate";
import { required } from "vee-validate/dist/rules";

// バリデーション
extend("required", {
  ...required,
  message: "{_field_}は必須項目です。",
});

export type DataType = {
  icon: any;
  page: number;
  threads: Array<{ [key: string]: string }>;
  threadForm: {
    name: string;
    title: string;
    text: string;
  };
  processing: boolean;
  dialog: boolean;
  /**
   * メッセージ表示有無
   */
  snackbar: boolean;
  /**
   * メッセージ本文
   */
  message: string;
};

export default Vue.extend({
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  data(): DataType {
    return {
      icon: { mdiLeadPencil },
      page: 1,
      threads: [],
      threadForm: {
        name: "",
        title: "",
        text: "",
      },
      dialog: false,
      processing: false,
      snackbar: false,
      message: "",
    };
  },
  async mounted() {
    const result = await this.$threadRepository.get();
    console.log(result);

    for (const thread of result) {
      const titleName = thread.Title;
      if (typeof titleName === "string") {
        this.threads.push({ title: titleName, id: thread.Id });
      }
    }
  },
  methods: {
    /**
     * スレッドを作成する
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

      try {
        // スレッド作成
        const result = await this.$threadRepository.create(
          this.threadForm.title,
          this.threadForm.name,
          this.threadForm.text
        );

        if (result.IsError) {
          throw new Error("作成失敗");
        }

        // スレッドページへ遷移
        this.$router.push(`/thread/${result.ID}`);
      } catch {
        // 作成失敗
        this.showMessage("作成できませんでした");
        this.processing = false;
      }
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
