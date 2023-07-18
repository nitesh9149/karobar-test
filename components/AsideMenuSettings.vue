<template>
  <aside
    v-show="isAsideVisible"
    class="aside is-placed-left is-expanded settings-aside"
  >
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
    <aside-tools class="setting-tools" :is-main-menu="true">
      <span slot="label">
        <div
          v-if="photo"
          class="aside-logo"
          :style="{ 'background-image': `url(${photo})` }"
        ></div>
        <div v-else class="aside-logo">
          <span>{{ business_name_short }}</span>
        </div>
        <div class="to-manage-business-settings">
          <div>
            <p class="logo-title">{{ business_name }}</p>
            <p class="sub-desc">{{ contact_number }}</p>
          </div>
          <!-- <b-icon size="default" icon="chevron-right"></b-icon> -->
        </div>
      </span>
    </aside-tools>
    <b-menu class="settings-menu">
      <b-menu-list>
        <b-menu-item
          icon="account-outline"
          tag="nuxt-link"
          to="/accountSettings"
          label="Account Settings"
        >
        </b-menu-item>
        <b-menu-item
        v-if="globalHelper('businessSettings')"
          icon="briefcase-outline"
          tag="nuxt-link"
          to="/businessSettings"
          label="Business Settings"
        >
        </b-menu-item>
        <b-menu-item
        v-if="globalHelper('invoiceSettings')"
          icon="file-document-outline"
          label="Invoice Settings"
          tag="nuxt-link"
          to="/invoicesettings"
        >
        </b-menu-item>
        <b-menu-item
        v-if="globalHelper('viewAllStaff')"
          label="Staff Settings"
          icon="account-multiple-outline"
          tag="nuxt-link"
          to="/staffSettings"
        ></b-menu-item>
      </b-menu-list>
    </b-menu>
    <div class="hr"></div>
    <div class="aside-button">
      <nuxt-link to="/">
        <b-button class="button go-to" icon-left="chevron-left"
          >Go to Dashboard</b-button
        >
      </nuxt-link>
    </div>
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
      isActive: false,
      isModalActive2: false,
      business_name: "",
      business_name_short: "",
      contact_number: "",
      photo: "",
    };
  },
  props: {
    menu: {
      type: Array,
      default: () => [],
    },
    active: {
      type: Boolean,
    },
  },
  computed: {
    ...mapState(["isAsideVisible", "isAsideExpanded","modalState"]),
  },
  async created() {
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
    this.business_name_short = this.business_name
      .charAt(0).toUpperCase();
    this.contact_number = response.data.contact_number;
  },
  methods: {
    trashModal() {
      this.isModalActive = true;
    },
    trashModal2() {
      this.isModalActive2 = true;
    },
    trashConfirm2() {
      this.isModalActive2 = false;
    },
    trashCancel2() {
      this.isModalActive2 = false;
    },
    trashConfirmAdd(a) {
      this.isModalActive = false;
      this.$router.push(a);
    },
    trashConfirm(a) {
      this.isModalActive = false;
      this.$router.push(a);
    },
    trashCancel() {
      this.isModalActive = false;
    },
    menuClick(item) {
    },
    theAction(key) {
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
          this.$store.commit("toggleModal")
          this.isModalActive2 = false;
          break;
        case "o":
          this.$emit("actionKeyClose");
          this.$router.push("/paymentOut");
          localStorage.setItem("openModal", true);
          this.$store.commit("toggleModal")
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
          this.$store.commit("toggleModal")
          this.isModalActive2 = false;
          break;
        case "m":
          this.$router.push("/addItem");
          localStorage.setItem("openModal", true);
          this.isModalActive2 = false;
          break;
        case "n":
          this.$emit("actionKeyClose");
          this.$router.push("/parties");
          localStorage.setItem("openModal", true);
          this.$store.commit("toggleModal")
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
          this.isModalActive2 = false;
          break;
        case "sx":
          this.$router.push("/expenses");
          this.isModalActive2 = false;
          break;
        case "ss":
          this.$router.push("/accountSettings");
          this.isModalActive2 = false;
          break;
        case "sr":
          this.$router.push("/reports");
          this.isModalActive2 = false;
          break;
        case "sh":
          this.isModalActive2 = !this.isModalActive2;
          this.$store.commit("modalClose")
          this.$emit("actionKeyClose");
          break;
        case "sk":
          this.$emit("actionKey");
          this.$store.commit("modalClose")
          this.isModalActive2 = false;
      }
    },
  },
};
</script>
<style lang="scss">
$green: #34a77f;
.settings-aside {
  background-color: white !important;
  padding: 0 !important;
  overflow-y: hidden !important;
  .to-manage-business-settings {
    position: relative;
    padding-right: 3rem;
    display: flex;
    justify-content: space-between;
    padding-bottom: 1.2rem;
    .icon {
      position: absolute;
      right: 0;
      top: 1.2rem;
      color: white;
    }
  }
  .hr {
    width: 100%;
    height: 1px;
    background-color: #dbdbdb;
  }
  .aside-button {
    display: flex;
    justify-content: center;
    margin-top: 1.5rem;
    .button {
      width: 13rem;
      border: none;
      box-shadow: none;
      height: 2.5em;
      &.go-to {
        background-color: $green;

        color: white;
      }
    }
  }
}
.aside-tools.setting-tools {
  margin-top: 0 !important;
  padding-top: 1.5rem !important;
}
.settings-menu {
  margin-top: 0.5rem !important;
  padding-bottom: 0.5rem;
  .active {
    background-color: white;
    color: $green;
  }
  .menu-list a {
    color: #6a707e;
    width: 14rem;
    margin: auto;
    border-radius: 4px;
    padding: 0.75rem 0;
    // &.nuxt-link-active{
    //   background-color: white;
    //   color: $green;
    // }
  }
  .menu-list li {
    margin: 7px 0;
    a {
      .icon {
        color: #aaaaaa !important;
        font-size: 18px;
      }
    }
  }

  .menu-list li a.nuxt-link-active {
    background-color: #d8f1e8;
    color: $green;
    .icon {
      color: $green !important;
    }
    &:hover {
      background-color: #d8f1e8;
      color: $green;
      .icon {
        background-color: #d8f1e8;
        color: $green;
      }
    }
  }
  .menu-list a:hover {
    background-color: #d8f1e8;
    color: $green !important;
    box-shadow: none;
    .icon {
      background-color: #d8f1e8;
      color: $green !important;
    }
  }
}
// aside.aside .menu-list li ul li a {
//   padding: 0.5rem 1rem;
//   font-size: 0.95rem;
//   width: 11rem;
//   &:hover {
//     background-color: #d8f1e8;
//     color: $green;
//     .icon {
//       color: $green !important;
//     }
//   }
// }
</style>