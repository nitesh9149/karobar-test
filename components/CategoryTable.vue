<template>
  <div>
    <b-table
      class="category-table"
      aria-next-label="Next page"
      aria-previous-label="Previous page"
      :checked-rows.sync="checkedRows"
      :checkable="false"
      :paginated="false"
      :loading="loading"
      :per-page="5"
      :striped="false"
      :sticky-header="true"
      :hoverable="true"
      default-sort="name"
      @click="clickRow($event)"
      :data="clients"
    >
      <template slot-scope="props">
        <b-table-column class="pad_left" label="Item Name" field="name">
          {{ props.row.name }}
        </b-table-column>
        <b-table-column class="pad_left" label="Items Type" field="items">
          {{ props.row.type_value }}
        </b-table-column>
        <b-table-column class="pad_left" label="Quantity" field="value">
          {{ conversion(props.row.quantity) }}
          {{ props.row.primary_unit_value }}
        </b-table-column>
        <b-table-column class="pad_left" label="Sale Price" field="value">
          Rs.
          {{ conversion(Math.abs(props.row.sale_price_num)) }}
        </b-table-column>
        <b-table-column class="pad_left" label="Stock Value" field="value">
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
  name: "ItemsTable",
  props: {
    dataUrl: {
      type: String,
      default: null,
    },
    checkable: {
      type: Boolean,
      default: false,
    },
    categoryId: {
      type: Number,
    },
  },
  data() {
    return {
      clients: [],
      loading: true,
      trashObject: null,
      paginated: true,
      perPage: 10,
      checkedRows: [],
      next: "",
    };
  },
  watch: {
    async categoryId(id) {
      this.loading = true;
      let list = [];
      let response = await axios.get(
        "/inventory/items/?business=" +
          localStorage.getItem("business") +
          "&category=" +
          id,
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
          sale_price_num: element.sale_price,
          primary_unit_value:
            element.type_value == "Product" ? element.primary_unit_value : "",
          quantity:
            element.type_value == "Product" ? Number(element.quantity) : "-",
          sale_price:
            "Rs." + " " + this.conversion(Math.abs(element.sale_price)),
          purchase_price:
            element.type_value == "Product"
              ? "Rs." + " " + this.conversion(Math.abs(element.purchase_price))
              : "-",
          opening_stock: element.opening_stock,
          stock_value:
            element.type_value == "Product"
              ? "Rs." +
                " " +
                this.conversion(element.quantity * element.sale_price)
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
  mounted() {
    document
      .querySelector(".has-sticky-header")
      .addEventListener("scroll", this.onScroll);
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
            document.querySelector(".has-sticky-header").clientHeight + 1 >=
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
              sale_price_num: element.sale_price,
              primary_unit_value:
                element.type_value == "Product"
                  ? element.primary_unit_value
                  : "",
              quantity:
                element.type_value == "Product"
                  ? Number(element.quantity)
                  : "-",
              sale_price:
                "Rs." + " " + this.conversion(Math.abs(element.sale_price)),
              purchase_price:
                element.type_value == "Product"
                  ? "Rs." +
                    " " +
                    this.conversion(Math.abs(element.purchase_price))
                  : "-",
              opening_stock: element.opening_stock,
              stock_value:
                element.type_value == "Product"
                  ? "Rs." +
                    " " +
                    this.conversion(element.quantity * element.sale_price)
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
  },
};
</script>
<style lang="scss">
$green: #34a77f;
$black: #1f1f1f;
$red: #e54f6d;
.color-green {
  color: $green;
}
.color-red {
  color: $red;
}

.b-table.category-table {
  .is-danger {
    background-color: $red;
  }
  .table {
    td {
      .button {
        visibility: hidden;
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
    tbody {
      .buttons {
        justify-content: center;
        .button {
          margin-left: 10px;
          box-shadow: none;
        }
      }
    }
  }
}
</style>
