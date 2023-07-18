<template>
  <div>
    <income-modal-table
      :is-active="isModalActive"
      @confirm="trashConfirm"
      @deleteConfirm="deleteConfirm"
      @cancel="trashCancel"
      :item="item"
      :categoryId="categoryId"
    />
    <b-table
      class="expenses-table"
      aria-next-label="Next page"
      aria-previous-label="Previous page"
      :checkable="false"
      :paginated="false"
      :per-page="5"
      :loading="loading"
      :striped="false"
      :hoverable="true"
      @click="clickRow($event)"
      :sticky-header="true"
      default-sort="name"
      :data="clients"
    >
      <template slot-scope="props">
        <b-table-column label="Date" field="nep_date" sortable>
          <span>
            {{ props.row.nep_date }}
          </span>
        </b-table-column>
        <b-table-column class="pad_left" label="Category" field="exp">
          {{ props.row.category_value }}
        </b-table-column>
        <b-table-column class="pad_left" width="260" label="Note" field="note">
          {{ props.row.noteText }}
        </b-table-column>
        <b-table-column class="pad_left" label="Mode" field="mode">
          {{ props.row.payment_mode_value }}
        </b-table-column>
        <b-table-column
          class="pad_left"
          label="Amount"
          field="amount_value"
          sortable
        >
          Rs. {{ props.row.amount }}
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
import IncomeModalTable from "@/components/IncomeModalTable";
import axios from "axios";
export default {
  name: "ClientsTableSample",
  components: {
    IncomeModalTable,
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
    categoryId: {
      type: Number,
    },
    expensePost: {
      type: Object,
    },
  },
  data() {
    return {
      clients: [],
      loading: true,
      trashObject: null,
      isModalActive: false,
      paginated: true,
      perPage: 10,
      CheckedRows: [],
      item: {},
      index: 0,
      switchCategory: "",
    };
  },
  watch: {
    expensePost(value) {
      var date1 = value.date != null ? new Date(value.date) : new Date();
      this.clients.unshift({
        nep_date: new NepaliDate(date1).format("YYYY MMMM DD"),
        nep_date_string: new NepaliDate(date1).format("YYYY-MM-DD"),
        payment_mode_value: value.payment_mode_value,
        category_value:
          value.category_value != null ? value.category_value : "-",
        note: value.note,
        noteText: value.note == "" || value.note == null ? "-" : value.note,
        amount: this.conversion(Math.abs(value.amount)),
        id: value.id,
      });
    },
    async categoryId(id) {
      document.querySelector(".has-sticky-header").scrollTop = 0;
      this.loading = true;
      let list = [];
      let response = await axios.get(
        "/transactions/income-expense?type=income&business=" +
          localStorage.getItem("business") +
          "&category=" +
          id +
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
          nep_date: new NepaliDate(date1).format("YYYY MMMM DD"),
          nep_date_string: new NepaliDate(date1).format("YYYY-MM-DD"),
          payment_mode_value: element.payment_mode_value,
          category_value:
            element.category_value != null ? element.category_value : "-",
          note: element.note,
          noteText:
            element.note == "" || element.note == null ? "-" : element.note,
          amount: this.conversion(Math.abs(element.amount)),
          id: element.id,
        });
      });
      this.clients = list;
      this.loading = false;
    },
  },
  async mounted() {
    document
      .querySelector(".has-sticky-header")
      .addEventListener("scroll", this.onScroll);
    let list = [];
    let response = await axios.get(
      "/transactions/income-expense?type=income&business=" +
        localStorage.getItem("business") +
        "&category=" +
        this.categoryId +
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
        nep_date: new NepaliDate(date1).format("YYYY MMMM DD"),
        nep_date_string: new NepaliDate(date1).format("YYYY-MM-DD"),
        payment_mode_value: element.payment_mode_value,
        category_value:
          element.category_value != null ? element.category_value : "-",
        note: element.note,
        noteText:
          element.note == "" || element.note == null ? "-" : element.note,
        amount_value: Math.abs(element.amount),
        amount: this.conversion(Math.abs(element.amount)),
        id: element.id,
      });
    });
    this.clients = list;
    this.loading = false;
  },
  methods: {
    clickRow(event) {
      this.isModalActive = true;
      const index = this.clients.findIndex((data) => data.id == event.id);
      this.index = index;
      this.item = { ...event };
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
              element.date != null ? new Date(element.date) : new Date();
            list.push({
              nep_date: new NepaliDate(date1).format("YYYY MMMM DD"),
              nep_date_string: new NepaliDate(date1).format("YYYY-MM-DD"),
              payment_mode_value: element.payment_mode_value,
              category_value:
                element.category_value != null ? element.category_value : "-",
              note: element.note,
              noteText:
                element.note == "" || element.note == null ? "-" : element.note,
              amount_value: Math.abs(element.amount),
              amount: this.conversion(Math.abs(element.amount)),
              id: element.id,
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
    async trashConfirm(post) {
      this.isModalActive = false;
      this.reset();
      this.switchCategory = post.category;
      this.$emit("updateAmount", this.switchCategory);
    },
    trashCancel() {
      this.isModalActive = false;
    },
    deleteConfirm() {
      this.isModalActive = false;
      this.clients.splice(this.index, 1);
      this.$emit("updateAmount", this.categoryId);
    },
    async reset() {
      let list = [];
      let response = await axios.get(
        "/transactions/income-expense?type=income&business=" +
          localStorage.getItem("business") +
          "&category=" +
          this.categoryId +
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
          nep_date: new NepaliDate(date1).format("YYYY MMMM DD"),
          nep_date_string: new NepaliDate(date1).format("YYYY-MM-DD"),
          payment_mode_value: element.payment_mode_value,
          category_value:
            element.category_value != null ? element.category_value : "-",
          note: element.note,
          noteText:
            element.note == "" || element.note == null ? "-" : element.note,
          amount_value: Math.abs(element.amount),
          amount: this.conversion(Math.abs(element.amount)),
          id: element.id,
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
.expenses-table {
  .table-wrapper.has-sticky-header {
    height: 34.4rem;
  }
}
</style>