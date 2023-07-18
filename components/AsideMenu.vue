<template>
  <aside v-show="isAsideVisible" class="aside is-placed-left is-expanded">
    <switch-business-modal
      :is-active="isModalActive"
      @confirm="trashConfirm"
      @confirmAdd="trashConfirmAdd"
      @cancel="trashCancel"
    />
    <message-modal
      :is-active="isModalActive2"
      @confirm="trashConfirm2"
      @cancel="trashCancel2"
    />
    <button
      style="display: none"
      v-shortkey="['alt', 's']"
      @shortkey="theAction('s')"
    ></button>
    <button
      style="display: none"
      v-shortkey="['alt', 'p']"
      @shortkey="theAction('p')"
    ></button>
    <button
      style="display: none"
      v-shortkey="['alt', 'i']"
      @shortkey="theAction('i')"
    ></button>
    <button
      style="display: none"
      v-shortkey="['alt', 'o']"
      @shortkey="theAction('o')"
    ></button>
    <button
      style="display: none"
      v-shortkey="['alt', 'c']"
      @shortkey="theAction('c')"
    ></button>
    <button
      style="display: none"
      v-shortkey="['alt', 'd']"
      @shortkey="theAction('d')"
    ></button>
    <button
      style="display: none"
      v-shortkey="['alt', 'q']"
      @shortkey="theAction('q')"
    ></button>
    <button
      style="display: none"
      v-shortkey="['alt', 'x']"
      @shortkey="theAction('x')"
    ></button>
    <button
      style="display: none"
      v-shortkey="['alt', 'm']"
      @shortkey="theAction('m')"
    ></button>
    <button
      style="display: none"
      v-shortkey="['alt', 'n']"
      @shortkey="theAction('n')"
    ></button>
    <button
      style="display: none"
      v-shortkey="['shift', 'd']"
      @shortkey="theAction('sd')"
    ></button>
    <button
      style="display: none"
      v-shortkey="['shift', 'p']"
      @shortkey="theAction('sp')"
    ></button>
    <button
      style="display: none"
      v-shortkey="['shift', 'i']"
      @shortkey="theAction('si')"
    ></button>
    <button
      style="display: none"
      v-shortkey="['shift', 'x']"
      @shortkey="theAction('sx')"
    ></button>
    <button
      style="display: none"
      v-shortkey="['shift', 's']"
      @shortkey="theAction('ss')"
    ></button>
    <button
      style="display: none"
      v-shortkey="['shift', 'r']"
      @shortkey="theAction('sr')"
    ></button>
    <button
      style="display: none"
      v-shortkey="['shift', 'h']"
      @shortkey="theAction('sh')"
    ></button>
    <button
      style="display: none"
      v-shortkey="['shift', 'k']"
      @shortkey="theAction('sk')"
    ></button>
    <aside-tools :is-main-menu="true">
      <span slot="label">
        <div
          v-if="photo"
          class="aside-logo"
          :style="{ 'background-image': `url(${photo})` }"
        ></div>
        <div v-else class="aside-logo">
          <span>{{ business_name_short }}</span>
        </div>
        <div class="to-manage-business">
          <div>
            <p class="logo-title">{{ business_name }}</p>
            <p class="sub-desc">{{ contact_number }}</p>
          </div>
          <!-- <b-icon size="default" icon="chevron-right"></b-icon> -->
        </div>
      </span>
    </aside-tools>
    <div class="hrl"></div>
    <b-menu>
      <b-menu-list label="BUSINESS">
        <b-menu-item
          tag="nuxt-link"
          to="/"
          @click.native="routeIndex"
          icon="chart-areaspline"
          label="Dashboard"
        >
        </b-menu-item>
        <b-menu-item
          v-if="
            globalHelper('viewPartiesCustomer') ||
            globalHelper('viewPartiesSupplier')
          "
          @click.native="routeParties"
          tag="nuxt-link"
          to="/parties"
          icon="account"
          label="Parties"
        >
        </b-menu-item>
        <b-menu-item
          :active.sync="isExpandedItem"
          :expanded.sync="isExpandedItem"
          v-if="globalHelper('viewInventory')"
          @click="routeItems"
          icon="archive"
        >
          <template #label="props">
            <span class="small">Items</span>
            <b-icon
              size="is-small"
              class="is-pulled-right"
              :icon="props.expanded ? 'minus' : 'plus'"
            ></b-icon>
          </template>
          <b-menu-item
            v-if="globalHelper('viewInventory')"
            label="Items List"
            tag="nuxt-link"
            to="/items"
          ></b-menu-item>
          <b-menu-item
            v-if="globalHelper('viewInventory')"
            label="Categories"
            tag="nuxt-link"
            to="/itemCategory"
          ></b-menu-item>
          <b-menu-item
            v-if="globalHelper('viewInventory')"
            label="Units"
            tag="nuxt-link"
            to="/units"
          ></b-menu-item>
        </b-menu-item>
        <b-menu-item
          v-if="globalHelper('viewSale')"
          @click="routeSales"
          :active.sync="isExpandedSale"
          :expanded.sync="isExpandedSale"
          icon="sale"
        >
          <template #label="props">
            <span class="small">Sales</span>
            <b-icon
              size="is-small"
              class="is-pulled-right"
              :icon="props.expanded ? 'minus' : 'plus'"
            ></b-icon>
          </template>
          <b-menu-item
            v-if="globalHelper('viewSale')"
            label="Sale List"
            tag="nuxt-link"
            to="/sales"
          ></b-menu-item>
          <b-menu-item
            label="Sale Return"
            tag="nuxt-link"
            to="/salesReturn"
          ></b-menu-item>
          <b-menu-item
            label="Payment In"
            tag="nuxt-link"
            to="/paymentIn"
          ></b-menu-item>
          <!-- <b-menu-item
            label="Estimate/Quotation"
            tag="nuxt-link"
            to="/estimate"
          ></b-menu-item> -->
        </b-menu-item>
        <b-menu-item
          v-if="globalHelper('viewPurchase')"
          @click="routePurchase"
          icon="cart"
          :active.sync="isExpandedPurchase"
          :expanded.sync="isExpandedPurchase"
        >
          <template #label="props">
            <span class="small">Purchase</span>
            <b-icon
              size="is-small"
              class="is-pulled-right"
              :icon="props.expanded ? 'minus' : 'plus'"
            ></b-icon>
          </template>
          <b-menu-item
            label="Purchase List"
            tag="nuxt-link"
            to="/purchaseList"
          ></b-menu-item>
          <b-menu-item
            label="Purchase Return"
            tag="nuxt-link"
            to="/purchaseReturn"
          ></b-menu-item>
          <b-menu-item
            label="Payment Out"
            tag="nuxt-link"
            to="/paymentOut"
          ></b-menu-item>
        </b-menu-item>
        <b-menu-item
          v-if="globalHelper('viewCash') || globalHelper('viewBank')"
          :active.sync="isExpandedBanks"
          :expanded.sync="isExpandedBanks"
          @click="routeBanks"
          icon="bank"
        >
          <template #label="props">
            <span class="small">Cash and Banks</span>
            <b-icon
              size="is-small"
              class="is-pulled-right"
              :icon="props.expanded ? 'minus' : 'plus'"
            ></b-icon>
          </template>
          <b-menu-item
            v-if="globalHelper('viewCash')"
            label="Cash in Hand"
            tag="nuxt-link"
            to="/cashInHand"
          ></b-menu-item>
          <b-menu-item
            v-if="globalHelper('viewBank')"
            label="Bank Balance"
            tag="nuxt-link"
            to="/bankBalance"
          ></b-menu-item>
        </b-menu-item>
        <b-menu-item
          v-if="globalHelper('viewExpense')"
          @click="routeExpenses"
          :active.sync="isExpandedExpenses"
          :expanded.sync="isExpandedExpenses"
          icon="wallet"
        >
          <template #label="props">
            <span class="small">Income Expenses</span>
            <b-icon
              size="is-small"
              class="is-pulled-right"
              :icon="props.expanded ? 'minus' : 'plus'"
            ></b-icon>
          </template>
          <b-menu-item
            label="Expenses"
            tag="nuxt-link"
            to="/expenses"
          ></b-menu-item>
          <b-menu-item
            label="Incomes"
            tag="nuxt-link"
            to="/incomes"
          ></b-menu-item>
        </b-menu-item>
      </b-menu-list>

      <b-menu-list label="MANAGEMENT">
        <b-menu-item
          icon="archive"
          label="Reports"
          tag="nuxt-link"
          to="/reports"
          @click.native="routeReports"
        ></b-menu-item>
        <b-menu-item
          v-if="globalHelper('importData')"
          @click="routeImport"
          :active.sync="isExpandedImport"
          :expanded.sync="isExpandedImport"
          icon="file-excel"
        >
          <template #label="props">
            <span class="small">Import Data</span>
            <b-icon
              size="is-small"
              class="is-pulled-right"
              :icon="props.expanded ? 'minus' : 'plus'"
            ></b-icon>
          </template>
          <b-menu-item
            label="Import Products"
            tag="nuxt-link"
            to="/importProducts"
          ></b-menu-item>
          <b-menu-item
            label="Import Party"
            tag="nuxt-link"
            to="/importParty"
          ></b-menu-item>
        </b-menu-item>
        <b-menu-item
          icon="cogs"
          label="Settings"
          tag="nuxt-link"
          to="/accountSettings"
        ></b-menu-item>
        <b-menu-item
          v-if="globalHelper('showSubscription')"
          icon="diamond"
          label="Subscription"
          tag="nuxt-link"
          to="/subscription"
          @click.native="routeSubs"
        ></b-menu-item>
        <b-menu-item
          icon="information"
          label="Learn to Use"
          tag="nuxt-link"
          to="/learnToUse"
        ></b-menu-item>
        <b-menu-item
          @click="trashModal2"
          ref="data"
          icon="face-agent"
          label="Help and Support"
        ></b-menu-item>
      </b-menu-list>
    </b-menu>
  </aside>
