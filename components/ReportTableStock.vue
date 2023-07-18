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
        <b-table-column label="Item Name" field="name">
          {{ props.row.name }}
        </b-table-column>
        <b-table-column class="pad_left" label="Sale Price" field="exp">
          {{ props.row.sale_price }}
        </b-table-column>
        <b-table-column class="pad_left" label="Purchase Price" field="mode">
          {{ props.row.purchase_price }}
        </b-table-column>
        <b-table-column class="pad_left" label="Stock QTY." field="note">
          {{ props.row.quantity }} {{ props.row.primary_unit_value }}
        </b-table-column>
        <b-table-column class="pad_left" label="Stock Value" field="amount">
          {{ props.row.stock_value }}
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
    filterType: {
      type: String,
    },
  },
  data() {
    return {
      clients: [],
      typeList: [],
      filterData: [],
      loading: true,
      trashObject: null,
      paginated: true,
      perPage: 10,
      CheckedRows: [],
      next: "",
    };
  },
  watch: {
    async filterType(date) {
      if (date == "All Categories" || date == "") {
        this.clients = this.typeList;
        let sum = 0;
        if (this.clients.length) {
          for (let i = 0; i < this.clients.length; i++) {
            sum = sum + this.clients[i].stock;
          }
        }
        let allAmt = { sum: sum };
        this.$emit("excelData", this.clients, allAmt, "stock");
      }
      if (date != "All Categories") {
        const result = this.typeList.filter((d) => d.category_value == date);
        this.clients = result;
        let sum = 0;
        if (this.clients.length) {
          for (let i = 0; i < this.clients.length; i++) {
            sum = sum + this.clients[i].stock;
            this.clients[i].id = i + 1;
          }
        }
        let allAmt = { sum: sum };
        this.$emit("excelData", this.clients, allAmt, "stock");
      }
    },
  },
  async mounted() {
    // document
    //   .querySelector(".has-sticky-header")
    //   .addEventListener("scroll", this.onScroll);
    let list = [];
    let response = await axios.get(
      "/inventory/items/?items=999999&business=" +
        localStorage.getItem("business") +
        "&user=" +
        this.$auth.user.id,
      {
        headers: {
          Authorization: localStorage.getItem("auth._token.local"),
        },
      }
    );
    this.next = response.data.next;
    response.data.results.forEach((element, index) => {
      if (element.type == "product") {
        list.push({
          name: element.name,
          type_value: element.type_value,
          category_value: element.category_value,
          id: index + 1,
          quantity:
            element.type_value == "Product"
              ? this.conversion(element.quantity)
              : "-",
          sale_priceExcel: this.conversion(element.sale_price),
          purchase_priceExcel: this.conversion(element.purchase_price),
          stockExcel:
            Number(element.quantity * element.purchase_price) <= 0
              ? 0
              : this.conversion(element.quantity * element.purchase_price),
          sale_price_num: element.sale_price,
          sale_price: "Rs." + " " + this.conversion(element.sale_price),
          purchase_price:
            element.type_value == "Product"
              ? "Rs." + " " + this.conversion(Math.abs(element.purchase_price))
              : "-",
          primary_unit_value: element.primary_unit_value,
          stock:
            Number(element.quantity * element.purchase_price) <= 0
              ? 0
              : Number(element.quantity * element.purchase_price),
          stock_value:
            Number(element.quantity * element.purchase_price) <= 0
              ? "Rs." + " " + 0
              : element.type_value == "Product"
              ? "Rs." +
                " " +
                this.conversion(element.quantity * element.purchase_price)
              : "-",
        });
      }
    });
    this.clients = list;
    this.typeList = list;
    this.$emit("excelData", this.clients, "", "stock");
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
          response.data.results.forEach((element, index) => {
            if (element.type == "product") {
              list.push({
                name: element.name,
                type_value: element.type_value,
                category_value: element.category_value,
                id: index + 1,
                quantity:
                  element.type_value == "Product"
                    ? this.conversion(element.quantity)
                    : "-",
                sale_priceExcel: this.conversion(element.sale_price),
                purchase_priceExcel: this.conversion(element.purchase_price),
                stockExcel:
                  Number(element.quantity * element.purchase_price) <= 0
                    ? 0
                    : this.conversion(element.quantity * element.purchase_price),
                sale_price_num: element.sale_price,
                sale_price: "Rs." + " " + this.conversion(element.sale_price),
                purchase_price:
                  element.type_value == "Product"
                    ? "Rs." +
                      " " +
                      this.conversion(Math.abs(element.purchase_price))
                    : "-",
                primary_unit_value: element.primary_unit_value,
                stock:
                  Number(element.quantity * element.purchase_price) <= 0
                    ? 0
                    : Number(element.quantity * element.purchase_price),
                stock_value:
                  Number(element.quantity * element.purchase_price) <= 0
                    ? "Rs." + " " + 0
                    : element.type_value == "Product"
                    ? "Rs." +
                      " " +
                      this.conversion(element.quantity * element.purchase_price)
                    : "-",
              });
            }
          });
          this.clients.push(...list);
          this.typeList.push(...list);
          this.$emit("excelData", this.clients, "", "stock");
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