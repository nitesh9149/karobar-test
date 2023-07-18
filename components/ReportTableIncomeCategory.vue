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
        <b-table-column label="SN" field="id">
          {{ props.row.id }}
        </b-table-column>
        <b-table-column width="480" label="Category" field="name">
          {{ props.row.name }}
        </b-table-column>
        <b-table-column class="pad_left" label="Total Income" field="amount">
          Rs. {{ props.row.total_amount_value }}
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
    try {
      let response = await axios.get(
        "/transactions/income-expense-category/?type=income&business=" +
          localStorage.getItem("business"),
        {
          headers: {
            Authorization: localStorage.getItem("auth._token.local"),
          },
        }
      );
      response.data.forEach((element, index) => {
        list.push({
          name: element.name,
          type_value: element.type_value,
          total_amount: Math.abs(element.total_amount),
          total_amount_value: this.conversion(Math.abs(element.total_amount)),
          id: index + 1,
        });
      });
      this.clients = list;
    } catch (err) {}
    let sum = 0;
    if (this.clients.length) {
      for (let i = 0; i < this.clients.length; i++) {
        sum = sum + this.clients[i].total_amount;
      }
    }
    let allAmt = { sum: sum };
    this.$emit("totalSum", allAmt);
    this.$emit("excelData", this.clients, allAmt, "income-category");
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