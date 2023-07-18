<template>
  <div class="card card-cash card-margin">
    <header v-if="title" class="card-header">
      <p class="card-header-title">
        {{ title }}
      </p>
      <b-button @click="viewReport(title)" :label="label"> </b-button>
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
    categoryName: {
      type: String,
      default: null,
    },
    label: {
      type: String,
      default: null,
    },
  },
  methods: {
    headerIconClick() {
      this.$emit("header-icon-click");
    },
    viewReport(title) {
      if (title == "All Expenses") {
        localStorage.setItem("report_title", "expense");
        localStorage.setItem("report_category", this.categoryName);
        this.$router.push("/reports");
      } else if (title == "All Incomes") {
        localStorage.setItem("report_title", "income");
        localStorage.setItem("report_category", this.categoryName);
        this.$router.push("/reports");
      }
      this.$store.commit("transition");
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
.card-button {
  width: 8rem;
  display: flex;
  justify-content: space-between;
}
.card-margin {
  margin: 0 0.75rem;
}
</style>
