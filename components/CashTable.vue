<template>
  <div>
    <cash-in-hand-modal-edit
      :is-active="isModalActive"
      @confirm="trashConfirm"
      @cancel="trashCancel"
      @deleteConfirm="deleteConfirm"
      :posts="postAddEdit"
    />
    <cash-in-hand-reduce-modal-edit
      :is-active="isModalActive2"
      @confirm="trashConfirm2"
      @cancel="trashCancel"
      :posts="postReduceEdit"
      @deleteConfirm="deleteConfirm"
    />
    <payment-in-modal-edit
      :is-active="isModalActive3"
      @confirm="trashConfirmPayIn"
      @cancel="trashCancel"
      @deleteConfirm="deleteConfirm"
      :payments="paymentsIn"
      ref="paymentEdit1"
    />
    <payment-out-modal-edit
      :is-active="isModalActive4"
      @confirm="trashConfirmPayOut"
      @cancel="trashCancel"
      @deleteConfirm="deleteConfirm"
      :payments="paymentsOut"
      ref="paymentEdit2"
    />
    <expense-modal-edit-cash
      :is-active="isModalActive5"
      @confirm="trashConfirmExp"
      @deleteConfirm="deleteConfirm"
      @cancel="trashCancel"
      :item="item"
      :type="type"
    />
    <b-table
      class="cash-table"
      aria-next-label="Next page"
      aria-previous-label="Previous page"
      :checked-rows.sync="checkedRows"
      :checkable="false"
      :paginated="false"
      :per-page="5"
      :striped="false"
      :hoverable="true"
      :sticky-header="true"
      default-sort="name"
      @click="clickRow($event)"
      :data="clients"
    >
      <template slot-scope="props">
        <b-table-column class="pad_left" label="Date" field="Date">
          <span v-if="props.row.date">
            {{ props.row.nep_date }}
          </span>
          <span v-else>-</span>
        </b-table-column>
        <b-table-column class="pad_left" label="Type" field="type">
          {{ props.row.type_value }}
        </b-table-column>
        <b-table-column class="pad_left" label="Name" field="name">
          <span v-if="props.row.party_value">{{ props.row.party_value }}</span>
          <span v-else>-</span>
        </b-table-column>
        <b-table-column class="pad_left" label="Cash In" field="cost">
          <span v-if="props.row.money_in_value"
            >Rs. {{ conversion(props.row.money_in_value) }}</span
          >
          <span v-else>-</span>
        </b-table-column>
        <b-table-column class="pad_left" label="Cash Out" field="balance">
          <span v-if="props.row.money_out_value"
            >Rs. {{ conversion(props.row.money_out_value) }}</span
          >
          <span v-else>-</span>
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
import CashInHandModalEdit from "@/components/CashInHandModalEdit";
import CashInHandReduceModalEdit from "@/components/CashInHandReduceModalEdit";
import PaymentInModalEdit from "@/components/PaymentInModalEdit";
import PaymentOutModalEdit from "@/components/PaymentOutModalEdit";
import ExpenseModalEditCash from "@/components/ExpenseModalEditCash";

