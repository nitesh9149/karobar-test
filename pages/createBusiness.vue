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
      <div class="create-business">
        <div class="columns is-mobile">
          <div class="column column is-6-desktop is-12-tablet is-12-mobile">
            <div class="login-form">
              <h1>Create Business</h1>
              <b-field label="Full Name">
                <b-input
                  v-model="registerInfo.full_name"
                  placeholder="Enter Full Name"
                ></b-input>
              </b-field>
              <div v-if="$v.registerInfo.full_name.$error" class="form-error">
                <span class="help is-danger">Full Name is Required</span>
              </div>
              <b-field label="Business Name">
                <b-input
                  v-model="registerInfo.business_name"
                  placeholder="Enter Business Name"
                ></b-input>
              </b-field>
              <div
                v-if="$v.registerInfo.business_name.$error"
                class="form-error"
              >
                <span class="help is-danger">Business Name is Required</span>
              </div>
              <b-field label="Business Address">
                <b-input
                  v-model="registerInfo.address"
                  placeholder="Enter Business Address"
                ></b-input>
              </b-field>
              <div v-if="$v.registerInfo.address.$error" class="form-error">
                <span class="help is-danger">Address is Required</span>
              </div>
              <b-field label="Business Category" expanded>
                <CustomSelect
                  :options="category"
                  :default="'Select a Business Category'"
                  class="select"
                  @value="value"
                />
              </b-field>
              <b-button class="register-btn" @click="register" type="is-primary"
                >Start Using App</b-button
              >
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
import CustomSelect from "@/components/CustomSelect.vue";
export default {
  layout: "empty",
  auth: true,
  components: {
    SignUpSlide,
    CustomSelect,
  },
  data() {
    return {
      isScrollable: true,
      maxHeight: 200,
      registerInfo: {
        full_name: "",
        business_name: "",
        category: "",
        address: "",
        user: this.$auth.user.id,
      },
      category: [
        { text: "Agriculture", value: "agriculture" },
        { text: "Auto / Parts", value: "auto" },
        { text: "Bakery", value: "bakery" },
        { text: "Beauty Parlour", value: "beauty" },
        { text: "Clothing", value: "clothing" },
        { text: "Computer Services", value: "computer" },
        { text: "Construction", value: "construction" },
        { text: "Consulting", value: "consulting" },
        { text: "Cosmetics", value: "cosmetics" },
        { text: "Catering", value: "catering" },
        { text: "Dairy Products", value: "dairy" },
        { text: "Education", value: "education" },
        { text: "Electronics", value: "electronics" },
        { text: "Entertainment", value: "entertainment" },
        { text: "Fashion Accessories", value: "fashion" },
        { text: "Financial Services", value: "financial" },
        { text: "Food & Beverages", value: "food" },
        { text: "Footwear", value: "footwear" },
        { text: "Fresh House", value: "freshhouse" },
        { text: "Fruits & Vegetables", value: "fruits" },
        { text: "Furniture", value: "furniture" },
        { text: "Garage", value: "garage" },
        { text: "General Stores (Kirana)", value: "general" },
        { text: "Gift & Toys", value: "gift" },
        { text: "Hardware", value: "hardware" },
        { text: "Hotel", value: "hotel" },
        { text: "Information Technology", value: "it" },
        { text: "Jwellery", value: "jwellery" },
        { text: "Kitchen Utensils", value: "kitchen" },
        { text: "Maintenance Services", value: "maintenance" },
        { text: "Medical & Healthcare", value: "medical" },
        { text: "Mobile & Accessories", value: "mobile" },
        { text: "Nuresery", value: "nursery" },
        { text: "Personal", value: "personal" },
        { text: "Pet Stores", value: "pet" },
        { text: "Printing", value: "printing" },
        { text: "Pooja Bhandar", value: "pooja" },
        { text: "Poultry", value: "poultry" },
        { text: "Restaurant & Cafe", value: "restaurant" },
        { text: "Sailon", value: "salon" },
        { text: "Sports & Fitness", value: "sports" },
        { text: "Stationery", value: "stationery" },
        { text: "Sweet Shop", value: "sweets" },
        { text: "Tailoring", value: "tailoring" },
        { text: "Textiles", value: "textiles" },
        { text: "Tours & Travel", value: "tours" },
        { text: "Veterinary", value: "veterinary" },
        { text: "Others", value: "others" },
      ],
    };
  },
  validations: {
    registerInfo: {
      full_name: {
        required,
      },
      business_name: {
        required,
      },
      address: {
        required,
      },
    },
  },

  methods: {
    value(a) {
      this.registerInfo.category = a;
    },
    valueBusiness(a) {
      this.registerInfo.business_type = a;
    },
    async register() {
      const loadingComponent = this.$buefy.loading.open();
      if (!this.$v.$invalid) {
        if (
          this.registerInfo.category === "Select a Business Category" ||
          this.registerInfo.category === ""
        ) {
          this.$buefy.snackbar.open({
            message: "Please Select Your Business Category",
            type: "is-danger",
            position: "is-bottom",
            indefinite: false,
          });
        } else {
          try {
            let business_data = this.registerInfo;
            await axios.post("/auth/setup/", business_data, {
              headers: {
                Authorization: localStorage.getItem("auth._token.local"),
              },
            });

            this.$buefy.snackbar.open({
              message:
                "Your business has been successfully created. You can start using Karobar now.",
              type: "is-primary",
              position: "is-bottom",
              indefinite: false,
            });
            window.location.assign("/");
          } catch (err) {
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
.create-business {
  .bg {
    background-color: #3ab98d08;
  }
  ::-webkit-input-placeholder {
    color: #676767;
    font-size: 15px;
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
      margin-top: -1rem;
      margin-bottom: 0.5rem;
    }
    .field {
      margin-bottom: 1.5em;
    }
    .control.has-icons-right .icon.is-right {
      top: 3px;
    }
    h1 {
      font-weight: bold;
      font-size: 25px;
      color: #03014c;
      padding-bottom: 1.5rem;
    }
    .register-btn {
      box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 6px -1px,
        rgba(0, 0, 0, 0.06) 0px 2px 4px -1px;
      width: 100%;
      height: 3em;
      margin-top: 1rem;
      font-weight: 600;
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
      padding-bottom: 2rem;
      a {
        color: $green;
        font-weight: bold;
      }
    }
  }
  .received-label {
    color: #363636;
    font-size: 1rem;
    font-weight: 600;
    display: block;
    margin-bottom: 0.5rem;
  }
  .dropdown-btn {
    box-shadow: none !important;
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
    &.left-adjust {
      border-radius: 0 4px 4px 0;
    }
  }
}
.slide-bottom {
  text-align: center;
  padding: 0 2rem 2rem;
  h1 {
    font-weight: bold;
    padding-bottom: 1rem;
    color: #03014c;
    padding-top: 1rem;
    font-size: 25px;
  }
  p {
    color: #092c4cab;
  }
}
@media screen and (max-width: 1024px) {
  .bg {
    display: none;
  }
}
@media screen and (max-width: 768px) {
  .create-business .login-form {
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
<style>
.notices .snackbar .action.is-primary .button {
  color: #3ab98d;
}
</style>
<style lang="scss">
.create-business {
  .input {
    height: 2.8em;
  }
}
</style>
