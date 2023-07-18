<template>
  <div>
    <payment-in-modal
      :is-active="isModalActivePin"
      @confirm="trashConfirmPin"
      @cancel="trashCancel"
      @addConfirm="addConfirmIn"
      ref="parties1"
    />
    <payment-out-modal
      :is-active="isModalActivePout"
      @confirm="trashConfirmPout"
      @cancel="trashCancel"
      @addConfirm="addConfirmOut"
      ref="parties2"
    />
    <expense-modal
      :is-active="isModalActive"
      @confirm="trashConfirm"
      @cancel="trashCancel"
      @confirmAdd="confirmAdd"
      ref="categories"
    />
    <income-modal
      :is-active="isModalActiveIncome"
      @confirm="trashConfirmIncome"
      @cancel="trashCancel"
      @confirmAdd="confirmAddIncome"
      ref="categoriesIncome"
    />
    <section class="section is-title-bar">
      <div class="level">
        <div class="level-left">
          <div class="level-item">
            <ul>
              <li>Dashboard</li>
            </ul>
          </div>
        </div>
        <div class="level-right">
          <div class="level-item">
            <div class="buttons is-right">
              <nuxt-link
                v-if="globalHelper('createSale')"
                @click.native="createTransaction"
                to="/saleInvoice"
                class="button is-primary"
              >
                <b-icon icon="plus" custom-size="default" />
                <span class="button-title">Add Sale Invoice</span>
              </nuxt-link>
              <nuxt-link
                v-if="globalHelper('createPurchase')"
                @click.native="createTransaction"
                to="/createPurchaseInvoice"
                class="button is-secondary"
              >
                <b-icon icon="plus" custom-size="default" />
                <span class="button-title">Add Purchase</span>
              </nuxt-link>
              <b-dropdown class="title-bar-dropdown pushed" aria-role="list">
                <template #trigger>
                  <b-button type="is-light" icon-right="menu-down"
                    ><span class="button-title">Add More</span></b-button
                  >
                </template>
                <b-dropdown-item
                  v-if="globalHelper('createSale')"
                  class="dropdown-item"
                  @click="paymentModal('Payment In')"
                  aria-role="listitem"
                  >Payment In</b-dropdown-item
                >
                <b-dropdown-item
                  v-if="globalHelper('createPurchase')"
                  class="dropdown-item"
                  @click="paymentModal('Payment Out')"
                  aria-role="listitem"
                  >Payment Out</b-dropdown-item
                >
                <nuxt-link
                  v-if="globalHelper('createSale')"
                  @click.native="createTransaction"
                  class="dropdown-item"
                  to="/createsalesReturn"
                  aria-role="listitem"
                  >Sales Return</nuxt-link
                >
                <nuxt-link
                  v-if="globalHelper('createPurchase')"
                  @click.native="createTransaction"
                  class="dropdown-item"
                  to="/createPurchaseReturn"
                  aria-role="listitem"
                  >Purchase Return</nuxt-link
                >
                <!-- <nuxt-link
                  v-if="globalHelper('createSale')"
                  @click.native="createTransaction"
                  class="dropdown-item"
                  to="/createEstimate"
                  aria-role="listitem"
                  >Estimate/Quotation</nuxt-link
                > -->
                <b-dropdown-item
                  v-if="globalHelper('createExpense')"
                  class="dropdown-item"
                  @click="paymentModal('Expense')"
                  aria-role="listitem"
                  >Expense</b-dropdown-item
                >
                <b-dropdown-item
                  v-if="globalHelper('createExpense')"
                  class="dropdown-item"
                  @click="paymentModal('Income')"
                  aria-role="listitem"
                  >Income</b-dropdown-item
                >
              </b-dropdown>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="section is-main-section">
      <div v-if="loading">
        <div v-if="globalHelper('viewBusinessStats')" class="columns is-mobile">
          <div
            class="column is-one-fifth-desktop is-half-mobile is-one-third-tablet mini-mobile"
          >
            <b-skeleton height="75px" :animated="true"></b-skeleton>
          </div>
          <div
            class="column is-one-fifth-desktop is-half-mobile is-one-third-tablet mini-mobile"
          >
            <b-skeleton height="75px" :animated="true"></b-skeleton>
          </div>
          <div
            class="column is-one-fifth-desktop is-half-mobile is-one-third-tablet mini-mobile"
          >
            <b-skeleton height="75px" :animated="true"></b-skeleton>
          </div>
          <div
            class="column is-one-fifth-desktop is-half-mobile is-one-third-tablet mini-mobile"
          >
            <b-skeleton height="75px" :animated="true"></b-skeleton>
          </div>
          <div
            class="column is-one-fifth-desktop is-half-mobile is-one-third-tablet mini-mobile"
          >
            <b-skeleton height="75px" :animated="true"></b-skeleton>
          </div>
        </div>
      </div>
      <div v-else class="features-index">
        <div v-if="globalHelper('viewBusinessStats')" class="columns is-mobile">
          <div
            class="column is-one-fifth-desktop is-half-mobile is-one-third-tablet mini-mobile"
          >
            <div class="tile is-child box">
              <div>
                <b-icon class="bg1" icon="arrow-down" size="is-small"> </b-icon>
              </div>
              <div>
                <p class="subtitle">To Receive</p>
                <p class="title">Rs. {{ conversion(to_receive) }}</p>
              </div>
            </div>
          </div>
          <div
            class="column is-one-fifth-desktop is-half-mobile is-one-third-tablet mini-mobile"
          >
            <div class="tile is-child box">
              <div>
                <b-icon class="bg2" icon="arrow-up" size="is-small"> </b-icon>
              </div>
              <div>
                <p class="subtitle">To Pay</p>
                <p class="title">Rs. {{ conversion(to_give) }}</p>
              </div>
            </div>
          </div>
          <div
            class="column is-one-fifth-desktop is-half-mobile is-one-third-tablet mini-mobile"
          >
            <div class="tile is-child box">
              <div>
                <b-icon class="bg3" icon="sale" size="is-small"> </b-icon>
              </div>
              <div>
                <p class="subtitle">Sales ({{ month }})</p>
                <p class="title">Rs. {{ conversion(sales_home) }}</p>
              </div>
            </div>
          </div>
          <div
            class="column is-one-fifth-desktop is-half-mobile is-one-third-tablet mini-mobile"
          >
            <div class="tile is-child box">
              <div>
                <b-icon class="bg4" icon="cart" size="is-small"> </b-icon>
              </div>
              <div>
                <p class="subtitle">Purchase ({{ month }})</p>
                <p class="title">Rs. {{ conversion(purchase_home) }}</p>
              </div>
            </div>
          </div>
          <div
            class="column is-one-fifth-desktop is-half-mobile is-one-third-tablet mini-mobile"
          >
            <div class="tile is-child box">
              <div>
                <b-icon class="bg5" icon="wallet-outline" size="is-small">
                </b-icon>
              </div>
              <div>
                <p class="subtitle">Expenses ({{ month }})</p>
                <p class="title">Rs. {{ conversion(expenses) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="loading" style="margin-top: 1rem" class="columns">
        <div v-if="globalHelper('viewBusinessStats')" class="column is-6">
          <div>
            <b-skeleton height="302px" :animated="true"></b-skeleton>
          </div>
        </div>
        <div v-if="globalHelper('viewBusinessStats')" class="column is-6">
          <div>
            <b-skeleton height="302px" :animated="true"></b-skeleton>
          </div>
        </div>
      </div>
      <div v-else class="columns">
        <div v-if="globalHelper('viewBusinessStats')" class="column is-6">
          <div class="chart-blur">
            <div v-if="!view_sales_chart" class="blur-section">
              <b-button @click="salesChart" type="is-primary">
                View Sales Chart</b-button
              >
            </div>
            <card-component-index
              :empty_sale="empty_sale"
              @filterDate="filterDate"
              title="Sales Chart"
              @header-icon-click="fillChartData"
            >
              <div v-if="defaultChart.chartData" class="chart-area">
                <line-chart
                  ref="bigChart"
                  style="height: 270px"
                  chart-id="big-line-chart"
                  :chart-data="defaultChart.chartData"
                  :extra-options="defaultChart.extraOptions"
                >
                </line-chart>
              </div>
            </card-component-index>
          </div>
        </div>
        <div v-if="globalHelper('viewBusinessStats')" class="column is-6">
          <div class="chart-blur">
            <div v-if="!view_purchase_chart" class="blur-section">
              <b-button @click="purchaseChart" type="is-secondary">
                View Purchase Chart</b-button
              >
            </div>
            <card-component-index-2
              :empty_purchase="empty_purchase"
              title="Purchase Chart"
              @header-icon-click="fillChartData2"
              @filterDate2="filterDate2"
            >
              <div v-if="defaultChart2.chartData" class="chart-area">
                <line-chart
                  ref="bigChart"
                  style="height: 270px"
                  chart-id="big-line-chart"
                  :chart-data="defaultChart2.chartData"
                  :extra-options="defaultChart2.extraOptions"
                >
                </line-chart>
              </div>
            </card-component-index-2>
          </div>
        </div>
      </div>
      <section v-if="recent_transaction">
        <div v-if="globalHelper('viewBusinessStats')" class="block-white">
          <h1>Recent Transactions</h1>
        </div>
        <card-component
          v-if="globalHelper('viewBusinessStats')"
          class="has-table has-mobile-sort-spaced"
          title="Clients"
          icon="account-multiple"
        >
          <expense-table-index
            @noTransaction="emptyTransaction"
            @updateData="updateData"
          />
          <div class="table-bottom">
            <nuxt-link to="/transactions">View All Transactions</nuxt-link>
          </div>
        </card-component>
      </section>
      <section
        class="empty-dashboard"
        v-if="!globalHelper('viewBusinessStats')"
      >
        <div>
          <b-icon icon="briefcase-variant" size="is-small"></b-icon>
          <p>Business Stats are hidden.</p>
        </div>
      </section>
    </section>
  </div>
</template>

<script>
// @ is an alias to /src
import { mapState } from "vuex";
import * as chartConfig from "@/components/Charts/chart.config";
import CardWidget from "@/components/CardWidget";
import CardComponent from "@/components/CardComponent";
import CardComponentIndex from "@/components/CardComponentIndex";
import CardComponentIndex2 from "@/components/CardComponentIndex2";
import LineChart from "@/components/Charts/LineChart";
import ExpenseTableIndex from "@/components/ExpenseTableIndex";
import PaymentOutModal from "@/components/PaymentOutModal";
import PaymentInModal from "@/components/PaymentInModal";
import ExpenseModal from "@/components/ExpenseModal";
import IncomeModal from "@/components/IncomeModal";
import axios from "axios";
export default {
  name: "Home",
  middleware: "auth-business",
  components: {
    ExpenseTableIndex,
    LineChart,
    CardComponentIndex,
    CardComponentIndex2,
    CardComponent,
    CardWidget,
    PaymentOutModal,
    PaymentInModal,
    ExpenseModal,
    IncomeModal,
  },
  data() {
    return {
      isFullPage: true,
      isModalActive: false,
      isModalActivePin: false,
      isModalActivePout: false,
      isModalActiveIncome: false,
      loading: true,
      view_sales_chart: false,
      view_purchase_chart: false,
      month: "",
      to_give: "",
      to_receive: "",
      stock_value: "",
      sales_home: "",
      purchase_home: "",
      expenses: "",
      empty_sale: false,
      empty_purchase: false,
      chart_values: [],
      labels: [],
      chart_values_p: [],
      labels_p: [],
      recent_transaction: true,
      defaultChart: {
        chartData: null,
        extraOptions: chartConfig.chartOptionsMain,
      },
      defaultChart2: {
        chartData: null,
        extraOptions: chartConfig.chartOptionsMain,
      },
    };
  },
  computed: {
    titleStack() {
      return ["Admin", "Dashboard"];
    },
  },
  async mounted() {
    try {
      const response = await axios.get(
        "/home/mobile/?business=" + localStorage.getItem("business"),
        {
          headers: {
            Authorization: localStorage.getItem("auth._token.local"),
          },
        }
      );
      this.month = response.data.month;
      this.to_give = Math.abs(response.data.to_give);
      this.to_receive = Math.abs(response.data.to_receive);
      this.sales_home = Number(response.data.month_sales);
      this.expenses = Math.abs(response.data.month_expenses);
      this.purchase_home = Number(response.data.month_purchases);
    } catch (err) {
      // this.$auth.logout();
      // localStorage.removeItem("business");
      // window.location.assign("/")
    }
    this.chart_values = [65, 59, 70, 77, 80, 87, 80, 81, 76, 90, 80, 75];
    let labels = [
      "Chaitra",
      "Falgun",
      "Magh",
      "Poush",
      "Mangsir",
      "Kartik",
      "Ashoj",
      "Bhadra",
      "Shrawan",
      "Asar",
      "Jestha",
      "Baisakh",
    ];
    this.labels = labels.reverse();
    this.chart_values_p = [65, 59, 70, 77, 80, 87, 80, 81, 76, 60, 80, 75];
    this.labels_p = labels.reverse();
    this.fillChartData();
    this.fillChartData2();
    this.loading = false;
  },

  methods: {
    emptyTransaction() {
      this.recent_transaction = false;
    },
    createTransaction() {
      localStorage.removeItem("party_details");
    },
    paymentModal(p) {
      if (p == "Payment In") {
        this.isModalActivePin = true;
        this.$refs.parties1.resetParties();
        this.$refs.parties1.resetMode();
        this.$refs.parties1.modalActivate();
      }
      if (p == "Payment Out") {
        this.$refs.parties2.resetParties();
        this.$refs.parties2.resetMode();
        this.$refs.parties2.modalActivate();
        this.isModalActivePout = true;
      }
      if (p == "Expense") {
        this.isModalActive = true;
        this.$refs.categories.selectCategory();
      }
      if (p == "Income") {
        this.isModalActiveIncome = true;
        this.$refs.categoriesIncome.selectCategory();
      }
    },
    async filterDate(filterDate) {
      if (filterDate == "Monthly") {
        try {
          const res = await axios.get(
            "/home/web-chart/?business=" +
              localStorage.getItem("business") +
              "&transaction=sale&duration=monthly",
            {
              headers: {
                Authorization: localStorage.getItem("auth._token.local"),
              },
            }
          );
          if (res.data.values_list.length) {
            this.total = this.conversion(res.data.total);
            this.chart_values = res.data.values_list.reverse();
            this.labels = res.data.labels.reverse();
          } else {
            this.empty_sale = true;
          }
          this.fillChartData();
        } catch (err) {}
      }
      if (filterDate == "Daily") {
        try {
          const res = await axios.get(
            "/home/web-chart/?business=" +
              localStorage.getItem("business") +
              "&transaction=sale&duration=daily",
            {
              headers: {
                Authorization: localStorage.getItem("auth._token.local"),
              },
            }
          );
          if (res.data.values_list.length) {
            this.total = this.conversion(res.data.total);
            this.chart_values = res.data.values_list.reverse();
            this.labels = res.data.labels.reverse();
          } else {
            this.empty_sale = true;
          }
          this.fillChartData();
        } catch (err) {}
      }
    },
    async filterDate2(filterDate) {
      if (filterDate == "Monthly") {
        try {
          const res = await axios.get(
            "/home/web-chart/?business=" +
              localStorage.getItem("business") +
              "&transaction=purchase&duration=monthly",
            {
              headers: {
                Authorization: localStorage.getItem("auth._token.local"),
              },
            }
          );
          if (res.data.values_list.length) {
            this.chart_values_p = res.data.values_list.reverse();
            this.labels_p = res.data.labels.reverse();
          } else {
            this.empty_purchase = true;
          }
          this.fillChartData2();
        } catch (err) {}
      }
      if (filterDate == "Daily") {
        try {
          const res = await axios.get(
            "/home/web-chart/?business=" +
              localStorage.getItem("business") +
              "&transaction=purchase&duration=daily",
            {
              headers: {
                Authorization: localStorage.getItem("auth._token.local"),
              },
            }
          );
          if (res.data.values_list.length) {
            this.chart_values_p = res.data.values_list.reverse();
            this.labels_p = res.data.labels.reverse();
          } else {
            this.empty_purchase = true;
          }
          this.fillChartData2();
        } catch (err) {}
      }
    },
    async salesChart() {
      this.filterDate("Monthly");
      this.view_sales_chart = true;
    },
    purchaseChart() {
      this.filterDate2("Monthly");
      this.view_purchase_chart = true;
    },
    fillChartData() {
      this.defaultChart.chartData = {
        datasets: [
          {
            fill: false,
            borderColor: chartConfig.chartColors.default.primary,
            borderWidth: 2,
            borderDash: [],
            backgroundColor: "#c4eadd",
            borderDashOffset: 0.0,
            pointBackgroundColor: chartConfig.chartColors.default.primary,
            pointBorderColor: "rgba(255,255,255,0)",
            pointHoverBackgroundColor: chartConfig.chartColors.default.primary,
            pointBorderWidth: 20,
            pointHoverRadius: 4,
            pointHoverBorderWidth: 15,
            pointRadius: 4,
            data: this.chart_values,
            fill: true,
          },
        ],
        labels: this.labels,
      };
    },
    fillChartData2() {
      this.defaultChart2.chartData = {
        datasets: [
          {
            fill: false,
            borderColor: chartConfig.chartColors.default.info,
            borderWidth: 2,
            borderDash: [],
            borderDashOffset: 0.0,
            backgroundColor: "#bddaff",
            pointBackgroundColor: chartConfig.chartColors.default.info,
            pointBorderColor: "rgba(255,255,255,0)",
            pointHoverBackgroundColor: chartConfig.chartColors.default.info,
            pointBorderWidth: 20,
            pointHoverRadius: 4,
            pointHoverBorderWidth: 15,
            pointRadius: 4,
            data: this.chart_values_p,
            fill: true,
          },
        ],
        labels: this.labels_p,
      };
    },
    trashConfirmPin() {
      this.isModalActivePin = false;
      this.$buefy.snackbar.open({
        message: "Payment In was added successfully",
        type: "is-primary",
        position: "is-bottom",
        indefinite: false,
      });
    },
    trashConfirmPout() {
      this.isModalActivePout = false;
      this.$buefy.snackbar.open({
        message: "Payment Out was added successfully",
        type: "is-primary",
        position: "is-bottom",
        indefinite: false,
      });
    },
    addConfirmIn() {
      this.isModalActivePin = true;
      this.$buefy.snackbar.open({
        message: "Payment In was added successfully",
        type: "is-primary",
        position: "is-bottom",
        indefinite: false,
      });
    },
    addConfirmOut() {
      this.isModalActivePout = true;
      this.$buefy.snackbar.open({
        message: "Payment Out was added successfully",
        type: "is-primary",
        position: "is-bottom",
        indefinite: false,
      });
    },
    confirmAdd() {
      this.isModalActive = true;
      this.$buefy.snackbar.open({
        message: "Expense was added successfully",
        type: "is-primary",
        position: "is-bottom",
        indefinite: false,
      });
    },
    confirmAddIncome() {
      this.isModalActiveIncome = true;
      this.$buefy.snackbar.open({
        message: "Income was added successfully",
        type: "is-primary",
        position: "is-bottom",
        indefinite: false,
      });
    },
    trashConfirm() {
      this.isModalActive = false;
      this.$buefy.snackbar.open({
        message: "Expense was added successfully",
        type: "is-primary",
        position: "is-bottom",
        indefinite: false,
      });
    },
    trashConfirmIncome() {
      this.isModalActiveIncome = false;
      this.$buefy.snackbar.open({
        message: "Income was added successfully",
        type: "is-primary",
        position: "is-bottom",
        indefinite: false,
      });
    },
    trashCancel() {
      this.isModalActivePin = false;
      this.isModalActivePout = false;
      this.isModalActive = false;
      this.isModalActiveIncome = false;
    },
    async updateData() {
      const response = await axios.get(
        "/home/mobile/?business=" + localStorage.getItem("business"),
        {
          headers: {
            Authorization: localStorage.getItem("auth._token.local"),
          },
        }
      );
      this.month = response.data.month;
      this.to_give = Math.abs(response.data.to_give);
      this.to_receive = Math.abs(response.data.to_receive);
      this.sales_home = Number(response.data.month_sales);
      this.expenses = Math.abs(response.data.month_expenses);
      this.purchase_home = Number(response.data.month_purchases);
    },
  },
  head() {
    return {
      title: "Dashboard - Karobar",
    };
  },
};
</script>
<style lang="scss">
$green: #3ab98d;
$black: #1f1f1f;
.empty-dashboard {
  display: grid;
  place-items: center;
  text-align: center;
  height: 70vh;
  .icon {
    font-size: 6rem;
    color: #aaaaaa;
  }
  p {
    color: #333a4d;
    font-size: 20px;
  }
}
.is-title-bar {
  border-bottom: 0 !important;
  .title-bar-dropdown.pushed {
    .dropdown-menu {
      left: -35px;
      .dropdown-content {
        width: max-content;
      }
    }
  }
  .button {
    .button-title {
      font-size: 14px;
    }
  }
  .button.is-primary {
    background-color: $green;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 6px -1px,
      rgba(0, 0, 0, 0.06) 0px 2px 4px -1px;
  }
  .button.is-light {
    border-color: $green;
    color: $green;
    background-color: #f8f8f8;
    &:hover {
      background-color: #f8f8f8;
    }
  }
}
.features-index {
  margin-bottom: 12px;
  .tile.is-parent {
    padding: 10px 8px;
  }
  .box {
    padding: 15px 10px;
  }
  .tile.is-child {
    display: flex;
    justify-content: flex-start;
    box-shadow: none;
    cursor: pointer;
    &:hover {
      box-shadow: none;
    }
    .icon {
      color: white;
      padding: 21px;
      border-radius: 50%;
      margin-right: 1rem;
      font-size: 23px;
      &.bg1 {
        background-color: #3ab98d;
      }
      &.bg2 {
        background-color: #f27e59;
      }
      &.bg3 {
        background-color: #2482ff;
      }
      &.bg4 {
        background-color: #00bcd5;
      }
      &.bg5 {
        background-color: #e54f6d;
      }
    }
    p.title {
      font-size: 15px;
      color: #0f1015;
      font-weight: 600;
    }
    p.subtitle {
      font-size: 14px;
      color: #6e6e70;
      padding-bottom: 0.5rem;
    }
  }
}
.table-bottom {
  background-color: #f8f9fb;
  text-align: center;
  padding: 0.6em 0;
  border-top: 1px solid #fafafa;
  a {
    color: $green;
    font-size: 14px;
    font-weight: 600;
  }
}
.block-white {
  background-color: white;
  padding: 12px 10px;
  border-radius: 4px;
  h1 {
    font-weight: 600;
    color: #1b2121;
  }
}
.chart-blur {
  position: relative;
  .button.is-secondary {
    color: white;
    background-color: #2482ff;
    border: none;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 6px -1px,
      rgba(0, 0, 0, 0.06) 0px 2px 4px -1px;
  }
  .blur-section {
    width: 100%;
    height: 100%;
    position: absolute;
    border-radius: 6px;
    z-index: 1;
    backdrop-filter: blur(7px);
    display: flex;
    align-items: center;
    justify-content: center;
    &.removed {
      display: none;
    }
  }
}
@media (min-width: 480px) and (max-width: 768px) {
  .level {
    display: flex;
    flex-wrap: wrap;
  }
  .level-left + .level-right {
    margin-top: 0;
  }
  .transaction-table-index {
    height: auto;
  }
}
@media screen and (max-width: 480px) {
  .is-title-bar {
    .buttons.is-right {
      justify-content: center;
    }
  }
  .transaction-table-index {
    height: auto;
  }
}
@media screen and (max-width: 360px) {
  .column.mini-mobile {
    width: 100%;
  }
}
</style>
