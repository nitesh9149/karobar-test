<template>
  <div>
    <payment-in-modal-edit
      :is-active="isModalActive"
      @confirm="trashConfirm"
      @cancel="trashCancel"
      @deleteConfirm="deleteConfirm"
      :payments="payments"
      ref="paymentEdit"
    />
    <b-table
      class="paymentTable"
      aria-next-label="Next page"
      aria-previous-label="Previous page"
      :checked-rows.sync="checkedRows"
      :checkable="false"
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
        <b-table-column label="Party Name" field="party">
          {{ props.row.party_value }}
        </b-table-column>
        <b-table-column label="Payment No." field="sale">
          {{ props.row.number }}
        </b-table-column>
        <b-table-column label="Date" field="Date">
          <span>
            {{ props.row.nep_date }}
          </span>
        </b-table-column>
        <b-table-column label="Payment Mode" field="mode">
          {{
            props.row.payment_mode.charAt(0).toUpperCase() +
            props.row.payment_mode.slice(1)
          }}
        </b-table-column>
        <b-table-column label="Amount" field="balance">
          Rs. {{ conversion(Math.abs(props.row.amount)) }}
        </b-table-column>
        <b-table-column label="">
          <b-button
            @click="download"
            class="dbutton"
            icon-right="download"
          ></b-button>
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
import PaymentInModalEdit from "@/components/PaymentInModalEdit";
export default {
  name: "ClientsTableSample",
  components: {
    PaymentInModalEdit,
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
    payment: {
      type: Object,
    },
    searchTransaction: {
      type: Object,
    },
  },
  data() {
    return {
      clients: [],
      payments: {},
      clicked: false,
      loading: true,
      paginated: true,
      isModalActive: false,
      searchQuery: "",
      perPage: 10,
      checkedRows: [],
      next: "",
    };
  },
  watch: {
    payment() {
      this.reset();
    },
    searchTransaction(search) {
      if (search.event.key == "Enter" || !search.value) {
        this.searchQuery = search.value;
        this.reset();
      }
    },
  },
  async mounted() {
    document
      .querySelector(".has-sticky-header")
      .addEventListener("scroll", this.onScroll);
    let list = [];
    let response = await axios.get(
      "/transactions/payment-in/?business=" +
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
      var date1 = element.date != null ? new Date(element.date) : new Date();
      list.push({
        id: element.id,
        nep_date: new NepaliDate(date1).format("YYYY MMMM DD"),
        nep_date_string: new NepaliDate(date1).format("YYYY-MM-DD"),
        payment_mode: element.payment_mode,
        payment_mode_value:
          element.payment_mode.charAt(0).toUpperCase() +
          element.payment_mode.slice(1),
        number: element.number != "" ? element.number : "-",
        num: element.number != "" ? JSON.stringify(element.number) : "",
        amount: element.amount,
        party_value: element.party_value != null ? element.party_value : "-",
        party: element.party,
        note: element.note,
        image_url_1: element.image_url_1,
        image_url_2: element.image_url_2,
        image_url_3: element.image_url_3,
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
              element.date != null ? new Date(element.date) : new Date();
            list.push({
              id: element.id,
              nep_date: new NepaliDate(date1).format("YYYY MMMM DD"),
              nep_date_string: new NepaliDate(date1).format("YYYY-MM-DD"),
              payment_mode: element.payment_mode,
              payment_mode_value:
                element.payment_mode.charAt(0).toUpperCase() +
                element.payment_mode.slice(1),
              number: element.number != "" ? element.number : "-",
              num: element.number != "" ? JSON.stringify(element.number) : "",
              amount: element.amount,
              party_value:
                element.party_value != null ? element.party_value : "-",
              party: element.party,
              note: element.note,
              image_url_1: element.image_url_1,
              image_url_2: element.image_url_2,
              image_url_3: element.image_url_3,
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
        "/transactions/payment-in/?business=" +
          localStorage.getItem("business") +
          "&user=" +
          this.$auth.user.id +
          "&search=" +
          this.searchQuery,
        {
          headers: {
            Authorization: localStorage.getItem("auth._token.local"),
          },
        }
      );
      this.next = response.data.next;
      response.data.results.forEach((element) => {
        var date1 = element.date != null ? new Date(element.date) : new Date();
        list.push({
          id: element.id,
          nep_date: new NepaliDate(date1).format("YYYY MMMM DD"),
          nep_date_string: new NepaliDate(date1).format("YYYY-MM-DD"),
          payment_mode: element.payment_mode,
          payment_mode_value:
            element.payment_mode.charAt(0).toUpperCase() +
            element.payment_mode.slice(1),
          number: element.number != "" ? element.number : "-",
          num: element.number != "" ? JSON.stringify(element.number) : "",
          amount: element.amount,
          party_value: element.party_value != null ? element.party_value : "-",
          party: element.party,
          note: element.note,
          image_url_1: element.image_url_1,
          image_url_2: element.image_url_2,
          image_url_3: element.image_url_3,
        });
      });
      this.clients = list;
    },
    updateFilter() {
      this.$emit("updateFilter");
    },
    download() {
      this.clicked = true;
    },
    clickRow(event) {
      if (this.clicked) {
        localStorage.setItem("payment_in", event.id);
        localStorage.setItem("payment", "payment-in");
        this.$router.push("/generatePayment");
      } else {
        event.amount = event.amount;
        event.number = event.number;
        event.date = new Date(event.date);
        const index = this.clients.findIndex((data) => data.id == event.id);
        this.index = index;
        this.payments = { ...event };
        this.isModalActive = true;
        this.$refs.paymentEdit.modalActivate();
      }
    },
    trashConfirm(post) {
      post.payment_mode_value =
        post.payment_mode.charAt(0).toUpperCase() + post.payment_mode.slice(1);
      this.clients.splice(this.index, 1, post);
      this.isModalActive = false;
      this.$buefy.snackbar.open({
        message: "Payment In was updated successfully",
        type: "is-primary",
        position: "is-bottom",
        indefinite: false,
      });
      this.reset();
    },
    async trashCancel() {
      // this.reset();
      this.isModalActive = false;
    },
    deleteConfirm() {
      this.isModalActive = false;
      this.clients.splice(this.index, 1);
      this.reset();
    },
  },
};
</script>
<style lang="scss">
$green: #3ab98d;
$black: #1f1f1f;
.paymentTable {
  .dbutton {
    background-color: #fdfdfd;
    border-color: #dedede;
    width: 3rem;
    box-shadow: none;
    visibility: hidden;
  }
  tr {
    &:hover {
      td {
        .dbutton {
          visibility: visible;
        }
      }
    }
  }
}
@media screen and (max-width: 768px) {
  .paymentTable .dbutton {
    visibility: visible;
  }
}
</style>
