<template>
  <b-modal
    class="staff-modal"
    data:posts
    :active.sync="isModalActive"
    has-modal-card
  >
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">ADD NEW STAFF</p>
        <b-button class="close-button" @click="cancel" type="is-light">
          <b-icon icon="close" size="is-small"> </b-icon
        ></b-button>
      </header>
      <section class="modal-card-body">
        <div class="modal-form">
          <div class="columns">
            <div class="column is-12">
              <b-field label="Name" expanded>
                <b-input
                  v-model="staff.name"
                  placeholder="Enter Full Name"
                  type="text"
                ></b-input>
              </b-field>
              <div v-if="$v.staff.name.$error" class="form-error">
                <span class="help is-danger">Full Name is Required</span>
              </div>
            </div>
          </div>
          <div class="columns">
            <div class="column is-12">
              <b-field label="Phone Number" expanded>
                <b-input
                  readonly
                  v-model="staff.phone_number"
                  placeholder="Enter Phone Number"
                  type="text"
                  maxlength="10"
                  @keypress.native="isNumber($event)"
                ></b-input>
              </b-field>
              <div v-if="$v.staff.phone_number.$error" class="form-error">
                <span class="help is-danger">Phone Number is Required</span>
              </div>
            </div>
          </div>
          <div class="columns">
            <div class="column is-7">
              <b-field label="Staff Role" expanded>
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
import { required,minLength } from "vuelidate/lib/validators";
export default {
  name: "ModalBox",
  props: {
    isActive: {
      type: Boolean,
      default: false,
    },
    staff: {
      type: Object,
    },
  },

  data() {
    return {
      isScrollable: false,
      maxHeight: 200,
      currentMenu: { text: "To Pay" },
      menus: [{ text: "To Receive" }],
      currentType: { text: "Select Role" },
      types: [
        { text: "Business Partner", value: "business-partner" },
        { text: "Sales Partner", value: "sales-person" },
        { text: "Inventory Manager", value: "inventory-manager" },
        { text: "Accountant", value: "accountant" },
      ],
      typesCopy: [
        { text: "Business Partner", value: "business-partner" },
        { text: "Sales Partner", value: "sales-person" },
        { text: "Inventory Manager", value: "inventory-manager" },
        { text: "Accountant", value: "accountant" },
      ],
      isModalActive: false,
      selected: new Date(),
      showWeekNumber: false,
      locale: undefined, // Browser locale
    };
  },
  validations: {
    staff: {
      name: {
        required,
      },
      phone_number: {
        required,
        minLength: minLength(10),
      },
    },
  },
  watch: {
    isActive(newValue) {
      this.isModalActive = newValue;
    },
    isNumber(evt) {
      evt = evt ? evt : window.event;
      var charCode = evt.which ? evt.which : evt.keyCode;
      if (
        charCode > 31 &&
        (charCode < 48 || charCode > 57) &&
        charCode !== 46
      ) {
        evt.preventDefault();
      } else {
        return true;
      }
    },
    isModalActive(newValue) {
      if (!newValue) {
        this.cancel();
      }
    },
    staff(staff) {
      this.currentType.text = staff.role_value;
      this.currentType.value = staff.role;
    },
  },
  methods: {
    cancel() {
      this.$emit("cancel");
    },
    async confirm() {
      const loadingComponent = this.$buefy.loading.open();
      if (!this.$v.$invalid) {
        if (this.currentType.text === "Select Role") {
          this.$buefy.snackbar.open({
            message: "Please Select Select Role",
            type: "is-danger",
            position: "is-bottom",
            indefinite: false,
          });
        } else {
          try {
            let posts = this.staff;
            posts.role = this.currentType.value;
            posts.business = localStorage.getItem("business");
            posts.user = this.$auth.user.id;
            const response = await axios.put(
              "/roles/roles/" +
                this.staff.id +
                "/" +
                "?business=" +
                localStorage.getItem("business"),
              posts,
              {
                headers: {
                  Authorization: localStorage.getItem("auth._token.local"),
                },
              }
            );
            this.$emit("confirm");
            this.staff.name = "";
            this.staff.phone_number = "";
            this.currentType.text = "Select Role";
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
        this.$v.staff.$touch();
      }
      loadingComponent.close();
    },
    resetMode() {
      let menus = [];
      this.typesCopy.forEach((element) => {
        menus.push({
          text: element.text,
          value: element.value,
        });
      });
      this.types = menus;
    },
  },
};
</script>
<style lang="scss">
$green: #34a77f;
.staff-modal {
  .label {
    font-weight: 500;
  }
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
  .dropdown-menu {
    top: -9rem;
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
    width: 40vw;
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
      padding-bottom: 0.5rem;
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
  ::-webkit-input-placeholder {
    color: #676767;
    font-size: 15px;
  }
  .label {
    font-weight: 500;
  }
}
</style>
