<template>
  <div>
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
    <b-table
      class="parties-table"
      aria-next-label="Next page"
      aria-previous-label="Previous page"
      :checked-rows.sync="checkedRows"
      :checkable="false"
      :loading="loading"
      :paginated="false"
      :per-page="5"
      :striped="false"
      :hoverable="true"
      :sticky-header="true"
      @click="clickRow($event)"
      default-sort="name"
      :data="clients"
    >
      <template slot-scope="props">
        <b-table-column label="Type" field="party_type">
          {{
            props.row.type_value == "Opening Balance"
              ? props.row.amount_value > 0
                ? "Receivable OB "
                : "Payable OB"
              : props.row.type_value
          }}
        </b-table-column>
        <b-table-column label="Date" field="nep_date">
          <span>
            {{ props.row.nep_date }}
          </span>
        </b-table-column>
        <b-table-column label="Transaction ID" field="id">
          {{ props.row.number }}
        </b-table-column>
        <b-table-column label="Amount" field="amount">
          Rs. {{ conversion(props.row.amount) }}
        </b-table-column>
        <b-table-column label="Rec/Paid" field="balance">
          Rs. {{ conversion(props.row.balance) }}
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
import NepaliDate from "nepali-date-converter";
import PaymentInModalEdit from "@/components/PaymentInModalEdit";
import PaymentOutModalEdit from "@/components/PaymentOutModalEdit";

