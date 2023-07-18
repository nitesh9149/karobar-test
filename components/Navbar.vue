<template>
  <div>
    <keyboards-modal
      :is-active="isModalActive"
      @confirm="trashConfirm"
      @cancel="trashCancel"
    />
    <nav v-show="isNavBarVisible" id="navbar-main" class="navbar is-fixed-top">
      <div class="navbar-brand">
        <a
          href="#"
          class="navbar-item is-hidden-desktop"
          @click.prevent="menuToggleMobile"
        >
          <b-icon :icon="menuToggleMobileIcon" />
        </a>
        <nav-bar-menu class="navbar-item is-hidden-desktop">
          <nuxt-link aria-label="Go to homepage" class="nav-link" to="/"
            ><img
              class="logo"
              width="106"
              height="20"
              src="@/img/Logo.png"
              alt="karobar logo"
          /></nuxt-link>
        </nav-bar-menu>
      </div>
      <div class="navbar-brand is-right">
        <nuxt-link
            @click.native="triggerSidebar"
            to="/learnToUse"
            class="navbar-item is-hidden-desktop learn-nav"
            >Learn to use</nuxt-link
          >
        <a
          style="display: none"
          href="#"
          class="navbar-item navbar-item-menu-toggle is-hidden-desktop"
        >
          <b-icon icon="keyboard" custom-size="default" />
        </a>
        <a
          style="display: none"
          href="#"
          class="navbar-item navbar-item-menu-toggle is-hidden-desktop"
        >
          <b-icon icon="bell" custom-size="default" />
        </a>
        <div class="navbar-item navbar-item-menu-toggle is-hidden-desktop">
          <b-dropdown v-if="$auth.loggedIn" aria-role="list">
            <template #trigger>
              <b-button style="border: none"><user-avatar /></b-button>
            </template>

            <nuxt-link to="/accountSettings" class="dropdown-item">
              <b-icon icon="account-outline" custom-size="default"></b-icon>
              <span>Account Settings</span>
            </nuxt-link>
            <nuxt-link
              v-if="globalHelper('businessSettings')"
              to="/businessSettings"
              class="dropdown-item"
            >
              <b-icon icon="briefcase-outline" custom-size="default"></b-icon>
              <span>Business Settings</span>
            </nuxt-link>
            <span
              style="cursor: pointer"
              @click="logout"
              class="dropdown-item"
              exact-active-class="is-active"
            >
              <b-icon icon="logout" custom-size="default" />
              <span>Log Out</span>
            </span>
          </b-dropdown>
        </div>
      </div>
      <div
        class="navbar-menu fadeIn animated faster"
        :class="{ 'is-active': isMenuNavBarActive }"
      >
        <div class="navbar-start">
          <b-button
            @click.prevent="toggleSideMenu"
            aria-label="collapse sidebar"
            class="button-side"
            ><b-icon icon="menu" size="is-small"> </b-icon
          ></b-button>
          <div class="navbar-item img-logo">
            <nuxt-link aria-label="Go to homepage" class="nav-link" to="/"
              ><img
                class="logo"
                width="106"
                height="20"
                src="@/img/Logo.png"
                alt="karobar logo"
            /></nuxt-link>
          </div>
        </div>
        <div class="navbar-end">
          <nuxt-link
            @click.native="triggerSidebar"
            to="/learnToUse"
            class="navbar-item is-desktop-icon-only learn-nav"
            >Learn to use</nuxt-link
          >
          <a
            href="#"
            @click="trashModal"
            aria-label="View keyboard shortcuts"
            class="navbar-item is-desktop-icon-only"
          >
            <b-icon icon="keyboard" custom-size="default" />
          </a>
          {{ userName }}
          <a
            style="display: none"
            href="#"
            aria-label="View Notifications"
            class="navbar-item is-desktop-icon-only"
          >
            <b-dropdown
              :scrollable="isScrollable"
              :max-height="maxHeight"
              class="notification-dropdown"
              aria-role="list"
            >
              <template #trigger>
                <b-button icon-left="bell" />
              </template>

              <header>NOTIFICATIONS</header>
              <hr />
              <b-dropdown-item aria-role="listitem">
                <div class="columns">
                  <div class="column is-2">
                    <b-icon icon="bell-outline"></b-icon>
                  </div>
                  <div class="coulmn is-10">
                    <h1>Payment Reminder</h1>
                    <p>
                      You need to collect Rs. 10,000 from Samir Phuyal from
                      Sales #101.
                    </p>
                    <small>Magh 10, 2077</small>
                  </div>
                </div>
              </b-dropdown-item>
              <b-dropdown-item aria-role="listitem">
                <div class="columns">
                  <div class="column is-2">
                    <b-icon icon="bell-outline"></b-icon>
                  </div>
                  <div class="coulmn is-10">
                    <h1>Payment Reminder</h1>
                    <p>
                      You need to collect Rs. 10,000 from Samir Phuyal from
                      Sales #101.
                    </p>
                    <small>Magh 10, 2077</small>
                  </div>
                </div>
              </b-dropdown-item>
              <b-dropdown-item aria-role="listitem">
                <div class="columns">
                  <div class="column is-2">
                    <b-icon icon="bell-outline"></b-icon>
                  </div>
                  <div class="coulmn is-10">
                    <h1>Payment Reminder</h1>
                    <p>
                      You need to collect Rs. 10,000 from Samir Phuyal from
                      Sales #101.
                    </p>
                    <small>Magh 10, 2077</small>
                  </div>
                </div>
              </b-dropdown-item>
              <b-dropdown-item aria-role="listitem">
                <div class="columns">
                  <div class="column is-2">
                    <b-icon icon="bell-outline"></b-icon>
                  </div>
                  <div class="coulmn is-10">
                    <h1>Payment Reminder</h1>
                    <p>
                      You need to collect Rs. 10,000 from Samir Phuyal from
                      Sales #101.
                    </p>
                    <small>Magh 10, 2077</small>
                  </div>
                </div>
              </b-dropdown-item>
              <b-dropdown-item aria-role="listitem">
                <div class="columns">
                  <div class="column is-2">
                    <b-icon icon="bell-outline"></b-icon>
                  </div>
                  <div class="coulmn is-10">
                    <h1>Payment Reminder</h1>
                    <p>
                      You need to collect Rs. 10,000 from Samir Phuyal from
                      Sales #101.
                    </p>
                    <small>Magh 10, 2077</small>
                  </div>
                </div>
              </b-dropdown-item>
            </b-dropdown>
          </a>
          <nav-bar-menu
            v-if="$auth.loggedIn"
            class="has-divider has-user-avatar"
          >
            <user-avatar />
            <div class="is-user-name is-flex">
              <span>{{ $auth.user.full_name }}</span>
              <b-icon icon="chevron-down"></b-icon>
            </div>
            <div slot="dropdown" class="navbar-dropdown">
              <nuxt-link to="/accountSettings" class="navbar-item">
                <b-icon icon="account-outline" custom-size="default"></b-icon>
                <span>Account Settings</span>
              </nuxt-link>
              <nuxt-link
                v-if="globalHelper('businessSettings')"
                to="/businessSettings"
                class="navbar-item"
              >
                <b-icon icon="briefcase-outline" custom-size="default"></b-icon>
                <span>Business Settings</span>
              </nuxt-link>
              <span
                style="cursor: pointer"
                @click="logout"
                class="navbar-item"
                exact-active-class="is-active"
              >
                <b-icon icon="logout" custom-size="default" />
                <span>Log Out</span>
              </span>
            </div>
          </nav-bar-menu>
          <nav-bar-menu v-else class="has-divider has-user-avatar">
            <user-avatar />
            <div class="is-user-name">
              <span>Sign In</span>
            </div>
            <div slot="dropdown" class="navbar-dropdown">
              <a
                href="/login"
                class="navbar-item"
                exact-active-class="is-active"
              >
                <b-icon icon="account" custom-size="default" />
                <span>Login</span>
              </a>
              <!-- <a href="/signUp" class="navbar-item">
                <b-icon icon="account" custom-size="default"></b-icon>
                <span>Sign Up</span>
              </a> -->
              <!-- <a href="#" class="navbar-item">
                <b-icon icon="cog" custom-size="default"></b-icon>
                <span>Settings</span>
              </a>
              <a href="#" class="navbar-item">
                <b-icon icon="email" custom-size="default"></b-icon>
                <span>Messages</span>
              </a> -->
            </div>
          </nav-bar-menu>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
