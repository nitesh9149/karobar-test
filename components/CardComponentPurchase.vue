<template>
  <div class="card card-sales">
    <header v-if="title" class="card-header">
      <b-field grouped class="card-header-title search-btn">
        <b-input
          expanded
          v-model="search"
          placeholder="Search All Purchases"
          type="search"
          icon="magnify"
          v-on:keyup.native="searchItem($event, search)"
        >
        </b-input>
      </b-field>
      <b-button class="card-button" @click="viewReport" label="View Purchase report">
      </b-button>
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
      isScrollable: false,
      maxHeight: 200,
      currentMenu1: {text: "Filter by Date" },
      menus1: [
        {text: "All Time" },
        {text: "Today" },
        {text: "Yesterday" },
        {text: "This Week" },
        {text: "This Month" },
        {text: "This Year" },
      ],
      currentMenu: {text: "All Transaction" },
      menus: [
        {text: "Daily" },
        {text: "Weekly" },
        {text: "Monthly" },
      ],
    };
  },
  name: 'CardComponent',
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
    viewReport() {
      localStorage.setItem("report_title", "purchase");
      this.$router.push("/reports");
      this.$store.commit("transition");
    },
    headerIconClick() {
      this.$emit('header-icon-click')
    },
    searchItem(event, search) {
      this.$emit("search", { event: event, value: search });
    },
    filterByDate(menu){
      this.$emit('filterDate', menu.text)
    }
  },
}
</script>
<style lang="scss" scoped>
$green: #34a77f;
.card-button {
  border: none;
  color: $green;
  font-weight: 600;
}
</style>
