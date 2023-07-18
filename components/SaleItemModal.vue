<template>
  <b-modal
    class="sale-item-modal"
    data:posts
    :active.sync="isModalActive"
    has-modal-card
  >
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">ADD NEW ITEM</p>
        <b-button class="close-button" @click="cancel" type="is-light">
          <b-icon icon="close" size="is-small"> </b-icon
        ></b-button>
      </header>
      <section class="modal-card-body">
        <div class="modal-form">
          <div class="columns">
            <div class="column is-4">
              <b-field label="Name" expanded>
                <b-input
                  v-model="items.name"
                  placeholder="Enter Item Name"
                  type="text"
                ></b-input>
              </b-field>
              <div v-if="$v.items.name.$error" class="form-error">
                <span class="help is-danger">Item Name is Required</span>
              </div>
            </div>
            <div class="column is-4">
              <b-field label="Item Category" expanded>
                <b-dropdown
                  expanded
                  :scrollable="isScrollable"
                  :max-height="maxHeight"
                  v-model="currentMenu"
                  aria-role="list"
                >
                  <template #trigger>
                    <b-button
                      expanded
                      :label="currentMenu.text"
                      icon-right="menu-down"
                    />
                  </template>

                  <b-dropdown-item
                    v-for="(menu, index) in menus"
                    :key="index"
                    :value="menu"
                    aria-role="listitem"
                    @click="chooseCategory(menu.value)"
                  >
                    <div class="media">
                      <div class="media-content">
                        <h3>{{ menu.text }}</h3>
                      </div>
                    </div>
                  </b-dropdown-item>
                </b-dropdown>
              </b-field>
            </div>
            <div class="column is-4">
              <b-field label="Item Type" expanded>
                <b-dropdown
                  expanded
                  :scrollable="isScrollable"
                  :max-height="maxHeight"
                  v-model="currentType"
                  aria-role="list"
                >
                  <template #trigger>
                    <b-button
                      expanded
                      :label="currentType.text"
                      icon-right="menu-down"
                    />
                  </template>

                  <b-dropdown-item
                    v-for="(menu, index) in types"
                    :key="index"
                    :value="menu"
                    aria-role="listitem"
                  >
                    <div class="media">
                      <div class="media-content">
                        <h3>{{ menu.text }}</h3>
                      </div>
                    </div>
                  </b-dropdown-item>
                </b-dropdown>
              </b-field>
            </div>
          </div>
        </div>
        <div class="modal-form">
          <div class="columns">
            <div class="column is-4">
              <span class="received-label-modal">Sales Price</span>
              <b-field expanded>
                <p class="control left-input">Rs.</p>
                <b-input
                  v-model="items.sale_price"
                  expanded
                  type="number"
                  @input.native="restrictInput($event)"
                  oninput="validity.valid||(value='');"
                  min="0"
                  step="any"
                  class="amount-input-left attached"
                ></b-input>
              </b-field>
            </div>
            <div class="column is-4">
              <span class="received-label-modal">Purchase Price</span>
              <b-field expanded>
                <p class="control left-input">Rs.</p>
                <b-input
                  v-model="items.purchase_price"
                  expanded
                  type="number"
                  class="amount-input-left attached"
                  @input.native="restrictInput2($event)"
                  oninput="validity.valid||(value='');"
                  min="0"
                  step="any"
                ></b-input>
              </b-field>
            </div>
            <div class="column is-4">
              <b-field label="Remarks" expanded>
                <b-input
                  v-model="items.remarks"
                  expanded
                  type="text"
                  placeholder="Enter Remarks"
                ></b-input>
              </b-field>
            </div>
          </div>
        </div>
      </section>
      <footer class="modal-card-foot">
        <div class="buttons">
          <b-button @click="cancel" type="is-light">CANCEL</b-button>
          <b-button @click="confirm" type="is-primary">SAVE</b-button>
        </div>
      </footer>
    </div>
  </b-modal>
</template>

