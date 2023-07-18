<template>
  <b-modal
    class="payment-in-modal-edit"
    data:posts
    :active.sync="isModalActive"
    has-modal-card
  >
    {{ inputDate }}{{ pushImages }}
    <span style="display: none">{{ partyChoose }}</span>
    <div class="modal-card">
      <header class="modal-card-head">
        <p v-if="globalHelper('editPurchase')" class="modal-card-title">
          EDIT PAYMENT OUT
        </p>
        <p v-else class="modal-card-title">PAYMENT OUT</p>
        <b-button class="close-button" @click="cancel" type="is-light">
          <b-icon icon="close" size="is-small"> </b-icon
        ></b-button>
      </header>
      <section class="modal-card-body">
        <div class="modal-form">
          <div class="columns">
            <div style="position: relative" class="column is-4">
              <span
                :class="[selected.amount_value > 0 ? 'text-green' : 'text-red']"
                v-if="partyChoose"
                >{{ partyChoose.amount_value }}</span
              >
              <b-field label="Party Name" expanded>
                <b-autocomplete
                  v-model="name"
                  ref="autocomplete"
                  @typing="searchParty($event)"
                  autocomplete="off"
                  :max-height="maxHeight"
                  dropdown-position="bottom"
                  :data="parties"
                  :open-on-focus="true"
                  field="party_value"
                  placeholder="Enter Party Name"
                  icon-right="chevron-down"
                  @select="(option) => (selected = option)"
                >
                  <template slot-scope="props">
                    <div>
                      {{ props.option.party_value }}
                    </div>
                  </template>
                  <template #empty>No results for {{ name }}</template>
                </b-autocomplete>
              </b-field>
            </div>
            <div class="column is-4">
              <b-field label="Payment Number" expanded>
                <b-input
                  v-model="payments.number"
                  expanded
                  placeholder="Enter Payment Number"
                  type="text"
                ></b-input>
              </b-field>
            </div>
            <div class="column is-4">
              <b-field label="Date">
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
              <span class="received-label">Paid Amount</span>
              <b-field>
                <b-dropdown
                  class="amount-dropdown"
                  :scrollable="isScrollable"
                  :max-height="maxHeight"
                  v-model="currentMenu"
                  aria-role="list"
                >
                  <template #trigger>
                    <b-button
                      class="right-adjust"
                      :label="currentMenu.text"
                      type="is-light"
                      icon-right="menu-down"
                    />
                  </template>

                  <b-dropdown-item
                    v-for="(menu, index) in menus"
                    :key="index"
                    :value="menu"
                    aria-role="listitem"
                    @click="chooseMode(menu.value)"
                  >
                    <div class="media">
                      <div class="media-content">
                        <h3>{{ menu.text }}</h3>
                      </div>
                    </div>
                  </b-dropdown-item>
                </b-dropdown>
                <p class="control mid-input">Rs.</p>
                <b-input
                  class="amount-input-left"
                  expanded
                  type="number"
                  v-model="payments.amount"
                  @input.native="restrictInput($event)"
                  oninput="validity.valid||(value='');"
                  min="0"
                  step="any"
                ></b-input>
              </b-field>
              <div v-if="$v.payments.amount.$error" class="form-error">
                <span class="help is-danger">Amount is Required</span>
              </div>
            </div>
            <div class="column is-4">
              <b-field label="Note" expanded>
                <b-input
                  placeholder="Enter Note or Remarks"
                  type="text"
                  v-model="payments.note"
                ></b-input>
              </b-field>
            </div>
          </div>
        </div>
        <div class="modal-form">
          <span class="label">Attach Images</span>
          <div class="upload-transaction-img">
            <div
              v-if="invoice_images.length < 3"
              class="image-input"
              @click="chooseImage"
            >
              <span class="placeholder">
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
            <div
              v-for="(image, index) in invoice_images"
              :key="index"
              class="image-output"
            >
              <a :href="image" target="_blank"
                ><img :src="image" alt="image"
              /></a>
              <span @click="removeImage(index)"
                ><b-icon icon="close" size="is-small"></b-icon
              ></span>
            </div>
          </div>
        </div>
      </section>
      <footer
        v-if="globalHelper('deletePurchase') || globalHelper('editPurchase')"
        class="modal-card-foot"
      >
        <b-button
          v-if="globalHelper('deletePurchase')"
          @click="deleteConfirm"
          type="is-danger-outline"
          >DELETE
        </b-button>
        <div v-else></div>
        <b-button
          v-if="globalHelper('editPurchase')"
          @click="confirm"
          type="is-primary"
          >SAVE</b-button
        >
      </footer>
      <footer v-else class="modal-card-foot footer-empty"></footer>
    </div>
  </b-modal>
