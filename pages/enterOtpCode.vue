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
      <form class="login">
        <div class="columns is-mobile">
          <div class="column is-6-desktop is-12-tablet is-12-mobile">
            <div class="login-form-otp">
              <h1>Enter OTP Code</h1>
              <p>Code Sent to +977 {{ currentPhone }} <span @click="toLogin" class="color">Change</span></p>
              <b-field class="codeBlock" label="Enter Code">
                <div style="display: flex; flex-direction: row">
                  <v-otp-input
                    ref="otpInput"
                    input-classes="otp-input"
                    separator=""
                    :num-inputs="6"
                    :should-auto-focus="true"
                    :is-input-num="true"
                    @on-complete="handleOnComplete"
                  />
                </div>
              </b-field>
              <div class="bottom-otp">
                <p
                  v-if="countDown == 0"
                  @click="resendCode"
                  class="resend-code"
                >
                  Resend OTP Code
                </p>
                <p v-else style="padding-bottom: 0; color: #000">
                  Resend OTP Code in {{ countDown }}s
                </p>
              </div>

              <b-button @click="otpCheck" type="is-primary">Continue</b-button>
              <!-- <p class="form-bottom">
                Already Verified?
                <nuxt-link to="/login"> Log in</nuxt-link>
              </p> -->
            </div>
          </div>
          <div class="column is-6 bg">
            <login-slide />
          </div>
        </div>
      </form>
    </section>
  </div>
</template>
<script>
import LoginSlide from "@/components/LoginSlide";
import axios from "axios";
export default {
  layout: "empty",
  components: {
    LoginSlide,
  },
  auth: false,
  data() {
    return {
      countDown: 30,
      currentPhone: "",
    };
  },
  created() {
    this.countDownTimer();
  },
  mounted() {
    if (localStorage.getItem("currentPhone")) {
      this.currentPhone = localStorage.getItem("currentPhone");
    }
  },
  methods: {
    toLogin() {
      this.$router.push("/login");
    },
    async handleOnComplete(value) {
      const loadingComponent = this.$buefy.loading.open();
      try {
        let data = {
          phone_number: this.currentPhone,
          otp: value,
        };
        await this.$auth.loginWith("local", { data: data });
        this.$buefy.snackbar.open({
          message: "Logged in successfully.",
          type: "is-primary",
          position: "is-bottom",
          actionText: "Ok",
          indefinite: false,
        });
        this.$router.push("/");
      } catch (err) {
        this.$refs.otpInput.clearInput();
        this.$buefy.snackbar.open({
          message: err.response.data.detail,
          type: "is-primary",
          position: "is-bottom",
          actionText: "Retry",
          indefinite: false,
        });
      }
      loadingComponent.close();
    },
    async resendCode() {
      const loadingComponent = this.$buefy.loading.open();
      try {
        localStorage.setItem("currentPhone", this.currentPhone);
        let data = {
          phone_number: this.currentPhone,
        };
        let verify = await axios.post("/auth/phone-login/", data);
        this.countDown = 30;
        this.countDownTimer();
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
          type: "is-danger",
          position: "is-bottom",
          actionText: "Retry",
          indefinite: false,
        });
      }
      loadingComponent.close();
    },
    countDownTimer() {
      if (this.countDown > 0) {
        setTimeout(() => {
          this.countDown -= 1;
          this.countDownTimer();
        }, 1000);
      }
    },
    otpCheck() {
      this.$buefy.snackbar.open({
        message: "Please enter otp code.",
        type: "is-primary",
        position: "is-bottom",
        actionText: "Retry",
        indefinite: false,
      });
    },
  },
  head() {
    return {
      title: "Enter OTP Code - Karobar",
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
  .login-form-otp {
    padding-left: 7rem;
    padding-right: 6rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 100vh;
    margin-bottom: -0.75rem;
    span.color {
      color: $green;
      cursor: pointer;
      padding-left: 0.5rem;
    }
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
    .bottom-otp {
      display: flex;
      justify-content: space-between;
      width: 72%;
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
      &.resend-code {
        padding-bottom: 0;
        color: $green;
        cursor: pointer;
        font-weight: 600;
        font-size: 15px;
      }
    }
    .button {
      box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 6px -1px,
        rgba(0, 0, 0, 0.06) 0px 2px 4px -1px;
      width: 72%;
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
  .login .login-form-otp {
    padding-left: 0;
    padding-right: 0;
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
.login-form-otp {
  .input {
    height: 2.8em;
  }
}
.codeBlock {
  .otp-input {
    width: 2.8em;
    height: 2.8em;
    margin: 0 10px;
    font-size: 16px;
    border-radius: 4px;
    border: 1px solid #dedede;
    text-align: center;
    &.error {
      border: 1px solid red !important;
    }
    &:focus-visible {
      outline: none;
    }
  }
  .otp-input::-webkit-inner-spin-button,
  .otp-input::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
}
@media screen and (max-width:768px) {
  .codeBlock .otp-input {
    width: 2.4em;
    height: 2.4em;
    margin: 0 5px;
    font-size: 14px;
}
.login .login-form-otp .button[data-v-16f9b28e] {
    width: 100%;
}
}
</style>

