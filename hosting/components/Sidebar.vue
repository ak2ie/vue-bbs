<template>
  <CSidebar
    fixed
    :minimize="minimized"
    :show="display"
    @update:show="(value) => (display = value)"
  >
    <CSidebarBrand class="d-md-down-none" to="/">
      <CIcon
        class="d-block"
        name="logo"
        size="custom-size"
        :height="35"
        :view-box="`0 0 ${minimized ? 110 : 556} 134`"
      />
    </CSidebarBrand>
    <CRenderFunction flat :content-to-render="nav" />
    <CSidebarMinimizer
      class="d-md-down-none"
      @click.native="minimized = !minimized"
    />
  </CSidebar>
</template>

<script lang="ts">
import Vue from "vue";
import nav from "./_nav";
import { store } from "~/store/";

export type DataType = {
  nav: any;
};

export default Vue.extend({
  data(): DataType {
    return {
      nav,
    };
  },
  computed: {
    display: {
      get(): boolean | string {
        return store.sidebar.display;
      },

      set(value: boolean | string): void {
        store.sidebar.setDisplay(value);
      },
    },

    minimized: {
      get(): boolean {
        return store.sidebar.minimized;
      },
      set(value: boolean) {
        store.sidebar.setMinimized(value);
      },
    },
  },
});
</script>
