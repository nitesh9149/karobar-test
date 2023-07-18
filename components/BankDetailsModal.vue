<template>
  <b-modal
    class="bank-details-modal"
    :active.sync="isModalActive"
    has-modal-card
  >
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">BANK DETAILS</p>
        <b-button class="close-button" @click="cancel" type="is-light">
          <b-icon icon="close" size="is-small"> </b-icon
        ></b-button>
      </header>
      <section class="modal-card-body">
        <div class="modal-form">
          <div class="columns">
            <div class="column is-12">
              <b-field label="Bank Name" expanded>
                <b-input
                  expanded
                  v-model="registerInfo.bank_name"
                  placeholder="Enter Bank Name"
                  type="text"
                ></b-input>
              </b-field>
              <div v-if="$v.registerInfo.bank_name.$error" class="form-error">
                <span class="help is-danger">Bank Name is Required</span>
              </div>
            </div>
          </div>
          <div class="columns">
            <div class="column is-12">
              <b-field label="Account Number" expanded>
                <b-input
                  expanded
                  v-model="registerInfo.account_number"
                  placeholder="Enter Account Number"
                  type="text"
                ></b-input>
              </b-field>
              <div
                v-if="$v.registerInfo.account_number.$error"
                class="form-error"
              >
                <span class="help is-danger">Account Number is Required</span>
              </div>
            </div>
          </div>
          <div class="columns">
            <div class="column is-12">
              <b-field label="Account Holder Name" expanded>
                <b-input
                  expanded
                  v-model="registerInfo.account_holder_name"
                  placeholder="Enter Account Holder Name"
                  type="text"
                ></b-input>
              </b-field>
              <div
                v-if="$v.registerInfo.account_holder_name.$error"
                class="form-error"
              >
                <span class="help is-danger"
                  >Account Holder Number is Required</span
                >
              </div>
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
import { required } from "vuelidate/lib/validators";
export default {
  name: "ModalBox",
  props: {
    isActive: {
      type: Boolean,
      default: false,
    },
    registerData: {
      bank_name: {
        type: String,
      },
      account_number: {
        type: String,
      },
      account_holder_name: {
        type: String,
      },
    },
  },
  data() {
    return {
      isModalActive: false,
      registerInfo: {
        bank_name: "",
        account_number: "",
        account_holder_name: "",
      },
    };
  },
  validations: {
    registerInfo: {
      bank_name: {
        required,
      },
      account_number: {
        required,
      },
      account_holder_name: {
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
    registerData(data) {
      this.registerInfo.bank_name = data.bank_name;
      this.registerInfo.account_holder_name = data.account_holder_name;
      this.registerInfo.account_number = data.account_number;
    },
  },
  methods: {
    async confirm() {
      const loadingComponent = this.$buefy.loading.open();
      if (!this.$v.$invalid) {
        try {
          this.$emit("confirm", this.registerInfo);
        } catch (err) {
          this.$buefy.snackbar.open({
            message: err.response.data.detail,
            type: "is-primary",
            position: "is-bottom",
            actionText: "Retry",
            indefinite: false,
          });
        }
      } else {
        this.$v.registerInfo.$touch();
      }
      loadingComponent.close();
    },
    cancel() {
      this.$emit("cancel");
    },
  },
};
</script>
<style lang="scss">
$green: #34a77f;
.bank-details-modal {
  .close-button {
    border: none !important;
    background-color: $green !important;
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
  .form-error {
    margin-bottom: -1rem;
    margin-top: -0.5rem;
  }
  .control.has-icons-left .icon,
  .control.has-icons-right .icon {
    color: #34a77f;
    top: 3px;
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
      background-color: $green;
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
      padding-bottom: 2rem;
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
