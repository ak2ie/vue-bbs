<template>
  <div class="c-app">
    <Sidebar />
    <CWrapper>
      <Header />
      <div class="c-body">
        <main class="c-main">
          <div class="container-fluid">
            <nuxt />
          </div>
        </main>
        <Footer />
      </div>
    </CWrapper>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
// import { iconsSet as icons } from "~/assets/icons/icons";
import Header from "~/components/Header.vue";
import Sidebar from "~/components/Sidebar.vue";
import Footer from "~/components/Footer.vue";

export default Vue.extend({
  components: {
    Header,
    Sidebar,
    Footer,
  },
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
