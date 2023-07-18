<template>
  <b-modal
    class="error-upload-modal"
    :active.sync="isModalActive"
    has-modal-card
  >
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">
          Please correct following errors before uploading file.
        </p>
        <b-button class="close-button" @click="cancel" type="is-light">
          <b-icon icon="close" size="is-small"> </b-icon
        ></b-button>
      </header>
      <section class="modal-card-body">
        <ul>
          <li v-for="(error,index) in errorMessage" :key="index">
            <b-icon size="is-small" icon="close-circle"></b-icon>
            <p>{{ error }}</p>
          </li>
        </ul>
      </section>
      <footer class="modal-card-foot"></footer>
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
    errorMessage: {
      type: Array,
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
    confirm() {
      this.$emit("confirm");
    },
  },
};
</script>
<style lang="scss">
$green: #34a77f;
.error-upload-modal {
  .close-button {
    border: none !important;
    background-color: white;
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
    width: 50vw;
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
      padding: 1rem 20px;
      ul {
        li {
          display: flex;
          align-items: center;
          column-gap: 0.5rem;
          padding-bottom: 0.5rem;
          .icon {
            color: #e54f6d;
          }
        }
      }
    }
    .modal-card-foot {
      background-color: white;
    }
  }
}
</style>
