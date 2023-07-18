<template>
  <div class="card card-margin">
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
      menus: [
        { text: "Item Name" },
        { text: "Item ID" },
        { text: "Quantity" },
        { text: "SalePrice" },
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
    searchItem(search) {
      this.$emit("search", search);
    },
  },
};
</script>
<style lang="scss" scoped>
.card-margin {
  margin: 0 0.75rem;
}
$green: #34a77f;
</style>
