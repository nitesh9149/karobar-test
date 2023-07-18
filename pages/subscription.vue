<template>
  <div>
    <extend-plan-modal
      :is-active="isModalActive"
      @confirm="trashConfirm"
      @cancel="trashCancel"
      :plan="plan"
      :package_props="package_obj"
      @coupon="getCoupon"
      @activate="activateSubs"
    />
    <section class="section is-title-bar">
      <div class="level">
        <div class="level-left">
          <div class="level-item">
            <ul>
              <li style="font-weight: 600">Your Karobar Subscription</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
    <section class="section is-main-section">
      <div class="columns">
        <div class="column is-6-desktop is-12-tablet">
          <div class="premium-plan">
            <div v-if="$auth.user.package != '0'">
              <h2>{{ $auth.user.subscription }}</h2>
              <h2 v-if="$auth.user.package == '2' && package_obj.price">
                <span v-if="package_obj.discounted_from" class="price-crossed"
                  >Rs. {{ conversion(package_obj.discounted_from) }}</span
                >
                Rs. {{ conversion(package_obj.price) }} /-
              </h2>
            </div>
            <div style="padding-bottom: 0" v-if="$auth.user.package == '0'">
              <h2>{{ $auth.user.subscription }}</h2>
              <h2>Free</h2>
            </div>
            <div v-if="$auth.user.package != '0'">
              <div>
                <p v-if="daysValue > 1" :class="{ red: daysValue == 0 }">
                  {{ daysValue }} Days Remaining
                </p>
                <p v-else :class="{ red: daysValue == 0 }">
                  <span v-if="!loading">{{ daysValue }} Day Remaining</span>
                </p>
                <b-progress
                  v-if="daysValue != 0"
                  class="primary"
                  :value="value"
                ></b-progress>
                <div v-else>
                  <b-progress
                    v-if="!loading"
                    class="primary isRed"
                    :value="0"
                  ></b-progress>
                </div>
              </div>
              <b-button
                v-if="$auth.user.package == '2'"
                @click="renew"
                type="is-primary"
                >Extend Plan</b-button
              >
            </div>
          </div>
          <div v-if="$auth.user.package != '0'" class="billing-history">
            <h2 class="section-title">Billing History</h2>
            <div class="billing-history-content">
              <header>
                <p>Details</p>
                <p>Amount</p>
              </header>
              <ul>
                <li v-for="item in billingHistory" :key="item.id">
                  <div>
                    <p>{{ item.title }}</p>
                    <small>{{ item.nep_date }}</small>
                  </div>
                  <div style="text-align: right">
                    <p>Rs. {{ item.amount_value }}</p>
                    <span style="color: #3ab98d; font-size: 0.9rem">{{
                      item.payment_method_value
                    }}</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="column is-6-desktop is-12-tablet">
          <b-tabs class="sublist-tab" v-model="activeTab">
            <!-- <b-tab-item label="Free Plan">
              <ul class="subscription-list">
                <li v-for="list in subscriptionListsFree" :key="list.id">
                  <p>{{ list.title }}</p>
                  <b-icon
                    v-if="list.check"
                    icon="check-circle"
                    type="is-green"
                  ></b-icon>
                  <b-icon
                    v-else
                    icon="close-circle-outline"
                    type="is-close"
                  ></b-icon>
                </li>
              </ul>
            </b-tab-item>

            <b-tab-item label="Plus Plan">
              <ul class="subscription-list">
                <li v-for="list in subscriptionListsPlus" :key="list.id">
                  <p>{{ list.title }}</p>
                  <b-icon
                    v-if="list.check"
                    icon="check-circle"
                    type="is-green"
                  ></b-icon>
                  <b-icon
                    v-else
                    icon="close-circle-outline"
                    type="is-close"
                  ></b-icon>
                </li>
              </ul>
            </b-tab-item> -->

            <b-tab-item label="Pro Plan">
              <ul class="subscription-list">
                <li v-for="list in subscriptionListsPremium" :key="list.id">
                  <p>{{ list.title }}</p>
                  <b-icon
                    v-if="list.check"
                    icon="check-circle"
                    type="is-green"
                  ></b-icon>
                  <b-icon
                    v-else
                    icon="close-circle-outline"
                    type="is-close"
                  ></b-icon>
                </li>
              </ul>
            </b-tab-item>
          </b-tabs>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
