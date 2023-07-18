<template>
  <div>
    <b-table
      class="expenses-table"
      aria-next-label="Next page"
      aria-previous-label="Previous page"
      :checkable="false"
      :paginated="false"
      :per-page="5"
      :striped="false"
      :hoverable="true"
      :sticky-header="true"
      default-sort="name"
      :data="clients"
    >
      <template slot-scope="props">
        <b-table-column label="Party Name" field="name">
          {{ props.row.party_value }}
        </b-table-column>
        <b-table-column class="pad_left" label="Contact" field="exp">
          {{ props.row.phone_number }}
        </b-table-column>
        <b-table-column class="pad_left" label="Receivable" field="mode">
          <span v-if="props.row.receivable"
            >Rs. {{ props.row.receivableAmt }}</span
          >
          <span v-else>-</span>
        </b-table-column>
        <b-table-column class="pad_left" label="Payable" field="amount">
          <span v-if="props.row.payable">Rs. {{ props.row.payableAmt }}</span>
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
    filterDate: {
      type: String,
    },
    filterType: {
      type: String,
    },
  },
  data() {
    return {
      clients: [],
      loading: true,
      trashObject: null,
      paginated: true,
      perPage: 10,
      CheckedRows: [],
      next: "",
    };
  },
  watch: {
    async filterDate(date) {
      if (date == "All Type" || date == "") {
        this.resetFilter();
        this.typeList = this.filterData;
        this.clients = this.filterList;
      }
      if (date == "Receivable") {
        const loadingComponent = this.$buefy.loading.open();
        const result = this.filterList.filter((d) => d.receivable);
        const resultDate = this.filterData.filter((d) => d.receivable);
        this.clients = result;
        this.typeList = resultDate;
        loadingComponent.close();
      }
      if (date == "Payable") {
        const loadingComponent = this.$buefy.loading.open();
        const result = this.filterList.filter((d) => d.payable);
        const resultDate = this.filterData.filter((d) => d.payable);
        this.clients = result;
        this.typeList = resultDate;
        loadingComponent.close();
      }
      let sum = 0;
      let paid = 0;
      if (this.clients.length) {
        for (let i = 0; i < this.clients.length; i++) {
          sum = sum + this.clients[i].payable;
          paid = paid + this.clients[i].receivable;
        }
      }
      let allAmt = { sum: sum, paid: paid };
      this.$emit("totalSum", allAmt);
      this.$emit("excelData", this.clients, allAmt, "all-parties");
    },
    filterType(type) {
      let result = {};
      let resultType = {};
      let loadingComponent = this.$buefy.loading.open();
      switch (type) {
        case "All Type" || "":
          this.resetFilter();
          this.clients = this.typeList;
          this.filterList = this.filterData;
          break;
        case "Customer":
          result = this.typeList.filter((d) => d.type_value == "Customer");
          resultType = this.filterData.filter(
            (d) => d.type_value == "Customer"
          );
          this.clients = result;
          this.filterList = resultType;
          break;
        case "Supplier":
          result = this.typeList.filter((d) => d.type_value == "Supplier");
          resultType = this.filterData.filter(
            (d) => d.type_value == "Supplier"
          );
          this.clients = result;
          this.filterList = resultType;
      }
      let sum = 0;
      let paid = 0;
      if (this.clients.length) {
        for (let i = 0; i < this.clients.length; i++) {
          sum = sum + this.clients[i].payable;
          paid = paid + this.clients[i].receivable;
        }
      }
      let allAmt = { sum: sum, paid: paid };
      this.$emit("totalSum", allAmt);
      this.$emit("excelData", this.clients, allAmt, "all-parties");
      loadingComponent.close();
    },
  },
  async mounted() {
    // document
    //   .querySelector(".has-sticky-header")
    //   .addEventListener("scroll", this.onScroll);
    let list = [];
    try {
      let response = await axios.get(
        "/parties/parties/?items=999999&business=" + localStorage.getItem("business"),
        {
          headers: {
            Authorization: localStorage.getItem("auth._token.local"),
          },
        }
      );
      this.next = response.data.next;
      response.data.results.forEach((element) => {
        let receivable = null;
        let payable = null;
        if (Number(element.amount > 0)) {
          receivable = element.amount;
        } else {
          payable = element.amount;
        }
        list.push({
          id: element.id,
          party_value: element.name,
          type_value: element.type_value,
          receivable: Math.abs(receivable),
          receivableAmt: this.conversion(Math.abs(receivable)),
          payable: Math.abs(payable),
          payableAmt: this.conversion(Math.abs(payable)),
          phone_number:
            element.phone_number === "" || element.phone_number === null
              ? "-"
              : element.phone_number,
        });
      });
      this.clients = list;
      this.filterList = list;
      this.typeList = list;
      this.filterData = list;
      let sum = 0;
      let paid = 0;
      if (this.clients.length) {
        for (let i = 0; i < this.clients.length; i++) {
          sum = sum + this.clients[i].payable;
          paid = paid + this.clients[i].receivable;
        }
      }
      let allAmt = { sum: sum, paid: paid };
      this.$emit("totalSum", allAmt);
      this.$emit("excelData", this.clients, allAmt, "all-parties");
    } catch (err) {}
    this.loading = false;
  },
  methods: {
    trashModal(trashObject) {
      this.trashObject = trashObject;
    },
    async resetFilter() {
      let list = [];
      try {
        let response = await axios.get(
          "/parties/parties/?items=999999&business=" + localStorage.getItem("business"),
          {
            headers: {
              Authorization: localStorage.getItem("auth._token.local"),
            },
          }
        );
        response.data.forEach((element) => {
          let receivable = null;
          let payable = null;
          if (Number(element.amount > 0)) {
            receivable = element.amount;
          } else {
            payable = element.amount;
          }
          list.push({
            id: element.id,
            party_value: element.name,
            type_value: element.type_value,
            receivable: Math.abs(receivable),
            receivableAmt: this.conversion(Math.abs(receivable)),
            payable: Math.abs(payable),
            payableAmt: this.conversion(Math.abs(payable)),
            phone_number:
              element.phone_number === "" || element.phone_number === null
                ? "-"
                : element.phone_number,
          });
        });
        this.filterData = list;
        let sum = 0;
        let paid = 0;
        if (this.clients.length) {
          for (let i = 0; i < this.clients.length; i++) {
            sum = sum + this.clients[i].payable;
            paid = paid + this.clients[i].receivable;
          }
        }
        let allAmt = { sum: sum, paid: paid };
        this.$emit("totalSum", allAmt);
        this.$emit("excelData", this.clients, allAmt, "all-parties");
      } catch (err) {}
      this.loading = false;
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
          this.next = response.data.next;
          response.data.results.forEach((element) => {
            let receivable = null;
            let payable = null;
            if (Number(element.amount > 0)) {
              receivable = element.amount;
            } else {
              payable = element.amount;
            }
            list.push({
              id: element.id,
              party_value: element.name,
              type_value: element.type_value,
              receivable: Math.abs(receivable),
              receivableAmt: this.conversion(Math.abs(receivable)),
              payable: Math.abs(payable),
              payableAmt: this.conversion(Math.abs(payable)),
              phone_number:
                element.phone_number === "" || element.phone_number === null
                  ? "-"
                  : element.phone_number,
            });
          });
          this.clients.push(...list);
          this.filterList.push(...list);
          this.typeList.push(...list);
          this.filterData.push(...list);
          let sum = 0;
          let paid = 0;
          if (this.clients.length) {
            for (let i = 0; i < this.clients.length; i++) {
              sum = sum + this.clients[i].payable;
              paid = paid + this.clients[i].receivable;
            }
          }
          let allAmt = { sum: sum, paid: paid };
          this.$emit("totalSum", allAmt);
          this.$emit("excelData", this.clients, allAmt, "all-parties");
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
</style>