import { mapState } from "vuex";
import NavBarMenu from "@/components/NavBarMenu";
import UserAvatar from "@/components/UserAvatar";
import KeyboardsModal from "@/components/KeyboardsModal";

export default {
  name: "NavBar",
  components: {
    UserAvatar,
    NavBarMenu,
    KeyboardsModal,
  },
  data() {
    return {
      isMenuNavBarActive: false,
      userName: null,
      isModalActive: false,
      isScrollable: true,
      maxHeight: 500,
    };
  },
  computed: {
    menuNavBarToggleIcon() {
      return this.isMenuNavBarActive ? "close" : "dots-vertical";
    },
    menuToggleMobileIcon() {
      return this.isAsideMobileExpanded ? "menu" : "menu";
    },
    ...mapState([
      "isNavBarVisible",
      "isAsideMobileExpanded",
      "isAsideExpanded",
      "modalState",
    ]),
  },
  methods: {
    async logout() {
      try {
        this.$auth.logout();
        localStorage.clear();
        this.$buefy.snackbar.open({
          message: "You have been logged out.",
          type: "is-primary",
          position: "is-bottom",
          indefinite: false,
        });
      } catch (error) {}
    },
    menuToggleMobile() {
      this.$store.commit("asideMobileStateToggle");
    },
    menuNavBarToggle() {
      this.isMenuNavBarActive = !this.isMenuNavBarActive;
    },
    toggleSideMenu() {
      this.$store.commit("asideStateToggle");
    },
    trashModal() {
      this.isModalActive = true;
    },
    openKeyboard() {
      this.isModalActive = !this.isModalActive;
    },
    openKeyboardClose() {
      this.isModalActive = false;
    },
    trashConfirm() {
      this.isModalActive = false;
    },
    trashCancel() {
      this.isModalActive = false;
    },
    triggerSidebar() {
      this.$emit("openModal");
    },
  },
};
</script>
<style lang="scss">
.button-side {
  margin: 0 0.5rem 0 1rem;
  border: none;
  box-shadow: none !important;
  &:focus {
    box-shadow: none !important;
  }
  .icon {
    font-size: 21px;
  }
}
.navbar {
  .navbar-start {
    align-items: center;
  }
}
.navbar-link:hover,
a.navbar-item:hover {
  color: #34a77f;
  background-color: white;
}
.learn-nav {
  cursor: pointer;
  &:hover {
    color: #34a77f;
  }
}
.dropdown-item {
  .icon {
    padding-right: 1rem;
  }
}
.img-logo {
  padding: 0.3rem 0 0 0 !important;
}
img.logo {
  max-height: 1.2rem;
}
a.navbar-item:focus,
a.navbar-item:focus-within,
a.navbar-item:hover,
a.navbar-item.is-active,
.navbar-link:focus,
.navbar-link:focus-within,
.navbar-link:hover,
.navbar-link.is-active {
  background-color: white;
}
.navbar-item,
.navbar-link {
  .icon {
    font-size: 20px;
    color: #aaaaaa;
  }
  &.is-active {
    background-color: white !important;
  }
  &:hover {
    background-color: white !important;
  }
  &:focus {
    color: #34a77f !important;
    background-color: white !important;
  }
  .button {
    box-shadow: none;
  }
}
.notification-dropdown {
  .button {
    border: none;
    &:focus {
      box-shadow: none;
    }
  }
  header {
    font-weight: 600;
    padding: 0.5rem 1rem;
    color: #092c4c;
  }
  hr {
    margin: 0.5rem 0;
  }
  .dropdown-menu {
    left: -11rem;
    top: 150%;
    width: 24rem;
    &::after {
      content: " ";
      position: absolute;
      right: 10.8rem;
      top: -13px;
      border-top: none;
      border-right: 15px solid transparent;
      border-left: 15px solid transparent;
      border-bottom: 19px solid white;
    }
    &::before {
      content: " ";
      position: absolute;
      right: 10.8rem;
      top: -15px;
      border-top: none;
      border-right: 15px solid transparent;
      border-left: 15px solid transparent;
      border-bottom: 19px solid #f1f1f1;
    }
    .dropdown-item {
      white-space: normal;
      padding: 1.375rem 1rem;
      h1 {
        font-weight: 600;
        font-size: 16px;
        color: #092c4c;
        margin-bottom: 0.5rem;
      }
      .icon {
        color: #3ab98d;
        width: max-content;
        margin: auto;
      }
      p {
        color: #092c4c;
        margin-bottom: 0.5rem;
      }
      small {
        color: #676767;
      }
    }
  }
}

@media screen and (min-width: 1024px) {
  nav.navbar .navbar-item {
    padding-right: 0.7rem;
    padding-left: 0.7rem;
  }
  nav.navbar .navbar-item.has-dropdown {
    min-width: 12rem;
  }
  .navbar-item.has-dropdown:focus .navbar-link,
  .navbar-item.has-dropdown:hover .navbar-link,
  .navbar-item.has-dropdown.is-active .navbar-link {
    background-color: white;
  }
}
@media screen and (max-width: 1023px) {
  .navbar-brand .navbar-item,
  .navbar-tabs .navbar-item {
    padding: 10px;
  }
}
</style>