</template>

<script>
import axios from "axios";
import NepaliDate from "nepali-date-converter";
import VNepaliDatePicker from "v-nepalidatepicker";
import { required } from "vuelidate/lib/validators";
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
    payments: {
      type: Object,
    },
  },
  data() {
    return {
      isScrollable: true,
      maxHeight: 140,
      currentMenu: { text: "Cash" },
      menus: [
        { text: "Cash", value: "cash" },
        { text: "Cheque", value: "cheque" },
        { text: "Online", value: "online" },
      ],
      menusCopy: [
        { text: "Cash", value: "cash" },
        { text: "Cheque", value: "cheque" },
        { text: "Online", value: "online" },
      ],
      date: "",
      name: "",
      currentParty: { party_value: "Search a Party" },
      parties: [],
      selectedParty: null,
      isModalActive: false,
      selected: null,
      showWeekNumber: false,
      locale: undefined, // Browser locale
      imageData: "",
      invoice_images: [],
      deleteImage: false,
      isModalActiveDownload: false,
      downloadImage: "",
      next: "",
    };
  },
  validations: {
    payments: {
      amount: {
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
    payments(payment) {
      this.date = payment.nep_date_string;
      this.selected = payment;
      this.selectedParty = payment.party;
      this.payments.number = payment.number == "-" ? null : payment.number;
      this.name = payment.party_value;
      this.currentMenu.text = payment.payment_mode_value;
      this.deleteImage = true;
      this.invoice_images = [];
      if (payment.image_url_1) {
        this.invoice_images[0] = payment.image_url_1;
      }
      if (payment.image_url_2) {
        this.invoice_images[1] = payment.image_url_2;
      }
      if (payment.image_url_3) {
        this.invoice_images[2] = payment.image_url_3;
      }
      this.partiesCall();
    },
  },
  computed: {
    inputDate() {
      if (this.date) {
        let nepDate = new NepaliDate(this.date);
        let engDate = nepDate.toJsDate();
        this.payments.date = engDate;
      }
    },
    partyChoose() {
      if (this.selected != null) {
        if (this.name != this.selected.party_value) {
          this.selectedParty = null;
        } else {
          this.selectedParty = this.selected.party;
        }
      } else {
        this.selectedParty = null;
      }
      return this.selected;
    },
    pushImages() {
      if (this.imageData && !this.deleteImage) {
        this.invoice_images.push(this.imageData);
      }
    },
  },
  methods: {
    chooseMode(value) {
      this.payments.payment_mode = value;
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
        this.payments.amount = event.target.value;
      } else if (value.length > 8) {
        event.target.value = value.slice(0, 8);
        this.payments.amount = event.target.value;
      }
    },
    modalActivate() {
      this.$nextTick(() => {
        this.$refs.autocomplete.$el
          .querySelector(".dropdown-content")
          .addEventListener("scroll", this.onScroll);
      });
    },
    onScroll() {
      let apiCall = async () => {
        if (
          Math.ceil(
            this.$refs.autocomplete.$el.querySelector(".dropdown-content")
              .scrollTop
          ) +
            this.$refs.autocomplete.$el.querySelector(".dropdown-content")
              .clientHeight +
            1 >=
            this.$refs.autocomplete.$el.querySelector(".dropdown-content")
              .scrollHeight &&
          this.next
        ) {
          let list = [];
          let response = await axios.get(this.next, {
            headers: {
              Authorization: localStorage.getItem("auth._token.local"),
            },
          });
          this.next = response.data.next;
          response.data.results.forEach((element) => {
            list.push({
              party_value: element.name,
              party: element.id,
              amount_value: Number(element.amount),
            });
          });
          this.parties.push(...list);
        }
      };
      this.throttleFunction(apiCall, 200);
    },
    async partiesCall() {
      let list = [];
      try {
        let response = await axios.get(
          "/parties/parties/?business=" + localStorage.getItem("business"),
          {
            headers: {
              Authorization: localStorage.getItem("auth._token.local"),
            },
          }
        );
        this.next = response.data.next;
        response.data.results.forEach((element) => {
          list.push({
            party_value: element.name,
            party: element.id,
            amount_value: Number(element.amount),
          });
        });
        this.parties = list;
      } catch (err) {}
    },
    throttleFunction(callback, time) {
      if (this.throttlePause) return;
      this.throttlePause = true;
      setTimeout(() => {
        callback();
        this.throttlePause = false;
      }, time);
    },
    async searchParty(event) {
      let list = [];
      try {
        let response = await axios.get(
          "/parties/parties/?business=" +
            localStorage.getItem("business") +
            "&search=" +
            event,
          {
            headers: {
              Authorization: localStorage.getItem("auth._token.local"),
            },
          }
        );
        this.next = response.data.next;
        response.data.results.forEach((element) => {
          list.push({
            party_value: element.name,
            party: element.id,
            amount_value: Number(element.amount),
          });
        });
        this.parties = list;
      } catch (err) {}
    },
    async confirm() {
      const loadingComponent = this.$buefy.loading.open();
      if (!this.$v.$invalid) {
        if (this.selectedParty == null) {
          this.$buefy.snackbar.open({
            message: "Please Select a Party from given parties list",
            type: "is-danger",
            position: "is-bottom",
            indefinite: false,
          });
        } else {
          try {
            let posts = this.payments;
            posts.party = this.selectedParty;
            posts.business = localStorage.getItem("business");
            posts.user = this.$auth.user.id;
            posts.image_url_1 = this.invoice_images[0]
              ? this.invoice_images[0]
              : "";
            posts.image_url_2 = this.invoice_images[1]
              ? this.invoice_images[1]
              : "";
            posts.image_url_3 = this.invoice_images[2]
              ? this.invoice_images[2]
              : "";
            const response = await axios.put(
              "/transactions/payment-out/" +
                this.payments.id +
                "/?business=" +
                localStorage.getItem("business"),
              posts,
              {
                headers: {
                  Authorization: localStorage.getItem("auth._token.local"),
                },
              }
            );
            this.$emit("confirm", response.data);
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
        this.$v.payments.$touch();
      }
      loadingComponent.close();
    },
    async deleteConfirm() {
      const loadingComponent = this.$buefy.loading.open();
      try {
        const response = await axios.delete(
          "/transactions/payment-out/" +
            this.payments.id +
            "/?business=" +
            localStorage.getItem("business"),
          {
            headers: {
              Authorization: localStorage.getItem("auth._token.local"),
            },
          }
        );
        this.$buefy.snackbar.open({
          message: "Payment Out deleted successfully",
          type: "is-primary",
          position: "is-bottom",
          indefinite: false,
        });
        this.$emit("deleteConfirm");
      } catch (err) {}
      loadingComponent.close();
    },
    chooseImage() {
      this.$refs.fileInput.click();
    },
    resetMode() {
      let list = [];
      this.menusCopy.forEach((element) => {
        list.push({
          text: element.text,
          value: element.value,
        });
      });
      this.menus = list;
    },
    async onSelectFile() {
      this.deleteImage = false;
      const input = this.$refs.fileInput;
      const files = input.files;
      this.file = files[0];
      const loadingComponent = this.$buefy.loading.open();
      if (files && files[0]) {
        try {
          let formData = new FormData();
          formData.append("type", "sale");
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
    removeImage(index) {
      this.deleteImage = true;
      this.invoice_images.splice(index, 1);
      this.imageData = "";
    },
  },
};
</script>
<style lang="scss">
$green: #34a77f;
$red: #e54f6d;
.payment-in-modal-edit {
  .text-green {
    color: $green;
    font-size: 14px;
    font-weight: 600;
    position: absolute;
    right: 1rem;
    top: 1rem;
  }
  .text-red {
    color: $red;
    font-size: 14px;
    font-weight: 600;
    position: absolute;
    right: 1rem;
    top: 1rem;
  }
  .close-button {
    border: none !important;
    .icon {
      font-size: 20px !important;
    }
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
  .amount-dropdown {
    .dropdown-menu {
      top: -100px;
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
      justify-content: space-between;
      background-color: white;
      padding-bottom: 1.5rem;
      border-top: 1px solid #dbdbdb;
      padding-top: 1.5rem;
      &.footer-empty {
        border-top: none;
      }
      .button {
        width: 12rem;
        display: block;
        height: 2.8em;
        &.is-primary {
          border: none;
          background-color: $green;
          color: white;
          &:focus {
            box-shadow: none;
            border: none;
          }
        }
        &.is-danger-outline {
          border-color: #e54f6d;
          box-shadow: none;
          color: #e54f6d;
          &:focus {
            border-color: #e54f6d;
            box-shadow: none;
          }
          &:hover {
            background-color: #e54f6d;
            box-shadow: none;
            color: white;
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
    &.mid-input {
      border: 1px solid #dbdbdb;
      border-radius: 0;
      height: 2.5em;
      padding: 8px 0px 8px 10px;
      border-right: 0;
      border-left: 0;
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
    &.right-adjust {
      border-radius: 4px 0 0 4px;
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
