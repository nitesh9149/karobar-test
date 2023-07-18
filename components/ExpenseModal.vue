<template>
  <b-modal class="expense-modal" :active.sync="isModalActive" has-modal-card>
    {{ openingDate }}
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">ADD NEW EXPENSE</p>
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
                    <div v-if="menu" class="media">
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
                  v-model="posts.amount"
                  expanded
                  class="amount-input-left"
                  type="number"
                  @input.native="restrictInput($event)"
                  oninput="validity.valid||(value='');"
                  min="0"
                  step="any"
                ></b-input>
              </b-field>
              <div v-if="$v.posts.amount.$error" class="form-error">
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
                  v-model="posts.note"
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
        <div class="buttons">
          <b-button @click="confirmAdd" type="is-light"
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
    categoryId: {
      type: Number,
    },
    categoryName: {
      type: String,
    },
    categoryList: {
      type: Array,
    },
  },
  data() {
    return {
      posts: {
        name: "",
        amount: "",
        note: "",
        user: this.$auth.user.id,
        category: "",
        date: new Date(),
        type: "expense",
      },
      date: "",
      keepFirst: false,
      openOnFocus: false,
      clearable: false,
      isScrollable: true,
      maxHeight: 140,
      currentType: { text: "Cash", value: "cash" },
      types: [
        { text: "Online", value: "online" },
        { text: "Cheque", value: "cheque" },
        { text: "Cash", value: "cash" },
      ],
      typesCopy: [
        { text: "Online", value: "online" },
        { text: "Cheque", value: "cheque" },
        { text: "Cash", value: "cash" },
      ],
      currentCategory: [],
      categories: [],
      isModalActive: false,
      selected: new Date(),
      showWeekNumber: false,
      locale: undefined,
    };
  },
  validations: {
    posts: {
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
    async categoryName(name) {
      this.currentCategory.text = name;
      this.currentCategory.value = this.categoryId;
      this.posts.category = this.categoryId;
      let list = [];
      this.categoryList.forEach((element) => {
        list.push({
          text: element.name,
          value: element.id,
        });
      });
      this.categories = list;
    },
  },
  computed: {
    openingDate() {
      if (this.date) {
        let nepDate = new NepaliDate(this.date);
        let engDate = nepDate.toJsDate();
        this.posts.date = engDate;
      } else {
        this.posts.date = new Date();
      }
    },
  },
  // async mounted() {
  //   let list = [];
  //   try {
  //     let response = await axios.get(
  //       "/transactions/income-expense-category/?type=expense&business=" +
  //         localStorage.getItem("business"),
  //       {
  //         headers: {
  //           Authorization: localStorage.getItem("auth._token.local"),
  //         },
  //       }
  //     );
  //     response.data.forEach((element) => {
  //       list.push({
  //         text: element.name,
  //         value: element.id,
  //       });
  //     });
  //     this.categories = list;
  //   } catch (err) {}
  // },

  methods: {
    choose(id) {
      this.posts.category = id;
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
        this.posts.amount = event.target.value;
      } else if (value.length > 8) {
        event.target.value = value.slice(0, 8);
        this.posts.amount = event.target.value;
      }
    },
    async confirm() {
      const loadingComponent = this.$buefy.loading.open();
      if (!this.$v.$invalid) {
        if (this.currentType.text === "Select Payment Method") {
          this.$buefy.snackbar.open({
            message: "Please Select Payment Method",
            type: "is-danger",
            position: "is-bottom",
            indefinite: false,
          });
        } else if (!this.posts.category) {
          this.$buefy.snackbar.open({
            message: "Please Select a Category",
            type: "is-danger",
            position: "is-bottom",
            indefinite: false,
          });
        } else if (!Number(this.posts.amount)) {
          this.$buefy.snackbar.open({
            message: "Please Enter Amount",
            type: "is-danger",
            position: "is-bottom",
            indefinite: false,
          });
        } else {
          try {
            let posts = this.posts;
            posts.business = localStorage.getItem("business");
            posts.payment_mode = this.currentType.value;
            const response = await axios.post(
              "/transactions/income-expense/",
              posts,
              {
                headers: {
                  Authorization: localStorage.getItem("auth._token.local"),
                },
              }
            );
            this.$emit("confirm", response.data);
            this.posts.amount = "";
            this.posts.note = "";
            this.currentType.text = "Cash";
            this.currentType.value = "cash";
            this.date = "";
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
        this.$v.posts.$touch();
      }
      loadingComponent.close();
    },
    async confirmAdd() {
      const loadingComponent = this.$buefy.loading.open();
      if (!this.$v.$invalid) {
        if (this.currentType.text === "Select Payment Method") {
          this.$buefy.snackbar.open({
            message: "Please Select Payment Method",
            type: "is-danger",
            position: "is-bottom",
            indefinite: false,
          });
        } else if (!this.posts.category) {
          this.$buefy.snackbar.open({
            message: "Please Select a Valid Category",
            type: "is-danger",
            position: "is-bottom",
            indefinite: false,
          });
        } else if (!Number(this.posts.amount)) {
          this.$buefy.snackbar.open({
            message: "Please Enter Amount",
            type: "is-danger",
            position: "is-bottom",
            indefinite: false,
          });
        } else {
          try {
            let posts = this.posts;
            posts.business = localStorage.getItem("business");
            posts.payment_mode = this.currentType.value;
            const response = await axios.post(
              "/transactions/income-expense/",
              posts,
              {
                headers: {
                  Authorization: localStorage.getItem("auth._token.local"),
                },
              }
            );
            this.$emit("confirmAdd", response.data);
            this.posts.amount = "";
            this.posts.note = "";
            this.currentType.text = "Cash";
            this.currentType.value = "cash";
            this.date = "";
            this.$v.posts.$reset();
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
        this.$v.posts.$touch();
      }
      loadingComponent.close();
    },
    resetMode() {
      let types = [];
      this.typesCopy.forEach((element) => {
        types.push({
          text: element.text,
          value: element.value,
        });
      });
      this.types = types;
    },
    async selectCategory() {
      let list = []
      let response = await axios.get(
        "/transactions/income-expense-category/?type=expense&business=" +
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
      this.currentCategory.text = response.data[0].name;
      this.posts.category = response.data[0].id;
    },
  },
};
</script>
<style lang="scss">
$green: #34a77f;

.expense-modal {
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
      justify-content: flex-end;
      background-color: white;
      padding-bottom: 1.5rem;
      border-top: 1px solid #dbdbdb;
      padding-top: 1.5rem;
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
