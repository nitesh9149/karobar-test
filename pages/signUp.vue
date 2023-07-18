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
      <div class="register">
        <div class="columns is-mobile">
          <div class="column column is-6-desktop is-12-tablet is-12-mobile">
            <div class="login-form">
              <h1>Create account</h1>
              <p>Signup for an account and start using Karobar app</p>
              <b-field label="Full Name">
                <b-input
                  @keyup.enter.native="register"
                  v-model="registerInfo.full_name"
                  type="text"
                  placeholder="Enter your Full Name"
                >
                </b-input>
              </b-field>
              <div v-if="$v.registerInfo.full_name.$error" class="form-error">
                <span class="help is-danger">Full Name is Required</span>
              </div>
              <b-field label="Phone Number">
                <b-input
                  @keyup.enter.native="register"
                  v-model="registerInfo.username"
                  type="text"
                  maxlength="10"
                  @keypress.native="isNumber($event)"
                  placeholder="Enter your Phone Number"
                >
                </b-input>
              </b-field>
              <div v-if="$v.registerInfo.username.$error" class="form-error">
                <span class="help is-danger">Phone Number is Required</span>
              </div>
              <b-field label="Password">
                <b-input
                  @keyup.enter.native="register"
                  v-model="registerInfo.password1"
                  type="password"
                  password-reveal
                  placeholder="Enter your Password"
                >
                </b-input>
              </b-field>
              <div v-if="$v.registerInfo.password1.$error" class="form-error">
                <span class="help is-danger">Password is Required</span>
              </div>
              <b-field label="Confirm Password">
                <b-input
                  @keyup.enter.native="register"
                  v-model="registerInfo.password2"
                  type="password"
                  password-reveal
                  placeholder="Enter your Password"
                >
                </b-input>
              </b-field>
              <div v-if="$v.registerInfo.password2.$error" class="form-error">
                <span class="help is-danger"
                  >Password Confirmation is Required</span
                >
              </div>
              <b-button @click="register" type="is-primary"
                >Create Account</b-button
              >
              <p class="form-bottom">
                Already have an account?
                <nuxt-link to="/login"> Log in</nuxt-link>
              </p>
            </div>
          </div>
          <div class="column is-6 bg">
            <sign-up-slide />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
import SignUpSlide from "@/components/LoginSlide";
import axios from "axios";
import { required } from "vuelidate/lib/validators";
export default {
  layout: "empty",
  auth: false,
  components: {
    SignUpSlide,
  },
  data() {
    return {
      registerInfo: {
        username: "",
        password1: "",
        password2: "",
        full_name: "",
      },
    };
  },
  validations: {
    registerInfo: {
      username: {
        required,
      },
      password1: {
        required,
      },
      password2: {
        required,
      },
      full_name: {
        required,
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
    async register() {
      const loadingComponent = this.$buefy.loading.open();
      if (!this.$v.$invalid) {
        try {
          const data = this.registerInfo;
          let response = await axios.post("/auth/registration/", data);
          this.$buefy.snackbar.open({
            message: "Your account has been created. Please login to continue.",
            type: "is-primary",
            position: "is-bottom",
            indefinite: false,
          });
        } catch (err) {
          if (err.response.status == 480) {
            try {
              localStorage.setItem("currentPhone", this.registerInfo.username);
              let data = {
                phone_number: this.registerInfo.username,
              };
              let verify = await axios.post("/auth/verify-number/", data);
              this.$router.push("/enterOtpCode");
              this.$buefy.snackbar.open({
                message: verify.data.message,
                type: "is-primary",
                position: "is-bottom",
                actionText: "Ok",
                indefinite: false,
              });
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
            this.$buefy.snackbar.open({
              message: err.response.data.detail,
              type: "is-primary",
              position: "is-bottom",
              actionText: "Retry",
              indefinite: false,
            });
          }
        }
      } else {
        this.$v.registerInfo.$touch();
      }
      loadingComponent.close();
    },
  },
  head() {
    return {
      title: "Create an Account - Karobar",
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
.register {
  ::-webkit-input-placeholder {
    color: #676767;
    font-size: 15px;
  }
  .bg {
    background-color: #3ab98d08;
  }
  .login-form {
    padding-top: 7rem;
    padding-left: 7rem;
    padding-right: 7rem;
    height: 100vh;
    margin-bottom: -0.75rem;
    .label {
      font-weight: 500;
      font-size: 16px;
      color: #000000;
    }
    .form-error {
      // margin-bottom: 1rem;
      margin-top: -0.75rem;
    }
    .field {
      margin-bottom: 1em;
    }
    .control.has-icons-right .icon.is-right {
      top: 3px;
    }
    input {
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
@media screen and (max-width: 1024px) {
  .bg {
    display: none;
  }
}
@media screen and (max-width: 768px) {
  .register {
    .login-form {
      padding-left: 2rem;
      padding-right: 2rem;
    }
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
  .control.has-icons-right .icon.is-right {
    height: 2.8em;
  }
}
</style>