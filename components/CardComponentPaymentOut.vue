<template>
  <div class="card card-sales">
    <header v-if="title" class="card-header">
      <b-field grouped class="card-header-title search-btn">
        <b-input
          expanded
          v-model="search"
          placeholder="Search Payment Out"
          type="search"
          icon="magnify"
          v-on:keyup.native="searchItem($event, search)"
        >
        </b-input>
      </b-field>
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
      search: "",
      isScrollable: true,
      maxHeight: 200,
      currentMenu1: { text: "Filter by Date" },
      menus1: [
        { text: "All Time" },
        { text: "Today" },
        { text: "Yesterday" },
        { text: "This Week" },
        { text: "This Month" },
        { text: "This Year" },
      ],
      menusFix: [
        { text: "All Time" },
        { text: "Today" },
        { text: "Yesterday" },
        { text: "This Week" },
        { text: "This Month" },
        { text: "This Year" },
      ],
      currentMenu: { text: "All Transaction" },
      menus: [{ text: "Daily" }, { text: "Weekly" }, { text: "Monthly" }],
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
  },
};
</script>
<style lang="scss" scoped>
$green: #34a77f;
.card-button {
  width: 8rem;
  display: flex;
  justify-content: space-between;
}
</style>
