<template>
  <div>
    <b-table
      class="expenses-table"
      aria-next-label="Next page"
      aria-previous-label="Previous page"
      :checkable="false"
      :loading="loading"
      :paginated="false"
      :per-page="5"
      :striped="false"
      :hoverable="true"
      :sticky-header="stickyHeader"
      default-sort="name"
      :data="clients"
    >
      <template slot-scope="props">
        <b-table-column label="Date" field="Date">
          <span>
            {{ props.row.date }}
          </span>
        </b-table-column>
        <b-table-column label="Particular" field="name">
          {{ props.row.type_value }}
        </b-table-column>
        <b-table-column class="pad_left" label="Bill no." field="exp">
          <span v-if="props.row.num">{{ props.row.num }}</span>
          <span v-else>-</span>
        </b-table-column>
        <b-table-column class="pad_left" label="Debit" field="note">
          <span v-if="props.row.debit != 0"
            >Rs. {{ props.row.debit_value }}</span
          >
          <span v-else>-</span>
        </b-table-column>
        <b-table-column class="pad_left" label="Credit" field="mode">
          <span v-if="props.row.credit != 0"
            >Rs. {{ props.row.credit_value }}</span
          >
          <span v-else>-</span>
        </b-table-column>
        <b-table-column class="pad_left" label="Bill Total" field="total">
          <span v-if="props.row.balance">Rs. {{ props.row.balance }}</span>
          <span v-else>-</span>
        </b-table-column>
        <!-- <b-table-column class="pad_left" label="Balance" field="amount">
          <span v-if="props.row.balanceNum > 0"
            >Rs. {{ (props.row.balance) }} <small>(Dr)</small></span
          >
          <span v-if="props.row.balanceNum < 0"
            >Rs. {{ (props.row.balance) }} <small>(Cr)</small></span
          >
        </b-table-column> -->
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
            <!-- <p>
              <b-icon icon="emoticon-sad" size="is-large" />
            </p>
            <p>Please Enter Party Name to show data</p> -->
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
      party: null,
      loading: true,
      trashObject: null,
      stickyHeader: false,
      paginated: true,
      perPage: 10,
      CheckedRows: [],
    };
  },
  watch: {
    async filterType(party) {
      if (party) {
        this.stickyHeader = true;
        this.party = party.party;
      }
      this.loading = false;
    },
    async dateSelect1(date1) {
      if (this.party) {
        this.stickyHeader = true;
        let list = [];
        let start = new NepaliDate(date1.x);
        let end = new NepaliDate(date1.y);
        start = start.getAD();
        start = `${start.year}-${start.month + 1}-${start.date}`;
        end = end.getAD();
        end = `${end.year}-${end.month + 1}-${end.date}`;
        let response = await axios.get(
          "/transactions/reports/?type=party-statement&business=" +
            localStorage.getItem("business") +
            "&start=" +
            start +
            "&end=" +
            end +
            "&party=" +
            this.party,
          {
            headers: {
              Authorization: localStorage.getItem("auth._token.local"),
            },
          }
        );
        response.data.result.forEach((element) => {
          var date1 =
            element.date != null ? new Date(element.date) : new Date();
          list.push({
            date: new NepaliDate(date1).format("YYYY-MM-DD"),
            party_value: element.name,
            num: element.num,
            type_value: element.particular,
            debit: element.debit,
            debit_value: this.conversion(Math.abs(element.debit)),
            credit: element.credit,
            credit_value: this.conversion(Math.abs(element.credit)),
            balance: this.conversion(element.total),
            balanceExcel: Number(element.total),
          });
        });
        this.clients = list;
        let debitTotal = 0;
        let creditTotal = 0;
        let totalAmt = 0;
        for (let i = 0; i < list.length; i++) {
          if (list[i].debit) {
            debitTotal = debitTotal + Math.abs(list[i].debit);
          } else {
            creditTotal = creditTotal + Math.abs(list[i].credit);
          }
          totalAmt = totalAmt + list[i].balanceExcel;
        }
        let allAmt = {
          sales: Number(response.data.sales),
          purchase: Number(response.data.purchases),
          money_in: Number(response.data.money_in),
          money_out: Number(response.data.money_out),
          amount: Number(response.data.amount),
        };
        let totalDC = {
          debitTotal: debitTotal,
          creditTotal: creditTotal,
          total: totalAmt,
        };
        this.$emit("totalSum", allAmt);
        this.$emit("excelData", this.clients, totalDC, "party-statement");
        this.loading = false;
      } else {
        this.$buefy.snackbar.open({
          message: "Please Select party name",
          type: "is-primary",
          position: "is-bottom",
          indefinite: false,
        });
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