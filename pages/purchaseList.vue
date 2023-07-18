<template>
  <div>
    <section class="section is-title-bar sales-title-bar">
      <div class="level">
        <div class="level-left">
          <div class="level-item">
            <ul>
              <li>Purchase List</li>
            </ul>
          </div>
        </div>
        <div class="level-right">
          <div class="level-item">
            <div class="buttons is-right">
              <nuxt-link v-if="globalHelper('createPurchase')" @click.native="createTransaction" to="/createPurchaseInvoice" class="button is-primary">
                <b-icon icon="plus" custom-size="default" />
                <span class="button-title">Create Purchase</span>
              </nuxt-link>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="section is-main-section">
      <card-component-purchase
        class="has-table has-mobile-sort-spaced"
        title="Clients"
        icon="account-multiple"
        @search="searchTransaction"
        @filterDate="filterDate"
      >
        <purchase-table 
        :searchTransaction="searchItem"
        :filterDate="dateFilter"
        />
      </card-component-purchase>
    </section>
  </div>
</template>
<script>
// @ is an alias to /src
import TitleBar from "@/components/TitleBar";
import CardComponentPurchase from "@/components/CardComponentPurchase";
import PurchaseTable from "@/components/PurchaseTable";
export default {
  name: "Home",
  middleware: "auth-business",
  components: {
    TitleBar,
    PurchaseTable,
    CardComponentPurchase,
  },
  data() {
    return {
      searchItem:{},
      dateFilter: "",
    };
  },
  head() {
    return {
      title: "Purchase List - Karobar",
    };
  },
  methods:{
    searchTransaction(a){
       this.searchItem = a
     },
     filterDate(filterDate) {
      this.dateFilter = filterDate;
    },
    createTransaction() {
      localStorage.removeItem("party_details");
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
