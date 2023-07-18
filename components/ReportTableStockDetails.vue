<template>
  <div>
    <b-table class="expenses-table"
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
        <b-table-column label="Item Name" field="name">
          {{props.row.name}}
        </b-table-column>
        <b-table-column class="pad_left" label="Opening QTY." field="exp">
          {{ props.row.opening_quantity }} {{props.row.unit}}
        </b-table-column>
        <b-table-column class="pad_left" label="QTY. In" field="mode">
            {{ props.row.quantity_in }} {{props.row.unit}}
        </b-table-column>
        <b-table-column class="pad_left" label="QTY. Out" field="note">
            {{ props.row.quantity_out }} {{props.row.unit}}
        </b-table-column>
        <b-table-column class="pad_left" label="Closing QTY." field="amount">
          {{ props.row.closing_quantity }} {{props.row.unit}}
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
import axios from 'axios'
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
  },
  watch: {
    async filterType(date) {
      if (date == "All Categories" || date == "") {
        this.clients = this.typeList;
        this.filterList = this.filterData;
        this.$emit("excelData", this.clients, "", "stock-detail");
      }
      if (date != "All Categories") {
        const result = this.typeList.filter((d) => d.category_value == date);
        const resultType = this.filterData.filter((d) => d.category_value == date);
        this.clients = result;
        this.filterList = resultType;
        this.$emit("excelData", this.clients, "", "stock-detail");
      }
    },
  },
  data() {
    return {
      clients: [
      ],
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
  async mounted() {
    let list = [];
    let response = await axios.get(
      "/transactions/reports/?business=" +
        localStorage.getItem("business") +
        "&type=stock-detail",
      {
        headers: {
          Authorization: localStorage.getItem("auth._token.local"),
        },
      }
    );
    response.data.result.forEach((element, index) => {
      list.push({
        name: element.item_name,
        opening_quantity: this.conversion(element.opening_quantity),
        quantity_in:this.conversion(element.quantity_in),
        quantity_out:this.conversion(element.quantity_out),
        closing_quantity:this.conversion(element.closing_quantity),
        category_value: element.item_category,
        unit:element.unit
      });
    });
    this.clients = list;
    this.filterList = list;
    this.typeList = list;
    this.filterData = list;
    this.$emit("excelData", this.clients, "", "stock-detail");
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