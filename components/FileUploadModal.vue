<template>
  <b-modal
    class="file-upload-modal"
    :active.sync="isModalActive"
    has-modal-card
  >
    <div class="modal-card">
      <header class="modal-card-head"></header>
      <section class="modal-card-body">
        <b-icon size="is-large" icon="check-circle"></b-icon>
        <p>{{message}}</p>
      </section>
      <footer class="modal-card-foot">
          <div class="buttons">
          <b-button @click="confirm" type="is-primary">{{submitText}}</b-button>
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
    message:{
        type:String
    },
    submitText:{
      type:String
    }
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
.file-upload-modal {
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
      .icon{
          color: $green;
      }
      p{
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
