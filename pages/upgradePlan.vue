<template>
  <div>
    <section class="bg-white">
      <div class="columns">
        <div class="login-logo column is-6-desktop is-12-tablet is-12-mobile">
          <nuxt-link to="/" class="logo"
            ><img src="@/img/Logo.png" alt="Karobar logo"
          /></nuxt-link>
        </div>
      </div>
      <div class="upgrade-plan">
        <div class="columns is-mobile">
          <div class="column is-6-desktop is-12-tablet is-12-mobile">
            <div class="plan-content">
              <div class="business-switch">
                <p style="font-size: 18px; font-weight: 600">
                  {{ business.name }}
                </p>
                <p
                  @click="$router.push('/selectBusiness')"
                  style="color: #3ab98d; cursor: pointer; font-weight: 600"
                >
                  Switch Business
                </p>
              </div>
              <h1>Upgrade To Pro Plan</h1>
              <p>Web Version of Karobar is only available for Pro Users.</p>
              <div class="our-plan">
                <div>
                  <h2>PRO PLAN</h2>
                  <small>Web + Mobile App</small>
                </div>
                <div>
                  <h4 class="price-crossed" v-if="discounted_from">
                    Rs. {{ conversion(discounted_from) }}
                  </h4>
                  <h2 v-if="newPrice >= 0 && newPrice != null">
                    Rs. {{ conversion(newPrice) }} <span>/year</span>
                  </h2>
                  <h2 v-else-if="package_obj.price">
                    Rs. {{ conversion(package_obj.price) }} <span>/year</span>
                  </h2>
                </div>
                <!-- <div>
                  <h4 class="price-crossed" v-if="package_obj.discounted_from">
                    Rs. {{ conversion(package_obj.discounted_from) }}
                  </h4>
                  <h2 v-if="package_obj.price">
                    Rs. {{ conversion(package_obj.price) }} <span>/year</span>
                  </h2>
                </div> -->
              </div>
              <div class="coupon-code">
                <h4 v-if="!showCoupon" @click="showCoupon = true">
                  Apply Coupon Code
                </h4>
                <b-field expanded v-if="showCoupon && !couponApplied">
                  <b-input
                    expanded
                    v-model="coupon"
                    placeholder="Enter Code here"
                    type="text"
                  ></b-input>
                  <p class="control">
                    <b-button @click="couponApi" class="button is-primary"
                      >Apply</b-button
                    >
                  </p>
                </b-field>
                <h4 style="cursor: auto" v-if="couponApplied">
                  Coupon Code applied successfully
                </h4>
              </div>
              <div v-if="newPrice != 0" class="payment-method">
                <h2>Select Payment Method</h2>
                <div>
                  <div
                    @click="isActiveBtn = 'esewa'"
                    :class="{ active: isActiveBtn === 'esewa' }"
                  >
                    <img src="@/img/esewa.png" alt="esewa" /> <span>eSewa</span>
                  </div>
                  <div
                    @click="isActiveBtn = 'khalti'"
                    :class="{ active: isActiveBtn === 'khalti' }"
                  >
                    <img src="@/img/khalti.png" alt="khalti" />
                    <span>Khalti</span>
                  </div>
                </div>
              </div>
              <div class="buttons">
                <b-button
                  @click="activateSubs"
                  v-if="newPrice == 0"
                  type="is-primary"
                  >Activate Subscription
                </b-button>
                <b-button v-else @click="upgrade" type="is-primary">
                  Buy Pro Plan</b-button
                >
              </div>
              <span @click="logout" class="logout-btn"
                ><b-icon icon="logout" size="is-small"></b-icon>Logout</span
              >
            </div>
          </div>
          <div class="column is-6-desktop is-12-tablet is-12-mobile bg">
            <div class="features-list">
              <h1>Pro Features</h1>
              <ul class="subscription-list">
                <li v-for="list in subscriptionLists" :key="list.id">
                  <b-icon
                    v-if="list.check"
                    icon="check-circle"
                    type="is-green"
                  ></b-icon>
                  <p>{{ list.title }}</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
