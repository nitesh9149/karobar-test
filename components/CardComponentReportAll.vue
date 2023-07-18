<template>
  <div class="card report-card">
    <template v-if="!loading">
      <div v-if="title" class="columns report-footer">
        <div v-if="totalSum" class="column is-one-third total">
          <div class="footer-title">Receivable Amt:</div>
          <div class="amount">
            Rs.
            {{
              conversion(totalSum.paid)
            }}
          </div>
        </div>
        <div v-if="totalSum" class="column is-one-third total">
          <div class="footer-title">Payable Amt:</div>
          <div class="amount">
            Rs.
            {{
              conversion(totalSum.sum)
            }}
          </div>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="columns report-footer">
        <div class="column is-one-third total">
          <b-skeleton width="40%"></b-skeleton>
          <b-skeleton width="80%"></b-skeleton>
        </div>
        <div class="column is-one-third total">
          <b-skeleton width="40%"></b-skeleton>
          <b-skeleton width="80%"></b-skeleton>
        </div>
      </div>
    </template>
    <header v-if="title" class="card-header">
      <p class="card-header-title">{{ title }} Report</p>
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
          @click="filterByDate(currentTransaction)"
        >
          <div class="media">
            <div class="media-content">
              <h3 @click.prevent="headerIconClick">{{ menu.text }}</h3>
            </div>
          </div>
        </b-dropdown-item>
      </b-dropdown>
      <b-dropdown
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
          @click="filterByType(currentMenu)"
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
export default {
  data() {
    return {
      isScrollable: false,
      maxHeight: 200,
      loading: true,
      currentTransaction: { text: "Due Type" },
      transactions: [
        { text: "All Type" },
        { text: "Receivable" },
        { text: "Payable" },
      ],
      currentMenu: { text: "Party type" },
      menus: [{ text: "All Type" }, { text: "Customer" }, { text: "Supplier" }],
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
    totalSum: {
      type: Object,
    },
  },
  watch: {
    totalSum(total) {
      if (total) {
        this.loading = false;
      }
    },
    activeIndex() {
      this.updateFilter();
    },
  },
  mounted() {
    let text = this.title.split(" ");
    let combine = text.join("_");
    this.$emit(
      "fileName",
      combine + "_Report"
    );
  },
  methods: {
    headerIconClick() {
      this.$emit("header-icon-click");
    },
    filterByDate(menu) {
      this.$emit("filterDate", menu.text);
    },
    filterByType(menu) {
      this.$emit("filterType", menu.text);
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
.report-card {
  .card-header {
    border-top: 1px solid #f8f9fb;
  }
}
.report-footer {
  margin: 0;
  font-weight: 600;
  font-size: 15px;
  &.columns {
    margin: 0;
  }
  .footer-title {
    font-weight: 500;
    margin-bottom: 0.5rem;
  }
  .total {
    &:nth-child(2) {
      border-left: 1px solid #f8f9fb;
      border-right: 1px solid #f8f9fb;
    }
  }
}
</style>
