<template>
  <div class="card card-cash">
    <header v-if="title" class="card-header">
      <p class="card-header-title">
        {{ title }}
        <span
          class="amountRs"
          :class="
            totalAmount > 0
              ? 'color-info1'
              : totalAmount < 0
              ? 'color-info2'
              : 'color-info3 '
          "
        >
          <span v-if="totalAmount < 0">-</span><span v-else>&nbsp;</span> Rs.
          {{ conversion(Math.abs(totalAmount)) }}</span
        >
      </p>
      <b-button
        class="card-button"
        @click="viewReport"
        label="View Cash in Hand report"
      >
      </b-button>
      <!-- <b-dropdown
        class="sales-button"
        :max-height="maxHeight"
        v-model="currentMenu1"
        aria-role="list"
      >
        <template #trigger>
          <b-button class="card-button" :label="currentMenu1.text" icon-right="menu-down" />
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
    totalAmount: {
      type: Number,
    },
  },
  methods: {
    viewReport() {
      localStorage.setItem("report_title", "cash-in-hand");
      this.$router.push("/reports");
      this.$store.commit("transition");
    },
    headerIconClick() {
      this.$emit("header-icon-click");
    },
    filterByDate(menu) {
      this.$emit("filterDate", menu.text);
    },
    updateFilter() {
      this.currentMenu1.text = "Filter by Date";
      let list = [];
      this.menusFix.forEach((e) => {
        list.push({
          text: e.text,
        });
      });
      this.menus1 = list;
    },
  },
};
</script>
<style lang="scss" scoped>
$green: #34a77f;
.amountRs {
  &.color-info1 {
    color: #3ab98d;
  }

  &.color-info2 {
    color: #e54f6d;
  }

  &.color-info3 {
    color: black;
  }
}
.card-button {
  border: none;
  color: $green;
  font-weight: 600;
}
</style>
