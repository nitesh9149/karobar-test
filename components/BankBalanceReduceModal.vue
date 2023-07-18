<template>
  <b-modal
    class="bank-balance-reduce-modal"
    data:posts
    :active.sync="isModalActive"
    has-modal-card
  >
    {{ openingDate }}
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">REDUCE CASH</p>
        <b-button class="close-button" @click="cancel" type="is-light">
          <b-icon icon="close" size="is-small"> </b-icon
        ></b-button>
      </header>
      <section class="modal-card-body">
        <div class="modal-form">
          <div class="columns">
            <div class="column is-7">
              <span class="received-label">Enter Amount</span>
              <b-field expanded>
                <p class="control left-input">Rs.</p>
                <b-input
                  expanded
                  class="amount-input-left"
                  type="number"
                  @input.native="restrictInput($event)"
                  v-model="posts.amount"
                  oninput="validity.valid||(value='');"
                  min="0"
                  step="any"
                ></b-input>
              </b-field>
              <div v-if="$v.posts.amount.$error" class="form-error">
                <span class="help is-danger">Amount is Required</span>
              </div>
            </div>
            <div class="column is-5">
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
        <div class="show-balance">
          <div>
            <p>
              Current Balance : <span>Rs. {{ currentBalance }}</span>
            </p>
          </div>
          <div>
            <p>
              New Balance :
              <span>Rs. {{ currentBalance - Number(posts.amount) }}</span>
            </p>
          </div>
        </div>
        <div class="modal-form">
          <div class="columns">
            <div class="column is-12">
              <b-field label="Remarks">
                <b-input
                  v-model="posts.remarks"
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
          <b-button @click="cancel" type="is-light">CANCEL </b-button>
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
    currentBalance: {
      type: Number,
    },
  },
  data() {
    return {
      posts: {
        amount: "",
        remarks: "",
        payment_mode: "bank",
        type: "reduce-money",
        user: this.$auth.user.id,
        created: new Date(),
      },
      date: "",
      isModalActive: false,
      selected: new Date(),
      showWeekNumber: false,
      locale: undefined, // Browser locale
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
  },
  computed: {
    openingDate() {
      if (this.date) {
        let nepDate = new NepaliDate(this.date);
        let engDate = nepDate.toJsDate();
        this.posts.created = engDate;
      } else {
        this.posts.created = new Date();
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
        this.posts.amount = event.target.value;
      } else if (value.length > 8) {
        event.target.value = value.slice(0, 8);
        this.posts.amount = event.target.value;
      }
    },
    async confirm() {
      const loadingComponent = this.$buefy.loading.open();
      if (Number(this.posts.amount) == 0) {
        this.$buefy.snackbar.open({
          message: "Please Enter Proper Amount",
          type: "is-danger",
          position: "is-bottom",
          indefinite: false,
        });
      } else if (!this.$v.$invalid) {
        try {
          let posts = this.posts;
          posts.business = localStorage.getItem("business");
          const response = await axios.post(
            "/transactions/transactions/",
            posts,
            {
              headers: {
                Authorization: localStorage.getItem("auth._token.local"),
              },
            }
          );
          this.$emit("confirm", response.data);
          this.posts.amount = "";
          this.posts.created = new Date();
          this.posts.remarks = "";
        } catch (err) {
          this.$buefy.snackbar.open({
            message: err.response.data.detail,
            type: "is-primary",
            position: "is-bottom",
            indefinite: false,
          });
        }
      } else {
        this.$v.posts.$touch();
      }
      loadingComponent.close();
    },
  },
};
</script>
<style lang="scss">
$green: #34a77f;
$red: #e54f6d;
.bank-balance-reduce-modal {
  .close-button {
    border: none !important;
    background-color: $red !important;
    &.is-light {
      &:focus {
        box-shadow: none;
      }
    }
    .icon {
      font-size: 20px !important;
      color: white;
    }
  }
  .datepicker .control.has-icons-left .icon,
  .datepicker .control.has-icons-right .icon {
    color: $red;
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
  .datepicker .control.has-icons-left .input:focus ~ .icon,
  .datepicker
    .control.has-icons-left
    .taginput
    .taginput-container.is-focusable:focus
    ~ .icon,
  .taginput
    .datepicker
    .control.has-icons-left
    .taginput-container.is-focusable:focus
    ~ .icon {
    color: $red;
  }
  a.dropdown-item {
    font-size: 16px;
  }
  .modal-form {
    padding-bottom: 1.5rem;
    &:first-child {
      padding-top: 0;
    }
  }
  .modal-card {
    width: 45vw;
    .modal-card-head,
    .modal-card-foot {
      padding: 10px 20px;
    }
    .modal-card-head {
      background-color: $red;
      border-color: #dbdbdb;
      .modal-card-title {
        color: white;
        font-weight: 600;
      }
    }
    .modal-card-body {
      padding-top: 1.5rem;
      padding-bottom: 0;
      padding-left: 0;
      padding-right: 0;
      padding: 20px 30px;
      .show-balance {
        display: flex;
        justify-content: space-between;
        margin-top: -0.5rem;
        padding-bottom: 1.5rem;
      }
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
            background-color: $red;
            color: white;
            &:focus {
              box-shadow: none;
              border: none;
            }
          }
          &.is-light {
            border: 1px solid #dbdbdb;
            color: #676767;
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
      text-align: left;
    }
  }
  .amount-input-right {
    input {
      border-right: 0;
      text-align: left;
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
