<template>
  <b-modal
    class="party-modal"
    data:posts
    :active.sync="isModalActive"
    has-modal-card
  >
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">ADD NEW PARTY</p>
        <b-button class="close-button" @click="cancel" type="is-light">
          <b-icon icon="close" size="is-small"> </b-icon
        ></b-button>
      </header>
      <section class="modal-card-body">
        <div class="modal-form">
          <div class="party-photo is-flex is-flex-gap-6 is-align-items-center">
            <div class="has-text-centered">
              <div class="upload-transaction-img party-upload">
                <div
                  @click="chooseImage"
                  class="image-input"
                  :style="{
                    'background-image': `url(${imageData}`,
                  }"
                >
                  <span v-if="!imageData" class="placeholder">
                    <b-icon icon="camera-plus" size="is-large"></b-icon>
                  </span>
                  <input
                    class="file-input"
                    ref="fileInput"
                    type="file"
                    accept="image/png, image/jpeg, image/jpg"
                    :key="imageData"
                    @input="onSelectFile"
                  />
                </div>
              </div>
              <span class="label" style="margin-top: 0.5rem"
                >Add Party Image</span
              >
            </div>
            <div class="w-100">
              <div class="columns is-multiline">
                <div class="column is-12">
                  <b-field label="Name" expanded>
                    <b-input
                      v-model="party.name"
                      placeholder="Enter Party Name"
                      type="text"
                    ></b-input>
                  </b-field>
                  <div v-if="$v.party.name.$error" class="form-error">
                    <span class="help is-danger">Party Name is Required</span>
                  </div>
                </div>
                <div class="column is-6">
                  <b-field label="Party Phone Number" expanded>
                    <b-input
                      placeholder="Enter Party Phone No"
                      type="text"
                      maxlength="16"
                      @keypress.native="isNumber($event)"
                      v-model="party.phone_number"
                    ></b-input>
                  </b-field>
                  <div v-if="$v.party.phone_number.$error" class="form-error">
                    <span class="help is-danger">Enter valid phone number</span>
                  </div>
                </div>
                <div class="column is-6">
                  <b-field label="Party Type" expanded>
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
          </div>
        </div>
        <div class="modal-form">
          <div class="columns">
            <div class="column is-4">
              <span class="received-label">Opening Balance</span>
              <b-field>
                <p class="control left-input">Rs.</p>
                <b-input
                  class="amount-input-left"
                  expanded
                  type="number"
                  @input.native="restrictInput($event)"
                  oninput="validity.valid||(value='');"
                  min="0"
                  step="any"
                  v-model="party.opening_balance"
                ></b-input>
                <b-dropdown
                  :scrollable="isScrollable"
                  :max-height="maxHeight"
                  v-model="currentMenu"
                  aria-role="list"
                >
                  <template #trigger>
                    <b-button
                      class="left-adjust"
                      :label="currentMenu.text"
                      type="is-light"
                      icon-right="menu-down"
                    />
                  </template>

                  <b-dropdown-item
                    v-for="(Unit, index) in menus"
                    :key="index"
                    :value="Unit"
                    aria-role="listitem"
                  >
                    <div class="media">
                      <div class="media-content">
                        <h3>{{ Unit.text }}</h3>
                      </div>
                    </div>
                  </b-dropdown-item>
                </b-dropdown>
              </b-field>
            </div>
            <div class="column is-4">
              <b-field label="Opening Date">
                <v-nepalidatepicker
                  v-model="date"
                  placeholder="Select a date"
                  classValue="date_picker"
                />
              </b-field>
            </div>
          </div>
        </div>
        <div class="modal-form">
          <div class="columns">
            <div class="column is-4">
              <b-field label="Address" expanded>
                <b-input
                  v-model="party.address"
                  placeholder="Enter Address"
                  type="text"
                ></b-input>
              </b-field>
            </div>
            <div class="column is-4">
              <b-field label="Email" expanded>
                <b-input
                  placeholder="Enter Email Address"
                  type="email"
                  v-model="party.email"
                ></b-input>
              </b-field>
            </div>
            <div class="column is-4">
              <span class="received-label">PAN Number</span>
              <b-field>
                <b-input
                  v-model="party.pan_vat_number"
                  expanded
                  placeholder="Enter Pan Number"
                  @keypress.native="isNumberPan($event)"
                  maxlength="9"
                  type="text"
                ></b-input>
                <!-- <b-dropdown
                  class="pan-dropdown"
                  :scrollable="isScrollable"
                  :max-height="maxHeight"
                  v-model="currentVat"
                  aria-role="list"
                >
                  <template #trigger>
                    <b-button
                      class="left-adjust"
                      :label="currentVat.text"
                      type="is-light"
                      icon-right="menu-down"
                    />
                  </template>

                  <b-dropdown-item
                    v-for="(Unit, index) in vats"
                    :key="index"
                    :value="Unit"
                    aria-role="listitem"
                  >
                    <div class="media">
                      <div class="media-content">
                        <h3>{{ Unit.text }}</h3>
                      </div>
                    </div>
                  </b-dropdown-item>
                </b-dropdown> -->
              </b-field>
              <div v-if="$v.party.pan_vat_number.$error" class="form-error">
                <span class="help is-danger">Enter valid PAN number</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      {{ openingDate }}
      <footer class="modal-card-foot">
        <div class="buttons">
          <b-button v-if="showAdd" @click="confirmAdd" type="is-light"
            >SAVE &amp; ADD NEW
          </b-button>
          <b-button @click="confirm" type="is-primary">SAVE</b-button>
        </div>
      </footer>
    </div>
  </b-modal>