export default {
  name: "ClientsTableSample",
  components: {
    PaymentInModalEdit,
    PaymentOutModalEdit,
  },
  props: {
    dataUrl: {
      type: String,
      default: null,
    },
    checkable: {
      type: Boolean,
      default: false,
    },
    partyId: {
      type: Number,
    },
    partyName: {
      type: String,
    },
    partyAmount: { type: String },
    filterType: {
      type: String,
    },
  },
  data() {
    return {
      clients: [],
      paymentsIn: {},
      paymentsOut: {},
      isModalActive3: false,
      isModalActive4: false,
      loading: true,
      trashObject: null,
      paginated: true,
      perPage: 10,
      checkedRows: [],
      next: "",
    };
  },
  watch: {
    async partyId() {
      this.reset();
    },
    // partyAmount() {
    //   this.reset();
    // },
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
        this.$auth.user.id +
        "&party=" +
        this.partyId,
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
        nep_date: new NepaliDate(date1).format("YYYY MMMM DD"),
        nep_date_string: new NepaliDate(date1).format("YYYY-MM-DD"),
        date: element.created != null ? new Date(element.created) : new Date(),
        remarks: element.remarks,
        type_value: element.type_value,
        party: element.party,
        party_value: element.party_value != "" ? element.party_value : "-",
        amount: Math.abs(element.amount),
        amount_value: Number(element.balance),
        balance: Math.abs(element.received),
        number: element.number != "" ? element.number : "-",
        object_id: element.object_id,
        id: element.id,
        type: element.type,
        type_value: element.type_value,
        payment_mode: element.payment_mode,
        payment_mode_value: element.payment_mode_value,
      });
    });
    this.clients = list;
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
              nep_date: new NepaliDate(date1).format("YYYY MMMM DD"),
              nep_date_string: new NepaliDate(date1).format("YYYY-MM-DD"),
              date:
                element.created != null
                  ? new Date(element.created)
                  : new Date(),
              remarks: element.remarks,
              type_value: element.type_value,
              party: element.party,
              party_value:
                element.party_value != "" ? element.party_value : "-",
              amount: Math.abs(element.amount),
              amount_value: Number(element.balance),
              balance: Math.abs(element.received),
              number: element.number != "" ? element.number : "-",
              object_id: element.object_id,
              id: element.id,
              type: element.type,
              type_value: element.type_value,
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
    async reset() {
      this.loading = true;
      document.querySelector(".has-sticky-header").scrollTop = 0;
      let list = [];
      let response = await axios.get(
        "/transactions/transactions/?business=" +
          localStorage.getItem("business") +
          "&user=" +
          this.$auth.user.id +
          "&party=" +
          this.partyId +
          "&type=" +
          this.filterType,
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
          nep_date: new NepaliDate(date1).format("YYYY MMMM DD"),
          nep_date_string: new NepaliDate(date1).format("YYYY-MM-DD"),
          date:
            element.created != null ? new Date(element.created) : new Date(),
          remarks: element.remarks,
          type_value: element.type_value,
          party: element.party,
          party_value: element.party_value != "" ? element.party_value : "-",
          amount: Math.abs(element.amount),
          amount_value: Number(element.balance),
          balance: Math.abs(element.received),
          number: element.number != "" ? element.number : "-",
          object_id: element.object_id,
          id: element.id,
          type: element.type,
          type_value: element.type_value,
          payment_mode: element.payment_mode,
          payment_mode_value: element.payment_mode_value,
        });
      });
      this.clients = list;
      this.loading = false;
    },
    updateFilter() {
      this.$emit("updateFilter");
    },
    async clickRow(event) {
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
      if (event.type == "sale") {
        this.$store.dispatch("dateTransfer", event.nep_date_string);
        localStorage.setItem("sale", event.object_id);
        localStorage.setItem("generate", "sale");
        localStorage.setItem("from_parties", true);
        this.$router.push("/saleInvoiceEdit");
      }
      if (event.type == "sale-return") {
        this.$store.dispatch("dateTransfer", event.nep_date_string);
        localStorage.setItem("sales_return", event.object_id);
        localStorage.setItem("generate", "sale_return");
        localStorage.setItem("from_parties", true);
        this.$router.push("/salesReturnEdit");
      }
      if (event.type == "purchase") {
        this.$store.dispatch("dateTransfer", event.nep_date_string);
        localStorage.setItem("generate", "purchase");
        localStorage.setItem("purchase", event.object_id);
        localStorage.setItem("from_parties", true);
        this.$router.push("/purchaseInvoiceEdit");
      }
      if (event.type == "purchase-return") {
        this.$store.dispatch("dateTransfer", event.nep_date_string);
        localStorage.setItem("purchase_return", event.object_id);
        localStorage.setItem("generate", "purchase_return");
        localStorage.setItem("from_parties", true);
        this.$router.push("/purchaseReturnEdit");
      }
      if (event.type == "estimate") {
        this.$store.dispatch("dateTransfer", event.nep_date_string);
        localStorage.setItem("estimate", event.object_id);
        localStorage.setItem("generate", "estimate");
        localStorage.setItem("from_parties", true);
        this.$router.push("/estimateEdit");
      }
    },
    trashConfirmPayIn(post) {
      this.isModalActive3 = false;
      post.object_id = post.id;
      post.remarks = post.note;
      this.$buefy.snackbar.open({
        message: "Payment In was updated successfully",
        type: "is-primary",
        position: "is-bottom",
        indefinite: false,
      });
      this.$emit("updateAmount");
      this.reset();
    },
    trashConfirmPayOut(post) {
      this.isModalActive4 = false;
      post.object_id = post.id;
      post.remarks = post.note;
      this.$buefy.snackbar.open({
        message: "Payment Out was updated successfully",
        type: "is-primary",
        position: "is-bottom",
        indefinite: false,
      });
      this.$emit("updateAmount");
      this.reset();
    },
    trashCancel() {
      // this.reset();
      this.isModalActive3 = false;
      this.isModalActive4 = false;
    },
    deleteConfirm() {
      this.isModalActive3 = false;
      this.isModalActive4 = false;
      this.reset();
      this.$emit("updateAmount");
    },
  },
};
</script>
<style lang="scss">
$green: #34a77f;
$black: #1f1f1f;
.parties-table {
  .table-wrapper.has-sticky-header {
    height: 32rem;
  }
}
</style>
