<template>
  <b-modal class="messgae-modal" :active.sync="isModalActive" has-modal-card>
    <div class="modal-card">
      <div class="columns">
        <div class="column is-6">
          <div class="contact">
            <h1>Contact Information</h1>
            <ul>
              <li>
                <b-icon icon="phone-outline" size="default"> </b-icon>
                <a href="tel:9761812176" class="info">9761812176,</a>
                <a href="tel:9828134832" class="info-right">9828134832</a>
              </li>
              <li>
                <b-icon icon="email-outline" size="default"> </b-icon>
                <a href="mailto:contact@karobarapp.com" class="info"
                  >contact@karobarapp.com</a
                >
              </li>
              <li>
                <b-icon icon="map-marker-outline" size="default"> </b-icon>
                <span class="info">Sanepa, Lalitpur</span>
              </li>
              <li>
                <b-icon icon="facebook" size="default"> </b-icon>
                <a
                  href="https://www.facebook.com/karobarapp"
                  target="_blank"
                  class="info"
                  >@karobarapp</a
                >
              </li>
            </ul>
          </div>
        </div>
        <div class="column is-6">
          <div class="message-send">
            <b-button class="close-button" @click="cancel" type="is-light">
              <b-icon icon="close" size="is-small"> </b-icon
            ></b-button>
            <b-field label="Send Message">
              <b-input
                type="textarea"
                v-model="posts.message"
                placeholder="Write Here"
              ></b-input>
            </b-field>
            <div v-if="$v.posts.message.$error" class="form-error">
              <span class="help is-danger">Message is Required</span>
            </div>
            <div class="buttons">
              <b-button @click="confirm" type="is-primary">SEND</b-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </b-modal>
</template>

<script>
import axios from "axios";
import { required } from "vuelidate/lib/validators";
export default {
  name: "ModalBox",
  props: {
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      posts: {
        message: "",
        user: this.$auth.user.id,
      },
      isModalActive: false,
    };
  },
  validations: {
    posts: {
      message: {
        required,
      },
    },
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
  },

  methods: {
    cancel() {
      this.$emit("cancel");
    },
    async confirm() {
      const loadingComponent = this.$buefy.loading.open();
      if (!this.$v.$invalid) {
        try {
          let response = await axios.post(
            "/core/messages/" +
              "?business=" +
              localStorage.getItem("business") +
              "/",
            this.posts,
            {
              headers: {
                Authorization: localStorage.getItem("auth._token.local"),
              },
            }
          );
          this.$emit("confirm");
          this.posts.message = "";
          this.$buefy.snackbar.open({
            message: "Your message has been successfully sent!",
            type: "is-primary",
            position: "is-bottom",
            indefinite: false,
          });
        } catch (err) {
          this.$buefy.snackbar.open({
            message: err.response.data.detail,
            type: "is-primary",
            position: "is-bottom",
            indefinite: false,
          });
        }
      } else {
        this.$v.posts.$touch();
      }
      loadingComponent.close();
    },
  },
};
</script>
<style lang="scss">
$green: #3ab98d;
.messgae-modal {
  .column {
    padding: 0;
  }
  .modal-card {
    width: 60vw;
    height: 17rem;
    border-radius: 6px;
    background-color: white;
    .message-send {
      padding-top: 2.5rem;
      padding-left: 1.5rem;
      padding-right: 2.5rem;
      .textarea{
        resize: none;
      }
      .close-button {
        border: none !important;
        background-color: white !important;
        position: absolute;
        right: 0.2rem;
        top: 0.2rem;
        &.is-light {
          &:focus {
            box-shadow: none;
          }
        }
        .icon {
          font-size: 20px !important;
          color: black;
        }
      }
      .buttons {
        display: flex;
        justify-content: flex-end;
        margin-top: 1.5rem;
        .button {
          width: 12rem;
          border: none;
          display: block;
          height: 2.5em;
          &.is-primary {
            background-color: #3ab98d;
            color: white;
            &:focus {
              box-shadow: none;
              border: none;
            }
          }
        }
      }
    }
    .contact {
      background-color: #3ab98d;
      padding-top: 2.5rem;
      padding-right: 2.5rem;
      padding-left: 2.5rem;
      height: 100vh;
      color: white;
      h1 {
        font-weight: 600;
        font-size: 17px;
        margin-bottom: 1rem;
      }
      ul {
        li {
          position: relative;
          .icon {
            position: absolute;
          }
          padding-top: 1rem;
          .info {
            padding-left: 2.5rem;
            color: inherit;
            text-decoration: none;
          }
          .info-right {
            color: inherit;
            text-decoration: none;
          }
        }
      }
    }
  }
  .form-error {
    position: absolute;
  }
  .textarea {
    border-color: #dedede;
    &:hover {
      border-color: #dedede;
    }
    &:focus {
      border-color: #dedede;
    }
  }

  ::-webkit-input-placeholder {
    color: #676767;
    font-size: 15px;
  }
  .button {
    height: 2.5em;
    box-shadow: none;
    background-color: white;
    border: 1px solid #dedede;
    display: flex;
    justify-content: space-between;
    &.left-adjust {
      border-radius: 0 4px 4px 0;
    }

    &:focus {
      box-shadow: none;
      border: 1px solid #dedede;
    }
    &:hover {
      background-color: white;
      border: 1px solid #dedede;
    }
  }
  .label {
    font-weight: 600;
  }
}
</style>
