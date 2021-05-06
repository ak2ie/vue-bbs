<template>
  <div>
    <CCard>
      <CCardHeader>
        カードのタイトル
        <div class="card-header-actions">
          <a
            href="https://coreui.io/vue/docs/components/card-components"
            class="card-header-action"
            rel="noreferrer noopener"
            target="_blank"
          >
            <CIcon name="cil-envelope-open" />
            <small class="text-muted">docs</small>
          </a>
        </div>
      </CCardHeader>
      <CCardBody> カードの内容 </CCardBody>
    </CCard>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export type DataType = {
  userData: Array<{
    username: string;
    registered: string;
    role: string;
    status: string;
  }>;
};

export default Vue.extend({
  layout: "admin",
});
</script>
