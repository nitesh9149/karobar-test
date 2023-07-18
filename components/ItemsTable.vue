<template>
  <div>
    <b-table
      class="items-table"
      aria-next-label="Next page"
      aria-previous-label="Previous page"
      :checked-rows.sync="checkedRows"
      :checkable="false"
      :paginated="false"
      :per-page="5"
      :striped="false"
      :sticky-header="true"
      :hoverable="true"
      @click="clickRow($event)"
      default-sort="name"
      :data="clients"
    >
      <template slot-scope="props">
        <b-table-column
          class="name_width pad_left"
          label="Item Name"
          field="name"
        >
          {{ props.row.name }}
        </b-table-column>
        <b-table-column class="pad_left" label="Type" field="name">
          {{ props.row.type_value }}
        </b-table-column>
        <b-table-column class="pad_left" label="Category" field="category">
          {{ props.row.category_value }}
        </b-table-column>
        <b-table-column class="pad_left" label="Item Id" field="id">
          {{ props.row.item_code }}
        </b-table-column>
        <b-table-column class="pad_left" label="Quantity" field="quantity">
          {{ props.row.quantity }} {{ props.row.primary_unit_value }}
        </b-table-column>
        <b-table-column class="pad_left" label="Sale Price" field="sale">
          {{ props.row.sale_price }}
        </b-table-column>
        <b-table-column
          class="pad_left"
          label="Purchase Price"
          field="purchase"
        >
          {{ props.row.purchase_price }}
        </b-table-column>
        <b-table-column class="pad_left" label="Stock Value" field="stock">
          <span
            v-if="props.row.stock == 0 && props.row.type_value == 'Product'"
          >
            Rs. {{ props.row.stock }}</span
          >
          <span v-else>{{ props.row.stock_value }}</span>
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
  name: "ItemsTable",
  components: {},
  props: {
    dataUrl: {
      type: String,
      default: null,
    },
    checkable: {
      type: Boolean,
      default: false,
    },
    searchTransaction: {
      type: Object,
    },
    filterCategory: {
      type: String,
    },
    filterType: {
      type: String,
    },
  },
  data() {
    return {
      isModalActive: false,
      clients: [],
      loading: true,
      searchQuery: "",
      trashObject: null,
      paginated: true,
      perPage: 10,
      checkedRows: [],
      next: "",
    };
  },
  watch: {
    searchTransaction(search) {
      if (search.event.key == "Enter" || !search.value) {
        this.searchQuery = search.value;
        this.resetFilter();
      }
    },
    filterType() {
      this.resetFilter();
    },
    async filterCategory() {
      this.resetFilter();
    },
  },
  async mounted() {
    document
      .querySelector(".has-sticky-header")
      .addEventListener("scroll", this.onScroll);
    let list = [];
    let response = await axios.get(
      "/inventory/items/?business=" +
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
    response.data.results.forEach((element) => {
      list.push({
        name: element.name,
        date: element.as_of_date,
        type_value: element.type_value,
        category_value: element.category_value,
        id: element.id,
        quantity:
          element.type_value == "Product"
            ? this.conversion(element.quantity)
            : "-",
        sale_price_num: element.sale_price,
        sale_price: "Rs." + " " + this.conversion(element.sale_price),
        purchase_price:
          element.purchase_price > 0
            ? "Rs." + " " + this.conversion(element.purchase_price)
            : "-",
        opening_stock: element.opening_stock,
        primary_unit_value:
          element.type_value == "Product" ? element.primary_unit_value : "",
        stock: Number(element.quantity * element.purchase_price),
        stock_value:
          element.type_value == "Product"
            ? "Rs." +
              " " +
              this.conversion(element.quantity * element.purchase_price)
            : "-",
        item_code:
          element.item_code == "" || element.item_code == null
            ? "-"
            : element.item_code,
        location:
          element.location == "" || element.location == null
            ? "-"
            : element.location,
        remarks:
          element.remarks == "" || element.remarks == null
            ? "-"
            : element.remarks,
        secondary_unit_value:
          element.secondary_unit_value == "" ||
          element.secondary_unit_value == null
            ? "-"
            : element.secondary_unit_value,
      });
    });
    this.clients = list;
    this.loading = false;
  },
  computed: {
    axiosParams() {
      const params = new URLSearchParams();
      params.append("search", this.searchQuery);
      params.append("type", this.filterType);
      params.append("category", this.filterCategory);
      return params;
    },
  },
  methods: {
    clickRow(event) {
      this.$router.push("/itemDetails");
      localStorage.setItem("item", JSON.stringify(event));
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
              date: element.as_of_date,
              type_value: element.type_value,
              category_value: element.category_value,
              id: element.id,
              quantity:
                element.type_value == "Product"
                  ? this.conversion(element.quantity)
                  : "-",
              sale_price_num: element.sale_price,
              sale_price: "Rs." + " " + this.conversion(element.sale_price),
              purchase_price:
                element.purchase_price > 0
                  ? "Rs." + " " + this.conversion(element.purchase_price)
                  : "-",
              opening_stock: element.opening_stock,
              primary_unit_value:
                element.type_value == "Product"
                  ? element.primary_unit_value
                  : "",
              stock: Number(element.quantity * element.purchase_price),
              stock_value:
                element.type_value == "Product"
                  ? "Rs." +
                    " " +
                    this.conversion(element.quantity * element.purchase_price)
                  : "-",
              item_code:
                element.item_code == "" || element.item_code == null
                  ? "-"
                  : element.item_code,
              location:
                element.location == "" || element.location == null
                  ? "-"
                  : element.location,
              remarks:
                element.remarks == "" || element.remarks == null
                  ? "-"
                  : element.remarks,
              secondary_unit_value:
                element.secondary_unit_value == "" ||
                element.secondary_unit_value == null
                  ? "-"
                  : element.secondary_unit_value,
            });
          });
          this.clients.push(...list);
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
    trashModal() {
      this.isModalActive = true;
    },
    trashCancel() {
      this.isModalActive = false;
    },
    trashConfirm() {
      this.isModalActive = false;
      this.$buefy.snackbar.open({
        message: "Confirmed",
        queue: false,
      });
    },
    async resetFilter() {
      let list = [];
      let response = await axios.get(
        "/inventory/items/?business=" +
          localStorage.getItem("business") +
          "&user=" +
          this.$auth.user.id,
        {
          params: this.axiosParams,
          headers: {
            Authorization: localStorage.getItem("auth._token.local"),
          },
        }
      );
      this.next = response.data.next;
      response.data.results.forEach((element) => {
        list.push({
          name: element.name,
          date: element.as_of_date,
          type_value: element.type_value,
          category_value: element.category_value,
          id: element.id,
          quantity: element.type_value == "Product" ? element.quantity : "-",
          sale_price_num: element.sale_price,
          sale_price: "Rs." + " " + this.conversion(element.sale_price),
          purchase_price:
            element.purchase_price > 0
              ? "Rs." + " " + this.conversion(element.purchase_price)
              : "-",
          opening_stock: element.opening_stock,
          primary_unit_value: element.primary_unit_value,
          stock: Number(element.quantity * element.purchase_price),
          stock_value:
            element.type_value == "Product"
              ? "Rs." +
                " " +
                this.conversion(element.quantity * element.purchase_price)
              : "-",
          item_code:
            element.item_code == "" || element.item_code == null
              ? "-"
              : element.item_code,
          location:
            element.location == "" || element.location == null
              ? "-"
              : element.location,
          remarks:
            element.remarks == "" || element.remarks == null
              ? "-"
              : element.remarks,
          secondary_unit_value:
            element.secondary_unit_value == "" ||
            element.secondary_unit_value == null
              ? "-"
              : element.secondary_unit_value,
        });
      });
      this.clients = list;
      this.loading = false;
    },
  },
};
</script>
<style lang="scss">
$green: #34a77f;
$black: #1f1f1f;

.b-table.items-table {
  .table {
    td {
      vertical-align: middle !important;
      font-size: 14px;
      &.name_width {
        width: 240px;
      }
      &.text-center {
        text-align: center;
      }
      .button {
        visibility: hidden;
        &.is-primary {
          background-color: transparent !important;
          color: #34a77f;
          font-weight: 600;
          box-shadow: none;
        }
      }
    }
    tr {
      &:hover {
        td {
          .button {
            visibility: visible;
          }
        }
      }
    }
  }
}
</style>
