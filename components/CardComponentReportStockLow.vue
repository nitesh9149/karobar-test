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
      currentTransaction: { text: "Filter by Category" },
      transactions: [],
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
        id: element.id,
      });
    });
    list.unshift({
      text: "All Categories",
      id:""
    });
    this.transactions = list;
    let text = this.title.split(" ");
    let combine = text.join("_");
    this.$emit("fileName", combine);
  },
  methods: {
    headerIconClick() {
      this.$emit("header-icon-click");
    },
    filterByType(menu) {
      this.$emit("filterType", menu.id.toString());
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
