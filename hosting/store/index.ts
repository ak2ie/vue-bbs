import { Store } from "vuex";
import { getModule } from "vuex-module-decorators";
import Sidebar from "~/store/sidebar";

let sidebar: Sidebar;

const initializer = (store: Store<any>): void => {
  sidebar = getModule(Sidebar, store);
};

export const plugins = [initializer];

export const store = new (class {
  get sidebar(): Sidebar {
    return sidebar;
  }
})();
