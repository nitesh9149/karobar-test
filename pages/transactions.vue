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
              <li>All Transactions</li>
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
                <span class="button-title">Create Sales Invoice</span>
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
              <b-dropdown class="title-bar-dropdown" aria-role="list">
                <template #trigger>
                  <b-button type="is-light" icon-right="menu-down"
                    ><span class="button-title">More Options</span></b-button
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
      <card-component-transaction
        class="has-table has-mobile-sort-spaced"
        title="Clients"
        icon="account-multiple"
        @search="searchTransaction"
        @filterDate="filterDate"
        @filterType="filterType"
        ref="updateFilterName"
      >
        <table-transaction
          @updateFilter="updateFilter"
          :searchTransaction="searchItem"
          :filterDate="dateFilter"
          :filterType="typeFilter"
          ref="reset"
        />
      </card-component-transaction>
    </section>
  </div>
</template>
<script>
import TableTransaction from "@/components/TableTransaction";
import CardComponentTransaction from "@/components/CardComponentTransaction";
import PaymentOutModal from "@/components/PaymentOutModal";
import PaymentInModal from "@/components/PaymentInModal";
import ExpenseModal from "@/components/ExpenseModal";
import IncomeModal from "@/components/IncomeModal";
export default {
  name: "Home",
  middleware: "auth-business",
  components: {
    TableTransaction,
    CardComponentTransaction,
    PaymentOutModal,
    PaymentInModal,
    ExpenseModal,
    IncomeModal,
  },
  data() {
    return {
      searchItem: {},
      dateFilter: "",
      typeFilter: "",
      isModalActive: false,
      isModalActivePin: false,
      isModalActivePout: false,
      isModalActiveIncome: false,
    };
  },
  methods: {
    createTransaction() {
      localStorage.removeItem("party_details");
    },
    updateFilter() {
      this.$refs.updateFilterName.updateFilter();
    },
    paymentModal(p) {
      if (p == "Payment In") {
        this.isModalActivePin = true;
        this.$refs.parties1.resetParties();
        this.$refs.parties1.resetMode();
        this.$refs.parties1.modalActivate();
      }
      if (p == "Payment Out") {
        this.isModalActivePout = true;
        this.$refs.parties2.resetParties();
        this.$refs.parties2.resetMode();
        this.$refs.parties2.modalActivate();
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
    searchTransaction(a) {
      this.searchItem = a;
    },
    filterDate(filterDate) {
      this.dateFilter = filterDate;
    },
    filterType(filterType) {
      this.typeFilter = filterType;
    },
    trashConfirmPin() {
      this.isModalActivePin = false;
      this.$buefy.snackbar.open({
        message: "Payment In was added successfully",
        type: "is-primary",
        position: "is-bottom",
        indefinite: false,
      });
      this.$refs.reset.reset();
    },
    trashConfirmPout() {
      this.isModalActivePout = false;
      this.$buefy.snackbar.open({
        message: "Payment Out was added successfully",
        type: "is-primary",
        position: "is-bottom",
        indefinite: false,
      });
      this.$refs.reset.reset();
    },
    addConfirmIn() {
      this.isModalActivePin = true;
      this.$buefy.snackbar.open({
        message: "Payment In was added successfully",
        type: "is-primary",
        position: "is-bottom",
        indefinite: false,
      });
      this.$refs.reset.reset();
    },
    addConfirmOut() {
      this.isModalActivePout = true;
      this.$buefy.snackbar.open({
        message: "Payment Out was added successfully",
        type: "is-primary",
        position: "is-bottom",
        indefinite: false,
      });
      this.$refs.reset.reset();
    },
    trashCancel() {
      this.isModalActivePin = false;
      this.isModalActivePout = false;
      this.isModalActive = false;
      this.isModalActiveIncome = false;
    },
  },
  head() {
    return {
      title: "All Transactions - Karobar Web App",
    };
  },
};
</script>
<style lang="scss">
$green: #3ab98d;
$black: #1f1f1f;

.is-title-bar {
  border-bottom: 0 !important;
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
</style>