<template>
  <div class="card card-staff">
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
    headerIconClick() {
      this.$emit("header-icon-click");
    },
  },
};
</script>
<style lang="scss">
$green: #34a77f;

</style>
