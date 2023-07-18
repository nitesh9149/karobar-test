<template>
  <div class="card chart-card">
    <div v-if="!empty_sale">
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
            @click="filterByDate(currentMenu)"
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
        <h1>Monthly Sales: Rs. {{ total }}</h1>
      </div>
      <div v-else class="card-bottom">
        <h1>Daily Sales</h1>
      </div> -->
    </div>
    <div v-else class="empty-chart">
      <b-icon icon="sale" size="is-small"></b-icon>
      <p>Sales chart will be shown here when there is enough data.</p>
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
    total: {
      type: String,
    },
    icon: {
      type: String,
      default: null,
    },
    headerIcon: {
      type: String,
      default: null,
    },
    empty_sale: {
      type: Boolean,
    },
  },
  methods: {
    headerIconClick() {
      this.$emit("header-icon-click");
    },
    filterByDate(menu) {
      this.$emit("filterDate", menu.text);
    },
  },
};
</script>
<style lang="scss">
$color: #34a77f;
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
  background-color: $color;
  color: white;
}
.card-header {
  border-bottom: 1px solid rgba(24, 28, 33, 0.06);
}
.card-header-title {
  font-weight: 600;
  padding: 1rem;
}
.chart-card {
  border-radius: 6px;
  .empty-chart {
    height: 23.2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    flex-direction: column;
    .icon {
      color: #3ab98d;
      padding-bottom: 3rem;
      &.is-small {
        font-size: 4rem;
      }
    }
  }
}
.card-content {
  padding: 1rem;
}
// .card-bottom {
//   border-top: 1px solid rgba(24, 28, 33, 0.06);
//   display: flex;
//   justify-content: flex-end;
//   padding: 0.75rem;
//   h1 {
//     font-size: 16px;
//   }
// }
</style>
