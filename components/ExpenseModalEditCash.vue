<template>
  <b-modal
    class="expense-modal-table"
    :active.sync="isModalActive"
    has-modal-card
  >
    {{ inputDate }}
    <div class="modal-card">
      <header class="modal-card-head">
        <p v-if="type" class="modal-card-title">
          EDIT {{ type.toUpperCase() }}
        </p>
        <b-button class="close-button" @click="cancel" type="is-light">
          <b-icon icon="close" size="is-small"> </b-icon
        ></b-button>
      </header>
      <section class="modal-card-body">
        <div class="modal-form">
          <div class="columns">
            <div class="column is-4">
              <b-field label="Category" expanded>
                <b-dropdown
                  expanded
                  :scrollable="isScrollable"
                  :max-height="maxHeight"
                  v-model="currentCategory"
                  aria-role="list"
                >
                  <template #trigger>
                    <b-button
                      expanded
                      :label="currentCategory.text"
                      icon-right="menu-down"
                    />
                  </template>

                  <b-dropdown-item
                    v-for="(menu, index) in categories"
                    :key="index"
                    :value="menu"
                    aria-role="listitem"
                    @click="choose(menu.value)"
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
              <span class="received-label">Amount</span>
              <b-field expanded>
                <p class="control left-input">Rs.</p>
                <b-input
                  v-model="item.amount"
                  expanded
                  class="amount-input-left"
                  type="number"
                  @input.native="restrictInput($event)"
                  oninput="validity.valid||(value='');"
                  min="0"
                  step="any"
                ></b-input>
              </b-field>
              <div v-if="$v.item.amount.$error" class="form-error">
                <span class="help is-danger">Amount is Required</span>
              </div>
            </div>
            <div class="column is-4">
              <b-field label="Payment Method" expanded>
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
              <b-field label="Note" expanded>
                <b-input
                  v-model="item.note"
                  placeholder="Enter Note or Remarks"
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
      </section>
      <footer class="modal-card-foot">
        <b-button @click="deleteConfirm" type="is-danger-outline"
          >DELETE
        </b-button>
        <b-button @click="confirm" type="is-primary">SAVE</b-button>
      </footer>
    </div>
  </b-modal>
</template>

<script>
import axios from "axios";
import { required } from "vuelidate/lib/validators";
import NepaliDate from "nepali-date-converter";
import VNepaliDatePicker from "v-nepalidatepicker";
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
    item: {
      type: Object,
    },
    type: {
      type: String,
    },
  },
  data() {
    return {
      keepFirst: false,
      openOnFocus: false,
      selected: null,
      clearable: false,
      name: "",
      isScrollable: true,
      maxHeight: 140,
      currentType: {},
      types: [
        { text: "Online", value: "online" },
        { text: "Cheque", value: "cheque" },
        { text: "Cash", value: "cash" },
      ],
      date: "",
      currentCategory: [],
      categories: [],
      isModalActive: false,
      selected: new Date(),
      showWeekNumber: false,
      locale: undefined,
    };
  },
  validations: {
    item: {
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
    item(item) {
      this.date = item.nep_date_string;
      this.currentCategory.text = item.category_value;
      this.currentType.text = item.payment_mode_value;
    },
    async type(type) {
      let list = [];
      try {
        let response = await axios.get(
          "/transactions/income-expense-category/?type=" +
            type +
            "&business=" +
            localStorage.getItem("business"),
          {
            headers: {
              Authorization: localStorage.getItem("auth._token.local"),
            },
          }
        );
        response.data.forEach((element) => {
          list.push({
            text: element.name,
            value: element.id,
          });
        });
        this.categories = list;
      } catch (err) {}
    },
  },
  async mounted() {},
  computed: {
    inputDate() {
      if (this.date) {
        let nepDate = new NepaliDate(this.date);
        let engDate = nepDate.toJsDate();
        this.item.date = engDate;
      }
    },
  },
  methods: {
    choose(id) {
      this.item.category = id;
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
        this.item.amount = event.target.value;
      } else if (value.length > 8) {
        event.target.value = value.slice(0, 8);
        this.item.amount = event.target.value;
      }
    },
    async confirm() {
      const loadingComponent = this.$buefy.loading.open();
      if (!this.$v.$invalid) {
        if (
          this.currentType.text === "Select Payment Method" ||
          this.currentType.text === ""
        ) {
          this.$buefy.snackbar.open({
            message: "Please Select Payment Method",
            type: "is-danger",
            position: "is-bottom",
            indefinite: false,
          });
        } else if (!this.item.category) {
          this.$buefy.snackbar.open({
            message: "Please Select a Category",
            type: "is-danger",
            position: "is-bottom",
            indefinite: false,
          });
        } else if (!Number(this.item.amount)) {
          this.$buefy.snackbar.open({
            message: "Please Enter Amount",
            type: "is-danger",
            position: "is-bottom",
            indefinite: false,
          });
        } else {
          try {
            let posts = this.item;
            posts.business = localStorage.getItem("business");
            posts.user = this.$auth.user.id;
            posts.payment_mode = this.currentType.value;
            const response = await axios.put(
              "/transactions/income-expense/" +
                this.item.object_id +
                "/?business=" +
                localStorage.getItem("business") +
                "&type=" +
                this.type,
              posts,
              {
                headers: {
                  Authorization: localStorage.getItem("auth._token.local"),
                },
              }
            );
            this.$emit("confirm", response.data);
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
        this.$v.item.$touch();
      }
      loadingComponent.close();
    },
    async deleteConfirm() {
      const loadingComponent = this.$buefy.loading.open();
      try {
        const response = await axios.delete(
          "/transactions/income-expense/" +
            this.item.object_id +
            "/?business=" +
            localStorage.getItem("business"),
          {
            headers: {
              Authorization: localStorage.getItem("auth._token.local"),
            },
          }
        );
        this.$emit("deleteConfirm");
        if (this.item.type == "income") {
          this.$buefy.snackbar.open({
            message: "Income deleted successfully",
            type: "is-primary",
            position: "is-bottom",
            indefinite: false,
          });
        } else if (this.item.type == "expense") {
          this.$buefy.snackbar.open({
            message: "Expense deleted successfully",
            type: "is-primary",
            position: "is-bottom",
            indefinite: false,
          });
        }
      } catch (err) {}
      loadingComponent.close();
    },
  },
};
</script>
<style lang="scss">
$green: #34a77f;

.expense-modal-table {
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
  a.dropdown-item {
    font-size: 16px;
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
