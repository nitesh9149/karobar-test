<template>
  <div>
    <section class="login-section bg-white">
      <div class="columns">
        <div class="login-logo column is-6-desktop is-12-tablet is-12-mobile">
          <nuxt-link to="/" class="logo"
            ><img src="@/img/Logo.png" alt="Karobar logo"
          /></nuxt-link>
        </div>
      </div>
      <div class="login">
        <div class="columns is-mobile">
          <div class="column is-6-desktop is-12-tablet is-12-mobile">
            <div class="login-form">
              <h1>Login with your account!</h1>
              <p>Login to start using karobar app</p>
              <b-field label="Phone Number">
                <b-input
                  v-model="login.phone_number"
                  @keyup.enter.native="userLogin"
                  type="text"
                  @keypress.native="isNumber($event)"
                  placeholder="Enter your Phone Number"
                  maxlength="10"
                >
                </b-input>
              </b-field>
              <div v-if="$v.login.phone_number.$error" class="form-error">
                <span class="help is-danger">Enter Valid Phone Number</span>
              </div>
              <b-field style="display: none" label="Password">
                <b-input type="text"> </b-input>
              </b-field>
              <b-button @click="userLogin" type="is-primary"
                >Login to Continue</b-button
              >
            </div>
          </div>
          <div class="column is-6 bg">
            <login-slide />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
import axios from "axios";
import LoginSlide from "@/components/LoginSlide";
import { required, minLength } from "vuelidate/lib/validators";
export default {
  layout: "empty",
  components: {
    LoginSlide,
  },
  data() {
    return {
      login: {
        phone_number: "",
      },
    };
  },
  mounted() {
    document.documentElement.classList.remove("has-aside-left");
    document.documentElement.classList.remove("has-aside-mobile-transition");
    document.documentElement.classList.remove("has-navbar-fixed-top");
    document.documentElement.classList.remove("has-aside-expanded");
    if (localStorage.getItem("currentPhone")) {
      this.login.phone_number = localStorage.getItem("currentPhone");
    }
  },
  validations: {
    login: {
      phone_number: {
        required,
        minLength: minLength(10),
      },
    },
  },
  methods: {
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
    async userLogin() {
      const loadingComponent = this.$buefy.loading.open();
      if (!this.$v.$invalid) {
        let data = {
          phone_number: this.login.phone_number,
        };
        try {
          const response = await axios.post("/auth/phone-login/", data);
          this.$buefy.snackbar.open({
            message: response.data.message,
            type: "is-primary",
            position: "is-bottom",
            actionText: "Ok",
            indefinite: false,
          });
          localStorage.setItem("currentPhone", this.login.phone_number);
          this.$router.push("/enterOtpCode");
        } catch (err) {
          this.$buefy.snackbar.open({
            message: err.response.data.detail,
            type: "is-danger",
            position: "is-bottom",
            actionText: "Retry",
            indefinite: false,
          });
        }
      } else {
        this.$v.login.$touch();
      }
      loadingComponent.close();
    },
  },
  head() {
    return {
      title: "Login - Karobar",
    };
  },
};
</script>
<style lang="scss" scoped>
$green: #3ab98d;
section.bg-white {
  background-color: white;
}
.login-logo {
  background-color: white;
  z-index: 100;
  height: 6rem;
  position: fixed;
  padding-top: 0;
  .logo {
    img {
      position: absolute;
      top: 3rem;
      left: 7.75rem;
      color: #000;
      width: 7rem;
    }
  }
}

.notices .is-green {
  color: red;
}
.login {
  ::-webkit-input-placeholder {
    color: #676767;
    font-size: 15px;
  }
  .bg {
    background-color: #3ab98d08;
  }
  .login-form {
    padding-left: 7rem;
    padding-right: 15rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 100vh;
    margin-bottom: -0.75rem;
    .label {
      font-weight: 500;
      font-size: 16px;
      color: #000000;
    }
    .form-error {
      margin-bottom: 1rem;
    }
    .field {
      margin-bottom: 1rem;
    }
    .control.has-icons-right .icon.is-right {
      top: 3px;
    }
    input {
      height: 2.6rem;
      border-color: #aaaaaa;
      &::placeholder {
        font-size: 15px;
      }
      &:focus {
        box-shadow: none;
        border-color: #3ab98d;
      }
    }

    h1 {
      font-weight: bold;
      font-size: 25px;
      color: #03014c;
      padding-bottom: 5px;
    }
    p {
      padding-bottom: 1.5rem;
      color: #092c4cab;
    }
    .button {
      box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 6px -1px,
        rgba(0, 0, 0, 0.06) 0px 2px 4px -1px;
      width: 100%;
      height: 3em;
      margin-top: 1rem;
      &.is-primary {
        background-color: #3ab98d;
        border-color: transparent;
        color: white;
        &:hover {
          background-color: #3ab98d;
        }
      }
    }
    p.form-bottom {
      padding-top: 1rem;
      color: #03014c;
      a {
        color: $green;
        font-weight: bold;
      }
    }
  }
}

@media screen and (max-width: 1023px) {
  .bg {
    display: none;
  }
}
@media screen and (max-width: 768px) {
  .login .login-form {
    padding-left: 2rem;
    padding-right: 2rem;
  }
  .login-logo .logo {
    img {
      left: 3.75rem;
    }
  }
  .columns.is-mobile {
    margin: 0;
  }
}
</style>
<style lang="scss">
.notices .snackbar .action.is-primary .button {
  color: #3ab98d;
}
.login-form {
  .input {
    height: 2.8em;
  }
  .control .help.counter {
    display: none;
  }
  .control.has-icons-right .icon.is-right {
    height: 2.8em;
  }
}
</style>

