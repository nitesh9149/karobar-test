<template>
  <div>
    <stock-modal-add-edit
      :is-active="isModalActive"
      @confirm="trashConfirm"
      @cancel="trashCancel"
      :editStock="editStock"
      :unit="unit"
    />
    <stock-modal-reduce-edit
      :is-active="isModalActive2"
      @confirm="trashConfirm2"
      @cancel="trashCancel2"
      :editStock="editStock"
      :unit="unit"
    />
    <b-table
      class="stock-table"
      aria-next-label="Next page"
      aria-previous-label="Previous page"
      :checkable="false"
      :paginated="false"
      :loading="loading"
      :per-page="5"
      :striped="false"
      :hoverable="true"
      :sticky-header="true"
      @click="clickRow($event)"
      default-sort="name"
      :data="clients"
    >
      <template slot-scope="props">
        <b-table-column class="pad_left" label="Type" field="exp">
          {{ props.row.type_value }}
        </b-table-column>
        <b-table-column label="Date" field="nep_date">
          <span>
            {{ props.row.nep_date }}
          </span>
        </b-table-column>
        <b-table-column class="pad_left" label="Change" field="note">
          <div
            class="status"
            :class="
              props.row.quantity > 0
                ? 'color-info1'
                : props.row.quantity < 0
                ? 'color-info2'
                : 'color-info3'
            "
          >
            {{ props.row.quantity_value }} {{ props.row.unit }}
          </div>
        </b-table-column>
        <b-table-column
          width="260"
          class="pad_left"
          label="Remarks"
          field="note"
        >
          {{ props.row.remarks }}
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
import NepaliDate from "nepali-date-converter";
import StockModalAddEdit from "@/components/StockModalAddEdit";
import StockModalReduceEdit from "@/components/StockModalReduceEdit";
import axios from "axios";
export default {
  name: "ClientsTableSample",
  components: { StockModalAddEdit, StockModalReduceEdit },
  props: {
    dataUrl: {
      type: String,
      default: null,
    },
    checkable: {
      type: Boolean,
      default: false,
    },
    itemId: {
      type: Number,
    },
    addStock: {
      type: Object,
    },
    reduceStock: {
      type: Object,
    },
  },
  data() {
    return {
      clients: [],
      loading: true,
      isModalActive: false,
      isModalActive2: false,
      trashObject: null,
      perPage: 10,
      editStock: {},
      CheckedRows: [],
      unit: "",
      next: "",
    };
  },
  watch: {
    async itemId(id) {
      this.loading = true;
      let list = [];
      let response = await axios.get(
        "/inventory/adjustments/?business=" +
          localStorage.getItem("business") +
          "&item=" +
          id,
        {
          headers: {
            Authorization: localStorage.getItem("auth._token.local"),
          },
        }
      );
      this.next = response.data.next
      response.data.results.forEach((element) => {
        var date1 =
          element.created_date != null
            ? new Date(element.created_date)
            : new Date();
        list.push({
          nep_date: new NepaliDate(date1).format("YYYY MMMM DD"),
          nep_date_string: new NepaliDate(date1).format("YYYY-MM-DD"),
          type_value: element.type_value,
          type: element.type,
          id: element.id,
          object_id: element.object,
          quantity_value: this.conversion(element.quantity),
          item: element.item,
          remarks_value: element.remarks,
          quantity:
            element.quantity > 0
              ? "+" + element.quantity
              : element.quantity < 0
              ? element.quantity
              : element.quantity,
          unit: element.unit_value,
          remarks:
            element.remarks == "" || element.remarks == null
              ? "-"
              : element.remarks,
        });
      });
      this.clients = list;
      this.loading = false;
    },
    addStock() {
      this.reset();
    },
    reduceStock() {
      this.reset();
    },
  },
  async mounted() {
    document
      .querySelector(".has-sticky-header")
      .addEventListener("scroll", this.onScroll);
    let list = [];
    let response = await axios.get(
      "/inventory/adjustments/?business=" +
        localStorage.getItem("business") +
        "&item=" +
        this.itemId,
      {
        headers: {
          Authorization: localStorage.getItem("auth._token.local"),
        },
      }
    );
    this.next = response.data.next;
    response.data.results.forEach((element) => {
      var date1 =
        element.created_date != null
          ? new Date(element.created_date)
          : new Date();
      list.push({
        nep_date: new NepaliDate(date1).format("YYYY MMMM DD"),
        nep_date_string: new NepaliDate(date1).format("YYYY-MM-DD"),
        type_value: element.type_value,
        type: element.type,
        id: element.id,
        object_id: element.object,
        item: element.item,
        quantity:
          element.quantity > 0
            ? "+" + element.quantity
            : element.quantity < 0
            ? element.quantity
            : element.quantity,
        quantity_value: this.conversion(element.quantity),
        unit: element.unit_value,
        remarks_value: element.remarks,
        remarks:
          element.remarks == "" || element.remarks == null
            ? "-"
            : element.remarks,
      });
    });
    this.clients = list;
    this.loading = false;
  },
  methods: {
    async clickRow(event) {
      if (event.type == "add") {
        this.isModalActive = true;
        this.editStock = event;
      }
      if (event.type == "reduce") {
        this.isModalActive2 = true;
        this.editStock = event;
      }
      if (event.type == "sale") {
        this.$store.dispatch("dateTransfer", event.nep_date_string);
        localStorage.setItem("sale", event.object_id);
        localStorage.setItem("generate", "sale");
        this.$router.push("/saleInvoiceEdit");
      }
      if (event.type == "sale-return") {
        this.$store.dispatch("dateTransfer", event.nep_date_string);
        localStorage.setItem("sales_return", event.object_id);
        localStorage.setItem("generate", "sale_return");
        this.$router.push("/salesReturnEdit");
      }
      if (event.type == "purchase") {
        this.$store.dispatch("dateTransfer", event.nep_date_string);
        localStorage.setItem("purchase", event.object_id);
        localStorage.setItem("generate", "purchase");
        this.$router.push("/purchaseInvoiceEdit");
      }
      if (event.type == "purchase-return") {
        this.$store.dispatch("dateTransfer", event.nep_date_string);
        localStorage.setItem("purchase_return", event.object_id);
        localStorage.setItem("generate", "purchase_return");
        this.$router.push("/purchaseReturnEdit");
      }
      if (event.type == "estimate") {
        this.$store.dispatch("dateTransfer", event.nep_date_string);
        localStorage.setItem("estimate", event.object_id);
        localStorage.setItem("generate", "estimate");
        this.$router.push("/estimateEdit");
      }
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
            var date1 =
              element.created_date != null
                ? new Date(element.created_date)
                : new Date();
            list.push({
              nep_date: new NepaliDate(date1).format("YYYY MMMM DD"),
              nep_date_string: new NepaliDate(date1).format("YYYY-MM-DD"),
              type_value: element.type_value,
              type: element.type,
              id: element.id,
              object_id: element.object,
              item: element.item,
              quantity:
                element.quantity > 0
                  ? "+" + element.quantity
                  : element.quantity < 0
                  ? element.quantity
                  : element.quantity,
              quantity_value: this.conversion(element.quantity),
              unit: element.unit_value,
              remarks_value: element.remarks,
              remarks:
                element.remarks == "" || element.remarks == null
                  ? "-"
                  : element.remarks,
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
    async reset() {
      let list = [];
      let response = await axios.get(
        "/inventory/adjustments/?business=" +
          localStorage.getItem("business") +
          "&item=" +
          this.itemId,
        {
          headers: {
            Authorization: localStorage.getItem("auth._token.local"),
          },
        }
      );
      this.next = response.data.next;
      response.data.results.forEach((element) => {
        var date1 =
          element.created_date != null
            ? new Date(element.created_date)
            : new Date();
        list.push({
          nep_date: new NepaliDate(date1).format("YYYY MMMM DD"),
          nep_date_string: new NepaliDate(date1).format("YYYY-MM-DD"),
          type_value: element.type_value,
          type: element.type,
          id: element.id,
          object_id: element.object,
          item: element.item,
          quantity:
            element.quantity > 0
              ? "+" + element.quantity
              : element.quantity < 0
              ? element.quantity
              : element.quantity,
          quantity_value: this.conversion(element.quantity),
          unit: element.unit_value,
          remarks_value: element.remarks,
          remarks:
            element.remarks == "" || element.remarks == null
              ? "-"
              : element.remarks,
        });
      });
      this.clients = list;
      this.loading = false;
    },
    trashConfirm() {
      this.isModalActive = false;
      this.reset()
      this.$emit("addStock");
    },
    trashCancel() {
      this.isModalActive = false;
    },
    trashConfirm2() {
      this.isModalActive2 = false;
      this.reset()
      this.$emit("addStock");
    },
    trashCancel2() {
      this.isModalActive2 = false;
    },
  },
};
</script>
<style lang="scss">
$green: #34a77f;
$black: #1f1f1f;
.stock-table {
  .table-wrapper.has-sticky-header {
    height: 25.16rem;
  }
  .status {
    font-size: 14px;

    &.color-info1 {
      color: #3ab98d;
    }

    &.color-info2 {
      color: #e54f6d;
    }

    &.color-info3 {
      color: black;
    }
  }
}
</style>