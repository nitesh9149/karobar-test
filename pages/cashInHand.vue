<template>
  <div>
    <cash-in-hand-modal
      :is-active="isModalActive"
      @confirm="trashConfirm"
      @cancel="trashCancel"
      :currentBalance="netAmount"
    />
    <cash-in-hand-reduce-modal
      :is-active="isModalActive2"
      @confirm="trashConfirm2"
      @cancel="trashCancel2"
      :currentBalance="netAmount"
    />
    <section class="section is-title-bar">
      <div class="level">
        <div class="level-left">
          <div class="level-item">
            <ul>
              <li>Cash in Hand</li>
            </ul>
          </div>
        </div>
        <div class="level-right">
          <div class="level-item">
            <div v-if="globalHelper('addReduceCash')" class="buttons is-right">
              <button @click="trashModal()" class="button is-primary">
                <b-icon icon="plus" custom-size="default" />
                <span class="button-title">Add Cash</span>
              </button>
              <b-button @click="trashModal2()" type="is-danger">
                <b-icon icon="minus" custom-size="default" />
                <span class="button-title">Reduce Cash</span>
              </b-button>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="section is-main-section">
      <card-component-cash
        class="has-table has-mobile-sort-spaced"
        title="Net Amount:"
        icon="account-multiple"
        :totalAmount="netAmount"
        @filterDate="filterDate"
        ref="updateFilterName"
      >
        <cash-table :posts="posts" @netAmount="totalAmount" :filterDate="dateFilter" @updateFilter="updateFilter" />
      </card-component-cash>
    </section>
  </div>
</template>
<script>
// @ is an alias to /src
import TitleBar from "@/components/TitleBar";
import CardComponentCash from "@/components/CardComponentCash";
import CashTable from "@/components/CashTable";
import CashInHandModal from "@/components/CashInHandModal";
import CashInHandReduceModal from "@/components/CashInHandReduceModal";
export default {
  name: "Home",
  middleware: "auth-business",
  components: {
    TitleBar,
    CashTable,
    CashInHandModal,
    CashInHandReduceModal,
    CardComponentCash,
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
        message: "Cash was added successfully",
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
      this.posts = post;
      this.isModalActive2 = false;
      this.$buefy.snackbar.open({
        message: "Cash was reduced successfully",
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
      title: "Cash in Hand - Karobar",
    };
  },
};
</script>
<style lang="scss">
$green: #3ab98d;
$black: #1f1f1f;
</style>
