<template>
  <div>
    <b-table
      class="expenses-table"
      aria-next-label="Next page"
      aria-previous-label="Previous page"
      :loading="loading"
      :checkable="false"
      :paginated="false"
      :per-page="5"
      :striped="false"
      :hoverable="true"
      :sticky-header="true"
      default-sort="name"
      :data="clients"
    >
      <template slot-scope="props">
        <b-table-column label="Date" field="date" sortable>
          <span>
            {{ props.row.date }}
          </span>
        </b-table-column>
        <b-table-column label="Category" field="name">
          {{ props.row.category_value }}
        </b-table-column>
        <b-table-column class="pad_left" label="Note" field="note">
          {{ props.row.note }}
        </b-table-column>
        <b-table-column class="pad_left" label="Amount" field="amount" sortable>
          Rs. {{ props.row.totalAmt }}
        </b-table-column>
      </template>
      <section slot="empty">
        <div class="content has-text-grey has-text-centered">
          <template v-if="loading">
            <b-skeleton height="50px" :animated="true"></b-skeleton>
            <b-skeleton height="50px" :animated="true"></b-skeleton>
            <b-skeleton height="50px" :animated="true"></b-skeleton>
            <b-skeleton height="50px" :animated="true"></b-skeleton>
          </template>
          <template v-else>
            <p class="pad-empty">
              <b-icon icon="emoticon-sad" size="is-large" />
            </p>
            <p>Nothing's here&hellip;</p>
          </template>
        </div>
      </section>
    </b-table>
  </div>
</template>
<script>
import axios from "axios";
import NepaliDate from "nepali-date-converter";
export default {
  name: "ClientsTableSample",
  props: {
    dataUrl: {
      type: String,
      default: null,
    },
    checkable: {
      type: Boolean,
      default: false,
    },
    filterDate: {
      type: String,
    },
    filterType: {
      type: Object,
    },
    dateSelect1: {
      type: Object,
    },
  },
  data() {
    return {
      clients: [],
      filterList: [],
      typeList: [],
      searchList: [],
      filterData: [],
      loading: false,
      trashObject: null,
      paginated: true,
      perPage: 10,
      CheckedRows: [],
    };
  },
  watch: {
    async dateSelect1(date1) {
      this.loading = true;
      let list = [];
      let start = new NepaliDate(date1.x);
      let end = new NepaliDate(date1.y);
      start = start.getAD();
      start = `${start.year}-${start.month + 1}-${start.date}`;
      end = end.getAD();
      end = `${end.year}-${end.month + 1}-${end.date}`;
      let response = await axios.get(
        "/transactions/reports/?type=incomes&business=" +
          localStorage.getItem("business") +
          "&start=" +
          start +
          "&end=" +
          end +
          "&user=" +
          this.$auth.user.id,
        {
          headers: {
            Authorization: localStorage.getItem("auth._token.local"),
          },
        }
      );
      response.data.results.forEach((element) => {
        var date1 = element.date != null ? new Date(element.date) : new Date();
        list.push({
          date: new NepaliDate(date1).format("YYYY-MM-DD"),
          total: element.total,
          amount: Math.abs(element.amount),
          totalAmt: this.conversion(Math.abs(element.amount)),
          note: element.note == "" || element.note == null ? "-" : element.note,
          category_value: element.category_value,
        });
      });
      this.clients = list;
      this.filterList = list;
      if (localStorage.getItem("report_title") == "income") {
        let category = localStorage.getItem("report_category");
        const result = this.clients.filter((d) => d.category_value == category);
        this.clients = result;
      }
      let sum = Number(response.data.total);
      let allAmt = { sum: sum };
      this.$emit("totalSum", allAmt);
      this.$emit("excelData", this.clients, allAmt, "income");
      this.loading = false;
    },
    async filterType(date) {
      if (date.id) {
        const result = this.filterList.filter((d) => d.category_value == date.text);
        this.clients = result;
        let start = new NepaliDate(this.dateSelect1.x);
        let end = new NepaliDate(this.dateSelect1.y);
        start = start.getAD();
        start = `${start.year}-${start.month + 1}-${start.date}`;
        end = end.getAD();
        end = `${end.year}-${end.month + 1}-${end.date}`;
        let response = await axios.get(
          "/transactions/reports/?type=incomes&business=" +
            localStorage.getItem("business") +
            "&start=" +
            start +
            "&end=" +
            end +
            "&user=" +
            this.$auth.user.id +
            "&category=" +
            date.id,
          {
            headers: {
              Authorization: localStorage.getItem("auth._token.local"),
            },
          }
        );
        let sum = Number(response.data.total);
        let allAmt = { sum: sum };
        this.$emit("totalSum", allAmt);
        this.$emit("excelData", this.clients, allAmt, "income");
      } else {
        this.clients = this.filterList;
        let start = new NepaliDate(this.dateSelect1.x);
        let end = new NepaliDate(this.dateSelect1.y);
        start = start.getAD();
        start = `${start.year}-${start.month + 1}-${start.date}`;
        end = end.getAD();
        end = `${end.year}-${end.month + 1}-${end.date}`;
        let response = await axios.get(
          "/transactions/reports/?type=incomes&business=" +
            localStorage.getItem("business") +
            "&start=" +
            start +
            "&end=" +
            end +
            "&user=" +
            this.$auth.user.id,
          {
            headers: {
              Authorization: localStorage.getItem("auth._token.local"),
            },
          }
        );
        let sum = Number(response.data.total);
        let allAmt = { sum: sum };
        this.$emit("totalSum", allAmt);
        this.$emit("excelData", this.clients, allAmt, "income");
      }
    },
  },
 methods: {
    trashModal(trashObject) {
      this.trashObject = trashObject;
    },
  },
};
</script>
<style lang="scss">
$green: #34a77f;
$black: #1f1f1f;
</style>