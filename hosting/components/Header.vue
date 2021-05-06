<template>
  <CHeader fixed with-subheader light>
    <CToggler in-header class="ml-3 d-lg-none" @click="toggleSidebarMobile()" />
    <CToggler
      in-header
      class="ml-3 d-md-down-none"
      @click="toggleSidebarDesktop()"
    />
    <CHeaderBrand class="mx-auto d-lg-none" to="/">
      <CIcon name="logo" height="48" alt="Logo" />
    </CHeaderBrand>
    <CHeaderNav class="d-md-down-none mr-auto">
      <CHeaderNavItem class="px-3">
        <CHeaderNavLink to="/dashboard">Dashboard</CHeaderNavLink>
      </CHeaderNavItem>
      <CHeaderNavItem class="px-3">
        <CHeaderNavLink to="/users" exact>Users</CHeaderNavLink>
      </CHeaderNavItem>
      <CHeaderNavItem class="px-3">
        <CHeaderNavLink>Settings</CHeaderNavLink>
      </CHeaderNavItem>
    </CHeaderNav>
    <CHeaderNav class="mr-4">
      <CHeaderNavItem class="d-md-down-none mx-2">
        <CHeaderNavLink><CIcon name="cil-bell" /></CHeaderNavLink>
      </CHeaderNavItem>
      <CHeaderNavItem class="d-md-down-none mx-2">
        <CHeaderNavLink><CIcon name="cil-list" /></CHeaderNavLink>
      </CHeaderNavItem>
      <CHeaderNavItem class="d-md-down-none mx-2">
        <CHeaderNavLink><CIcon name="cil-envelope-open" /></CHeaderNavLink>
      </CHeaderNavItem>
      <HeaderDropdown />
    </CHeaderNav>
    <CSubheader class="px-3">
      <CBreadcrumbRouter class="border-0 mb-0" />
    </CSubheader>
  </CHeader>
</template>

<script lang="ts">
import Vue from "vue";
import HeaderDropdown from "./HeaderDropdown.vue";
import { store } from "~/store/";

export default Vue.extend({
  components: {
    HeaderDropdown,
  },

  methods: {
    toggleSidebarMobile(): void {
      store.sidebar.toggleSidebarMobile();
    },

    toggleSidebarDesktop(): void {
      store.sidebar.toggleSidebarDesktop();
    },
  },
});
</script>
