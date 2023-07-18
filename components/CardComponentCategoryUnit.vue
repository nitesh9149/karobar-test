<template>
  <div class="card">
    <header v-if="title" class="card-header">
      <b-field grouped class="card-header-title search-btn">
        <b-input
          expanded
          placeholder="Search Units"
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
      currentMenu: { text: "Filter By Category" },
      menus: [{ text: "Item Name" }, { text: "Item ID" }, { text: "Quantity" }, { text: "SalePrice" }],
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
      searchItem(search){
      this.$emit("search", search);
    },
    headerIconClick() {
      this.$emit("header-icon-click");
    },
  },
};
</script>
<style lang="scss">
$green: #34a77f;
</style>
