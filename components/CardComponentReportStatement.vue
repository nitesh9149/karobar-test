<template>
  <div class="card card-party report-card">
    <template>
      <div v-if="show">
        <div v-if="title" class="columns report-footer">
          <div v-if="totalSum" class="column is-one-third total">
            <div class="footer-title sub">Total Sales:</div>
            <sub>(Sales - Sales Return)</sub>
            <div class="amount">
              Rs.
              {{ conversion(totalSum.sales) }}
            </div>
          </div>
          <div v-if="totalSum" class="column is-one-third total">
            <div class="footer-title sub">Total Purchase:</div>
            <sub>(Purchase - Purchase Return)</sub>
            <div class="amount">
              Rs.
              {{ conversion(totalSum.purchase) }}
            </div>
          </div>
          <div v-if="totalSum" class="column is-one-third total">
            <div class="footer-title">Closing Balance:</div>
            <div
              v-if="totalSum.amount > 0"
              style="color: #34a77f"
              class="amount"
            >
              Rs.
              {{ conversion(Math.abs(totalSum.amount)) }}
              <small>(Dr.)</small>
            </div>
            <div
              v-if="totalSum.amount < 0"
              style="color: #e54f6d"
              class="amount"
            >
              Rs.
              {{ conversion(Math.abs(totalSum.amount)) }}
              <small>(Cr.)</small>
            </div>
            <div v-if="totalSum.amount == 0" class="amount">
              Rs.
              {{ conversion(Math.abs(totalSum.amount)) }}
            </div>
          </div>
        </div>
        <div v-if="title" class="columns report-footer">
          <div v-if="totalSum" class="column is-one-third total">
            <div class="footer-title">Money In:</div>
            <div class="amount">
              Rs.
              {{ conversion(totalSum.money_in) }}
            </div>
          </div>
          <div v-if="totalSum" class="column is-one-third total">
            <div class="footer-title">Money Out:</div>
            <div class="amount">
              Rs.
              {{ conversion(totalSum.money_out) }}
            </div>
          </div>
        </div>
      </div>
    </template>
    {{ computeDate }}
    <span style="display: none">{{ partyChoose }}</span>
    <p class="card-header-title">{{ title }} Report</p>
    <header v-if="title" class="card-header">
      <b-autocomplete
        v-model="name"
        ref="autocomplete"
        @typing="searchParty($event)"
        :max-height="maxHeight"
        dropdown-position="bottom"
        :data="parties"
        :open-on-focus="true"
        field="party_value"
        placeholder="Search for Party"
        icon-right="chevron-down"
        @select="(option) => (selected = option)"
      >
        <template slot-scope="props">
          <div @click="updateFilter">
            {{ props.option.party_value }}
          </div>
        </template>
        <template #empty>No results for {{ name }}</template>
      </b-autocomplete>
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
import axios from "axios";
export default {
  components: {
    VNepaliDatePicker,
  },
  data() {
    return {
      isScrollable: false,
      maxHeight: 200,
      componentKey: 0,
      componentKey2: 0,
      show: false,
      selectedParty: null,
      currentMenu: { text: "This Month" },
      date1: "",
      date2: "",
      name: "",
      currentParty: { text: "Search for Party" },
      parties: [],
      selected: null,
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
      next: "",
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
      if (total.amount != null) {
        this.show = true;
      } else {
        this.show = false;
      }
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
  async mounted() {
    this.$refs.autocomplete.$el
      .querySelector(".dropdown-content")
      .addEventListener("scroll", this.onScroll);

    let list = [];
    try {
      let response = await axios.get(
        "/parties/parties/?business=" + localStorage.getItem("business"),
        {
          headers: {
            Authorization: localStorage.getItem("auth._token.local"),
          },
        }
      );
      this.next = response.data.next;
      response.data.results.forEach((element) => {
        list.push({
          party_value: element.name,
          party: element.id,
          amount: element.amount,
        });
      });
      this.parties = list;
    } catch (err) {}
  },
  computed: {
    computeDate() {
      if (this.date1 || this.date2) {
        this.$emit("selectDate1", { x: this.date1, y: this.date2 });
        if (this.selected) {
          let text = this.selected.party_value;
          this.$emit("fileName", text + "_" + this.date1 + "to" + this.date2);
        }
      }
    },
    partyChoose() {
      if (this.selected != null) {
        if (this.selected.party_value != this.name) {
          this.selectedParty = null;
        } else {
          this.selectedParty = this.selected;
        }
      } else {
        this.selectedParty = null;
      }
      this.$emit("filterType", this.selectedParty);
    },
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
    onScroll() {
      let apiCall = async () => {
        if (
          Math.ceil(
            this.$refs.autocomplete.$el.querySelector(".dropdown-content")
              .scrollTop
          ) +
            this.$refs.autocomplete.$el.querySelector(".dropdown-content")
              .clientHeight +
            1 >=
            this.$refs.autocomplete.$el.querySelector(".dropdown-content")
              .scrollHeight &&
          this.next
        ) {
          let list = [];
          let response = await axios.get(this.next, {
            headers: {
              Authorization: localStorage.getItem("auth._token.local"),
            },
          });
          this.next = response.data.next;
          response.data.results.forEach((element) => {
            list.push({
              party_value: element.name,
              party: element.id,
              amount: element.amount,
            });
          });
          this.parties.push(...list);
        }
      };
      this.throttleFunction(apiCall, 200);
    },
    throttleFunction(callback, time) {
      if (this.throttlePause) return;
      this.throttlePause = true;
      setTimeout(() => {
        callback();
        this.throttlePause = false;
      }, time);
    },
    async searchParty(event) {
      let list = [];
      try {
        let response = await axios.get(
          "/parties/parties/?business=" +
            localStorage.getItem("business") +
            "&search=" +
            event,
          {
            headers: {
              Authorization: localStorage.getItem("auth._token.local"),
            },
          }
        );
        this.next = response.data.next;
        response.data.results.forEach((element) => {
          list.push({
            party_value: element.name,
            party: element.id,
            amount: element.amount,
          });
        });
        this.parties = list;
      } catch (err) {}
    },
    headerIconClick() {
      this.$emit("header-icon-click");
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

        let end = new Date(now.setDate(now.getDate() - now.getDay() + 6));
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
    updateFilter() {
      this.currentMenu.text = "This Month";
      let start = new NepaliDate.now();
      start.setDate(1);
      let end = new NepaliDate.now();
      end.setMonth(end.getMonth() + 1);
      end.setDate(0);
      this.date1 = start.format("YYYY-MM-DD");
      this.date2 = end.format("YYYY-MM-DD");
      this.componentKey += 1;
      this.componentKey2 += 1;
      let list = [];
      this.menusFix.forEach((e) => {
        list.push({
          text: e.text,
        });
      });
      this.menus = list;
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
<style lang="scss">
$green: #34a77f;
.report-button {
  .button {
    width: 10rem;
    display: flex;
    justify-content: space-between;
  }
}
.card-party {
  .card-header {
    justify-content: center;
  }
  .autocomplete {
    margin: auto;
    padding-right: 1rem;
    padding-left: 1rem;
  }
  .dropdown-content {
    width: 94% !important;
  }
  .input {
    height: 2.5em;
  }
  .icon {
    height: 2.5em;
  }
  .footer-title {
    &.sub {
      margin-bottom: -0.5rem;
    }
  }
  sub {
    font-weight: 400;
  }
}
</style>