import LoginSlide from "@/components/LoginSlide";
import { required } from "vuelidate/lib/validators";
import axios from "axios";
import KhaltiCheckout from "khalti-checkout-web";
export default {
  layout: "empty",
  components: {
    LoginSlide,
  },
  data() {
    return {
      login: {
        username: "",
        password: "",
      },
      showCoupon: false,
      coupon: "",
      discounted_from: null,
      newPrice: null,
      couponApplied: false,
      business: {},
      isActiveBtn: "",
      package_obj: {},
      subscriptionLists: [
        {
          title: "All Features From Free Version",
          check: true,
        },
        {
          title: "Desktop Web Version",
          check: true,
        },
        // {
        //   title: "Create & Manage 5 Businesses",
        //   check: true,
        // },
        {
          title: "Use Karobar App on Mobile",
          check: true,
        },
        {
          title: "Add 5 Staff Members",
          check: true,
        },
        {
          title: "Customize Invoices With Various Styles",
          check: true,
        },
        // {
        //   title: "Create & Send Estimates",
        //   check: true,
        // },
        {
          title: "Hide Karobar Branding on Invoices",
          check: true,
        },
        {
          title: "View All Business Reports",
          check: true,
        },
        {
          title: "Priority Customer Support",
          check: true,
        },
      ],
    };
  },
  async mounted() {
    const loadingComponent = this.$buefy.loading.open();
    localStorage.getItem("business");
    let response = await axios.get(
      "/business/businesses/" + localStorage.getItem("business") + "/",
      {
        headers: {
          Authorization: localStorage.getItem("auth._token.local"),
        },
      }
    );
    this.business = response.data;

    loadingComponent.close();
    let res_package = await axios.get("/subscription/packages/", {
      headers: {
        Authorization: localStorage.getItem("auth._token.local"),
      },
    });
    this.package_obj = res_package.data[2];
  },
  validations: {
    login: {
      username: {
        required,
      },
      password: {
        required,
      },
    },
  },
  methods: {
    generateNum(package_id) {
      var choices = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
      var random = "";
      for (let i = 0; i < 6; i++) {
        random += choices[Math.floor(Math.random() * choices.length)];
      }
      let user_id = this.$auth.user.id;
      return package_id + "-" + user_id + "-" + random;
    },
    async couponApi() {
      try {
        let response = await this.$axios.get(
          "/referrals/apply-coupon/?code=" + this.coupon + "&package=2"
        );
        this.discounted_from = Number(this.package_obj.price);
        let discount = Number(response.data.discount_percentage) / 100;
        let amount = this.package_obj.price - discount * this.package_obj.price;
        this.newPrice = amount;
        this.couponApplied = true;
      } catch (error) {
        this.$buefy.snackbar.open({
          message: error.response.data.detail,
          type: "is-danger",
          position: "is-bottom",
          indefinite: false,
        });
      }
    },
    upgrade() {
      if (this.isActiveBtn) {
        if (this.isActiveBtn == "khalti") {
          let axios = this.$axios;
          let Object = this;
          let config = {
            // replace this key with yours
            publicKey: "live_public_key_91d1ffb7820d40edab355088ef68012d",
            productIdentity: "2",
            productName: "Pro",
            productUrl: "https://www.karobarapp.com/",
            eventHandler: {
              async onSuccess(payload) {
                // hit merchant api for initiating verfication
                try {
                  let data = {
                    package: payload.product_identity,
                    payment_method: "khalti",
                    amount: payload.amount / 100,
                    token: payload.token,
                    coupon: Object.coupon,
                  };
                  let response = await axios.post(
                    "/subscription/payment/",
                    data
                  );
                  if (response.data.success) {
                    Object.$buefy.snackbar.open({
                      message: response.data.message,
                      type: "is-success",
                      position: "is-bottom",
                      indefinite: false,
                    });
                    window.location.assign("/");
                  } else {
                    Object.$buefy.snackbar.open({
                      message: response.data.message,
                      type: "is-danger",
                      position: "is-bottom",
                      indefinite: false,
                    });
                  }
                } catch (error) {
                  Object.$buefy.snackbar.open({
                    message: error.response.data.detail,
                    type: "is-danger",
                    position: "is-bottom",
                    indefinite: false,
                  });
                }
              },
              // onError handler is optional
              onError(error) {
                // handle errors
              },
              onClose() {},
            },
            paymentPreference: [
              "KHALTI",
              "EBANKING",
              "MOBILE_BANKING",
              "CONNECT_IPS",
              "SCT",
            ],
          };
          let checkout = new KhaltiCheckout(config);
          checkout.show({
            amount: this.newPrice
              ? Number(this.newPrice) * 100
              : Number(this.package_obj.price) * 100,
          });
        } else if (this.isActiveBtn == "esewa") {
          var path = "https://esewa.com.np/epay/main";
          var params = {
            amt: this.newPrice ? this.newPrice : Number(this.package_obj.price),
            psc: 0,
            pdc: 0,
            txAmt: 0,
            tAmt: this.newPrice
              ? this.newPrice
              : Number(this.package_obj.price),
            pid: this.generateNum("2"),
            scd: "NP-ES-BYTE",
            su:
              "https://web.karobarapp.com/paymentProcess/?coupon=" +
              this.coupon,
            fu: "https://web.karobarapp.com/paymentFailed",
          };
          var form = document.createElement("form");
          form.setAttribute("method", "POST");
          form.setAttribute("action", path);
          for (var key in params) {
            var hiddenField = document.createElement("input");
            hiddenField.setAttribute("type", "hidden");
            hiddenField.setAttribute("name", key);
            hiddenField.setAttribute("value", params[key]);
            form.appendChild(hiddenField);
          }
          document.body.appendChild(form);
          form.submit();
        }
      } else {
        this.$buefy.snackbar.open({
          message: "Please select payment method",
          type: "is-danger",
          position: "is-bottom",
          indefinite: false,
        });
      }
    },
    async activateSubs() {
      try {
        let data = {
          package: "2",
          payment_method: "free",
          amount: "0",
          token: "free",
          coupon: this.coupon,
        };
        let response = await this.$axios.post("/subscription/payment/", data);
        if (response.data.success) {
          this.$buefy.snackbar.open({
            message: response.data.message,
            type: "is-success",
            position: "is-bottom",
            indefinite: false,
          });
          window.location.assign("/");
        } else {
          this.$buefy.snackbar.open({
            message: response.data.message,
            type: "is-danger",
            position: "is-bottom",
            indefinite: false,
          });
        }
      } catch (error) {
        this.$buefy.snackbar.open({
          message: error.response.data.detail,
          type: "is-danger",
          position: "is-bottom",
          indefinite: false,
        });
      }
    },
    logout() {
      this.$auth.logout();
      localStorage.clear();
      this.$buefy.snackbar.open({
        message: "You have been logged out.",
        type: "is-primary",
        position: "is-bottom",
        indefinite: false,
      });
    },
  },
  head() {
    return {
      title: "Upgrade Plan - Karobar",
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
.upgrade-plan {
  .bg {
    background-color: #3ab98d08;
  }
  .business-switch {
    display: flex;
    justify-content: space-between;
    padding-bottom: 2rem;
    margin-top: -2rem;
  }
  .plan-content {
    padding-left: 7rem;
    padding-right: 12rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 100vh;
    margin-bottom: -0.75rem;
    h1 {
      font-weight: bold;
      font-size: 25px;
      color: #03014c;
      padding-bottom: 5px;
    }
    & > p {
      padding-bottom: 1.5rem;
      color: #092c4cab;
    }
    .our-plan {
      display: flex;
      justify-content: space-between;
      background-color: $green;
      color: white;
      border-radius: 6px;
      padding: 1rem;
      align-items: center;
      .price-crossed {
        text-align: right;
        text-decoration: line-through;
      }
      div {
        h2 {
          font-weight: 600;
          font-size: 20px;

          span {
            font-size: 13px;
            font-weight: 400;
          }
        }
      }
    }
    .coupon-code {
      padding-top: 1rem;
      h4 {
        cursor: pointer;
        color: $green;
        width: fit-content;
      }
      .button.is-primary {
        background-color: $green;
        box-shadow: none;
      }
    }
    .payment-method {
      padding-top: 1rem;
      h2 {
        font-weight: 600;
        font-size: 19px;
        padding-bottom: 1rem;
      }
      & > div {
        display: flex;
        column-gap: 2rem;
        div {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border: 1px solid #dedede;
          width: 11rem;
          border-radius: 4px;
          padding: 0.3rem 1.8rem;
          cursor: pointer;
          &.active {
            color: $green;
            border-color: $green;
            border-width: 1.5px;
          }
          &:first-child {
            img {
              width: 2.3rem;
            }
          }
          &:last-child {
            img {
              width: 3rem;
            }
          }
          span {
            font-weight: 600;
            font-size: 18px;
          }
        }
      }
    }
    .buttons {
      width: 100%;
      padding-top: 3rem;
      .button {
        width: 100%;
        padding-top: 1.8rem;
        padding-bottom: 1.8rem;
        font-weight: 600;
        &.is-primary {
          background-color: $green;
          color: white;
          border: none;
          &:focus {
            box-shadow: none;
            border: none;
          }
        }
      }
    }
    .logout-btn {
      color: #e54f6d;
      position: absolute;
      bottom: 4rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      column-gap: 0.4rem;
      cursor: pointer;
    }
  }

  .features-list {
    padding-top: 9.5rem;
    padding-left: 4rem;
    h1 {
      font-weight: bold;
      font-size: 22px;
      color: #03014c;
      padding-bottom: 1rem;
    }
    .subscription-list {
      li {
        display: flex;
        column-gap: 1rem;
        align-items: center;
        padding-bottom: 1rem;
        padding-top: 1rem;
        &:first-child {
          padding-top: 1rem;
        }
        .icon.has-text-green {
          color: $green;
        }
        .icon.has-text-close {
          color: #a8a8a8;
        }
      }
    }
  }
}

@media screen and (max-width: 1023px) {
  .upgrade-plan .features-list {
    padding-top: 3rem;
    padding-left: 7rem;
  }
}
@media screen and (max-width: 768px) {
  .upgrade-plan .plan-content {
    padding-left: 2rem;
    padding-right: 2rem;
  }
  .upgrade-plan .features-list {
    padding-top: 2rem;
    padding-left: 2rem;
  }
  .upgrade-plan .plan-content .our-plan {
    width: 100%;
  }
  .upgrade-plan .plan-content .buttons .button {
    width: 100%;
  }
  .upgrade-plan .plan-content .payment-method > div div {
    padding: 0.3rem 0.8rem;
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
iframe {
  height: 100%;
}
.notices .snackbar .action.is-primary .button {
  color: #3ab98d;
}
</style>

