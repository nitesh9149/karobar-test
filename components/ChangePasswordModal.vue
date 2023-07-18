<template>
  <b-modal
    class="change-password-modal"
    data:posts
    :active.sync="isModalActive"
    has-modal-card
  >
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Change Password</p>
        <b-button class="close-button" @click="cancel" type="is-light">
          <b-icon icon="close" size="is-small"> </b-icon
        ></b-button>
      </header>
      <section class="modal-card-body">
        <div class="modal-form">
          <b-field label="New Password" expanded>
            <b-input v-model="posts.new_password1" expanded type="password" password-reveal></b-input>
          </b-field>
          <div v-if="$v.posts.new_password1.$error" class="form-error">
            <span class="help is-danger">Password is Required</span>
          </div>
          <b-field label="Confirm Password" expanded>
            <b-input v-model="posts.new_password2" expanded type="password" password-reveal></b-input>
          </b-field>
          <div v-if="$v.posts.new_password2.$error" class="form-error">
            <span class="help is-danger"
              >Password Confirmation is Required</span
            >
          </div>
        </div>
      </section>
      <footer class="modal-card-foot">
        <div class="buttons">
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
  },
  data() {
    return {
      posts: {
        new_password1: "",
        new_password2: "",
      },
      isModalActive: false,
      locale: undefined, // Browser locale
    };
  },
  validations: {
    posts: {
      new_password1: {
        required,
      },
      new_password2: {
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
  methods: {
    cancel() {
      this.$emit("cancel");
    },
    async confirm() {
      const loadingComponent = this.$buefy.loading.open();
      if (!this.$v.$invalid) {
        try {
          let posts = this.posts;
          const response = await axios.post(
            "/auth/password/change/",
            posts,
            {
              headers: {
                Authorization: localStorage.getItem("auth._token.local"),
              },
            }
          );
          this.$emit("confirm", response.data);
          this.$buefy.snackbar.open({
            message: "New Password set successfully",
            type: "is-primary",
            position: "is-bottom",
            actionText: "Ok",
            indefinite: false,
          });
          this.posts.new_password1 = "";
          this.posts.new_password2 = "";
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
.change-password-modal {
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
    .form-error{
        margin-top: -0.5rem;
        margin-bottom: 0.5rem;
    }
  }
  .modal-card {
    width: 35vw;
    .modal-card-head,
    .modal-card-foot {
      padding: 10px 20px;
    }
    .modal-card-head {
      background-color: white;
      border-color: #dbdbdb;
      .modal-card-title {
        color: black;
        font-weight: 600;
      }
    }
    .modal-card-body {
      padding-top: 1.5rem;
      padding-bottom: 0;
      padding-left: 0;
      padding-right: 0;
      padding: 20px 30px;
      .control.has-icons-right .icon.is-right {
        height: 2.5em;
      }
    }
    .modal-card-foot {
      display: flex;
      justify-content: flex-end;
      background-color: white;
      padding-bottom: 1.5rem;
      border-top: 0;
      padding-top: 0;
      .buttons {
        width: 100%;
        .button {
          width: 100%;
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
  ::-webkit-input-placeholder {
    color: #676767;
    font-size: 15px;
  }
  .button {
    height: 2.5em;
    box-shadow: none;
    background-color: white;
    border: 1px solid #dedede;
    display: flex;
    justify-content: space-between;
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
