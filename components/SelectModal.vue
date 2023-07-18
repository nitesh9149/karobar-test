<template>
  <b-modal data:posts :active.sync="isModalActive" has-modal-card>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">SELECT UNIT</p>
      </header>
      <section class="modal-card-body">
        <b-field label="Primary Unit">
          <b-select placeholder="Select Primary Unit" expanded>
            <option value="flint">Flint</option>
            <option value="silver">Silver</option>
          </b-select>
        </b-field>

        <b-field label="Secondary Unit">
          <b-select placeholder="Select Secondary Unit" expanded>
            <option value="flint">Flint</option>
            <option value="silver">Silver</option>
          </b-select>
        </b-field>
        <div class="block">Enter Unit Conversion Rate</div>
        <b-field grouped>
          <b-field class="equals">
            <b-input></b-input>
          </b-field>
          <b-field class="equals"><span>=</span></b-field>
          <b-field class="equals">
            <b-input></b-input>
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
        id_: 10,
        bank_name: "",
        ac_no: 9542112242111,
        amount: 122140,
      },
      isModalActive: false,
      selected: new Date(),
      showWeekNumber: false,
      locale: undefined, // Browser locale
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
      this.$emit("confirm", { ...this.posts });
    },
  },
};
</script>
<style lang="scss">
$green: #34a77f;
// .modal-background {
//   background-color: rgba(10, 10, 10, 0.6);
// }
// .modal-card {
//   .modal-card-head {
//     background-color: #34a77f;
//     .modal-card-title {
//       color: white;
//     }
//   }
//   .modal-card-body {
//     .block {
//       margin-bottom: 10px;
//           font-weight: bold;
//     }
//   }
//   .modal-card-foot {
//     display: flex;
//     justify-content: flex-end;
//     background-color: white;
//     .button {
//       font-size: 14px;
//       width: 6rem;
//       &.is-success {
//         background-color: $green;
//       }
//     }
//   }
// }
// @media screen and (min-width: 768px) {
//   .modal-card .modal-card-body .equals {
//     margin: auto;
//   }
// }
</style>
