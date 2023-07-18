<template>
  <div class="card report-card">
    <template v-if="!loading">
      <div v-if="title" class="columns report-footer">
        <div v-if="totalSum" class="column is-one-third total">
          <span class="footer-title">Total Amount:</span>
          <span class="amount">
            Rs.
            {{
              conversion(totalSum.sum)
            }}
          </span>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="columns report-footer">
        <div class="column is-one-third total">
          <b-skeleton width="80%"></b-skeleton>
        </div>
      </div>
    </template>
    <header v-if="title" class="card-header">
      <p class="card-header-title">{{ title }} Report</p>
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
  },
  mounted() {
    let text = this.title.split(" ");
    let combine = text.join("_");
    this.$emit("fileName", combine + "_Report");
  },
  methods: {
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
}
</style>
