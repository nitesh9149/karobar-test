<template>
  <div>
    <b-table
      class="estimate-table"
      aria-next-label="Next page"
      aria-previous-label="Previous page"
      :checked-rows.sync="checkedRows"
      :checkable="false"
      :paginated="false"
      :per-page="5"
      :striped="false"
      :sticky-header="true"
      :hoverable="true"
      default-sort="name"
      @click="clickRow($event)"
      :data="resultQuery"
    >
      <template slot-scope="props">
        <b-table-column
          class="name_width pad_left"
          label="Party Name"
          field="name"
        >
          {{ props.row.party_value }}
        </b-table-column>
        <b-table-column
          class="pad_left"
          field="estimateNo"
          label="Estimate No."
        >
          {{ props.row.number }}
        </b-table-column>
        <b-table-column class="pad_left" label="Date" field="Date">
          <span>
            {{
              props.row.nep_date
            }}
          </span>
        </b-table-column>
        <b-table-column class="pad_left" label="Valid Upto" field="Date">
          <span v-if="props.row.due">
            {{
              props.row.nep_due
            }}
          </span>
          <span v-else>-</span>
        </b-table-column>
        <b-table-column class="pad_left" label="Total Amount" field="balance">
          Rs. {{ props.row.totalAmt }}
        </b-table-column>
        <b-table-column label="" field="action">
          <b-button v-if="globalHelper('createSale')" @click="convert" type="is-primary"
            >Convert to Sale</b-button
          >
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
      type: String,
    },
    filterDate: {
      type: String,
    },
  },
  data() {
    return {
      clients: [],
      searchList: [],
      searchQuery: "",
      loading: true,
      paginated: true,
      perPage: 10,
      checkedRows: [],
      clicked: false,
    };
  },
  watch: {
    searchTransaction(search) {
      this.searchQuery = search;
    },
    // async filterDate(date) {
    //   if (date == "All Time" || date == "") {
    //     this.reset()
    //   }
    //   if (date == "Today") {
    //     const result = this.searchList.filter(
    //       (d) => new Date(d.date).getDate() == new Date().getDate()
    //     );
    //     this.clients = result;
    //   }
    //   if (date == "Yesterday") {
    //     var yesterday = new Date(
    //       new Date().valueOf() - 1000 * 60 * 60 * 24
    //     ).getDate();
    //     const result = this.searchList.filter(
    //       (d) => new Date(d.date).getDate() == yesterday
    //     );
    //     this.clients = result;
    //   }
    //   if (date == "This Week") {
    //     let now = new Date();
    //     let dayOfWeek = now.getDay(); //0-6
    //     let numDay = now.getDate();

    //     let start = new Date(now); //copy
    //     start.setDate(numDay - dayOfWeek);
    //     start.setHours(0, 0, 0, 0);

    //     let end = new Date(now); //copy
    //     end.setDate(numDay + (7 - dayOfWeek));
    //     end.setHours(0, 0, 0, 0);
    //     const result = this.searchList.filter(
    //       (d) => +new Date(d.date) >= +start && +new Date(d.date) < +end
    //     );
    //     this.clients = result;
    //   }
    //   if (date == "This Month") {
    //     let currentMonth = new Date().getMonth();
    //     const result = this.searchList.filter(
    //       (d) => new Date(d.date).getMonth() == currentMonth
    //     );
    //     this.clients = result;
    //   }
    //   if (date == "This Year") {
    //     let currentYear = new Date().getFullYear();
    //     const result = this.searchList.filter(
    //       (d) => new Date(d.date).getFullYear() == currentYear
    //     );
    //     this.clients = result;
    //   }
    // },
  },
  async mounted() {
    this.clicked = false;
    let list = [];
    let response = await axios.get(
      "/transactions/estimates/?business=" +
        localStorage.getItem("business") +
        "&user=" +
        this.$auth.user.id,
      {
        headers: {
          Authorization: localStorage.getItem("auth._token.local"),
        },
      }
    );
    response.data.forEach((element) => {
      var date1 = element.date != null ? new Date(element.date) : new Date();
      var date2 = element.due != null ? new Date(element.due) : new Date();
      list.push({
        id: element.id,
        nep_date: new NepaliDate(date1).format("YYYY MMMM DD"),
        nep_date_string:new NepaliDate(date1).format("YYYY-MM-DD"),
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
            : element.total,
        received: element.received,
        receivedAmt: (
          Number(element.total) - Number(element.received)
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
          Number(element.total) > 0 && Number(element.received) == 0
            ? "UNPAID"
            : Number(element.total) == Number(element.received)
            ? "PAID"
            : "PARTIAL",
      });
    });
    this.clients = list;
    this.loading = false;
    this.searchList = list;
  },
  computed: {
    trashObjectName() {
      if (this.trashObject) {
        return this.trashObject.name;
      }

      return null;
    },
    resultQuery() {
      if (this.searchQuery) {
        return this.searchList.filter((item) => {
          return this.searchQuery
            .toLowerCase()
            .split(" ")
            .every(
              (v) =>
                item.party_value.toLowerCase().includes(v) ||
                item.num.toLowerCase().includes(v)
            );
        });
      } else {
        return this.clients;
      }
    },
  },
  methods: {
    convert() {
      this.clicked = true;
    },
    clickRow(event) {
      if (this.clicked) {
        localStorage.setItem("estimate", event.id);
        this.$router.push("/convertToSale");
      } else {
        this.$store.dispatch("dateTransfer", event.nep_date_string);
        localStorage.setItem("estimate", event.id);
        localStorage.setItem("generate","estimate")
        this.$router.push("/estimateEdit");
      }
    },
    async reset() {
      this.clicked = false;
      let list = [];
      let response = await axios.get(
        "/transactions/estimates/?business=" +
          localStorage.getItem("business") +
          "&user=" +
          this.$auth.user.id,
        {
          headers: {
            Authorization: localStorage.getItem("auth._token.local"),
          },
        }
      );
      response.data.forEach((element) => {
        var date1 = element.date != null ? new Date(element.date) : new Date();
      var date2 = element.due != null ? new Date(element.due) : new Date();
        list.push({
          id: element.id,
          nep_date: new NepaliDate(date1).format("YYYY MMMM DD"),
        nep_date_string:new NepaliDate(date1).format("YYYY-MM-DD"),
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
              : element.total,
          received: element.received,
          receivedAmt: (
            Number(element.total) - Number(element.received)
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
            Number(element.total) > 0 && Number(element.received) == 0
              ? "UNPAID"
              : Number(element.total) == Number(element.received)
              ? "PAID"
              : "PARTIAL",
        });
      });
      this.clients = list;
      this.loading = false;
      this.searchList = list;
    },
  },
};
</script>
<style lang="scss">
.b-table.estimate-table {
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
