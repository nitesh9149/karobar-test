<template>
  <div>
    <section class="section is-title-bar sales-title-bar">
      <div class="level">
        <div class="level-left">
          <div class="level-item">
            <ul>
              <li>Sales List</li>
            </ul>
          </div>
        </div>      
        <div class="level-right">
          <div class="level-item">
            <div class="buttons is-right">
              <nuxt-link v-if="globalHelper('createSale')" @click.native="createTransaction" to="/saleInvoice" class="button is-primary">
                <b-icon icon="plus" custom-size="default" />
                <span class="button-title">Create Sales Invoice</span>
              </nuxt-link>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="section is-main-section">
      <card-component-sales
        class="has-table has-mobile-sort-spaced"
        title="Clients"
        icon="account-multiple"
        @search="searchTransaction"
        @filterDate="filterDate"
      >
        <sales-table 
        :searchTransaction="searchItem"
        :filterDate="dateFilter"
        />
      </card-component-sales>
    </section>
  </div>
</template>
<script>
// @ is an alias to /src
import axios from "axios";
import TitleBar from "@/components/TitleBar";
import CardComponentSales from "@/components/CardComponentSales";
import SalesTable from "@/components/SalesTable";
export default {
  name: "Home",
  middleware: "auth-business",
  components: {
    TitleBar,
    SalesTable,
    CardComponentSales,
  },
  data() {
    return {
      searchItem:{},
      dateFilter: "",
    };
  },
  head() {
    return {
      title: "Sales - Karobar",
    };
  },
  methods:{
    createTransaction() {
      localStorage.removeItem("party_details");
    },
    searchTransaction(a){
       this.searchItem = a
     },
     filterDate(filterDate) {
      this.dateFilter = filterDate;
    },
  }
};
</script>
<style lang="scss">
$green: #3ab98d;
$black: #1f1f1f;
.sales-title-bar {
  .button {
    &.is-light {
      border-color: $green;
      color: $green;
      background-color: transparent;
    }
  }
}
</style>
