<template>
  <div>
    <section class="section is-title-bar">
      <div class="level">
        <div class="level-left">
          <div class="level-item">
            <ul>
              <li>Items List</li>
            </ul>
          </div>
        </div>
        <div class="level-right">
          <div class="level-item">
            <div class="buttons is-right">
              <button v-if="globalHelper('createInventory')" @click="routeAddItem" class="button is-primary">
                <b-icon icon="plus" custom-size="default" />
                <span class="button-title">Add New Item</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="section is-main-section">
      <card-component-items
        class="has-table has-mobile-sort-spaced"
        title="Clients"
        icon="account-multiple"
        @search="searchTransaction"
        @filterCategory="filterCategory"
        @filterType="filterType"
      >
        <items-table :filterType="typeFilter" :filterCategory="categoryFilter" :searchTransaction="searchItem" />
      </card-component-items>
    </section>
  </div>
</template>
<script>
// @ is an alias to /src
import axios from "axios";
import TitleBar from "@/components/TitleBar";
import ItemsTable from "@/components/ItemsTable";
import CardComponentItems from "@/components/CardComponentItem";
export default {
  name: "Home",
  middleware: "auth-business",
  components: {
    TitleBar,
    ItemsTable,
    CardComponentItems,
  },
  data() {
    return {
      searchItem: {},
      categoryFilter: "",
      typeFilter:""
    };
  },
  computed: {
    titleStack() {
      return ["Items List"];
    },
  },
  methods: {
    searchTransaction(a) {
      this.searchItem = a;
    },
     filterCategory(filterCategory) {
      this.categoryFilter = filterCategory;
    },
    filterType(filterType) {
      this.typeFilter = filterType;
    },
    routeAddItem(){
      this.$router.push('/addItem')
      localStorage.removeItem("currentCategoryId")
    }
  },
  head() {
    return {
      title: "All Items - Karobar",
    };
  },
};
</script>
<style lang="scss">
$green: #3ab98d;
$black: #1f1f1f;
</style>
