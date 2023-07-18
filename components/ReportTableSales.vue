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
        <b-table-column width="100" label="Date" field="date" sortable>
          <span>
            {{ props.row.date }}
          </span>
        </b-table-column>
        <b-table-column label="Party Name" field="party_value">
          {{ props.row.party_value }}
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
          label="Received Amt"
          field="received"
          sortable
        >
          Rs. {{ props.row.receivedAmt }}
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
import NepaliDate from "nepali-date-converter";
import axios from "axios";
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
      stickyHeader: true,
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
        "/transactions/reports/?type=sales&business=" +
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
          id: element.id,
          date: new NepaliDate(date1).format("YYYY-MM-DD"),
          number:
            element.number == "" || element.number == null
              ? "-"
              : element.number,
          total: Number(element.total),
          totalAmt:
            element.total == "" || element.total == null
              ? "-"
              : this.conversion(element.total),
          received: Number(element.received),
          receivedAmt: this.conversion(element.received),
          balance: Number(element.total) - Number(element.received),
          balanceAmt: this.conversion(
            Number(element.total) - Number(element.received)
          ),
          party_value:
            element.on_cash == false && element.party == null
              ? "-"
              : element.on_cash == true && element.party == null
              ? "On Cash"
              : element.party_name,
        });
      });
      this.clients = list;
      let sum = Number(response.data.total);
      let paid = Number(response.data.received);
      let unpaid = Number(response.data.unpaid);
      let allAmt = { sum: sum, paid: paid, unpaid: unpaid, type: "received" };
      this.$emit("totalSum", allAmt);
      this.$emit("excelData", this.clients, allAmt, "sale");
      this.loading = false;
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