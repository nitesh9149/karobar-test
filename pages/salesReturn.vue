<template>
  <div>
    <title-bar :title-stack="titleStack" :nuxt-link="nuxtLink" :link="toLink" />
    <section class="section is-main-section">
      <card-component-sales-return
        class="has-table has-mobile-sort-spaced"
        title="Sales Return List"
        icon="account-multiple"
        @search="searchTransaction"
        @filterDate="filterDate"
      >
        <sales-return-table 
        :searchTransaction="searchItem"
        :filterDate="dateFilter"
        />
      </card-component-sales-return>
    </section>
  </div>
</template>
<script>
// @ is an alias to /src
import TitleBar from "@/components/TitleBar";
import CardComponentSalesReturn from "@/components/CardComponentSalesReturn";
import SalesReturnTable from "@/components/SalesReturnTable";
export default {
  name: "Home",
  middleware: "auth-business",
  components: {
    TitleBar,
    SalesReturnTable,
    CardComponentSalesReturn,
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
      return ["Sales Return List"];
    },
    nuxtLink() {
      return ["Create Sales Return"];
    },
    toLink() {
      return "/createSalesReturn";
    },
  },
  
  head() {
    return {
      title: "Sales Return - Karobar",
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
