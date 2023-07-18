<template>
  <div class="card">
    <header v-if="title" class="card-header">
      <p class="card-header-title">
        {{ title }}
      </p>
      <b-dropdown
        class="report-button"
        :max-height="maxHeight"
        v-model="currentTransaction"
        aria-role="list"
      >
        <template #trigger>
          <b-button
            style="width: 10rem"
            :label="currentTransaction.text"
            icon-right="menu-down"
          />
        </template>

        <b-dropdown-item
          v-for="(menu, index) in transactions"
          :key="index"
          :value="menu"
          aria-role="listitem"
          @click="filterByType(currentTransaction)"
        >
          <div class="media">
            <div class="media-content">
              <h3 @click.prevent="headerIconClick">{{ menu.text }}</h3>
            </div>
          </div>
        </b-dropdown-item>
      </b-dropdown>
      <!-- <b-dropdown
        class="report-button"
        :max-height="maxHeight"
        v-model="currentMenu"
        aria-role="list"
      >
        <template #trigger>
          <b-button
            style="width: 10rem"
            :label="currentMenu.text"
            icon-right="menu-down"
          />
        </template>

        <b-dropdown-item
          v-for="(menu, index) in menus"
          :key="index"
          :value="menu"
          aria-role="listitem"
          @click="filterByDate(currentMenu)"
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
import axios from "axios";
export default {
  data() {
    return {
      isScrollable: false,
      maxHeight: 200,
      currentTransaction: { text: "All Categories" },
      transactions: [],
      currentMenu: { text: "Filter By Date" },
      menus: [
        { text: "All Time" },
        { text: "Today" },
        { text: "Yesterday" },
        { text: "This Week" },
        { text: "This Month" },
        { text: "This Year" },
      ],
    };
  },
  name: "CardComponent",
  props: {
    title: {
      type: String,
      default: null,
    },
    footer: {
      type: String,
      default: null,
    },
  },
  async mounted() {
    let list = [];
    let response1 = await axios.get(
      "/inventory/categories/?business=" +
        localStorage.getItem("business") +
        "&user=" +
        this.$auth.user.id,
      {
        headers: {
          Authorization: localStorage.getItem("auth._token.local"),
        },
      }
    );
    response1.data.forEach((element) => {
      list.push({
        text: element.name,
      });
    });
    list.unshift({
      text: "All Categories",
    });
    this.transactions = list;
    let text = this.title.split(" ");
    let combine = text.join("_");
    this.$emit(
      "fileName",
      combine 
    );
  },
  methods: {
    filterByType(menu) {
      this.$emit("filterType", menu.text);
    },
    filterByDate(menu) {
      this.$emit("filterDate", menu.text);
    },
    headerIconClick() {
      this.$emit("header-icon-click");
    },
  },
};
</script>
<style lang="scss" scoped>
$green: #34a77f;
.report-button {
  .button {
    display: flex;
    justify-content: space-between;
  }
}
</style>