import axios from "axios";
import ExtendPlanModal from "@/components/ExtendPlanModal";
import NepaliDate from "nepali-date-converter";
import KhaltiCheckout from "khalti-checkout-web";
export default {
  components: { ExtendPlanModal },
  middleware: "subscription",
  data() {
    return {
      isModalActive: false,
      billingHistory: [],
      value: 0,
      loading: true,
      activeTab: 0,
      plan: "",
      daysValue: 0,
      package_obj: {},
      coupon: "",
      subscriptionListsFree: [
        {
          title: "Manage Daily Sale, Purchase & Expenses",
          check: true,
        },
        {
          title: "Manage Inventory",
          check: true,
        },
        {
          title: "Quick Billing Feature",
          check: true,
        },
        {
          title: "Track Party Receivables & Payables",
          check: true,
        },
        {
          title: "View Business Performance Stats & Reports",
          check: true,
        },
        {
          title: "Send Payment Reminders to Parties",
          check: true,
        },
        {
          title: "Maintain Cash In Hand & Bank Balance",
          check: true,
        },
        {
          title: "Online Data Backup & Restore",
          check: true,
        },
        {
          title: "Manage Only 1 Business",
          check: true,
        },
        {
          title: "Only 1 Device",
          check: true,
        },
        {
          title: "No Staff Members",
          check: false,
        },
        {
          title: "No Desktop Web Version",
          check: false,
        },
        {
          title: "Can't Create & Send Estimates",
          check: false,
        },
        {
          title: "Karobar Branding on Invoices",
          check: false,
        },
        {
          title: "No Invoice Customization Options",
          check: false,
        },
        {
          title: "No App Lock",
          check: false,
        },
      ],
      subscriptionListsPlus: [
        {
          title: "All Features From Free Version",
          check: true,
        },
        {
          title: "Create & Manage 2 Businesses",
          check: true,
        },
        {
          title: "Add 2 Staff Members",
          check: true,
        },
        {
          title: "Create & Send Estimates",
          check: true,
        },
        {
          title: "Hide Karobar Branding on Invoices",
          check: true,
        },
        {
          title: "Enable App Lock Feature",
          check: true,
        },
        {
          title: "Customize Invoices With Various Styles",
          check: true,
        },
        {
          title: "Priority Customer Support",
          check: true,
        },
        {
          title: "No Desktop Web Version",
          check: false,
        },
      ],
      subscriptionListsPremium: [
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
    try {
      if (this.$auth.user.package == "1") {
        this.activeTab = 1;
      } else if (this.$auth.user.package == "2") {
        this.activeTab = 2;
      } else {
        this.activeTab = 0;
      }
      let response = await axios.get("/subscription/subscriptions/", {
        headers: {
          Authorization: localStorage.getItem("auth._token.local"),
        },
      });
      response.data.forEach((element) => {
        var date1 = new Date(element.date);
        this.billingHistory.push({
          id: element.id,
          title: element.title,
          nep_date: new NepaliDate(date1).format("YYYY MMMM DD"),
          amount_value: this.conversion(element.amount),
          payment_method_value: element.payment_method_value,
        });
      });
      let expire =
        new Date(this.$auth.user.subscription_expiry).getTime() -
        new Date().getTime();
      let days = parseInt(Math.round(expire / (1000 * 3600 * 24)));
      this.daysValue = days < 0 ? 0 : Math.abs(days);
      if (days < 0) {
        this.value = 0;
      } else {
        this.value = 100 - (this.daysValue / 365) * 100;
      }
      let res_package = await axios.get("/subscription/packages/", {
        headers: {
          Authorization: localStorage.getItem("auth._token.local"),
        },
      });
      this.package_obj = res_package.data[2];
    } catch (error) {}
    this.loading = false;
  },
  methods: {
    renew() {
      this.isModalActive = true;
      this.plan = "renew-premium";
    },
    getCoupon(value) {
      this.coupon = value;
    },
    generateNum(package_id) {
      var choices = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
      var random = "";
      for (let i = 0; i < 6; i++) {
        random += choices[Math.floor(Math.random() * choices.length)];
      }
      let user_id = this.$auth.user.id;
      return package_id + "-" + user_id + "-" + random;
    },
    async trashConfirm(value, newPrice) {
      this.isModalActive = false;
      if (value == "khalti") {
        if (this.plan == "renew-premium") {
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
            amount: newPrice
              ? Number(newPrice) * 100
              : Number(this.package_obj.price) * 100,
          });
        }
      } else if (value == "esewa") {
        var path = "https://esewa.com.np/epay/main";
        var params = {};
        if (this.plan == "renew-premium" || this.plan == "premium") {
          params = {
            amt: newPrice ? newPrice : Number(this.package_obj.price),
            psc: 0,
            pdc: 0,
            txAmt: 0,
            tAmt: newPrice ? newPrice : Number(this.package_obj.price),
            pid: this.generateNum("2"),
            scd: "NP-ES-BYTE",
            su:
              "https://web.karobarapp.com/paymentProcess/?coupon=" +
              this.coupon,
            fu: "https://web.karobarapp.com/paymentFailed",
          };
        }
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
    trashCancel() {
      this.isModalActive = false;
    },
  },
  head() {
    return {
      title: "Subscription - Karobar",
    };
  },
};
</script>
<style lang="scss">
$green: #3ab98d;
iframe {
  height: 100%;
}
.premium-plan {
  background-color: white;
  border-radius: 4px;
  padding: 1.5rem 2rem;
  border: 1px solid $green;
  color: #333333;
  span.price-crossed {
    font-size: 1rem;
    text-decoration: line-through;
    color: #676767;
    padding-right: 0.5rem;
  }
  .progress {
    height: 0.75rem;
  }
  .red {
    color: #e54f6d;
  }
  .primary {
    .progress::-webkit-progress-value {
      background-color: $green;
    }
    &.isRed {
      progress::-webkit-progress-bar {
        background-color: #e54f6d;
        width: 100%;
      }
    }
  }

  & > div {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    &:first-child {
      padding-bottom: 1.5rem;
      h2 {
        font-weight: 600;
        font-size: 21px;
      }
    }
    &:last-child {
      & > div {
        width: 50%;
        p {
          font-weight: 500;
          padding-bottom: 0.75rem;
        }
      }
    }
    .button.is-primary {
      border-color: $green;
      color: white;
      background-color: $green;
      font-weight: 500;
      &:hover {
        background-color: $green;
      }
      &:focus {
        box-shadow: none;
      }
    }
  }
}
.premium-plan-btn {
  width: 100%;
  padding-top: 1rem;
  .button {
    display: flex;
    justify-content: center;
    column-gap: 1rem;
    padding: 1.4rem 1rem;
    width: 100%;
    &.is-white {
      background-color: $green;
      color: white;
    }
  }
}
.billing-history {
  padding-top: 2rem;
  color: #333333;
  h2.section-title {
    font-weight: 600;
    font-size: 21px;
    padding-bottom: 1rem;
  }
  .billing-history-content {
    background-color: white;
    border-radius: 4px;
    header {
      display: flex;
      justify-content: space-between;
      padding: 1rem;
      border-bottom: 1.5px solid #dedede;
      p {
        font-weight: 600;
      }
    }
    ul {
      height: 18.5rem;
      overflow-y: scroll;
      li {
        display: flex;
        justify-content: space-between;
        padding-bottom: 1rem;
        padding-top: 1rem;
        align-items: center;
        border-top: 1px solid #dedede;
        padding-left: 1rem;
        padding-right: 1rem;
        &:first-child {
          padding-top: 1rem;
          border-top: 0;
        }
        p {
          color: #252324;
        }
        div {
          small {
            color: #676767;
          }
        }
      }
    }
  }
  .card {
    padding: 1.5rem;
    .button.is-primary {
      width: 100%;
      padding: 1.5rem 0;
      border-color: $green;
      color: white;
      background-color: $green;
      font-weight: 600;
      &:hover {
        background-color: $green;
      }
      &:focus {
        box-shadow: none;
      }
    }
    & > div {
      display: flex;
      justify-content: space-between;
      color: #333333;
      align-items: center;
      padding-bottom: 1rem;
      & > div {
        &:first-child {
          h2 {
            padding-bottom: 0.3rem;
          }
        }
      }
      h2 {
        font-weight: 700;
        font-size: 20px;
        sup {
          font-size: 13px;
          font-weight: 400;
        }
      }
    }
  }
}
.sublist-tab {
  background-color: white;
  .tab-content {
    overflow-y: scroll;
    height: 33.5rem;
  }
  .tabs a {
    font-weight: 600;
    border-bottom-width: 0;
    padding: 0.75rem 1.5rem;
  }
  .tabs ul {
    border-bottom-width: 1px;
  }
  .tabs li.is-active a {
    border-bottom-color: $green;
    color: $green;
    border-bottom-width: 2px;
    font-weight: 600;
  }
  .tabs a:hover {
    border-bottom-color: $green;
    border-bottom-width: 2px;
  }
  .subscription-list {
    padding: 0 1rem;
    li {
      display: flex;
      justify-content: space-between;
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
</style>
