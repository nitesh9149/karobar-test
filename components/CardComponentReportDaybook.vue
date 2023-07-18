<template>
  <div class="card card-daybook">
    <span style="display: none">{{ computeDate }}</span>
    <template v-if="!loading">
      <div v-if="title" class="columns report-footer">
        <div v-if="totalSum" class="column is-one-third total">
          <div class="footer-title">Money In:</div>
          <div class="amount">
            Rs.
            {{ conversion(totalSum.paid) }}
          </div>
        </div>
        <div v-if="totalSum" class="column is-one-third total">
          <div class="footer-title">Money Out:</div>
          <div class="amount">
            Rs.
            {{ conversion(totalSum.unpaid) }}
          </div>
        </div>
        <div v-if="totalSum" class="column is-one-third total">
          <div class="footer-title">Total Amount:</div>
          <div class="amount">
            Rs.
            {{ conversion(totalSum.sum) }}
          </div>
        </div>
      </div>
    </template>
    <!-- <template v-else>
      <div class="columns report-footer">
        <div class="column is-one-third total">
          <b-skeleton width="40%"></b-skeleton>
          <b-skeleton width="80%"></b-skeleton>
        </div>
        <div class="column is-one-third total">
          <b-skeleton width="40%"></b-skeleton>
          <b-skeleton width="80%"></b-skeleton>
        </div>
        <div class="column is-one-third total">
          <b-skeleton width="40%"></b-skeleton>
          <b-skeleton width="80%"></b-skeleton>
        </div>
      </div>
    </template> -->
    <header v-if="title" class="card-header">
      <p class="card-header-title">{{ title }} Report</p>
      <b-field class="date-picker-down date-content">
        <v-nepalidatepicker
          v-model="date1"
          placeholder="Select a date"
          classValue="date_picker_page"
        />
      </b-field>
    </header>
    <div class="card-content">
      <slot />
    </div>
  </div>
</template>

<script>
import NepaliDate from "nepali-date-converter";
import VNepaliDatePicker from "v-nepalidatepicker";
export default {
  components: {
    VNepaliDatePicker,
  },
  data() {
    let nepdate = new NepaliDate(new Date()).format("YYYY-MM-DD");
    return {
      isScrollable: false,
      maxHeight: 200,
      loading: true,
      date: null,
      date1: nepdate,
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
  computed: {
    computeDate() {
      if (this.date1) {
        this.$emit("selectDate1", { x: this.date1 });
        let text = this.title.split(" ");
        let combine = text.join("_");
        this.$emit("fileName", combine + "_Report_" + this.date1);
      }
    },
  },
  updated() {
    document.querySelector(".date_picker_page").readOnly = true;
  },

  methods: {
    headerIconClick() {
      this.$emit("header-icon-click");
    },
  },
};
</script>
<style lang="scss">
$green: #34a77f;
.report-button {
  .button {
    width: 10rem;
    display: flex;
    justify-content: space-between;
  }
}
.card-daybook {
  .control.has-icons-left .icon,
  .control.has-icons-right .icon {
    color: #34a77f;
    top: 3px;
  }
  .datepicker {
    margin: 0.75rem 0 0.75rem 0;
    padding-right: 1rem;
    .calendar {
      left: -7rem;
    }
  }
  .input {
    height: 2.5em;
    border-color: #dedede;
    &:hover {
      border-color: #dedede;
    }
    &:focus {
      border-color: #dedede;
    }
  }
  ::-webkit-input-placeholder {
    color: #676767;
    font-size: 15px;
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
}
</style>
