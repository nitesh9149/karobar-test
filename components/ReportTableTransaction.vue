<template>
  <div>
    <b-table
      class="expenses-table"
      aria-next-label="Next page"
      aria-previous-label="Previous page"
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
        <b-table-column
          class="pad_left"
          label="Txn Type"
          field="type_value"
          sortable
        >
          {{ props.row.type_value }}
        </b-table-column>
        <b-table-column label="Party Name" field="party_value" sortable>
          {{ props.row.party_value }}
        </b-table-column>
        <b-table-column width="100" label="Date" field="date" sortable>
          <span>
            {{ props.row.date }}
          </span>
        </b-table-column>
        <b-table-column
          class="pad_left"
          label="Bill no."
          field="number"
          sortable
        >
          {{ props.row.number }}
        </b-table-column>
        <b-table-column
          class="pad_left"
          label="Total Amt"
          field="total"
          sortable
        >
          Rs. {{ props.row.totalAmt }}
        </b-table-column>
        <b-table-column
          class="pad_left"
          label="Rec/Paid Amt"
          field="rp"
          sortable
        >
          Rs. {{ props.row.rpAmt }}
        </b-table-column>
        <b-table-column
          class="pad_left"
          label="Balance Amt"
          field="balance"
          sortable
        >
          Rs. {{ props.row.balanceAmt }}
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
    filterType: {
      type: String,
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
      loading: true,
      trashObject: null,
      paginated: true,
      perPage: 10,
      CheckedRows: [],
    };
  },
  watch: {
    filterType(type) {
      let result = {};
      let resultType = {};
      let loadingComponent = this.$buefy.loading.open();
      switch (type) {
        case "All Transaction" || "":
          this.clients = this.typeList;
          break;
        case "Sales Invoice":
          result = this.typeList.filter((d) => d.type_value == "Sale Invoice");
          this.clients = result;
          break;
        case "Purchase":
          result = this.typeList.filter((d) => d.type_value == "Purchase");
          this.clients = result;
          break;
        case "Sales Return":
          result = this.typeList.filter((d) => d.type_value == "Sales Return");
          this.clients = result;
          break;
        case "Purchase Return":
          result = this.typeList.filter(
            (d) => d.type_value == "Purchase Return"
          );
          this.clients = result;
          break;
        case "Estimate/Quotation":
          result = this.typeList.filter((d) => d.type_value == "Estimate");
          this.clients = result;
          break;
        case "Payment In":
          result = this.typeList.filter((d) => d.type_value == "Payment In");
          this.clients = result;
          break;
        case "Payment Out":
          result = this.typeList.filter((d) => d.type_value == "Payment Out");
          this.clients = result;
          break;
        case "Expense":
          result = this.typeList.filter((d) => d.type_value == "Expense");
          this.clients = result;
          break;
        case "Income":
          result = this.typeList.filter((d) => d.type_value == "Income");
          this.clients = result;
      }
      this.$emit("excelData", this.clients, "", "all-transaction");
      loadingComponent.close();
    },
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
        "/transactions/reports/?type=all-transactions&business=" +
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
          number:
            element.number == null || element.number == ""
              ? "-"
              : element.number,
          total: Math.abs(element.amount),
          totalAmt:
            element.amount == "" || element.amount == null
              ? "-"
              : this.conversion(Math.abs(element.amount)),
          rp: Math.abs(element.received),
          rpAmt:
            element.received == "" || element.received == null
              ? "-"
              : this.conversion(Math.abs(element.received)),
          balance: Math.abs(element.balance),
          balanceAmt:
            element.type == "income" ||
            element.type == "expense" ||
            element.type == "payment-in" ||
            element.type == "payment-out"
              ? 0
              : this.conversion(Math.abs(element.balance)),
          type_value:
            element.type_value == "" || element.type_value == null
              ? "-"
              : element.type_value,
          party_value:
            element.party_value == "" || element.party_value == null
              ? "On " + element.payment_mode_value
              : element.party_value,
        });
      });
      this.clients = list;
      this.typeList = list;
      this.$emit("excelData", this.clients, "", "all-transaction");
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
.expenses-table {
  .is-empty {
    .content {
      margin-top: 0 !important;
    }
  }
}
</style>