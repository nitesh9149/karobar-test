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
      :sticky-header="stickyHeader"
      default-sort="name"
      :data="clients"
    >
      <template slot-scope="props">
        <b-table-column class="pad_left" label="Txn Type" field="exp">
          {{ props.row.type_value }}
        </b-table-column>
        <b-table-column label="Party Name" field="name">
          {{ props.row.party_value }}
        </b-table-column>
        <b-table-column class="pad_left" label="Amount" field="amount">
          Rs. {{ props.row.amount_value }}
        </b-table-column>
        <b-table-column class="pad_left" label="Money In" field="in">
          <span v-if="props.row.money_in_value"
            >Rs. {{ props.row.money_in_value }}</span
          >
          <span v-else>-</span>
        </b-table-column>
        <b-table-column class="pad_left" label="Money Out" field="out">
          <span v-if="props.row.money_out_value"
            >Rs. {{ props.row.money_out_value }}</span
          >
          <span v-else>-</span>
        </b-table-column>
      </template>
      <section slot="empty">
        <div class="content has-text-grey has-text-centered">
          <template v-if="loading">
            <!-- <b-skeleton height="50px" :animated="true"></b-skeleton>
            <b-skeleton height="50px" :animated="true"></b-skeleton>
            <b-skeleton height="50px" :animated="true"></b-skeleton>
            <b-skeleton height="50px" :animated="true"></b-skeleton> -->
          </template>
          <template v-else>
            <p>
              <b-icon icon="emoticon-sad" size="is-large" />
            </p>
            <p>Please Enter Date to show data</p>
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
    dateSelect1: {
      type: Object,
    },
  },
  data() {
    return {
      clients: [],
      isLoading: false,
      stickyHeader: false,
      loading: true,
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
      this.stickyHeader = true;
      let start = new NepaliDate(date1.x);
      start = start.getAD();
      start = `${start.year}-${start.month + 1}-${start.date}`;
      let response = await axios.get(
        "/transactions/reports/?type=day-book&business=" +
          localStorage.getItem("business") +
          "&date=" +
          start,
        {
          headers: {
            Authorization: localStorage.getItem("auth._token.local"),
          },
        }
      );
      response.data.result.forEach((element) => {
        list.push({
          number: element.number != "" ? Number(element.number) : "-",
          amount_value:
            element.amount == "" || element.amount == null
              ? "-"
              : this.conversion(Math.abs(element.amount)),
          received: Math.abs(element.received),
          balance: Number(element.balance),
          type_value: element.type_value,
          party_value: element.party_value == "" ? "-" : element.party_value,
        });
      });
      list.forEach((element) => {
        if (
          element.type_value == "Sale Invoice" ||
          element.type_value == "Add Cash" ||
          element.type_value == "Add Bank Money" ||
          element.type_value == "Payment In" ||
          element.type_value == "Income" ||
          element.type_value == "Purchase Return"
        ) {
          element.money_in = Math.abs(element.received);
          element.money_out = 0;
          element.money_in_value = this.conversion(Math.abs(element.received));
        } else if (
          element.type_value == "Sales Return" ||
          element.type_value == "Reduce Cash" ||
          element.type_value == "Reduce Bank Money" ||
          element.type_value == "Payment Out" ||
          element.type_value == "Expense" ||
          element.type_value == "Purchase"
        ) {
          element.money_out = Math.abs(element.received);
          element.money_in = 0;
          element.money_out_value = this.conversion(Math.abs(element.received));
        }
      });
      this.clients = list;
      let sum = Number(response.data.amount);
      let paid = Number(response.data.money_in);
      let unpaid = Number(response.data.money_out);
      let allAmt = { sum: sum, paid: paid, unpaid: unpaid };
      this.$emit("totalSum", allAmt);
      this.$emit("excelData", this.clients,allAmt,"daybook")
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
.expenses-table {
  .is-empty {
    .content {
      margin-top: 0 !important;
    }
  }
}
$green: #34a77f;
$black: #1f1f1f;
</style>
