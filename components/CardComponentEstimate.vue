<template>
  <div class="card card-sales">
    <header v-if="title" class="card-header">
      <b-field grouped class="card-header-title search-btn">
        <b-input
          expanded
          placeholder="Search Estimates"
          type="search"
          icon="magnify"
          @input="searchItem"
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
    headerIconClick() {
      this.$emit('header-icon-click')
    },
    searchItem(search){
      this.$emit("search", search);
    },
    filterByDate(menu){
      this.$emit('filterDate', menu.text)
    }
  },
}
</script>
<style lang="scss">
$green: #34a77f;
</style>
