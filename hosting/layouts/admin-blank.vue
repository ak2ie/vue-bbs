<template>
  <div class="c-app">
    <CWrapper>
      <div class="c-body">
        <main class="c-main">
          <div class="container-fluid">
            <nuxt />
          </div>
        </main>
      </div>
    </CWrapper>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
// import { iconsSet as icons } from "~/assets/icons/icons";

export default Vue.extend({
  created() {
    // this.$root.$options.icons = icons;
  },

  methods: {
    name() {
      return this.$route.name;
    },

    list() {
      return this.$route.matched;
    },
  },
});
</script>