</template>

<script>
import axios from "axios";
import NepaliDate from "nepali-date-converter";
import VNepaliDatePicker from "v-nepalidatepicker";
import { required, minLength } from "vuelidate/lib/validators";
export default {
  name: "ModalBox",
  components: {
    VNepaliDatePicker,
  },
  props: {
    isActive: {
      type: Boolean,
      default: false,
    },
    showAdd: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      party: {
        name: "",
        phone_number: "",
        opening_balance: null,
        address: "",
        email: "",
        pan_vat_number: "",
        user: this.$auth.user.id,
        opening_date: new Date(),
        image: "",
      },
      imageData: "",
      date: "",
      isScrollable: false,
      maxHeight: 200,
      currentMenu: { text: "To Pay" },
      menus: [{ text: "To Pay" }, { text: "To Receive" }],
      menusCopy: [{ text: "To Pay" }, { text: "To Receive" }],
      currentType: {},
      types: [],
      typesCopy: [],
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
    party: {
      name: {
        required,
      },
      phone_number: {
        minLength: minLength(9),
      },
      pan_vat_number: {
        minLength: minLength(9),
      },
    },
  },
  watch: {
    isActive(newValue) {
      this.isModalActive = newValue;
      this.$v.party.$reset();
    },
    isModalActive(newValue) {
      if (!newValue) {
        this.cancel();
      }
    },
  },
  mounted() {
    let role = localStorage.getItem("role");
    if (role == "inventory-manager") {
      this.currentType.text = "Supplier";
      this.currentType.value = "supplier";
      this.types.push({
        text: "Supplier",
        value: "supplier",
      });
      this.typesCopy.push({
        text: "Supplier",
        value: "supplier",
      });
    } else if (role == "sales-person") {
      this.currentType.text = "Customer";
      this.currentType.value = "customer";
      this.types.push({
        text: "Customer",
        value: "customer",
      });
      this.typesCopy.push({
        text: "Customer",
        value: "customer",
      });
    } else {
      this.currentType.text = "Customer";
      this.currentType.value = "customer";
      this.types.push(
        {
          text: "Customer",
          value: "customer",
        },
        {
          text: "Supplier",
          value: "supplier",
        }
      );
      this.typesCopy.push(
        {
          text: "Customer",
          value: "customer",
        },
        {
          text: "Supplier",
          value: "supplier",
        }
      );
    }
  },
  computed: {
    openingDate() {
      if (this.date) {
        let nepDate = new NepaliDate(this.date);
        let engDate = nepDate.toJsDate();
        this.party.opening_date = engDate;
      } else {
        this.party.opening_date = new Date();
      }
    },
  },
  methods: {
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
        this.party.opening_balance = event.target.value;
      } else if (value.length > 8) {
        event.target.value = value.slice(0, 8);
        this.party.opening_balance = event.target.value;
      }
    },
    isNumber(event) {
      const inputValue = event.target.value;
      const keyCode = event.keyCode || event.which;
      const char = String.fromCharCode(keyCode);
      if (keyCode === 43 && inputValue.length === 0) {
        return true;
      } else if (/^[\d\s-]$/.test(char)) {
        if (char === " " && inputValue.length === 0) {
          event.preventDefault(); // Prevent space at the beginning
        } else {
          return true; // Allow numbers
        }
      } else {
        event.preventDefault(); // Prevent any other characters
      }
    },
    isNumberPan(event) {
      const charCode = event.which ? event.which : event.keyCode;

      // Allow only numbers (0-9)
      if (charCode < 48 || charCode > 57) {
        event.preventDefault();
      }
    },
    async confirmAdd() {
      const loadingComponent = this.$buefy.loading.open();
      if (!this.$v.$invalid) {
        try {
          let party = this.party;
          this.party.image = this.imageData;
          party.name = this.party.name.trim();
          party.business = localStorage.getItem("business");
          party.is_vat = this.currentVat.text == "VAT" ? true : false;
          party.type = this.currentType.value;
          party.opening_balance =
            this.currentMenu.text == "To Pay"
              ? -Math.abs(party.opening_balance)
              : Math.abs(party.opening_balance);
          const response = await axios.post("/parties/parties/", party, {
            headers: {
              Authorization: localStorage.getItem("auth._token.local"),
            },
          });
          this.$emit("confirmAdd", response.data);
          this.party.name = "";
          this.party.phone_number = null;
          this.party.opening_balance = null;
          this.party.address = null;
          this.party.email = null;
          this.party.pan_vat_number = "";
          this.currentMenu.text = "To Pay";
          this.currentType.text = "Customer";
          this.currentType.value = "customer";
          this.currentVat.text = "PAN";
          this.imageData = "";
          this.party.opening_date = new Date();
          this.resetMode();
        } catch (err) {
          this.$buefy.snackbar.open({
            message: err.response.data.detail,
            type: "is-primary",
            position: "is-bottom",
            indefinite: false,
          });
        }
      } else {
        this.$v.party.$touch();
      }
      loadingComponent.close();
    },
    async confirm() {
      const loadingComponent = this.$buefy.loading.open();
      if (!this.$v.$invalid) {
        try {
          let party = this.party;
          this.party.image = this.imageData;
          party.name = this.party.name.trim();
          party.business = localStorage.getItem("business");
          party.is_vat = this.currentVat.text == "VAT" ? true : false;
          party.type = this.currentType.value;
          party.opening_balance =
            this.currentMenu.text === "To Pay"
              ? -Math.abs(party.opening_balance)
              : Math.abs(party.opening_balance);
          const response = await axios.post("/parties/parties/", party, {
            headers: {
              Authorization: localStorage.getItem("auth._token.local"),
            },
          });
          this.$emit("confirm", response.data);
          this.party.name = "";
          this.party.phone_number = null;
          this.party.opening_balance = null;
          this.party.address = null;
          this.party.email = null;
          this.party.pan_vat_number = "";
          this.currentMenu.text = "To Pay";
          this.currentType.text = "Customer";
          this.currentType.value = "customer";
          this.currentVat.text = "PAN";
          this.imageData = "";
          this.party.opening_date = new Date();

          this.resetMode();
        } catch (err) {
          this.$buefy.snackbar.open({
            message: err.response.data.detail,
            type: "is-primary",
            position: "is-bottom",
            indefinite: false,
          });
        }
      } else {
        this.$v.party.$touch();
      }
      loadingComponent.close();
    },
    resetMode() {
      let menus = [];
      this.menusCopy.forEach((element) => {
        menus.push({
          text: element.text,
          value: element.value,
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
      let vats = [];
      this.vatsCopy.forEach((element) => {
        vats.push({
          text: element.text,
        });
      });
      this.vats = vats;
    },
    chooseImage() {
      this.$refs.fileInput.click();
    },
    async onSelectFile() {
      const input = this.$refs.fileInput;
      const files = input.files;
      this.file = files[0];
      const loadingComponent = this.$buefy.loading.open();
      if (files && files[0]) {
        try {
          let formData = new FormData();
          formData.append("type", "party");
          formData.append("image", this.file);
          formData.append("business", localStorage.getItem("business"));
          formData.append("user", this.$auth.user.id);
          const response = await axios.post("/transactions/image/", formData, {
            headers: {
              Authorization: localStorage.getItem("auth._token.local"),
            },
          });
          this.imageData = response.data.image;
        } catch (error) {}
      }
      loadingComponent.close();
    },
  },
};
</script>
<style lang="scss">
$green: #34a77f;
.party-modal {
  .close-button {
    border: none !important;
    .icon {
      font-size: 20px !important;
    }
  }
  a.dropdown-item {
    font-size: 16px;
  }
  .control.has-icons-left .icon,
  .control.has-icons-right .icon {
    color: #34a77f;
    top: 3px;
  }
  .datepicker {
    .dropdown-menu {
      position: fixed;
      width: 21rem;
      margin: 10% auto; /* Will not center vertically and won't work in IE6/7. */
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
    }
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
    min-width: 60vw;
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
  .upload-transaction-img.party-upload .image-input {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 8.5rem;
    height: 8.5rem;
  }
  .received-label {
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
@media screen and (max-width: 1024px) {
  .party-modal .modal-card {
    width: 80vw;
  }
}
@media screen and (max-width: 768px) {
  .party-modal {
    .party-photo {
      flex-wrap: wrap;
    }
  }
}
</style>
