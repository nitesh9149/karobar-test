<template>
  <div class="card report-card">
    <header v-if="title" class="card-header">
      <p class="card-header-title">{{ footer }} Report</p>
      <b-dropdown
        class="report-button"
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
          aria-role="listitem"
          @click="filterByDate(currentMenu)"
        >
          <div class="media">
            <div class="media-content">
              <h3 @click.prevent="headerIconClick">{{ menu.text }}</h3>
            </div>
          </div>
        </b-dropdown-item>
      </b-dropdown>
      <b-field class="date-picker-down date-content from-datepicker">
        <span class="input-side">From</span>
        <v-nepalidatepicker
          class="date-picker1"
          v-model="date1"
          placeholder="Start date"
          classValue="date_picker_page from-input"
          ref="c1"
        />
      </b-field>
      <b-field class="date-picker-down date-content">
        <span class="input-side b-0">To</span>
        <v-nepalidatepicker
          class="date-picker2"
          v-model="date2"
          placeholder="End date"
          classValue="date_picker_page2"
          ref="c2"
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
    return {
      isScrollable: false,
      maxHeight: 200,
      loading: true,
      currentMenu: { text: "This Month" },
      date1: "",
      date2: "",
      checkCustom: false,
      menus: [
        { text: "Today" },
        { text: "Yesterday" },
        { text: "This Week" },
        { text: "This Month" },
        { text: "This Year" },
      ],
      menusFix: [
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
    amountTitle: {
      type: String,
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
.report-card {
  .card-header {
    border-top: 1px solid #f8f9fb;
    .field {
      margin-bottom: 0;
      span.input-side {
        margin-top: 0.75rem;
        background-color: #f8f9fb;
        padding: 0.4rem;
        border-radius: 4px 0 0 4px;
        height: 2.5em;
        border: 1px solid #dedede;
        &.b-0 {
          border-radius: 0;
        }
      }
    }
    .from-datepicker {
      .datepicker {
        margin: 0.75rem 0 0.75rem 0;
      }
    }
    .datepicker {
      width: 10rem;
      margin: 0.75rem 0.75rem 0.75rem 0;
      .date_picker_page,
      .date_picker_page2 {
        border-radius: 0 4px 4px 0;
        border-left: 0;
        &.from-input {
          border-radius: 0;
          border-right: 0;
        }
      }
      .calendar {
        left: -11rem;
      }
    }
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
  // .amount {
  //   padding-left: 1rem;
  // }
  .total {
    &:nth-child(2) {
      border-left: 1px solid #f8f9fb;
      border-right: 1px solid #f8f9fb;
    }
  }
}
</style>