<script>
import axios from "axios";
import { required } from "vuelidate/lib/validators";
export default {
  name: "ModalBox",
  props: {
    isActive: {
      type: Boolean,
      default: false,
    },
    nameItem: {
      type: String,
    },
    type: {
      type: String,
    },
  },
  data() {
    return {
      items: {
        name: "",
        category: "",
        sale_price: "",
        purchase_price: "",
        remarks: "",
        user: this.$auth.user.id,
      },
      isScrollable: true,
      maxHeight: 140,
      currentMenu: { text: "Select Item Category" },
      menus: [],
      currentType: { text: "Product", value: "product" },
      types: [
        { text: "Product", value: "product" },
        { text: "Service", value: "service" },
      ],
      typesCopy: [
        { text: "Product", value: "product" },
        { text: "Service", value: "service" },
      ],
      currentVat: { text: "PAN" },
      vats: [{ text: "PAN" }, { text: "VAT" }],
      vatsCopy: [{ text: "PAN" }, { text: "VAT" }],
      isModalActive: false,
      selected: new Date(),
      showWeekNumber: false,
      locale: undefined, // Browser locale
    };
  },
  validations: {
    items: {
      name: {
        required,
      },
    },
  },
  watch: {
    isActive(newValue) {
      this.isModalActive = newValue;
    },
    isModalActive(newValue) {
      if (!newValue) {
        this.cancel();
      }
    },
    nameItem(name) {
      this.items.name = name;
    },
  },
  async mounted() {
    let list = [];
    let response1 = await axios.get(
      "/inventory/categories/?business=" +
        localStorage.getItem("business") +
        "&user=" +
        this.$auth.user.id,
      {
        headers: {
          Authorization: localStorage.getItem("auth._token.local"),
        },
      }
    );
    response1.data.forEach((element) => {
      list.push({
        text: element.name,
        value: element.id,
      });
    });
    this.menus = list;
  },
  methods: {
    chooseCategory(value) {
      this.items.category = value;
    },
    cancel() {
      this.$emit("cancel");
    },
    restrictInput(event) {
      let value = event.target.value;
      if (value.includes(".")) {
        const [integerPart, decimalPart] = value.split(".");
        event.target.value = `${integerPart.slice(0, 8)}.${decimalPart.slice(
          0,
          2
        )}`;
        this.items.sale_price = event.target.value;
      } else if (value.length > 8) {
        event.target.value = value.slice(0, 8);
        this.items.sale_price = event.target.value;
      }
    },
    restrictInput2(event) {
      let value = event.target.value;
      if (value.includes(".")) {
        const [integerPart, decimalPart] = value.split(".");
        event.target.value = `${integerPart.slice(0, 8)}.${decimalPart.slice(
          0,
          2
        )}`;
        this.items.purchase_price = event.target.value;
      } else if (value.length > 8) {
        event.target.value = value.slice(0, 8);
        this.items.purchase_price = event.target.value;
      }
    },
    async confirm() {
      const loadingComponent = this.$buefy.loading.open();
      if (!this.$v.$invalid) {
        if (this.currentMenu.text === "Select Item Category") {
          this.$buefy.snackbar.open({
            message: "Please Select Item Category",
            type: "is-danger",
            position: "is-bottom",
            indefinite: false,
          });
        } else {
          try {
            let posts = this.items;
            posts.sale_price = this.items.sale_price
              ? this.items.sale_price
              : 0;
            posts.purchase_price = this.items.purchase_price
              ? this.items.purchase_price
              : 0;
            posts.business = localStorage.getItem("business");
            posts.type = this.currentType.value;
            const response = await axios.post(
              "/inventory/items/?business=" + localStorage.getItem("business"),
              posts,
              {
                headers: {
                  Authorization: localStorage.getItem("auth._token.local"),
                },
              }
            );
            this.$emit("confirm");
            this.items.name = "";
            this.sale_price = "";
            this.purchase_price = "";
            this.remarks = "";
            this.currentMenu = {
              text: "Select Item Category",
              value: "",
            };
            this.resetMode();
          } catch (err) {
            this.$buefy.snackbar.open({
              message: err.response.data.detail,
              type: "is-primary",
              position: "is-bottom",
              indefinite: false,
            });
          }
        }
      } else {
        this.$v.items.$touch();
      }
      loadingComponent.close();
    },
    async resetMode() {
      let menus = [];
      let response1 = await axios.get(
        "/inventory/categories/?business=" +
          localStorage.getItem("business") +
          "&user=" +
          this.$auth.user.id,
        {
          headers: {
            Authorization: localStorage.getItem("auth._token.local"),
          },
        }
      );
      response1.data.forEach((element) => {
        menus.push({
          text: element.name,
          value: element.id,
        });
      });
      this.menus = menus;
      let types = [];
      this.typesCopy.forEach((element) => {
        types.push({
          text: element.text,
          value: element.value,
        });
      });
      this.types = types;
    },
  },
};
</script>
<style lang="scss">
$green: #34a77f;
.sale-item-modal {
  .close-button {
    border: none !important;
    .icon {
      font-size: 20px !important;
    }
  }
  a.dropdown-item {
    font-size: 16px;
  }
  .modal-form {
    border-bottom: 1px solid #dbdbdb;
    padding-bottom: 1.5rem;
    padding-top: 1.5rem;
    padding-left: 20px;
    padding-right: 20px;
    &:first-child {
      padding-top: 0;
    }
    &:last-child {
      border-bottom: 0;
    }
  }
  .modal-card {
    width: 60vw;
    .modal-card-head,
    .modal-card-foot {
      padding: 10px 20px;
    }
    .modal-card-head {
      background-color: white;
      border-color: #dbdbdb;
      .modal-card-title {
        color: #1d262d;
        font-weight: 600;
      }
    }
    .modal-card-body {
      padding-top: 1.5rem;
      padding-bottom: 0;
      padding-left: 0;
      padding-right: 0;
    }
    .modal-card-foot {
      display: flex;
      justify-content: flex-end;
      background-color: white;
      padding-bottom: 1.5rem;
      padding-top: 1.5rem;
      border-top: 1px solid #dbdbdb;
      .buttons {
        .button {
          width: 12rem;
          border: none;
          display: block;
          height: 2.8em;
          &.is-primary {
            background-color: $green;
            color: white;
            &:focus {
              box-shadow: none;
              border: none;
            }
          }
          &.is-light {
            border: 1px solid $green;
            color: $green;
            &:focus {
              box-shadow: none;
            }
          }
        }
      }
    }
  }
  .input {
    height: 2.5em;
    border-color: #dedede;
    &:hover {
      border-color: #dedede;
    }
    &:focus {
      border-color: #dedede;
    }
  }
  .received-label-modal {
    color: #363636;
    font-size: 1rem;
    font-weight: 500;
    display: block;
    margin-bottom: 0.5rem;
  }
  .mid-equals {
    display: flex;
    align-items: center;
    padding: 0 10px;
  }
  ::-webkit-input-placeholder {
    color: #676767;
    font-size: 15px;
  }
  .amount-input-left {
    input {
      border-left: 0;
      text-align: right;
    }
  }
  .amount-input-right {
    input {
      border-right: 0;
      text-align: right;
    }
  }
  p.control {
    &.left-input {
      border: 1px solid #dbdbdb;
      border-radius: 4px 0 0 4px;
      height: 2.5em;
      padding: 8px 0px 8px 10px;
      border-right: 0;
    }
    &.right-input {
      border: 1px solid #dbdbdb;
      border-radius: 0 4px 4px 0;
      height: 2.5em;
      padding: 8px 10px 8px 0;
      border-left: 0;
    }
  }
  .pan-dropdown {
    .dropdown-menu {
      left: -7rem;
      top: -6rem;
    }
  }
  .button {
    height: 2.5em;
    box-shadow: none;
    background-color: white;
    border: 1px solid #dedede;
    display: flex;
    justify-content: space-between;
    &.left-adjust {
      border-radius: 0 4px 4px 0;
    }

    &:focus {
      box-shadow: none;
      border: 1px solid #dedede;
    }
    &:hover {
      background-color: white;
      border: 1px solid #dedede;
    }
  }
  .label {
    font-weight: 500;
  }
}
</style>
