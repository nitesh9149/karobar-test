<template>
  <div class="card card-transaction">
    <header v-if="title" class="card-header">
      <b-field grouped class="card-header-title search-btn">
        <b-input
          expanded
          v-model="search"
          placeholder="Search for Transaction"
          type="search"
          icon="magnify"
          v-on:keyup.native="searchItem($event, search)"
        >
        </b-input>
      </b-field>
      <!-- <b-dropdown
        class="sales-button"
        :max-height="maxHeight"
        v-model="currentMenu1"
        aria-role="list"
      >
        <template #trigger>
          <b-button :label="currentMenu1.text" icon-right="menu-down" />
        </template>

        <b-dropdown-item
          v-for="(menu, index) in menus1"
          :key="index"
          :value="menu"
          aria-role="listitem"
          @click="filterByDate(currentMenu1)"
        >
          <div class="media">
            <div class="media-content">
              <h3 @click.prevent="headerIconClick">{{ menu.text }}</h3>
            </div>
          </div>
        </b-dropdown-item>
      </b-dropdown> -->
      <b-dropdown
        class="sales-button"
        :max-height="maxHeight"
        v-model="currentMenu"
        aria-role="list"
      >
        <template #trigger>
          <b-button
            class="stretch"
            :label="currentMenu.text"
            icon-right="menu-down"
          />
        </template>

        <b-dropdown-item
          v-for="(menu, index) in menus"
          :key="index"
          :value="menu"
          aria-role="listitem"
          @click="filterByType(currentMenu)"
        >
          <div class="media">
            <div class="media-content">
              <h3 @click.prevent="headerIconClick">{{ menu.text }}</h3>
            </div>
          </div>
        </b-dropdown-item>
      </b-dropdown>
    </header>
    <div class="card-content">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isScrollable: false,
      maxHeight: 200,
      search: "",
      // currentMenu1: { text: "Filter by Date" },
      // menus1: [
      //   { text: "All Time" },
      //   { text: "Today" },
      //   { text: "Yesterday" },
      //   { text: "This Week" },
      //   { text: "This Month" },
      //   { text: "This Year" },
      // ],
      currentMenu: { text: "All Transactions" },
      menus: [
        { text: "All Transaction", value: "" },
        { text: "Sales Invoice", value: "sale" },
        { text: "Purchase", value: "purchase" },
        { text: "Payment In", value: "payment-in" },
        { text: "Payment Out", value: "payment-out" },
        { text: "Sales Return", value: "sale-return" },
        { text: "Purchase Return", value: "purchase-return" },
        // {text: "Estimate/Quotation" },
        { text: "Expense", value: "expense" },
        { text: "Income", value: "income" },
      ],
      menusFix: [
        { text: "All Transaction", value: "" },
        { text: "Sales Invoice", value: "sale" },
        { text: "Purchase", value: "purchase" },
        { text: "Payment In", value: "payment-in" },
        { text: "Payment Out", value: "payment-out" },
        { text: "Sales Return", value: "sale-return" },
        { text: "Purchase Return", value: "purchase-return" },
        // {text: "Estimate/Quotation" },
        { text: "Expense", value: "expense" },
        { text: "Income", value: "income" },
      ],
    };
  },
  name: "CardComponent",
  props: {
    title: {
      type: String,
      default: null,
    },
    icon: {
      type: String,
      default: null,
    },
    headerIcon: {
      type: String,
      default: null,
    },
  },
  methods: {
    headerIconClick() {
      this.$emit("header-icon-click");
    },
    searchItem(event, search) {
      this.$emit("search", { event: event, value: search });
    },
    updateFilter() {
      this.currentMenu.text = "All Transactions";
      let list = [];
      this.menusFix.forEach((e) => {
        list.push({
          text: e.text,
          value:e.value
        });
      });
      this.menus = list;
    },
    filterByType(menu) {
      this.$emit("filterType", menu.value);
    },
  },
};
</script>
<style lang="scss">
$green: #34a77f;
</style>
