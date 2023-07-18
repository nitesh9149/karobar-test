<template>
  <div>
    <title-bar :title-stack="titleStack" :nuxt-link="nuxtLink" :link="toLink" />
    <section class="section is-main-section">
      <card-component-estimate
          class="has-table has-mobile-sort-spaced"
          title="Clients"
          icon="account-multiple"
          @search="searchTransaction"
        @filterDate="filterDate"
        >
          <estimate-table-sample
          :searchTransaction="searchItem"
        :filterDate="dateFilter"
          />
        </card-component-estimate>
    </section>
  </div>
</template>
<script>
// @ is an alias to /src
import SubtitleBar from "@/components/SubtitleBar";
import TitleBar from "@/components/TitleBar";
import CardComponentEstimate from "@/components/CardComponentEstimate";
import EstimateTableSample from "@/components/EstimateTableSample";
export default {
  name: "Home",
  middleware: "auth-business",
  components: {
    TitleBar,
    SubtitleBar,
    EstimateTableSample,
    CardComponentEstimate,
  },
  data() {
    return {
      searchItem:"",
      dateFilter: "",
    };
  },
  computed: {
    titleStack() {
      return ["Estimate/Quotation"];
    },
    titleSub() {
      return ["Items"];
    },
    nuxtLink() {
      return ["Create Estimate"];
    },
    toLink() {
      return "/createEstimate";
    },
  },
  methods:{
    searchTransaction(a){
       this.searchItem = a
     },
     filterDate(filterDate) {
      this.dateFilter = filterDate;
    },
  },
  head() {
    return {
      title: "Create Estimate - Karobar",
    };
  },
};
</script>
<style lang="scss">
$green: #3ab98d;
$black: #1f1f1f;

</style>