</template>

<script>
import { mapState } from "vuex";
import AsideTools from "@/components/AsideTools";
import AsideMenuList from "@/components/AsideMenuList";
import SwitchBusinessModal from "@/components/SwitchBusinessModal";
import MessageModal from "@/components/MessageModal";
import axios from "axios";
export default {
  name: "AsideMenu",
  components: { AsideTools, AsideMenuList, SwitchBusinessModal, MessageModal },
  data() {
    return {
      isModalActive: false,
      isModalActive2: false,
      business_name: "",
      business_name_short: "",
      contact_number: "",
      photo: "",
      isExpandedItem: false,
      isExpandedSale: false,
      isExpandedPurchase: false,
      isExpandedBanks: false,
      isExpandedExpenses: false,
      isExpandedImport: false,
    };
  },
  props: {
    menu: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    ...mapState(["isAsideVisible", "isAsideExpanded", "modalState", "counter"]),
  },
  watch: {
    counter() {
      this.routeIndex();
    },
  },
  async mounted() {
    localStorage.getItem("business");
    let response = await axios.get(
      "/business/businesses/" + localStorage.getItem("business") + "/",
      {
        headers: {
          Authorization: localStorage.getItem("auth._token.local"),
        },
      }
    );
    this.photo = response.data.photo;
    this.business_name = response.data.name;
    this.business_name_short = this.business_name.charAt(0).toUpperCase();
    this.contact_number = response.data.contact_number;
  },
  methods: {
    trashModal() {
      this.isModalActive = true;
    },
    trashModal2() {
      this.isModalActive2 = true;
      this.$refs.data.newActive = false;
    },
    openMessage() {
      this.isModalActive2 = !this.isModalActive2;
    },
    trashConfirmAdd(a) {
      this.isModalActive = false;
      this.$router.push(a);
    },
    trashConfirm(a) {
      this.isModalActive = false;
      this.$router.push(a);
    },
    trashConfirm2() {
      this.isModalActive2 = false;
    },
    trashCancel() {
      this.isModalActive = false;
    },
    trashCancel2() {
      this.isModalActive2 = false;
    },
    menuClick(item) {},
    routeIndex() {
      // this.$router.push("/");
      this.isExpandedItem = false;
      this.isExpandedSale = false;
      this.isExpandedPurchase = false;
      this.isExpandedBanks = false;
      this.isExpandedExpenses = false;
      this.isExpandedImport = false;
    },
    routeParties() {
      // this.$router.push("/parties");
      this.isExpandedItem = false;
      this.isExpandedSale = false;
      this.isExpandedPurchase = false;
      this.isExpandedBanks = false;
      this.isExpandedExpenses = false;
      this.isExpandedImport = false;
    },
    routeItems() {
      this.$router.push("/items");
    },
    routeImport() {
      this.$router.push("/importProducts");
    },
    routeSales() {
      this.$router.push("/sales");
    },
    routePurchase() {
      this.$router.push("/purchaseList");
    },
    routeBanks() {
      this.$router.push("/cashInHand");
    },
    routeExpenses() {
      this.$router.push("/expenses");
    },
    routeReports() {
      localStorage.removeItem("report_title");
      // this.$router.push("/reports");
      this.isExpandedItem = false;
      this.isExpandedSale = false;
      this.isExpandedPurchase = false;
      this.isExpandedBanks = false;
      this.isExpandedExpenses = false;
      this.isExpandedImport = false;
    },
    routeSubs() {
      // this.$router.push("/subscription");
      this.isExpandedItem = false;
      this.isExpandedSale = false;
      this.isExpandedPurchase = false;
      this.isExpandedBanks = false;
      this.isExpandedExpenses = false;
      this.isExpandedImport = false;
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
      localStorage.removeItem("party_details");
      switch (key) {
        case "s":
          this.$router.push("/saleInvoice");
          this.$emit("actionKeyClose");
          this.isModalActive2 = false;
          break;
        case "p":
          this.$router.push("/createPurchaseInvoice");
          this.$emit("actionKeyClose");
          this.isModalActive2 = false;
          break;
        case "i":
          this.$emit("actionKeyClose");
          this.$router.push("/paymentIn");
          localStorage.setItem("openModal", true);
          // this.$store.commit("toggleModal");
          this.isModalActive2 = false;
          break;
        case "o":
          this.$emit("actionKeyClose");
          this.$router.push("/paymentOut");
          localStorage.setItem("openModal", true);
          // this.$store.commit("toggleModal");
          this.isModalActive2 = false;
          break;
        case "c":
          this.$router.push("/createSalesReturn");
          this.isModalActive2 = false;
          break;
        case "d":
          this.$router.push("/createPurchaseReturn");
          this.isModalActive2 = false;
          break;
        // case "q":
        //   this.$router.push("/createEstimate");
        //   this.isModalActive2 = false;
        //   break;
        case "x":
          this.$emit("actionKeyClose");
          this.$router.push("/expenses");
          localStorage.setItem("openModal", true);
          // this.$store.commit("toggleModal");
          this.isModalActive2 = false;
          break;
        case "m":
          this.$router.push("/addItem");
          this.isModalActive2 = false;
          break;
        case "n":
          this.$emit("actionKeyClose");
          this.$router.push("/parties");
          localStorage.setItem("openModal", true);
          // this.$store.commit("toggleModal");
          this.isModalActive2 = false;
          break;
        case "sd":
          this.$router.push("/");
          this.isModalActive2 = false;
          break;
        case "sp":
          this.$router.push("/parties");
          this.isModalActive2 = false;
          break;
        case "si":
          this.$router.push("/items");
          this.$emit("actionKeyClose");
          this.isModalActive2 = false;
          break;
        case "sx":
          this.$router.push("/expenses");
          this.$emit("actionKeyClose");
          this.isModalActive2 = false;
          break;
        case "ss":
          this.$router.push("/accountSettings");
          this.$emit("actionKeyClose");
          this.isModalActive2 = false;
          break;
        case "sr":
          localStorage.removeItem("report_title");
          this.$router.push("/reports");
          this.$emit("actionKeyClose");
          this.isModalActive2 = false;
          break;
        case "sh":
          this.isModalActive2 = !this.isModalActive2;
          this.$store.commit("modalClose");
          this.$emit("actionKeyClose");
          break;
        case "sk":
          this.$emit("actionKey");
          this.$store.commit("modalClose");
          this.isModalActive2 = false;
      }
    },
  },
};
</script>
<style lang="scss">
$green: #34a77f;

