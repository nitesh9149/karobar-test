<template>
  <div class="card chart-card">
    <div v-if="!empty_purchase">
      <header v-if="title" class="card-header">
        <p class="card-header-title">
          <b-icon v-if="icon" :icon="icon" custom-size="default" />
          {{ title }}
        </p>
        <b-dropdown
          class="sales-button"
          :max-height="maxHeight"
          v-model="currentMenu"
          aria-role="list"
        >
          <template #trigger>
            <b-button :label="currentMenu.text" icon-right="menu-down" />
          </template>

          <b-dropdown-item
            v-for="(menu, index) in menus"
            :key="index"
            :value="menu"
            @click="filterByDate2(currentMenu)"
            aria-role="listitem"
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
      <!-- <div v-if="currentMenu.text == 'Monthly'" class="card-bottom">
        <h1>Monthly Purchases: Rs. {{ purchase }}</h1>
      </div>
      <div v-else class="card-bottom">
        <h1>Daily Purchases</h1>
      </div> -->
    </div>
    <div v-else class="empty-chart">
        <b-icon icon="cart" size="is-small"></b-icon>
      <p>Purchase chart will be shown here when there is enough data.</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isScrollable: false,
      maxHeight: 200,
      currentMenu: { text: "Monthly" },
      menus: [{ text: "Monthly" }, { text: "Daily" }],
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
    purchase: {
      type: String,
    },
    headerIcon: {
      type: String,
      default: null,
    },
    empty_purchase: {
      type: Boolean,
    },
  },
  methods: {
    headerIconClick() {
      this.$emit("header-icon-click");
    },
    filterByDate2(menu) {
      this.$emit("filterDate2", menu.text);
    },
  },
};
</script>
<style lang="scss">
.sales-button {
  margin: auto 0;
  .button {
    font-size: 14px;
    box-shadow: none;
  }
}
a.dropdown-item.is-active,
.dropdown .dropdown-menu .has-link a.is-active,
button.dropdown-item.is-active {
  background-color: #34a77f;
  color: white;
}
.card-header-title {
  font-weight: 600;
}
.chart-card{
  border-radius: 6px;
  .empty-chart{
    height: 23.2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    flex-direction: column;
    .icon{
      color: #3ab98d;
      padding-bottom: 3rem;
      &.is-small{
        font-size: 4rem;
      }
    }
  }
}
.card-content {
  padding: 1rem;
}
.card-bottom {
  display: flex;
  justify-content: flex-end;
  padding: 0.75rem;
  h1 {
    font-size: 16px;
    font-weight: 600;
  }
}
</style>

