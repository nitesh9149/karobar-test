<template>
  <div>
    <bank-balance-modal
      :is-active="isModalActive"
      @confirm="trashConfirm"
      @cancel="trashCancel"
      :currentBalance="netAmount"
    />
    <bank-balance-reduce-modal
      :is-active="isModalActive2"
      @confirm="trashConfirm2"
      @cancel="trashCancel2"
      :currentBalance="netAmount"
    />
    <section class="section is-title-bar sales-title-bar">
      <div class="level">
        <div class="level-left">
          <div class="level-item">
            <ul>
              <li>Bank Balance</li>
            </ul>
          </div>
        </div>
        <div class="level-right">
          <div class="level-item">
            <div v-if="globalHelper('addReduceBank')" class="buttons is-right">
              <button  @click="trashModal()" class="button is-primary">
                <b-icon icon="plus" custom-size="default" />
                <span class="button-title">Add Money</span>
              </button>
              <b-button @click="trashModal2()" type="is-danger">
                <b-icon icon="minus" custom-size="default" />
                <span class="button-title">Reduce Money</span>
              </b-button>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="section is-main-section">
      <card-component-balance
        class="has-table has-mobile-sort-spaced"
        title="Net Amount:"
        icon="account-multiple"
        :totalAmount="netAmount"
        @filterDate="filterDate"
        ref="updateFilterName"
      >
        <balance-table
        :posts="posts"
        @netAmount="totalAmount"
        :filterDate="dateFilter"
        @updateFilter="updateFilter"
         />
      </card-component-balance>
    </section>
  </div>
</template>
<script>
// @ is an alias to /src
import TitleBar from "@/components/TitleBar";
import CardComponentBalance from "@/components/CardComponentBalance";
import BalanceTable from "@/components/BalanceTable";
import BankBalanceModal from "@/components/BankBalanceModal";
import BankBalanceReduceModal from "@/components/BankBalanceReduceModal";
export default {
  name: "Home",
  middleware: "auth-business",
  components: {
    TitleBar,
    BalanceTable,
    BankBalanceModal,
    CardComponentBalance,
    BankBalanceReduceModal
  },
  data() {
    return {
      isModalActive: false,
      isModalActive2: false,
       posts: {},
       netAmount:0,
       dateFilter: "",
    };
  },
  methods: {
    totalAmount(amount) {
      this.netAmount = amount;
    },
    filterDate(filterDate) {
      this.dateFilter = filterDate;
    },
    updateFilter(){
      this.$refs.updateFilterName.updateFilter()
    },
    trashModal() {
      this.isModalActive = true;
    },
    trashConfirm(post) {
      this.isModalActive = false;
      this.posts = post;
      this.$buefy.snackbar.open({
          message: "Money was added successfully",
          type: "is-primary",
          position: "is-bottom",
          indefinite: false,
        });
    },
    trashCancel() {
      this.isModalActive = false;
    },
        trashModal2() {
      this.isModalActive2 = true;
    },
    trashConfirm2(post) {
      this.isModalActive2 = false;
      this.posts = post;
      this.$buefy.snackbar.open({
          message: "Money was reduced successfully",
          type: "is-primary",
          position: "is-bottom",
          indefinite: false,
        });
    },
    trashCancel2() {
      this.isModalActive2 = false;
    },
  },
  head() {
    return {
      title: "Bank Balance - Karobar",
    };
  },
};
</script>
<style lang="scss">
$green: #3ab98d;
$black: #1f1f1f;
.sales-title-bar {
  .button {
    &.is-light {
      border-color: $green;
      color: $green;
      background-color: transparent;
    }
  }
}
</style>
