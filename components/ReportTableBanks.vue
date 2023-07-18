<template>
  <div>
    <b-table
      class="expenses-table"
      aria-next-label="Next page"
      aria-previous-label="Previous page"
      :checkable="false"
      :paginated="false"
      :loading="loading"
      :per-page="5"
      :striped="false"
      :hoverable="true"
      :sticky-header="stickyHeader"
      default-sort="name"
      :data="clients"
    >
      <template slot-scope="props">
        <b-table-column width="100" label="Date" field="Date">
          <span>
            {{ props.row.date }}
          </span>
        </b-table-column>
        <b-table-column label="Particular" field="name">
          {{ props.row.type_value }}
        </b-table-column>
        <b-table-column width="260" class="pad_left" label="Remarks" field="note">
          <span v-if="props.row.remarks">{{ props.row.remarks }}</span>
          <span v-else>-</span>
        </b-table-column>
        <b-table-column class="pad_left" label="Withdraw" field="mode">
          <span v-if="props.row.money_out_value"
            >Rs. {{ props.row.money_out_value }}</span
          >
          <span v-else>-</span>
        </b-table-column>
        <b-table-column class="pad_left" label="Deposit" field="amount">
          <span v-if="props.row.money_in_value"
            >Rs. {{ props.row.money_in_value }}</span
          >
          <span v-else>-</span>
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
            <p>
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
    dateSelect1: {
      type: Object,
    },
  },
  data() {
    return {
      clients: [],
      loading: true,
      trashObject: null,
      paginated: true,
      perPage: 10,
      stickyHeader: false,
      CheckedRows: [],
    };
  },
  watch: {
    async dateSelect1(date1) {
      this.loading = true;
      this.stickyHeader = true;
      let list = [];
      let start = new NepaliDate(date1.x);
      let end = new NepaliDate(date1.y);
      start = start.getAD();
      start = `${start.year}-${start.month + 1}-${start.date}`;
      end = end.getAD();
      end = `${end.year}-${end.month + 1}-${end.date}`;
      let response = await axios.get(
        "/transactions/reports/?type=bank-statement&business=" +
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
        var date1 =
          element.created != null ? new Date(element.created) : new Date();
        list.push({
          id: element.id,
          date: new NepaliDate(date1).format("YYYY-MM-DD"),
          remarks: element.remarks,
          type_value: element.type_value,
          amount: Math.abs(element.amount),
          amount_value: this.conversion(Math.abs(element.amount)),
          balance: Number(element.received),
        });
      });

      list.forEach((element) => {
        if (element.type_value == "Balance B/F") {
          if (Number(element.balance) < 0) {
            element.money_in = 0;
            element.money_out = Math.abs(element.balance);
            element.money_out_value = this.conversion(element.balance);
          } else if (Number(element.balance) > 0) {
            element.money_out = 0;
            element.money_in = Math.abs(element.balance);
            element.money_in_value = this.conversion(Math.abs(element.balance));
          }
        }
        if (
          element.type_value == "Sale Invoice" ||
          element.type_value == "Add Bank Money" ||
          element.type_value == "Payment In" ||
          element.type_value == "Income" ||
          element.type_value == "Purchase Return"
        ) {
          element.money_in = Math.abs(element.balance);
          element.money_out = 0;
          element.money_in_value = this.conversion(Math.abs(element.balance));
        } else if (
          element.type_value == "Sales Return" ||
          element.type_value == "Reduce Bank Money" ||
          element.type_value == "Payment Out" ||
          element.type_value == "Expense" ||
          element.type_value == "Purchase"
        ) {
          element.money_out = Math.abs(element.balance);
          element.money_in = 0;
          element.money_out_value = this.conversion(element.balance);
        }
      });
      this.clients = list;
      let closing = Number(response.data.closing);
      let allAmt = { closing: closing };
      this.$emit("totalSum", allAmt);
      this.$emit("excelData", this.clients, allAmt, "bank");
      this.loading = false;
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