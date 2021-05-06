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

    <CCard>
      <CCardBody>
        <CDataTable :items="getShuffledUsersData()"> </CDataTable>
      </CCardBody>
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
  data() {
    return {
      usersData: [
        {
          username: "Samppa Nori",
          registered: "2012/01/01",
          role: "Member",
          status: "Active",
        },
        {
          username: "Estavan Lykos",
          registered: "2012/02/01",
          role: "Staff",
          status: "Banned",
        },
        {
          username: "Chetan Mohamed",
          registered: "2012/02/01",
          role: "Admin",
          status: "Inactive",
        },
        {
          username: "Derick Maximinus",
          registered: "2012/03/01",
          role: "Member",
          status: "Pending",
        },
        {
          username: "Friderik Dávid",
          registered: "2012/01/21",
          role: "Staff",
          status: "Active",
        },
        {
          username: "Yiorgos Avraamu",
          registered: "2012/01/01",
          role: "Member",
          status: "Active",
        },
        {
          username: "Avram Tarasios",
          registered: "2012/02/01",
          role: "Staff",
          status: "Banned",
          _classes: "table-success",
        },
        {
          username: "Quintin Ed",
          registered: "2012/02/01",
          role: "Admin",
          status: "Inactive",
        },
        {
          username: "Enéas Kwadwo",
          registered: "2012/03/01",
          role: "Member",
          status: "Pending",
        },
        {
          username: "Agapetus Tadeáš",
          registered: "2012/01/21",
          role: "Staff",
          status: "Active",
        },
        {
          username: "Carwyn Fachtna",
          registered: "2012/01/01",
          role: "Member",
          status: "Active",
          _classes: "table-success",
        },
        {
          username: "Nehemiah Tatius",
          registered: "2012/02/01",
          role: "Staff",
          status: "Banned",
        },
        {
          username: "Ebbe Gemariah",
          registered: "2012/02/01",
          role: "Admin",
          status: "Inactive",
        },
        {
          username: "Eustorgios Amulius",
          registered: "2012/03/01",
          role: "Member",
          status: "Pending",
        },
        {
          username: "Leopold Gáspár",
          registered: "2012/01/21",
          role: "Staff",
          status: "Active",
        },
        {
          username: "Pompeius René",
          registered: "2012/01/01",
          role: "Member",
          status: "Active",
        },
        {
          username: "Paĉjo Jadon",
          registered: "2012/02/01",
          role: "Staff",
          status: "Banned",
        },
        {
          username: "Micheal Mercurius",
          registered: "2012/02/01",
          role: "Admin",
          status: "Inactive",
        },
        {
          username: "Ganesha Dubhghall",
          registered: "2012/03/01",
          role: "Member",
          status: "Pending",
        },
        {
          username: "Hiroto Šimun",
          registered: "2012/01/21",
          role: "Staff",
          status: "Active",
        },
        {
          username: "Vishnu Serghei",
          registered: "2012/01/01",
          role: "Member",
          status: "Active",
        },
        {
          username: "Zbyněk Phoibos",
          registered: "2012/02/01",
          role: "Staff",
          status: "Banned",
        },
        {
          username: "Einar Randall",
          registered: "2012/02/01",
          role: "Admin",
          status: "Inactive",
          _classes: "table-danger",
        },
        {
          username: "Félix Troels",
          registered: "2012/03/21",
          role: "Staff",
          status: "Active",
        },
        {
          username: "Aulus Agmundr",
          registered: "2012/01/01",
          role: "Member",
          status: "Pending",
        },
      ],
    };
  },
  methods: {
    shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
      return array;
    },
    getShuffledUsersData() {
      return this.shuffleArray(this.usersData.slice(0));
    },
  },
});
</script>
