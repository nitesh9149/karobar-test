<template>
  <div class="card report-card">
    {{ computeDate }}
    <template v-if="!loading">
      <div v-if="title" class="columns report-footer">
        <div style="display:flex; column-gap:0.5rem;" v-if="totalSum" class="column is-one-third total">
          <div class="footer-title">Closing Balance:</div>
          <div class="amount">
            Rs.
            {{
              conversion(totalSum.closing)
            }}
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
      <p class="card-header-title">{{ title }}</p>
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
          :key="componentKey"
          @click.native="hideC2"
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
          :key="componentKey2"
          @click.native="hideC1"
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
      menus: [
        { text: "Today" },
        { text: "Yesterday" },
        { text: "This Week" },
        { text: "This Month" },
        { text: "This Year" },
      ],
      date1: "",
      date2: "",
      componentKey: 0,
      componentKey2: 0,
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
    totalSum: {
      type: Object,
    },
    activeIndex: {
      type: Number,
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
      this.componentKey += 1;
      this.componentKey2 += 1;
    },
    // date1(val1, val2) {
    //   if (val2) {
    //     this.updateFilter2();
    //   }
    // },
    // date2(val1, val2) {
    //   if (val2) {
    //     this.updateFilter2();
    //   }
    // },
  },
  computed: {
    computeDate() {
      if (this.date1 || this.date2) {
        this.$emit("selectDate1", { x: this.date1, y: this.date2 });
        let text =  this.title.split(" ");
        let combine = text.join("_");
        this.$emit("fileName", combine + "_Report_" + this.date1 + "to" + this.date2 );
      }
    },
  },
  beforeMount() {
    let start = new NepaliDate.now();
    start.setDate(1);
    let end = new NepaliDate.now();
    end.setMonth(end.getMonth() + 1);
    end.setDate(0);
    this.date1 = start.format("YYYY-MM-DD");
    this.date2 = end.format("YYYY-MM-DD");
  },
  updated() {
    document.querySelector(".date_picker_page").readOnly = true;
    document.querySelector(".date_picker_page2").readOnly = true;
  },
  methods: {
    hideC1() {
      this.$refs.c1.hide();
      this.updateFilter2();
    },
    hideC2() {
      this.$refs.c2.hide();
      this.updateFilter2();
    },
    filterByDate(menu) {
      this.$emit("filterDate", menu.text);
      if (menu.text == "Today") {
        let today = new Date();
        let date = new NepaliDate(today);
        this.date1 = date.format("YYYY-MM-DD");
        this.date2 = date.format("YYYY-MM-DD");
        this.componentKey += 1;
        this.componentKey2 += 1;
      }
      if (menu.text == "Yesterday") {
        let yesterday = new Date(new Date().valueOf() - 1000 * 60 * 60 * 24);
        let date = new NepaliDate(yesterday);
        this.date1 = date.format("YYYY-MM-DD");
        this.date2 = date.format("YYYY-MM-DD");
        this.componentKey += 1;
        this.componentKey2 += 1;
      }
      if (menu.text == "This Week") {
        let now = new Date();
        let dayOfWeek = now.getDay(); //0-6
        let numDay = now.getDate();

        let start = new Date(now); //copy
        start.setDate(numDay - dayOfWeek);
        start.setHours(0, 0, 0, 0);

        let end = new Date(now.setDate(now.getDate() - now.getDay()+6));
        let start2 = new NepaliDate(start);
        let end2 = new NepaliDate(end);
        this.date1 = start2.format("YYYY-MM-DD");
        this.date2 = end2.format("YYYY-MM-DD");
        this.componentKey += 1;
        this.componentKey2 += 1;
      }
      if (menu.text == "This Month") {
        let start = new NepaliDate.now();
        start.setDate(1);
        let end = new NepaliDate.now();
        end.setMonth(end.getMonth() + 1);
        end.setDate(0);
        this.date1 = start.format("YYYY-MM-DD");
        this.date2 = end.format("YYYY-MM-DD");
        this.componentKey += 1;
        this.componentKey2 += 1;
      }
      if (menu.text == "This Year") {
        let start = new NepaliDate.now();
        start.setDate(1);
        start.setMonth(0);
        let end = new NepaliDate.now();
        end.setYear(end.getYear() + 1);
        end.setMonth(0);
        end.setDate(0);
        this.date1 = start.format("YYYY-MM-DD");
        this.date2 = end.format("YYYY-MM-DD");
        this.componentKey += 1;
        this.componentKey2 += 1;
      }
    },
    headerIconClick() {
      this.$emit("header-icon-click");
    },
    updateFilter() {
      this.currentMenu.text = "This Month";
      let list = [];
      this.menusFix.forEach((e) => {
        list.push({
          text: e.text,
        });
      });
      this.menus = list;

      let start = new NepaliDate.now();
      start.setDate(1);
      let end = new NepaliDate.now();
      end.setMonth(end.getMonth() + 1);
      end.setDate(0);
      this.date1 = start.format("YYYY-MM-DD");
      this.date2 = end.format("YYYY-MM-DD");
      this.componentKey += 1;
      this.componentKey2 += 1;
    },
    updateFilter2() {
      this.currentMenu.text = "Custom";
      let list = [];
      this.menusFix.forEach((e) => {
        list.push({
          text: e.text,
        });
      });
      this.menus = list;
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