export default {
  name: "ClientsTableSample",
  components: {
    CashInHandModalEdit,
    CashInHandReduceModalEdit,
    PaymentInModalEdit,
    PaymentOutModalEdit,
    ExpenseModalEditCash,
  },
  props: {
    dataUrl: {
      type: String,
      default: null,
    },
    posts: {
      type: Object,
    },
    checkable: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      clients: [],
      postAddEdit: {},
      postReduceEdit: {},
      paymentsIn: {},
      paymentsOut: {},
      item: {},
      type: "",
      isModalActive: false,
      isModalActive2: false,
      isModalActive3: false,
      isModalActive4: false,
      isModalActive5: false,
      loading: true,
      paginated: true,
      currentBalance: 0,
      perPage: 10,
      checkedRows: [],
      index: 0,
      next: "",
    };
  },
  watch: {
    posts() {
      this.reset();
    },
  },
  async mounted() {
    document
      .querySelector(".has-sticky-header")
      .addEventListener("scroll", this.onScroll);
    let response = await axios.get(
      "/transactions/transactions/?business=" +
        localStorage.getItem("business") +
        "&user=" +
        this.$auth.user.id +
        "&payment_type=cash",
      {
        headers: {
          Authorization: localStorage.getItem("auth._token.local"),
        },
      }
    );
    this.next = response.data.next;
    response.data.results;
    let balanceList = [];
    for (let i = 0; i < response.data.results.length; i++) {
      var date1 =
        response.data.results[i].created != null
          ? new Date(response.data.results[i].created)
          : new Date();
      balanceList.push({
        id: response.data.results[i].id,
        object_id: response.data.results[i].object_id,
        balance: Number(response.data.results[i].received),
        amount:
          response.data.results[i].type == "add-cash"
            ? Math.abs(response.data.results[i].amount)
            : response.data.results[i].type == "reduce-cash"
            ? -Math.abs(response.data.results[i].amount)
            : Number(response.data.results[i].amount),
        party: response.data.results[i].party,
        party_value:
          response.data.results[i].party_value == "" ||
          response.data.results[i].party_value == null
            ? "-"
            : response.data.results[i].party_value,
        type_value: response.data.results[i].type_value,
        type: response.data.results[i].type,
        remarks: response.data.results[i].remarks,
        date: response.data.results[i].created,
        nep_date: new NepaliDate(date1).format("YYYY MMMM DD"),
        nep_date_string: new NepaliDate(date1).format("YYYY-MM-DD"),
        payment_mode_value: response.data.results[i].payment_mode_value,
      });
    }
    balanceList.forEach((element) => {
      if (element.type_value == "Balance B/F") {
        if (Number(element.balance) < 0) {
          element.money_in = 0;
          element.money_out = Math.abs(element.balance);
          element.money_out_value = Number(element.balance);
        } else if (Number(element.balance) > 0) {
          element.money_out = 0;
          element.money_in = Math.abs(element.balance);
          element.money_in_value = Math.abs(element.balance);
        }
      }
      if (
        element.type_value == "Sale Invoice" ||
        element.type_value == "Add Cash" ||
        element.type_value == "Add Bank Money" ||
        element.type_value == "Payment In" ||
        element.type_value == "Income" ||
        element.type_value == "Purchase Return"
      ) {
        element.money_out = 0;
        element.money_in = Math.abs(element.balance);
        element.money_in_value = Math.abs(element.balance);
      } else if (
        element.type_value == "Sales Return" ||
        element.type_value == "Reduce Cash" ||
        element.type_value == "Reduce Bank Money" ||
        element.type_value == "Payment Out" ||
        element.type_value == "Expense" ||
        element.type_value == "Purchase"
      ) {
        element.money_in = 0;
        element.money_out = Math.abs(element.balance);
        element.money_out_value = Number(element.balance);
      }
    });
    this.clients = balanceList;
    let stat = await axios.get(
      "/home/stat/?business=" +
        localStorage.getItem("business") +
        "&stat_type=cash",
      {
        headers: {
          Authorization: localStorage.getItem("auth._token.local"),
        },
      }
    );
    let net_amount = Number(stat.data.cash_transactions);
    if (this.clients.length) {
      this.$emit("netAmount", net_amount);
    }
    this.loading = false;
  },
  methods: {
    onScroll() {
      let apiCall = async () => {
        if (
          Math.ceil(document.querySelector(".has-sticky-header").scrollTop) +
            document.querySelector(".has-sticky-header").clientHeight +
            1 >=
            document.querySelector(".has-sticky-header").scrollHeight &&
          this.next
        ) {
          let response = await axios.get(this.next, {
            headers: {
              Authorization: localStorage.getItem("auth._token.local"),
            },
          });
          this.next = response.data.next;
          response.data.results;
          let balanceList = [];
          for (let i = 0; i < response.data.results.length; i++) {
            var date1 =
              response.data.results[i].created != null
                ? new Date(response.data.results[i].created)
                : new Date();
            balanceList.push({
              id: response.data.results[i].id,
              object_id: response.data.results[i].object_id,
              balance: Number(response.data.results[i].received),
              amount:
                response.data.results[i].type == "add-cash"
                  ? Math.abs(response.data.results[i].amount)
                  : response.data.results[i].type == "reduce-cash"
                  ? -Math.abs(response.data.results[i].amount)
                  : Number(response.data.results[i].amount),
              party: response.data.results[i].party,
              party_value:
                response.data.results[i].party_value == "" ||
                response.data.results[i].party_value == null
                  ? "-"
                  : response.data.results[i].party_value,
              type_value: response.data.results[i].type_value,
              type: response.data.results[i].type,
              remarks: response.data.results[i].remarks,
              date: response.data.results[i].created,
              nep_date: new NepaliDate(date1).format("YYYY MMMM DD"),
              nep_date_string: new NepaliDate(date1).format("YYYY-MM-DD"),
              payment_mode_value: response.data.results[i].payment_mode_value,
            });
          }
          balanceList.forEach((element) => {
            if (element.type_value == "Balance B/F") {
              if (Number(element.balance) < 0) {
                element.money_in = 0;
                element.money_out = Math.abs(element.balance);
                element.money_out_value = Number(element.balance);
              } else if (Number(element.balance) > 0) {
                element.money_out = 0;
                element.money_in = Math.abs(element.balance);
                element.money_in_value = Math.abs(element.balance);
              }
            }
            if (
              element.type_value == "Sale Invoice" ||
              element.type_value == "Add Cash" ||
              element.type_value == "Add Bank Money" ||
              element.type_value == "Payment In" ||
              element.type_value == "Income" ||
              element.type_value == "Purchase Return"
            ) {
              element.money_out = 0;
              element.money_in = Math.abs(element.balance);
              element.money_in_value = Math.abs(element.balance);
            } else if (
              element.type_value == "Sales Return" ||
              element.type_value == "Reduce Cash" ||
              element.type_value == "Reduce Bank Money" ||
              element.type_value == "Payment Out" ||
              element.type_value == "Expense" ||
              element.type_value == "Purchase"
            ) {
              element.money_in = 0;
              element.money_out = Math.abs(element.balance);
              element.money_out_value = Number(element.balance);
            }
          });
          this.clients.push(...balanceList);
          let stat = await axios.get(
            "/home/stat/?business=" +
              localStorage.getItem("business") +
              "&stat_type=cash",
            {
              headers: {
                Authorization: localStorage.getItem("auth._token.local"),
              },
            }
          );
          let net_amount = Number(stat.data.cash_transactions);
          if (this.clients.length) {
            this.$emit("netAmount", net_amount);
          }
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
      let response = await axios.get(
        "/transactions/transactions/?business=" +
          localStorage.getItem("business") +
          "&user=" +
          this.$auth.user.id +
          "&payment_type=cash",
        {
          headers: {
            Authorization: localStorage.getItem("auth._token.local"),
          },
        }
      );
      this.next = response.data.next;
      response.data.results;
      let balanceList = [];
      for (let i = 0; i < response.data.results.length; i++) {
        var date1 =
          response.data.results[i].created != null
            ? new Date(response.data.results[i].created)
            : new Date();
        balanceList.push({
          id: response.data.results[i].id,
          object_id: response.data.results[i].object_id,
          balance: Number(response.data.results[i].received),
          amount:
            response.data.results[i].type == "add-cash"
              ? Math.abs(response.data.results[i].amount)
              : response.data.results[i].type == "reduce-cash"
              ? -Math.abs(response.data.results[i].amount)
              : Number(response.data.results[i].amount),
          party: response.data.results[i].party,
          party_value:
            response.data.results[i].party_value == "" ||
            response.data.results[i].party_value == null
              ? "-"
              : response.data.results[i].party_value,
          type_value: response.data.results[i].type_value,
          type: response.data.results[i].type,
          remarks: response.data.results[i].remarks,
          date: response.data.results[i].created,
          nep_date: new NepaliDate(date1).format("YYYY MMMM DD"),
          nep_date_string: new NepaliDate(date1).format("YYYY-MM-DD"),
          payment_mode_value: response.data.results[i].payment_mode_value,
        });
      }
      balanceList.forEach((element) => {
        if (element.type_value == "Balance B/F") {
          if (Number(element.balance) < 0) {
            element.money_in = 0;
            element.money_out = Math.abs(element.balance);
            element.money_out_value = Number(element.balance);
          } else if (Number(element.balance) > 0) {
            element.money_out = 0;
            element.money_in = Math.abs(element.balance);
            element.money_in_value = Math.abs(element.balance);
          }
        }
        if (
          element.type_value == "Sale Invoice" ||
          element.type_value == "Add Cash" ||
          element.type_value == "Add Bank Money" ||
          element.type_value == "Payment In" ||
          element.type_value == "Income" ||
          element.type_value == "Purchase Return"
        ) {
          element.money_out = 0;
          element.money_in = Math.abs(element.balance);
          element.money_in_value = Math.abs(element.balance);
        } else if (
          element.type_value == "Sales Return" ||
          element.type_value == "Reduce Cash" ||
          element.type_value == "Reduce Bank Money" ||
          element.type_value == "Payment Out" ||
          element.type_value == "Expense" ||
          element.type_value == "Purchase"
        ) {
          element.money_in = 0;
          element.money_out = Math.abs(element.balance);
          element.money_out_value = Number(element.balance);
        }
      });
      this.clients = balanceList;
      let stat = await axios.get(
        "/home/stat/?business=" +
          localStorage.getItem("business") +
          "&stat_type=cash",
        {
          headers: {
            Authorization: localStorage.getItem("auth._token.local"),
          },
        }
      );
      let net_amount = Number(stat.data.cash_transactions);
      if (this.clients.length) {
        this.$emit("netAmount", net_amount);
      } else {
        this.$emit("netAmount", 0);
      }
      this.loading = false;
    },
    async clickRow(event) {
      if (event.type == "add-cash") {
        this.isModalActive = true;
        this.postAddEdit = { ...event };
      }
      if (event.type == "reduce-cash") {
        this.isModalActive2 = true;
        this.postReduceEdit = { ...event };
      }
      if (event.type == "payment-in") {
        let response = await axios.get(
          "/transactions/payment-in/" +
            event.object_id +
            "/?business=" +
            localStorage.getItem("business"),
          {
            headers: {
              Authorization: localStorage.getItem("auth._token.local"),
            },
          }
        );
        var date1 =
          response.data.date != null
            ? new Date(response.data.date)
            : new Date();
        let obj = {
          id: response.data.id,
          date: new Date(response.data.date),
          nep_date: new NepaliDate(date1).format("YYYY MMMM DD"),
          nep_date_string: new NepaliDate(date1).format("YYYY-MM-DD"),
          payment_mode: response.data.payment_mode,
          payment_mode_value:
            response.data.payment_mode.charAt(0).toUpperCase() +
            response.data.payment_mode.slice(1),
          number: response.data.number != "" ? response.data.number : "-",
          num:
            response.data.number != ""
              ? JSON.stringify(response.data.number)
              : "",
          amount: Math.abs(response.data.amount),
          party_value:
            response.data.party_value != null ? response.data.party_value : "-",
          party: response.data.party,
          note: response.data.note,
          image_url_1: response.data.image_url_1,
          image_url_2: response.data.image_url_2,
          image_url_3: response.data.image_url_3,
        };
        this.paymentsIn = obj;
        this.isModalActive3 = true;
        this.$refs.paymentEdit1.modalActivate();
      }
      if (event.type == "payment-out") {
        let response = await axios.get(
          "/transactions/payment-out/" +
            event.object_id +
            "/?business=" +
            localStorage.getItem("business"),
          {
            headers: {
              Authorization: localStorage.getItem("auth._token.local"),
            },
          }
        );
        var date1 =
          response.data.date != null
            ? new Date(response.data.date)
            : new Date();
        let obj = {
          id: response.data.id,
          date: new Date(response.data.date),
          nep_date: new NepaliDate(date1).format("YYYY MMMM DD"),
          nep_date_string: new NepaliDate(date1).format("YYYY-MM-DD"),
          payment_mode: response.data.payment_mode,
          payment_mode_value:
            response.data.payment_mode.charAt(0).toUpperCase() +
            response.data.payment_mode.slice(1),
          number: response.data.number != "" ? response.data.number : "-",
          num:
            response.data.number != ""
              ? JSON.stringify(response.data.number)
              : "",
          amount: Math.abs(response.data.amount),
          party_value:
            response.data.party_value != null ? response.data.party_value : "-",
          party: response.data.party,
          note: response.data.note,
          image_url_1: response.data.image_url_1,
          image_url_2: response.data.image_url_2,
          image_url_3: response.data.image_url_3,
        };
        this.paymentsOut = obj;
        this.isModalActive4 = true;
        this.$refs.paymentEdit2.modalActivate();
      }
      if (event.type == "expense") {
        this.type = event.type;
        let response = await axios.get(
          "/transactions/income-expense/" +
            event.object_id +
            "/?business=" +
            localStorage.getItem("business"),
          {
            headers: {
              Authorization: localStorage.getItem("auth._token.local"),
            },
          }
        );
        event.category = response.data.category;
        event.category_value = response.data.category_value;
        event.amount = Math.abs(event.amount);
        event.date = new Date(event.date);
        event.note = event.remarks;
        event.payment_mode = "cash";
        (event.payment_mode_value =
          event.payment_mode.charAt(0).toUpperCase() +
          event.payment_mode.slice(1)),
          (this.item = { ...event });
        this.isModalActive5 = true;
      }
      if (event.type == "income") {
        this.type = event.type;
        let response = await axios.get(
          "/transactions/income-expense/" +
            event.object_id +
            "/?business=" +
            localStorage.getItem("business"),
          {
            headers: {
              Authorization: localStorage.getItem("auth._token.local"),
            },
          }
        );
        event.category = response.data.category;
        event.category_value = response.data.category_value;
        event.amount = Math.abs(event.amount);
        event.date = new Date(event.date);
        event.note = event.remarks;
        event.payment_mode = "cash";
        (event.payment_mode_value =
          event.payment_mode.charAt(0).toUpperCase() +
          event.payment_mode.slice(1)),
          (this.item = { ...event });
        this.isModalActive5 = true;
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
        localStorage.setItem("generate", "purchase");
        localStorage.setItem("purchase", event.object_id);
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
      const index = this.clients.findIndex((data) => data.id == event.id);
      this.index = index;
    },
    trashConfirm(post) {
      this.isModalActive = false;
      post.amount = Math.abs(post.amount);
      this.clients.splice(this.index, 1, post);
      this.$buefy.snackbar.open({
        message: "Cash was updated successfully",
        type: "is-primary",
        position: "is-bottom",
        indefinite: false,
      });
      this.reset();
    },
    trashCancel() {
      // this.reset();
      this.isModalActive = false;
      this.isModalActive2 = false;
      this.isModalActive3 = false;
      this.isModalActive4 = false;
      this.isModalActive5 = false;
    },
    deleteConfirm() {
      this.isModalActive = false;
      this.isModalActive2 = false;
      this.isModalActive3 = false;
      this.isModalActive4 = false;
      this.isModalActive5 = false;
      this.reset();
    },
    trashConfirm2(post) {
      this.isModalActive2 = false;
      post.amount = -Math.abs(post.amount);
      this.clients.splice(this.index, 1, post);
      this.$buefy.snackbar.open({
        message: "Cash was updated successfully",
        type: "is-primary",
        position: "is-bottom",
        indefinite: false,
      });
      this.reset();
    },
    trashConfirmPayIn(post) {
      this.isModalActive3 = false;
      post.object_id = post.id;
      post.payment_mode_value =
        post.payment_mode.charAt(0).toUpperCase() + post.payment_mode.slice(1);
      post.remarks = post.note;
      this.$buefy.snackbar.open({
        message: "Payment In was updated successfully",
        type: "is-primary",
        position: "is-bottom",
        indefinite: false,
      });
      this.reset();
    },
    trashConfirmPayOut(post) {
      this.isModalActive4 = false;
      post.object_id = post.id;
      post.payment_mode_value =
        post.payment_mode.charAt(0).toUpperCase() + post.payment_mode.slice(1);
      post.remarks = post.note;
      this.$buefy.snackbar.open({
        message: "Payment Out was updated successfully",
        type: "is-primary",
        position: "is-bottom",
        indefinite: false,
      });
      this.reset();
    },
    trashConfirmExp(post) {
      this.isModalActive5 = false;
      post.object_id = post.id;
      post.payment_mode_value =
        post.payment_mode.charAt(0).toUpperCase() + post.payment_mode.slice(1);
      post.remarks = post.note;
      this.$buefy.snackbar.open({
        message: post.type_value + " was updated successfully",
        type: "is-primary",
        position: "is-bottom",
        indefinite: false,
      });
      this.reset();
    },
  },
};
</script>
<style lang="scss">
.cash-table {
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
