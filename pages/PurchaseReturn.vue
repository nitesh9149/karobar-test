<template>
  <div>
    <section class="section is-title-bar sales-title-bar">
      <div class="level">
        <div class="level-left">
          <div class="level-item">
            <ul>
              <li>Purchase Return List</li>
            </ul>
          </div>
        </div>
        <div class="level-right">
          <div class="level-item">
            <div class="buttons is-right">
              <nuxt-link v-if="globalHelper('createPurchase')" to="/createPurchaseReturn" class="button is-primary">
                <b-icon icon="plus" custom-size="default" />
                <span class="button-title">Create Purchase Return</span>
              </nuxt-link>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="section is-main-section">
      <card-component-purchase-return
        class="has-table has-mobile-sort-spaced"
        title="Payment Return List"
        icon="account-multiple"
        @search="searchTransaction"
        @filterDate="filterDate"
      >
        <purchase-return-table
        :searchTransaction="searchItem"
        :filterDate="dateFilter"
         />
      </card-component-purchase-return>
    </section>
  </div>
</template>
<script>
// @ is an alias to /src
import TitleBar from "@/components/TitleBar";
import CardComponentPurchaseReturn from "@/components/CardComponentPurchaseReturn";
import PurchaseReturnTable from "@/components/PurchaseReturnTable";
export default {
  name: "Home",
  middleware: "auth-business",
  components: {
    TitleBar,
    PurchaseReturnTable,
    CardComponentPurchaseReturn,
  },
  data() {
    return {
      showWeekNumber: false,
      locale: undefined, // Browser locale
      searchItem:{},
      dateFilter: "",
    };
  },
  computed: {
    titleStack() {
      return ["Purchase Returns"];
    },
    nuxtLink() {
      return ["Create Purchase Return"];
    },
    toLink() {
      return "/createPurchaseReturn";
    },
  },
  head() {
    return {
      title: "Purchase Returns - Karobar",
    };
  },
  methods:{
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
.payment-form {
  padding-bottom: 2rem;
  .input {
    border: none;
    box-shadow: none;
  }
  .datepicker .dropdown .input[readonly] {
    box-shadow: none;
  }
  .control.has-icons-left .icon,
  .control.has-icons-right .icon {
    color: #3ab98d;
  }
  .select:not(.is-multiple):not(.is-loading)::after {
    border-color: #4b4b4b;
  }

}
</style>
