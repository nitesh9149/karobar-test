<template>
  <div>
    <b-table
      class="sales-table"
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
        <b-table-column label="Party Name" field="name">
          {{ props.row.party_value }}
        </b-table-column>
        <b-table-column label="Invoice No." field="purchase">
          {{ props.row.number }}
        </b-table-column>
        <b-table-column label="Date" field="Date">
          <span>
            {{ props.row.nep_date }}
          </span>
        </b-table-column>
        <b-table-column label="Due Date" field="due_date">
          <span v-if="props.row.due">
            {{ props.row.nep_due }}
          </span>
          <span v-else>-</span>
        </b-table-column>
        <b-table-column field="status" label="Status">
          <div
            class="status"
            :class="
              props.row.status === 'PAID'
                ? 'color-info1'
                : props.row.status === 'UNPAID'
                ? 'color-info2'
                : 'color-info3'
            "
          >
            <p>{{ props.row.status }}</p>
          </div>
        </b-table-column>
        <b-table-column class="pad_left" label="Total Amount" field="cost">
          Rs. {{ props.row.totalAmt }}
        </b-table-column>
        <b-table-column class="pad_left" label="Balance Amount" field="balance">
          Rs. {{ props.row.paidAmt }}
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
    searchTransaction: {
      type: Object,
    },
  },
  data() {
    return {
      clients: [],
      searchQuery: "",
      partyValue: "",
      loading: true,
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
      "/transactions/sales-return/?business=" +
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
      var date2 = element.due != null ? new Date(element.due) : new Date();
      list.push({
        id: element.id,
        nep_date: new NepaliDate(date1).format("YYYY MMMM DD"),
        nep_date_string: new NepaliDate(date1).format("YYYY-MM-DD"),
        due: element.due,
        nep_due: new NepaliDate(date2).format("YYYY MMMM DD"),
        payment_mode: element.payment_mode,
        payment_mode_value:
          element.payment_mode.charAt(0).toUpperCase() +
          element.payment_mode.slice(1),
        number:
          element.number == "" || element.number == null ? "-" : element.number,
        num:
          element.number != "" || element.number != null
            ? JSON.stringify(element.number)
            : "",
        total: element.total,
        totalAmt:
          element.total == "" || element.total == null
            ? "0"
            : this.conversion(element.total),
        paid: element.paid,
        paidAmt:this.conversion(Number(element.total) - Number(element.paid)),
        party: element.party,
        party_value:
          element.on_cash == false && element.party == null
            ? "-"
            : element.on_cash == true && element.party == null
            ? "On Cash"
            : element.party_name,
        note: element.note,
        status:
          Number(element.total) > 0 && Number(element.paid) == 0
            ? "UNPAID"
            : Number(element.total) == Number(element.paid)
            ? "PAID"
            : "PARTIAL",
      });
    });
    this.clients = list;
    this.loading = false;
  },
  methods: {
    clickRow(event) {
      this.$store.dispatch("dateTransfer", event.nep_date_string);
      localStorage.setItem("sales_return", event.id);
      localStorage.setItem("generate", "sale_return");
      this.$router.push("/salesReturnEdit");
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
          let response = await axios.get(this.next,
            {
              headers: {
                Authorization: localStorage.getItem("auth._token.local"),
              },
            }
          );
          this.next = response.data.next;
          response.data.results.forEach((element) => {
            var date1 =
              element.date != null ? new Date(element.date) : new Date();
            var date2 =
              element.due != null ? new Date(element.due) : new Date();
            list.push({
              id: element.id,
              nep_date: new NepaliDate(date1).format("YYYY MMMM DD"),
              nep_date_string: new NepaliDate(date1).format("YYYY-MM-DD"),
              due: element.due,
              nep_due: new NepaliDate(date2).format("YYYY MMMM DD"),
              payment_mode: element.payment_mode,
              payment_mode_value:
                element.payment_mode.charAt(0).toUpperCase() +
                element.payment_mode.slice(1),
              number:
                element.number == "" || element.number == null
                  ? "-"
                  : element.number,
              num:
                element.number != "" || element.number != null
                  ? JSON.stringify(element.number)
                  : "",
              total: element.total,
              totalAmt:
                element.total == "" || element.total == null
                  ? "-"
                  : this.conversion(element.total),
              paid: element.paid,
              paidAmt: this.conversion(
                Number(element.total) - Number(element.paid)
              ),
              party: element.party,
              party_value:
                element.on_cash == false && element.party == null
                  ? "-"
                  : element.on_cash == true && element.party == null
                  ? "On Cash"
                  : element.party_name,
              note: element.note,
              status:
                Number(element.total) > 0 && Number(element.paid) == 0
                  ? "UNPAID"
                  : Number(element.total) == Number(element.paid)
                  ? "PAID"
                  : "PARTIAL",
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
        "/transactions/sales-return/?business=" +
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
        list.push({
          id: element.id,
          date: element.created != null ? element.created : new Date(),
          due: element.due != null ? element.due : null,
          payment_mode: element.payment_mode,
          payment_mode_value:
            element.payment_mode.charAt(0).toUpperCase() +
            element.payment_mode.slice(1),
          number:
            element.number == "" || element.number == null
              ? "-"
              : element.number,
          num:
            element.number != "" || element.number != null
              ? JSON.stringify(element.number)
              : "",
          total: element.total,
          totalAmt:
            element.total == "" || element.total == null
              ? "-"
              : this.conversion(element.total),
          paid: element.paid,
          paidAmt: this.conversion(
            Number(element.total) - Number(element.paid)
          ),
          party: element.party,
          party_value:
            element.on_cash == false && element.party == null
              ? "-"
              : element.on_cash == true && element.party == null
              ? "On Cash"
              : element.party_name,
          note: element.note,
          status:
            Number(element.total) > 0 && Number(element.paid) == 0
              ? "UNPAID"
              : Number(element.total) == Number(element.paid)
              ? "PAID"
              : "PARTIAL",
        });
      });
      this.clients = list;
      this.loading = false;
    },
  },
};
</script>
<style lang="scss">
.sales-table {
  .status {
    width: 5rem;
    text-align: center;
    font-size: 14px;
    padding: 4px 0px;

    &.color-info1 {
      color: #3ab98d;
      background-color: #d8f1e8;
    }

    &.color-info2 {
      color: #e54f6d;
      background-color: #f5d1d8;
    }

    &.color-info3 {
      color: #00bcd5;
      background-color: #e6f8fb;
    }
  }
}
</style>
