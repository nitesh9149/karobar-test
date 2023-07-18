<template>
  <b-modal class="renew-app-modal" :active.sync="isModalActive" has-modal-card>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">{{ title }}</p>
        <b-button class="close-button" @click="cancel" type="is-light">
          <b-icon icon="close" size="is-small"> </b-icon
        ></b-button>
      </header>
      <section class="modal-card-body">
        <div class="our-plan">
          <div>
            <h2>{{ planTitle }}</h2>
            <small>{{ version }}</small>
          </div>
          <div>
            <h4 class="price-crossed" v-if="discounted_from">
              Rs. {{ conversion(discounted_from) }}
            </h4>
            <h2 v-if="newPrice >= 0 && newPrice != null">
              Rs. {{ conversion(newPrice) }} <span>/year</span>
            </h2>
            <h2 v-else>
              Rs. {{ conversion(package_props.price) }} <span>/year</span>
            </h2>
          </div>
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
              <img src="@/img/khalti.png" alt="khalti" /> <span>Khalti</span>
            </div>
          </div>
        </div>
      </section>
      <footer class="modal-card-foot">
        <div class="buttons">
          <b-button @click="activateSubs" v-if="newPrice == 0" type="is-primary"
            >Activate Subscription
          </b-button>
          <b-button v-else @click="confirm" type="is-primary"
            >Pay Now
          </b-button>
        </div>
      </footer>
    </div>
  </b-modal>
</template>

<script>
export default {
  name: "ModalBox",

  props: {
    isActive: {
      type: Boolean,
      default: false,
    },
    plan: {
      type: String,
    },
    package_props: {
      type: Object,
    },
  },
  data() {
    return {
      isModalActive: false,
      showCoupon: false,
      isActiveBtn: "",
      title: "",
      version: "",
      planTitle: "",
      price: "",
      coupon: "",
      discounted_from: null,
      newPrice: null,
      couponApplied: false,
    };
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
    plan(plan) {
      if (plan == "renew-premium") {
        this.title = "Extend App License";
        this.version = "Web + Mobile App";
        this.planTitle = "PRO PLAN";
        this.price = "3,999";
      } else if (plan == "plus") {
        this.title = "Buy Subscription";
        this.version = "Mobile App";
        this.planTitle = "PLUS PLAN";
        this.price = "1,999";
      } else if (plan == "premium") {
        this.title = "Buy Subscription";
        this.version = "Web + Mobile App";
        this.planTitle = "PRO PLAN";
        this.price = "3,999";
      } else if (plan == "renew-plus") {
        this.title = "Extend App License";
        this.version = "Mobile App";
        this.planTitle = "PLUS PLAN";
        this.price = "1,999";
      }
    },
  },
  methods: {
    cancel() {
      this.$emit("cancel");
    },
    async couponApi() {
      try {
        let response = await this.$axios.get(
          "/referrals/apply-coupon/?code=" + this.coupon + "&package=2"
        );
        this.discounted_from = Number(this.package_props.price);
        let discount = Number(response.data.discount_percentage) / 100;
        let amount =
          this.package_props.price - discount * this.package_props.price;
        this.newPrice = amount;
        this.couponApplied = true;
        this.$emit("coupon", this.coupon);
      } catch (error) {
        this.$buefy.snackbar.open({
          message: error.response.data.detail,
          type: "is-danger",
          position: "is-bottom",
          indefinite: false,
        });
      }
    },
    confirm() {
      if (this.isActiveBtn) {
        this.$emit("confirm", this.isActiveBtn, this.newPrice);
        this.isActiveBtn = "";
      } else {
        this.$buefy.snackbar.open({
          message: "Please select payment method",
          type: "is-danger",
          position: "is-bottom",
          indefinite: false,
        });
      }
    },
    activateSubs() {
      this.$emit("activate");
    },
  },
};
</script>
<style lang="scss">
$green: #34a77f;
.renew-app-modal {
  .close-button {
    border: none !important;
    background-color: white;
    box-shadow: none;
    &.is-light {
      &:focus {
        box-shadow: none;
      }
      &:hover {
        background-color: white;
        border: 1px solid #dedede;
      }
    }
    .icon {
      font-size: 20px !important;
      color: black;
    }
  }
  .modal-card {
    width: 30vw;
    .modal-card-head,
    .modal-card-foot {
      padding: 10px 20px;
    }
    .modal-card-head {
      background-color: white;
      border-color: #dbdbdb;
      .modal-card-title {
        color: #333a4d;
        font-weight: 600;
        font-size: 21px;
      }
    }
    .modal-card-body {
      padding: 2rem 20px 1rem 20px;
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
          justify-content: space-between;
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
    }
    .modal-card-foot {
      display: block;
      background-color: white;
      padding-bottom: 1.5rem;
      border-top: 0;
      padding-top: 1.5rem;
      .buttons {
        width: 100%;
        .button {
          width: 100%;
          height: 2.8em;
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
    }
  }
}
</style>