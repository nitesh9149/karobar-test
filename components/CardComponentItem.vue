<template>
  <div class="card">
    <header v-if="title" class="card-header">
      <b-field grouped class="card-header-title search-btn">
        <b-input
          expanded
          v-model="search"
          placeholder="Search Products and Services"
          type="search"
          icon="magnify"
          v-on:keyup.native="searchItem($event, search)"
        >
        </b-input>
      </b-field>
      <b-dropdown
        class="items-button"
        :max-height="maxHeight"
        v-model="currentType"
        aria-role="list"
      >
        <template #trigger>
          <b-button
            class="button-expand"
            :label="currentType.text"
            icon-right="menu-down"
          />
        </template>

        <b-dropdown-item
          v-for="(menu, index) in types"
          :key="index"
          :value="menu"
          aria-role="listitem"
          @click="filterByType(currentType)"
        >
          <div class="media">
            <div class="media-content">
              <h3 @click.prevent="headerIconClick">{{ menu.text }}</h3>
            </div>
          </div>
        </b-dropdown-item>
      </b-dropdown>
      <b-dropdown
        class="items-button"
        :max-height="maxHeight"
        v-model="currentMenu"
        aria-role="list"
      >
        <template #trigger>
          <b-button
            class="button-expand"
            :label="currentMenu.text"
            icon-right="menu-down"
          />
        </template>

        <b-dropdown-item
          v-for="(menu, index) in menus"
          :key="index"
          :value="menu"
          aria-role="listitem"
          @click="filterByCategory(currentMenu)"
        >
          <div class="media">
            <div class="media-content">
              <h3 @click.prevent="headerIconClick">{{ menu.text }}</h3>
            </div>
          </div>
        </b-dropdown-item>
      </b-dropdown>
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
      search: "",
      isScrollable: false,
      maxHeight: 200,
      currentMenu: { text: "Filter by Category" },
      menus: [],
      currentType: { text: "Filter by Types" },
      types: [
        { text: "All Types", value: "" },
        { text: "Product", value: "product" },
        { text: "Service", value: "service" },
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
        value: element.id,
      });
    });
    list.unshift({
      text: "All Categories",
      value: "",
    });
    this.menus = list;
  },
  methods: {
    headerIconClick() {
      this.$emit("header-icon-click");
    },
    searchItem(event, search) {
      this.$emit("search", { event: event, value: search });
    },
    filterByCategory(menu) {
      this.$emit(
        "filterCategory",
        menu.value ? JSON.stringify(menu.value) : ""
      );
    },
    filterByType(type) {
      this.$emit("filterType", type.value);
    },
  },
};
</script>
<style lang="scss" scoped>
$green: #34a77f;
.button-expand {
  width: 10rem;
  display: flex;
  justify-content: space-between;
}
</style>