.aside-logo {
  background-color: white;
  border-radius: 50%;
  font-size: 23px;
  text-align: center;
  width: 70px;
  height: 70px;
  vertical-align: middle;
  line-height: 3;
  margin-bottom: 0.5rem;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  span {
    color: $green;
    font-weight: 600;
  }
  a:hover {
    color: $green;
  }
}
p.logo-title {
  padding-top: 0.5rem;
}
p.sub-desc {
  font-size: 14px;
}

// .hrl {
//       // height: 1rem;
//       padding: 10px;
// }
.to-manage-business {
  position: relative;
  padding-right: 3rem;
  display: flex;
  justify-content: space-between;
  padding-bottom: 1.2rem;
  &::after {
    content: "";
    width: 100%;
    height: 1px;
    background-color: rgba(250, 250, 250, 0.27059);
    margin-top: 1rem;
    position: absolute;
    bottom: 0;
  }
  .icon {
    position: absolute;
    right: 0;
    top: 1.2rem;
    color: white;
  }
}
.menu-list a {
  color: rgba(255, 255, 255, 0.9);
  width: 14rem;
  margin: auto;
  border-radius: 4px;
  padding: 0.63rem 0;
  .icon {
    &.is-pulled-right {
      font-size: 16px;
      margin-top: 3px;
    }
  }
  span {
    &:last-child {
      font-size: 15px;
    }
    &.small {
      font-size: 15px;
    }
  }
  &:hover {
    background-color: $green;
    color: white !important;
    .icon {
      background-color: $green;
      color: white;
    }
  }
  &.nuxt-link-exact-active {
    background-color: white;
    color: $green;
    .icon {
      color: $green !important;
    }
    &:hover {
      background-color: white;
      color: $green !important;
      .icon {
        background-color: white;
        color: $green !important;
      }
    }
  }
  &.is-active {
    background-color: white;
    color: $green;
    .icon {
      background-color: white;
      color: $green !important;
    }
    &:hover {
      background-color: white;
      color: $green !important;
      .icon {
        background-color: white;
        color: $green;
      }
    }
  }
}
.menu-list li {
  margin: 7px 0;
}
aside.aside .menu-list li ul li a {
  padding: 0.5rem 1rem;
  font-size: 0.95rem;
  width: 11rem;
  &.nuxt-link-active {
    background-color: $green;
    color: white;
    .icon {
      background-color: $green;
      color: white;
    }
    &:hover {
      background-color: $green;
      color: white !important;
      .icon {
        background-color: $green;
        color: white;
      }
    }
  }
  &:hover {
    background-color: $green;
    color: white;
  }
}
</style>