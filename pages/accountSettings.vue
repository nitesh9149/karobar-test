<template>
  <div>
    <change-password-modal
      :is-active="isModalActive"
      @confirm="trashConfirm"
      @cancel="trashCancel"
    />
    <section class="section is-title-bar">
      <div class="level">
        <div class="level-left">
          <div class="level-item">
            <ul>
              <li>Account Settings</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
    <section class="section is-main-section">
      <div class="box settings-page">
        <div class="settings-title">
          <div class="person-info">
            <div class="person-img">
              <div
                class="image-input"
                :style="{ 'background-image': `url(${imageData})` }"
                @click="chooseImage"
              >
                <span v-if="!imageData" class="placeholder">
                  <b-icon icon="camera-plus" size="is-large"></b-icon>
                </span>
                <input
                  class="file-input"
                  ref="fileInput"
                  type="file"
                  accept="image/png, image/jpeg, image/jpg"
                  @input="onSelectFile"
                />
              </div>
            </div>
            <div class="person-detail">
              <h1>{{ $auth.user.full_name }}</h1>
              <p>{{ $auth.user.phone_number }}</p>
            </div>
          </div>
        </div>
        <div class="settings-body">
          <div class="columns">
            <div class="column is-4">
              <b-field label="Your Name">
                <b-input
                  type="text"
                  placeholder="Enter Your Full Name"
                  v-model="user.full_name"
                ></b-input>
              </b-field>
              <div v-if="$v.user.full_name.$error" class="form-error">
                <span class="help is-danger">Full Name is Required</span>
              </div>
            </div>
            <div class="column is-4">
              <b-field label="Address">
                <b-input
                  v-model="user.address"
                  type="text"
                  placeholder="Enter Your Address"
                ></b-input>
              </b-field>
            </div>
          </div>
          <div class="columns">
            <div class="column is-4">
              <b-field label="Email">
                <b-input
                  type="email"
                  placeholder="Enter Your Email"
                  v-model="user.email"
                ></b-input>
              </b-field>
            </div>
          </div>
        </div>
        <div class="settings-footer">
          <b-button @click="logout" type="is-danger">LOG OUT</b-button>
          <b-button @click="save" type="is-primary">SAVE</b-button>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
import axios from "axios";
import { required } from "vuelidate/lib/validators";
import ChangePasswordModal from "@/components/ChangePasswordModal";
export default {
  layout: "settings",
  middleware: "auth-business",
  components: { ChangePasswordModal },
  data() {
    return {
      imageData: this.$auth.user.photo,
      phone_number: this.$auth.user.phone_number,
      user: {
        full_name: this.$auth.user.full_name,
        address: this.$auth.user.address,
        email: this.$auth.user.email,
      },
      isModalActive: false,
    };
  },
  validations: {
    user: {
      full_name: {
        required,
      },
    },
  },
  methods: {
    chooseImage() {
      this.$refs.fileInput.click();
    },
    async save() {
      const loadingComponent = this.$buefy.loading.open();
      if (!this.$v.$invalid) {
        try {
          let formData = new FormData();
          formData.append("full_name", this.user.full_name);
          formData.append("address", this.user.address);
          formData.append("email", this.user.email);
          if (this.imageData && this.file) {
            formData.append("photo", this.file);
          }
          await axios.patch("/auth/user/", formData, {
            headers: {
              Authorization: localStorage.getItem("auth._token.local"),
              "Content-type": "multipart/form-data",
            },
          });
          this.$buefy.snackbar.open({
            message: "Your account has been updated",
            type: "is-primary",
            position: "is-bottom",
            indefinite: false,
          });
          this.$router.go();
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
        this.$v.user.$touch();
      }
      loadingComponent.close();
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
      // this.$axios.setHeader("Authorization", null);
      // window.location.assign("/login")
    },
    onSelectFile() {
      const input = this.$refs.fileInput;
      const files = input.files;
      this.file = files[0];
      if (files && files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.imageData = e.target.result;
        };
        reader.readAsDataURL(files[0]);
        this.$emit("input", files[0]);
      }
    },
    changePassword() {
      this.isModalActive = true;
    },
    trashConfirm() {
      this.isModalActive = false;
    },

    trashCancel() {
      this.isModalActive = false;
    },
  },
  head() {
    return {
      title: "Account Settings - Karobar",
    };
  },
};
</script>
<style lang="scss">
$green: #3ab98d;
.box.settings-page {
  box-shadow: none;
  padding: 0;
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
  .person-img {
    .image-input {
      display: block;
      width: 100%;
      height: 100%;
      cursor: pointer;
      background-repeat: no-repeat;
      background-size: cover;
      border-radius: 6px;
      background-position: center;
    }
    .file-input {
      display: none;
    }
  }

  ::-webkit-input-placeholder {
    color: #676767;
    font-size: 15px;
  }
  .label {
    font-weight: 500;
  }
  .settings-title {
    padding: 30px;
    border-bottom: 1px solid #dbdbdb;
    .person-info {
      display: flex;
      justify-content: start;
      flex-wrap: wrap;
      .person-img {
        width: 120px;
        height: 120px;
        background-color: #eff0f0;
        text-align: center;
        margin-right: 1.5rem;
        border-radius: 6px;
        .icon {
          color: $green;
          vertical-align: middle;
          &.is-large {
            width: 120px;
            height: 120px;
          }
        }
      }
      .person-detail {
        padding-top: 1.5rem;
        h1 {
          font-weight: 600;
          font-size: 21px;
          padding-top: 0.25rem;
        }
        a {
          color: #68768b;
        }
      }
    }
  }
  .settings-body {
    padding: 40px 30px;
    border-bottom: 1px solid #dbdbdb;
  }
  .settings-footer {
    display: flex;
    justify-content: space-between;
    padding: 15px 30px;
    flex-wrap: wrap;
    .button {
      text-align: middle;
      width: 12rem;
      height: 2.8rem;
      margin: 10px 0;
      &.is-danger {
        background-color: #e54f6d;
        &:focus {
          box-shadow: none;
        }
      }
      &.is-primary {
        background-color: $green;
        &:focus {
          box-shadow: none;
        }
      }
    }
  }
}
@media screen and (max-width: 480px) {
  .box.settings-page {
    .field {
      width: 100%;
    }
    .settings-title,
    .settings-body,
    .settings-footer {
      padding-left: 15px;
      padding-right: 15px;
    }
  }
}
</style>