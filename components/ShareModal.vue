<template>
  <b-modal class="share-modal" :active.sync="isModalActive" has-modal-card>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Share Party Transactions</p>
        <b-button class="close-button" @click="cancel" type="is-light">
          <b-icon icon="close" size="is-small"> </b-icon
        ></b-button>
      </header>
      <section class="modal-card-body">
        Copy the link below and send it to the party from where they can view
        their transactions with your business.
      </section>
      <footer class="modal-card-foot">
        <div class="buttons">
          <b-button
            icon-left="content-copy"
            @click="confirm"
            type="is-primary-outline"
            >{{ "https://karobar.link/" + share_code }}</b-button
          >
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
    share_code: {
      type: String,
    },
  },
  data() {
    return {
      isModalActive: false,
      isActiveBtn: "",
      title: "",
      version: "",
      planTitle: "",
      price: "",
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
    confirm() {
      var dummy = document.createElement("input"),
        text = "https://karobar.link/" + this.share_code;

      document.body.appendChild(dummy);
      dummy.value = text;
      dummy.select();
      document.execCommand("copy");
      document.body.removeChild(dummy);
      this.$buefy.snackbar.open({
        message: "Link Copied",
        type: "is-primary",
        position: "is-bottom",
        indefinite: false,
      });
    },
  },
};
</script>
<style lang="scss">
$green: #34a77f;
.share-modal {
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
          &.is-primary-outline {
            background-color: white;
            color: $green;
            border-color: $green;
            box-shadow: none;
          }
        }
      }
    }
  }
}
</style>
