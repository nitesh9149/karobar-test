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
        <b-table-column label="SN" field="Date">
          {{ props.row.id }}
        </b-table-column>
        <b-table-column width="300" label="Party Name" field="name">
          {{ props.row.name }}
        </b-table-column>
        <b-table-column
          class="pad_left"
          label="Total Sale Discount"
          field="mode"
        >
          Rs. {{ props.row.total_sale_discount_Amt }}
        </b-table-column>
        <b-table-column
          class="pad_left"
          label="Total Purchase Discount"
          field="amount"
        >
          Rs. {{ props.row.total_purchase_discount_Amt }}
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
  },
  data() {
    return {
      clients: [],
      loading: true,
      trashObject: null,
      paginated: true,
      perPage: 10,
      CheckedRows: [],
    };
  },
  async mounted() {
    let list = [];
    let response = await axios.get(
      "/transactions/reports/?business=" +
        localStorage.getItem("business") +
        "&type=discount-report",
      {
        headers: {
          Authorization: localStorage.getItem("auth._token.local"),
        },
      }
    );
    let num = 0;
    response.data.result.forEach((element, index) => {
      if (
        Number(element.total_sale_discount) ||
        Number(element.total_purchase_discount)
      ) {
        list.push({
          id: num + 1,
          name: element.party_name,
          total_sale_discount: Number(element.total_sale_discount),
          total_purchase_discount: Number(element.total_purchase_discount),
          total_sale_discount_Amt: this.conversion(element.total_sale_discount),
          total_purchase_discount_Amt: this.conversion(
            element.total_purchase_discount
          ),
        });
        num++
      }
    });
    this.clients = list;
    let sale_discount = 0;
    let purchase_discount = 0;
    if (this.clients.length) {
      for (let i = 0; i < this.clients.length; i++) {
        sale_discount = sale_discount + this.clients[i].total_sale_discount;
        purchase_discount =
          purchase_discount + this.clients[i].total_purchase_discount;
      }
    }
    let allAmt = {
      sale_discount: sale_discount,
      purchase_discount: purchase_discount,
    };
    this.$emit("totalSum", allAmt);
    this.$emit("excelData", this.clients, allAmt, "discount");
    this.loading = false;
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