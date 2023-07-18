<template>
  <b-modal data:posts :active.sync="isModalActive" has-modal-card>
    {{ openingDate }}{{ unitCalculation }}
    <div class="modal-card reduce_stock">
      <header class="modal-card-head">
        <p class="modal-card-title">REDUCE STOCK</p>
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
                    custom-size="default"
                    @input.native="restrictInput($event)"
                    oninput="validity.valid||(value='');"
                    min="0"
                    step="any"
                    type="number"
                    v-model="stock.quantity"
                    expanded
                  ></b-input>
                  <p v-if="menus.length" class="control">
                    <b-dropdown
                      :scrollable="isScrollable"
                      :max-height="maxHeight"
                      v-model="currentMenu"
                      aria-role="list"
                    >
                      <template #trigger>
                        <b-button
                          :label="currentMenu.text"
                          icon-right="menu-down"
                        />
                      </template>

                      <b-dropdown-item
                        v-for="(menu, index) in menus"
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
        <!-- <div class="show-balance">
          <div>
            <p>
              Current Stock :
              <span
                >{{ Number(showCurrentStock).toFixed(2) }}
                {{ currentMenu.text }}</span
              >
            </p>
          </div>
          <div>
            <p>
              New Stock :
              <span
                >{{
                  (Number(showCurrentStock) - Number(stock.quantity)).toFixed(2)
                }}
                {{ currentMenu.text }}</span
              >
            </p>
          </div>
        </div> -->
        <b-field label="Remarks">
          <b-input
            maxlength="200"
            placeholder="Enter Remarks"
            type="textarea"
            v-model="stock.remarks"
          ></b-input>
        </b-field>
      </section>
      <footer class="modal-card-foot">
        <button class="button is-light" @click="cancel">CANCEL</button>
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
    modalItemId: {
      type: Number,
    },
    itemUnit: {
      type: String,
    },
    currentStock: {
      type: Number,
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
      showCurrentStock: null,
      conversionRate: null,
      isScrollable: false,
      maxHeight: 200,
      currentMenu: { value: false },
      menus: [],
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
    unitCalculation() {
      if (this.currentMenu) {
        if (this.currentMenu.value) {
          this.showCurrentStock =
            Number(this.currentStock) * Number(this.conversionRate);
        } else {
          this.showCurrentStock = this.currentStock;
        }
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
    async modalItemId(id) {
      this.menus = [];
      let res = await axios.get(
        "/inventory/items/" +
          id +
          "/" +
          "?business=" +
          localStorage.getItem("business"),
        {
          headers: {
            Authorization: localStorage.getItem("auth._token.local"),
          },
        }
      );
      this.conversionRate = res.data.conversion_rate;
      if (res.data.primary_unit) {
        this.currentMenu.text = res.data.primary_unit_value;
        this.currentMenu.value = false;
        this.menus.push({
          text: res.data.primary_unit_value,
          value: false,
        });
      }
      if (res.data.secondary_unit) {
        this.menus.push({
          text: res.data.secondary_unit_value,
          value: true,
        });
      }
    },
  },
  // async mounted() {
  //   this.menus = [];
  //   let res = await axios.get(
  //     "/inventory/items/" +
  //       this.modalItemId +
  //       "/" +
  //       "?business=" +
  //       localStorage.getItem("business"),
  //     {
  //       headers: {
  //         Authorization: localStorage.getItem("auth._token.local"),
  //       },
  //     }
  //   );
  //   this.conversionRate = res.data.conversion_rate;
  //   if (res.data.primary_unit) {
  //     this.currentMenu.text = res.data.primary_unit_value;
  //     this.currentMenu.value = false;
  //     this.menus.push({
  //       text: res.data.primary_unit_value,
  //       value: false,
  //     });
  //   }
  //   if (res.data.secondary_unit) {
  //     this.menus.push({
  //       text: res.data.secondary_unit_value,
  //       value: true,
  //     });
  //   }
  // },
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
        this.stock.quantity = event.target.value;
      } else if (value.length > 8) {
        event.target.value = value.slice(0, 8);
        this.stock.quantity = event.target.value;
      }
    },
    async confirm() {
      const loadingComponent = this.$buefy.loading.open();
      if (!this.$v.$invalid) {
        try {
          let stock = this.stock;
          stock.item = this.modalItemId;
          stock.business = localStorage.getItem("business");
          stock.secondary_unit = this.currentMenu.value;
          const response = await axios.post(
            "/inventory/adjustments/?item=" +
              this.modalItemId +
              "&business=" +
              localStorage.getItem("business"),
            stock,
            {
              headers: {
                Authorization: localStorage.getItem("auth._token.local"),
              },
            }
          );
          this.$emit("confirm", response.data);
          this.stock.quantity = "";
          this.stock.created_date = new Date();
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
    justify-content: flex-end;
    background-color: white;
    padding-bottom: 1.5rem;
    border-top: 1px solid #dbdbdb;
    padding-top: 1.5rem;
    .button {
      width: 12rem;
      border: none;
      display: block;
      height: 2.8em;
      &.is-primary {
        background-color: #e54f6d;
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
</style>
