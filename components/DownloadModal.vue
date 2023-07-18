<template>
  <b-modal
    class="image-download-modal"
    :active.sync="isModalActive"
    has-modal-card
  >
    <div class="modal-card">
      <header class="modal-card-head">
        <!-- <b-button class="close-button" @click="cancel" type="is-light">
          <b-icon icon="close" size="is-small"> </b-icon
        ></b-button> -->
      </header>
      <section class="modal-card-body">
        <img :src="image" alt="image" />
      </section>
      <footer class="modal-card-foot">
        <div class="buttons">
          <b-button @click="confirm(image)" type="is-primary"
            >Download</b-button
          >
        </div>
      </footer>
    </div>
  </b-modal>
</template>

<script>
import axios from "axios";
export default {
  name: "ModalBox",
  props: {
    isActive: {
      type: Boolean,
      default: false,
    },
    image: {
      type: String,
    },
  },
  data() {
    return {
      isModalActive: false,
      isActiveBtn: "",
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
  },
  methods: {
    cancel() {
      this.$emit("cancel");
    },
    confirm(image) {
      let getUrl = image;
      axios({
        url: getUrl,
        method: "GET",
        responseType: "blob",
      }).then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", getUrl.replace(/^.*[\\\/]/, ""));
        document.body.appendChild(link);
        link.click();
      });
      this.$emit("confirm");
    },
  },
};
</script>
<style lang="scss">
$green: #34a77f;
.image-download-modal {
  .modal-card-head {
    justify-content: flex-end;
    .close-button {
      border: none !important;
      background-color: $green !important;
      &.is-light {
        &:focus {
          box-shadow: none;
        }
      }
      .icon {
        font-size: 20px !important;
        color: white;
      }
    }
  }

  .modal-card {
    width: 30vw;
    .modal-card-head,
    .modal-card-foot {
      padding: 10px 20px;
    }
    .modal-card-head {
      border: none;
      background-color: white;
    }
    .modal-card-body {
      padding: 1rem 20px 0 20px;
      text-align: center;
      .icon {
        color: $green;
      }
      p {
        padding-top: 0.5rem;
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
