<template>
  <div class="card card-margin">
    <header v-if="title" class="card-header">
      <p class="card-header-title">
        {{ title }}
      </p>
      <div class="buttons">
        <b-dropdown
          class="parties-button"
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
            @click="filterByType(currentMenu)"
            aria-role="listitem"
          >
            <div class="media">
              <div class="media-content">
                <h3 @click.prevent="headerIconClick">{{ menu.text }}</h3>
              </div>
            </div>
          </b-dropdown-item>
        </b-dropdown>
      </div>
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
      currentMenu: { text: "All Transaction" },
      menus: [
        { text: "All Transaction", value: "" },
        { text: "Sales Invoice", value: "sale" },
        { text: "Purchase", value: "purchase" },
        { text: "Payment In", value: "payment-in" },
        { text: "Payment Out", value: "payment-out" },
        { text: "Sales Return", value: "sale-return" },
        { text: "Purchase Return", value: "purchase-return" },
        // {text: "Estimate/Quotation" }
      ],
      menusCopy: [
        { text: "All Transaction", value: "" },
        { text: "Sales Invoice", value: "sale" },
        { text: "Purchase", value: "purchase" },
        { text: "Payment In", value: "payment-in" },
        { text: "Payment Out", value: "payment-out" },
        { text: "Sales Return", value: "sale-return" },
        { text: "Purchase Return", value: "purchase-return" },
        // {text: "Estimate/Quotation" }
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
    filterByType(menu) {
      this.$emit("filterType", menu.value);
    },
    updateFilter() {
      this.currentMenu.text = "All Transaction";
      let list2 = [];
      this.menusCopy.forEach((e) => {
        list2.push({
          text: e.text,
          value:e.value
        });
      });
      this.menus = list2;
    },
  },
};
</script>
<style lang="scss" >
.card-margin {
  margin: 0 0.75rem;
}
</style>
