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
        <b-table-column label="Item Name" field="name">
          {{ props.row.name }}
        </b-table-column>
        <b-table-column class="pad_left" label="Stock QTY." field="note">
          {{ props.row.quantity }} {{ props.row.primary_unit_value }}
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
    filterType: {
      type: String,
    },
  },
  data() {
    return {
      clients: [],
      filterList: [],
      loading: true,
      trashObject: null,
      paginated: true,
      perPage: 10,
      CheckedRows: [],
      next: "",
    };
  },
  watch: {
    filterType(date) {
      if (date) {
        const result = this.filterList.filter(
          (d) => d.category == Number(date)
        );
        this.clients = result;
        this.$emit("excelData", this.clients, "", "stock-low");
      } else {
        this.clients = this.filterList;
        this.$emit("excelData", this.clients, "", "stock-low");
      }
    },
  },
  async mounted() {
    // document
    //   .querySelector(".has-sticky-header")
    //   .addEventListener("scroll", this.onScroll);
    let list = [];
    let response = await axios.get(
      "/transactions/reports/?type=low-stock-report&business=" +
        localStorage.getItem("business") +
        "&user=" +
        this.$auth.user.id,
      {
        headers: {
          Authorization: localStorage.getItem("auth._token.local"),
        },
      }
    );
    response.data.result.forEach((element) => {
      list.push({
        name: element.name,
        quantity:
          element.type == "product" ? this.conversion(element.quantity) : "-",
        primary_unit_value: element.unit,
        low_stock: this.conversion(element.low_stock),
        category: element.category,
      });
    });
    this.clients = list;
    this.filterList = list;
    let num = 1;
    this.clients.forEach((e) => {
      e.id = num++;
    });
    this.$emit("excelData", this.clients, "", "stock-low");
    this.loading = false;
  },
  methods: {
    trashModal(trashObject) {
      this.trashObject = trashObject;
    },
    onScroll() {
      let apiCall = async () => {
        if (
          Math.ceil(document.querySelector(".has-sticky-header").scrollTop) +
            document.querySelector(".has-sticky-header").clientHeight +
            1 >=
            document.querySelector(".has-sticky-header").scrollHeight &&
          this.next
        ) {
          let list = [];
          let response = await axios.get(this.next, {
            headers: {
              Authorization: localStorage.getItem("auth._token.local"),
            },
          });
          this.next = response.data.next;
          response.data.results.forEach((element) => {
            list.push({
              name: element.name,
              quantity:
                element.type_value == "Product"
                  ? this.conversion(element.quantity)
                  : "-",
              primary_unit_value: element.primary_unit_value,
              low_stock: this.conversion(element.low_stock),
              category_value: element.category_value,
            });
          });
          this.clients.push(...list);
          let num = 1;
          this.clients.forEach((e) => {
            e.id = num++;
          });
          this.filterList.push(...list);
          this.$emit("excelData", this.clients, "", "stock-low");
        }
      };
      this.throttleFunction(apiCall, 200);
    },
    throttleFunction(callback, time) {
      if (this.throttlePause) return;
      this.throttlePause = true;
      setTimeout(() => {
        callback();
        this.throttlePause = false;
      }, time);
    },
  },
};
</script>
<style lang="scss">
$green: #34a77f;
$black: #1f1f1f;
</style>