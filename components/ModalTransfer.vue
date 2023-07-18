<template>
  <b-modal :active.sync="isModalActive2" has-modal-card>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">TRANSFER BALANCE</p>
      </header>
      <section class="modal-card-body">
        <b-field label="From">
          <b-input
            placeholder="Enter Account holder name"
          ></b-input>
        </b-field>
        <b-field label="To Bank">
          <b-input placeholder="NMB Bank Limited"></b-input>
        </b-field>
        <b-field grouped>
          <b-field label="Amount" expanded>
            <b-input placeholder="Rs"></b-input>
          </b-field>
          <b-field label="Date" expanded>
            <b-datepicker
              v-model="selected"
              :show-week-number="showWeekNumber"
              :locale="locale"
              placeholder="Click to select..."
              icon="calendar-today"
              trap-focus
            >
            </b-datepicker>
          </b-field>
        </b-field>
      </section>
      <footer class="modal-card-foot">
        <button class="button is-success" @click="confirm">SAVE</button>
      </footer>
    </div>
  </b-modal>
</template>

<script>
export default {
  name: "ModalTransfer",
  props: {
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isModalActive2: false,
      selected: new Date(),
      showWeekNumber: false,
      locale: undefined, // Browser locale
    };
  },
  watch: {
    isActive(newValue) {
      this.isModalActive2 = newValue;
    },
    isModalActive2(newValue) {
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
.modal-background {
  background-color: rgba(10, 10, 10, 0.6);
}
.modal-card {
  .modal-card-head {
    background-color: #34a77f;
    .modal-card-title {
      color: white;
    }
  }
  .modal-card-foot {
    display: flex;
    justify-content: flex-end;
    background-color: white;
    .button {
      font-size: 14px;
      width: 6rem;
      &.is-success {
        background-color: $green;
      }
    }
  }
}
</style>
