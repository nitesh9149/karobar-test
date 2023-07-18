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
        <b-table-column label="Date" field="Date">
          <span>
            {{ props.row.date }}
          </span>
        </b-table-column>
        <b-table-column class="pad_left" label="Bill no." field="exp">
          {{ props.row.number }}
        </b-table-column>
        <b-table-column label="Party Name" field="name">
          {{ props.row.party_value }}
        </b-table-column>

        <b-table-column class="pad_left" label="VAT/PAN No." field="note">
          {{ props.row.pan_vat_num }}
        </b-table-column>
        <b-table-column class="pad_left" label="Taxable Amt." field="rec">
          Rs. {{ props.row.amount }}
        </b-table-column>
        <b-table-column class="pad_left" label="VAT" field="mode">
          Rs. {{ props.row.vat_amount }}
        </b-table-column>
        <b-table-column class="pad_left" label="Total" field="amount">
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
        "/transactions/reports/?type=vat-purchases&business=" +
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
        number: element.number != "" ? (element.number) : "-",
        total: element.total,
        vat_enabled: element.vat_enabled,
        amount: Number(element.sub_total),
        totalAmt:
          element.sub_total == "" || element.sub_total == null
            ? "-"
            : this.conversion(element.sub_total),
        vat: Number(element.vat_amount),
        vat_amount: this.conversion(element.vat_amount),
        balance: Number(element.sub_total) + Number(element.vat_amount),
        balanceAmt: this.conversion(
          Number(element.sub_total) + Number(element.vat_amount)
        ),
        pan_vat_num:
          element.party_pan_vat_number == ""
            ? "-"
            : element.party_pan_vat_number,
        party_value:
          element.on_cash == false && element.party == null
            ? "-"
            : element.on_cash == true && element.party == null
            ? "On Cash"
            : element.party_name,
      });
    });
    this.clients = list;
    let paid = Number(response.data.taxable_amt);
    let unpaid = Number(response.data.vat_amt);
    let sum = Number(response.data.total_amt);
    let allAmt = { sum: sum, paid: paid, unpaid: unpaid };
    this.$emit("totalSum", allAmt);
    this.$emit("excelData", this.clients,allAmt,"vat-purchase");
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