<template>
  <b-modal data:posts :active.sync="isModalActive" has-modal-card>
    {{ openingDate }}
    <div class="modal-card reduce_stock">
      <header class="modal-card-head">
        <p class="modal-card-title">EDIT STOCK</p>
        <b-button class="close-button" @click="cancel" type="is-light">
          <b-icon icon="close" size="is-small"> </b-icon
        ></b-button>
      </header>
      <section class="modal-card-body items-card-body">
        <div class="modal-form">
          <div class="columns">
            <div class="column is-7">
              <b-field label="Quantity to Reduce">
                <b-field class="adjust-quantity">
                  <p class="control">
                    <b-button class="add">
                      <b-icon icon="minus" size="is-small"></b-icon>
                    </b-button>
                  </p>
                  <b-input
                    class="adjust-left"
                    custom-size="default"
                    step="any"
                    type="text"
                    v-model="stock.quantity"
                    expanded
                  ></b-input>
                  <p class="control">
                    <b-button class="btn-unit" type="is-light" :label="unit" />
                  </p>
                </b-field>
              </b-field>
              <div v-if="$v.stock.quantity.$error" class="form-error">
                <span class="help is-danger">Quantity is Required</span>
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
        <b-field label="Remarks">
          <b-input
            maxlength="200"
            type="textarea"
            v-model="stock.remarks"
          ></b-input>
        </b-field>
      </section>
      <footer class="modal-card-foot">
        <button class="button is-danger-outline" @click="deleteStock">
          Delete
        </button>
        <button class="button is-primary" @click="confirm">SAVE</button>
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
    editStock: {
      type: Object,
    },
  },
  data() {
    return {
      isToggled: true,
      plus: "plus",
      stock: {
        quantity: "",
        type: "reduce",
        created_date: new Date(),
        item: "",
        remarks: "",
        user: this.$auth.user.id,
      },
      unit: "",
      date: "",
      isModalActive: false,
      selected: new Date(),
      showWeekNumber: false,
      locale: undefined, // Browser locale
    };
  },
  validations: {
    stock: {
      quantity: {
        required,
      },
    },
  },
  computed: {
    openingDate() {
      if (this.date) {
        let nepDate = new NepaliDate(this.date);
        let engDate = nepDate.toJsDate();
        this.stock.created_date = engDate;
      } else {
        this.stock.created_date = new Date();
      }
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
    editStock(stock) {
      this.stock.quantity = Math.abs(stock.quantity);
      this.date = stock.nep_date_string;
      this.stock.remarks = stock.remarks_value;
      this.stock.item = stock.item;
      this.unit = stock.unit;
    },
  },
  methods: {
    cancel() {
      this.$emit("cancel");
    },
    async confirm() {
      const loadingComponent = this.$buefy.loading.open();
      if (!this.$v.$invalid) {
        try {
          let stock = this.stock;
          stock.business = localStorage.getItem("business");
          await axios.patch(
            "/inventory/adjustments/" +
              this.editStock.id +
              "?item=" +
              this.stock.item +
              "&business=" +
              localStorage.getItem("business"),
            stock,
            {
              headers: {
                Authorization: localStorage.getItem("auth._token.local"),
              },
            }
          );
          this.$emit("confirm");
        } catch (err) {
          this.$buefy.snackbar.open({
            message: err.response.data.detail,
            type: "is-primary",
            position: "is-bottom",
            indefinite: false,
          });
        }
      } else {
        this.$v.stock.$touch();
      }
      loadingComponent.close();
    },
    async deleteStock() {
      const loadingComponent = this.$buefy.loading.open();
      try {
        await axios.delete(
          "/inventory/adjustments/" +
            this.editStock.id +
            "?item=" +
            this.stock.item +
            "&business=" +
            localStorage.getItem("business"),
          {
            headers: {
              Authorization: localStorage.getItem("auth._token.local"),
            },
          }
        );
        this.$emit("confirm");
      } catch (error) {}
      loadingComponent.close();
    },
  },
};
</script>
<style lang="scss">
$green: #34a77f;
.modal-background {
  background-color: rgba(10, 10, 10, 0.6);
}
.modal-card.reduce_stock {
  width: 45vw;
  .close-button {
    border: none !important;
    background-color: #e54f6d !important;
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
    .control.has-icons-left .icon,
    .control.has-icons-right .icon {
      color: #e54f6d;
      top: 3px;
    }
  }
  ::-webkit-input-placeholder {
    color: #676767;
    font-size: 15px;
  }
  .button {
    box-shadow: none;
    height: 2.8em;
    padding: 0 20px;
    z-index: 2;
    &.add {
      background-color: #f5d1d8;
      .icon {
        color: #e54f6d;
        font-size: 24px;
        margin-top: 3px;
      }
    }
    span {
      font-size: 14px;
    }
    &:focus {
      z-index: 2 !important;
    }
    &.is-light {
      background-color: white;
      border-color: #dbdbdb;
      color: #000000;
      border-left: 0;
      &:focus {
        box-shadow: none;
      }
    }
    &.is-primary {
      &:focus {
        box-shadow: none;
      }
    }
  }
  .input {
    height: 2.8em;
    border-color: #dedede;
    z-index: 2;
    &:hover {
      border-color: #dedede;
      z-index: 2;
    }
    &:focus {
      border-color: #dedede;
      z-index: 2;
    }
  }
  .control.has-icons-left .icon,
  .control.has-icons-right .icon {
    top: 5px;
    color: black;
  }
  .modal-card-head,
  .modal-card-foot {
    padding: 10px 20px;
  }
  .modal-card-head {
    background-color: #e54f6d;
    .modal-card-title {
      font-weight: 600;
      color: white;
    }
  }
  .modal-card-body.items-card-body {
    .modal-form {
      padding-bottom: 1.5rem;
      &:first-child {
        padding-top: 0;
      }
    }
    .show-balance {
      display: flex;
      justify-content: space-between;
      margin-top: -0.5rem;
      padding-bottom: 1.5rem;
    }
    label {
      color: #000000;
      font-size: 16px;
      font-weight: 500;
      padding-bottom: 0.5rem;
    }
    .adjust-left {
      .input {
        border-right: 0;
      }
    }
    .adjust-quantity {
      padding-bottom: 0.75rem;

      &.field.has-addons {
        justify-content: center;
      }
    }
    textarea {
      &:focus {
        border-color: #dedede;
      }
      &:hover {
        border-color: #dedede;
      }
    }
  }
  .modal-card-foot {
    display: flex;
    justify-content: space-between;
    background-color: white;
    padding-bottom: 1.5rem;
    border-top: 1px solid #dbdbdb;
    padding-top: 1.5rem;
    border-top: 0;
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
        box-shadow: none;
        color: #e54f6d;
        border: 1px solid #e54f6d;
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
    }
  }
}
</style>
<style lang="scss" scoped>
// .modal-card.reduce_stock .modal-card-foot {
//   padding-bottom: 0.5rem;
//   border-top: 0;
//   padding-top: 0;
// }
</style>
