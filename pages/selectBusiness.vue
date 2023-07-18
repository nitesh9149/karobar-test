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
      <div class="select-business">
        <div class="columns is-mobile">
          <div class="column is-6-desktop is-12-tablet is-12-mobile">
            <div class="business-list">
              <h1>Select Business To Continue</h1>
              <ul>
                <li
                  @click="selectBusiness(business)"
                  v-for="business in businesses"
                  :key="business.id"
                >
                  <div>{{ business.business_name_short }}</div>
                  <div>
                    <p class="bold">{{ business.business_name }}</p>
                    <small>{{ business.role_value }}</small>
                  </div>
                </li>
              </ul>
              <span @click="logout" class="logout-btn"
                ><b-icon icon="logout" size="is-small"></b-icon>Logout</span
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
import LoginSlide from "@/components/LoginSlide";
import axios from "axios";
export default {
  layout: "empty",
  components: {
    LoginSlide,
  },
  data() {
    return {
      businesses: "",
    };
  },
  async mounted() {
    const loadingComponent = this.$buefy.loading.open();
    let list = [];
    const response = await axios.get("auth/user/", {
      headers: {
        Authorization: localStorage.getItem("auth._token.local"),
      },
    });
    response.data.businesses.forEach((business) => {
      list.push({
        id: business.id,
        business_name: business.business_name,
        business: business.business,
        role: business.role,
        role_value: business.role_value,
        business_name_short: business.business_name.charAt(0).toUpperCase(),
      });
    });
    this.businesses = list;
    loadingComponent.close();
  },
  methods: {
    selectBusiness(business) {
      localStorage.setItem("business", business.business);
      localStorage.setItem("role", business.role);
      this.$router.push("/");
    },
    logout() {
      localStorage.clear();
      this.$auth.logout();
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
.select-business {
  .bg {
    background-color: #3ab98d08;
  }
  .business-list {
    padding-left: 7rem;
    padding-right: 6rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 100vh;
    margin-bottom: -0.75rem;
    h1 {
      font-weight: bold;
      font-size: 25px;
      color: #03014c;
      padding-bottom: 2rem;
    }
    ul {
      height: 52vh;
      width: 70%;
      overflow-y: scroll;
      li {
        display: flex;
        align-items: center;
        column-gap: 1rem;
        color: #333333;
        cursor: pointer;
        border: 1px solid #dedede;
        padding: 1rem;
        border-radius: 4px;
        margin-bottom: 1rem;
        div {
          p.bold {
            font-weight: 600;
          }
          &:first-child {
            background-color: $green;
            color: white;
            width: 2.5rem;
            height: 2.5rem;
            border-radius: 50%;
            text-align: center;
            line-height: 2.5;
            font-weight: 500;
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
}

@media screen and (max-width: 1023px) {
  .bg {
    display: none;
  }
}
@media screen and (max-width: 768px) {
  .select-business .business-list {
    padding-left: 2rem;
    padding-right: 2rem;
  }
  .select-business .business-list ul {
    width: 100%;
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
</style>

