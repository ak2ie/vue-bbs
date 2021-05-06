import Vue from "vue";
import CoreUI from "@coreui/vue";
import { iconsSet } from "assets/icons/icons";
import { Plugin } from "@nuxt/types";
import { CIcon } from "@coreui/icons-vue";

/* -----------------------------------------------
 *  CORE UI
 * ----------------------------------------------- */
// CORE UIを使用するため必須
Vue.use(CoreUI);

// アイコン使用
Vue.component("c-icon", CIcon);

const coreUiIcons: Plugin = ({ app }) => {
  app.icons = iconsSet;
};

export default coreUiIcons;
