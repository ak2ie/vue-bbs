import { Plugin } from "@nuxt/types";
import ThreadRepository from "@/api/ThreadRepository";

const repositoryPlugin: Plugin = (context, inject) => {
  // export default function ({$axios}, inject) {
  const api = context.$axios.create({
    baseURL: "https://asia-northeast1-vue-bbs-b16c3.cloudfunctions.net/app",
    data: {},
  });

  // レスポンス受信時の処理
  api.interceptors.response.use(
    function (response) {
      // 正常の場合はそのまま返す
      return response;
    },
    function (error) {
      return error;
    }
  );

  const threadRepository = new ThreadRepository(api);
  inject("threadRepository", threadRepository);
};

export default repositoryPlugin;

declare module "vue/types/vue" {
  interface Vue {
    readonly $threadRepository: ThreadRepository;
  }
}

declare module "@nuxt/types" {
  interface NuxtAppOptions {
    readonly $threadRepository: ThreadRepository;
  }

  interface Context {
    readonly $threadRepository: ThreadRepository;
  }
}
