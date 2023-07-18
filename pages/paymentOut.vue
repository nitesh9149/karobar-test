<template>
  <div>
    <payment-out-modal
      :is-active="isModalActive"
      @confirm="trashConfirm"
      @cancel="trashCancel"
      @addConfirm="addConfirm"
      ref="parties"
    />
    <span style="display: none">{{ modalChange }}</span>
    <button
      style="display: none"
      v-shortkey="['alt', 'o']"
      @shortkey="theAction('o')"
    ></button>
    <section class="section is-title-bar">
      <div class="level">
        <div class="level-left">
          <div class="level-item">
            <ul>
              <li>Payment Out</li>
            </ul>
          </div>
        </div>
        <div class="level-right">
          <div class="level-item">
            <div class="buttons is-right">
              <button
                v-if="globalHelper('createPurchase')"
                @click="trashModal()"
                class="button is-primary"
              >
                <b-icon icon="plus" custom-size="default" />
                <span class="button-title">Add Payment-Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="section is-main-section">
      <card-component-payment-out
        class="has-table has-mobile-sort-spaced"
        title="Payment-Out-List"
        icon="account-multiple"
        @filterDate="filterDate"
        @search="searchTransaction"
        ref="updateFilterName"
      >
        <payment-out-table
          :filterDate="dateFilter"
          :payment="payment"
          :searchTransaction="searchItem"
          @updateFilter="updateFilter"
        />
      </card-component-payment-out>
    </section>
  </div>
</template>
<script>
// @ is an alias to /src
import { mapState } from "vuex";
import TitleBar from "@/components/TitleBar";
import CardComponentPaymentOut from "@/components/CardComponentPaymentOut";
import PaymentOutTable from "@/components/PaymentOutTable";
import PaymentOutModal from "@/components/PaymentOutModal";
export default {
  name: "Home",
  middleware: "auth-business",
  components: {
    TitleBar,
    PaymentOutTable,
    CardComponentPaymentOut,
    PaymentOutModal,
  },
  data() {
    return {
      showWeekNumber: false,
      isModalActive: false,
      locale: undefined, // Browser locale
      payment: {},
      dateFilter: "",
      searchItem: {},
    };
  },
  mounted() {
    if (localStorage.getItem("openModal")) {
      this.trashModal();
    }
    localStorage.removeItem("openModal");
  },
  computed: {
    titleStack() {
      return ["All Payment Out"];
    },
    nuxtLink() {
      return ["Add Payment Out"];
    },
    toLink() {
      return "/addPaymentIn";
    },
    ...mapState(["pageModal", "pageModalOpen"]),
    modalChange() {
      if (this.pageModal) {
        this.isModalActive = true;
        // this.$store.commit("toggleModal");
      } else {
        this.isModalActive = false;
      }
    },
  },
  methods: {
    filterDate(filterDate) {
      this.dateFilter = filterDate;
    },
    updateFilter() {
      this.$refs.updateFilterName.updateFilter();
    },
    trashModal() {
      this.isModalActive = true;
      this.$refs.parties.resetParties();
      this.$refs.parties.resetMode();
      this.$refs.parties.modalActivate();
    },
    trashConfirm(post) {
      this.payment = post;
      this.isModalActive = false;
      this.$buefy.snackbar.open({
        message: "Payment Out was added successfully",
        type: "is-primary",
        position: "is-bottom",
        indefinite: false,
      });
    },
    addConfirm(post) {
      this.payment = post;
      this.$buefy.snackbar.open({
        message: "Payment Out was added successfully",
        type: "is-primary",
        position: "is-bottom",
        indefinite: false,
      });
      this.isModalActive = true;
    },
    trashCancel() {
      this.isModalActive = false;
      this.$store.commit("modalClose");
    },
    searchTransaction(a) {
      this.searchItem = a;
    },
    theAction(key) {
      if (localStorage.getItem("business")) {
        let i = 0;

        this.$auth.user.businesses.forEach((element, index) => {
          if (
            element.business == JSON.parse(localStorage.getItem("business"))
          ) {
            i = index;
          }
        });
        let business = this.$auth.user.businesses[i];
        if (business.own_business == true) {
          if (business.package != "2") {
            window.location.assign("/upgradePlan");
            return;
          }
          if (business.expired == true) {
            this.$router.push("/subscription");
            return;
          }
        } else {
          if (business.expired == true) {
            this.$router.push("/renewSubscription");
            return;
          }
        }
      }
      let permissions = {
        admin: {
          s: true,
          p: true,
          i: true,
          o: true,
          c: true,
          d: true,
          q: true,
          x: true,
          m: true,
          n: true,
          sd: true,
          sp: true,
          si: true,
          sx: true,
          ss: true,
          sr: true,
          sh: true,
          sk: true,
        },
        "business-partner": {
          s: true,
          p: true,
          i: true,
          o: true,
          c: true,
          d: true,
          q: true,
          x: true,
          m: true,
          n: true,
          sd: true,
          sp: true,
          si: true,
          sx: true,
          ss: true,
          sr: true,
          sh: true,
          sk: true,
        },
        "sales-person": {
          s: true,
          p: false,
          i: true,
          o: false,
          c: true,
          d: false,
          q: true,
          x: true,
          m: false,
          n: true,
          sd: true,
          sp: true,
          si: true,
          sx: true,
          ss: true,
          sr: true,
          sh: true,
          sk: true,
        },
        "inventory-manager": {
          s: false,
          p: true,
          i: false,
          o: true,
          c: false,
          d: true,
          q: false,
          x: true,
          m: true,
          n: true,
          sd: true,
          sp: true,
          si: true,
          sx: true,
          ss: true,
          sr: true,
          sh: true,
          sk: true,
        },
        accountant: {
          s: false,
          p: false,
          i: false,
          o: false,
          c: false,
          d: false,
          q: false,
          x: false,
          m: false,
          n: false,
          sd: true,
          sp: false,
          si: false,
          sx: false,
          ss: true,
          sr: true,
          sh: true,
          sk: true,
        },
      };
      let role = localStorage.getItem("role");
      if (!permissions[role][key]) {
        this.$buefy.snackbar.open({
          message: "You can't perform this action as " + role,
          type: "is-primary",
          position: "is-bottom",
          indefinite: false,
        });
        return;
      }
      this.$refs.parties.resetParties();
      this.$refs.parties.resetMode();
      this.$refs.parties.modalActivate();
      this.$emit("actionKeyClose");
      this.$store.commit("toggleModal");
    },
  },
  head() {
    return {
      title: "Payment-Out - Karobar",
    };
  },
};
</script>
<style lang="scss">
$green: #3ab98d;
$black: #1f1f1f;
.payment-form {
  padding-bottom: 2rem;
  .input {
    border: none;
    box-shadow: none;
  }
  .datepicker .dropdown .input[readonly] {
    box-shadow: none;
  }
  .control.has-icons-left .icon,
  .control.has-icons-right .icon {
    color: #3ab98d;
  }
  .select:not(.is-multiple):not(.is-loading)::after {
    border-color: #4b4b4b;
  }
}
</style>
