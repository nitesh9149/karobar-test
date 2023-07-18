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
    <bank-balance-modal-edit
      :is-active="isModalActiveBank"
      @confirm="trashConfirmBank"
      @cancel="trashCancel"
      @deleteConfirm="deleteConfirm"
      :posts="postAddEdit"
    />
    <bank-balance-reduce-modal-edit
      :is-active="isModalActiveBankReduce"
      @confirm="trashConfirmReduceBank"
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
      class="transaction-table"
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
        <b-table-column label="Date" field="nep_date">
          <span>
            {{ props.row.nep_date }}
          </span>
        </b-table-column>
        <b-table-column label="Type" field="type_value">
          {{ props.row.type_value }}
        </b-table-column>
        <b-table-column class="pad_left" label="Transaction Id" field="number">
          {{ props.row.number }}
        </b-table-column>
        <b-table-column class="pad_left" label="Party Name" field="party_value">
          {{ props.row.party_value }}
        </b-table-column>
        <b-table-column class="pad_left" label="Amount" field="amount">
          Rs. {{ conversion(props.row.amount) }}
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
import BankBalanceModalEdit from "@/components/BankBalanceModalEdit";
import BankBalanceReduceModalEdit from "@/components/BankBalanceReduceModalEdit";
import CashInHandModalEdit from "@/components/CashInHandModalEdit";
import CashInHandReduceModalEdit from "@/components/CashInHandReduceModalEdit";
import PaymentInModalEdit from "@/components/PaymentInModalEdit";
import PaymentOutModalEdit from "@/components/PaymentOutModalEdit";
import ExpenseModalEditCash from "@/components/ExpenseModalEditCash";
export default {
  name: "ClientsTableSample",
  components: {
    BankBalanceModalEdit,
    BankBalanceReduceModalEdit,
    CashInHandModalEdit,
    CashInHandReduceModalEdit,
    PaymentInModalEdit,
    PaymentOutModalEdit,
    ExpenseModalEditCash,
  },
  props: {
    searchTransaction: {
      type: Object,
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
      isModalActiveBank: false,
      isModalActiveBankReduce: false,
      loading: true,
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
        this.reset();
      }
    },
    filterType() {
      this.reset();
    },
  },
  async mounted() {
    document
      .querySelector(".has-sticky-header")
      .addEventListener("scroll", this.onScroll);
    let list = [];
    let response = await axios.get(
      "/transactions/transactions/?business=" +
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
      var date1 =
        element.created != null ? new Date(element.created) : new Date();
      list.push({
        id: element.id,
        nep_date: new NepaliDate(date1).format("YYYY MMMM DD"),
        remarks: element.remarks,
        type_value: element.type_value,
        party: element.party,
        party_value:
          element.party_value == "" || element.party_value == null
            ? "-"
            : element.party_value,
        amount: Math.abs(element.amount),
        number:
          element.number == "" || element.number == null ? "-" : element.number,
        object_id: element.object_id,
        num: element.number != "" ? JSON.stringify(element.number) : "",
        type: element.type,
        date: element.created,
        nep_date_string: new NepaliDate(date1).format("YYYY-MM-DD"),
        payment_mode: element.payment_mode,
        payment_mode_value: element.payment_mode_value,
      });
    });
    this.clients = list;
    this.loading = false;
  },
  computed: {
    axiosParams() {
      const params = new URLSearchParams();
      params.append(
        "search",
        this.searchTransaction.value ? this.searchTransaction.value : ""
      );
      params.append("type", this.filterType);
      return params;
    },
  },
  methods: {
    async clickRow(event) {
      if (event.type == "add-cash") {
        this.isModalActive = true;
        this.postAddEdit = { ...event };
      }
      if (event.type == "reduce-cash") {
        this.isModalActive2 = true;
        this.postReduceEdit = { ...event };
      }
      if (event.type == "add-money") {
        this.isModalActiveBank = true;
        this.postAddEdit = { ...event };
      }
      if (event.type == "reduce-money") {
        this.isModalActiveBankReduce = true;
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
        this.item = event;
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
        this.item = event;
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
            var date1 =
              element.created != null ? new Date(element.created) : new Date();
            list.push({
              id: element.id,
              nep_date: new NepaliDate(date1).format("YYYY MMMM DD"),
              remarks: element.remarks,
              type_value: element.type_value,
              party: element.party,
              party_value:
                element.party_value == "" || element.party_value == null
                  ? "-"
                  : element.party_value,
              amount: Math.abs(element.amount),
              number:
                element.number == "" || element.number == null
                  ? "-"
                  : element.number,
              object_id: element.object_id,
              num: element.number != "" ? JSON.stringify(element.number) : "",
              type: element.type,
              date: element.created,
              nep_date_string: new NepaliDate(date1).format("YYYY-MM-DD"),
              payment_mode: element.payment_mode,
              payment_mode_value: element.payment_mode_value,
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
    updateFilter() {
      this.$emit("updateFilter");
    },
    trashConfirm(post) {
      this.isModalActive = false;
      this.$buefy.snackbar.open({
        message: "Cash was updated successfully",
        type: "is-primary",
        position: "is-bottom",
        indefinite: false,
      });
      this.reset();
    },
    trashConfirm2(post) {
      this.isModalActive2 = false;
      this.$buefy.snackbar.open({
        message: "Cash was updated successfully",
        type: "is-primary",
        position: "is-bottom",
        indefinite: false,
      });
      this.reset();
    },
    trashConfirmBank() {
      this.isModalActiveBank = false;
      this.$buefy.snackbar.open({
        message: "Bank Balance was updated successfully",
        type: "is-primary",
        position: "is-bottom",
        indefinite: false,
      });

      this.reset();
    },
    trashConfirmReduceBank() {
      this.isModalActiveBankReduce = false;
      this.$buefy.snackbar.open({
        message: "Bank Balance was updated successfully",
        type: "is-primary",
        position: "is-bottom",
        indefinite: false,
      });

      this.reset();
    },
    trashConfirmPayIn() {
      this.isModalActive3 = false;
      this.$buefy.snackbar.open({
        message: "Payment In was updated successfully",
        type: "is-primary",
        position: "is-bottom",
        indefinite: false,
      });
      this.reset();
    },
    trashConfirmPayOut() {
      this.isModalActive4 = false;
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
      this.$buefy.snackbar.open({
        message: post.type_value + " was updated successfully",
        type: "is-primary",
        position: "is-bottom",
        indefinite: false,
      });
      this.reset();
    },
    trashCancel() {
      this.isModalActive = false;
      this.isModalActive2 = false;
      this.isModalActive3 = false;
      this.isModalActive4 = false;
      this.isModalActive5 = false;
      this.isModalActiveBank = false;
      this.isModalActiveBankReduce = false;
      // this.reset();
    },
    deleteConfirm() {
      this.isModalActive = false;
      this.isModalActive2 = false;
      this.isModalActive3 = false;
      this.isModalActive4 = false;
      this.isModalActive5 = false;
      this.isModalActiveBank = false;
      this.isModalActiveBankReduce = false;
      this.reset();
    },
    async reset() {
      let list = [];
      let response = await axios.get(
        "/transactions/transactions/?business=" +
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
        var date1 =
          element.created != null ? new Date(element.created) : new Date();
        list.push({
          id: element.id,
          nep_date: new NepaliDate(date1).format("YYYY MMMM DD"),
          remarks: element.remarks,
          type_value: element.type_value,
          party: element.party,
          party_value:
            element.party_value == "" || element.party_value == null
              ? "-"
              : element.party_value,
          amount: Math.abs(element.amount),
          number:
            element.number == "" || element.number == null
              ? "-"
              : element.number,
          object_id: element.object_id,
          num: element.number != "" ? JSON.stringify(element.number) : "",
          type: element.type,
          date: element.created,
          nep_date_string: new NepaliDate(date1).format("YYYY-MM-DD"),
          payment_mode: element.payment_mode,
          payment_mode_value: element.payment_mode_value,
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
</style>
