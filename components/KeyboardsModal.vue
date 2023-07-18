<template>
  <b-modal
    class="keyboard-modal"
    data:posts
    :active.sync="isModalActive"
    has-modal-card
  >
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">KEYBOARDS SHORTCUTS</p>
        <b-button class="close-button" @click="cancel" type="is-light">
          <b-icon icon="close" size="is-small"> </b-icon
        ></b-button>
      </header>
      <section class="modal-card-body">
        <div class="modal-form">
          <div class="list-key">
            <ul>
              <li class="columns">
                <div class="column">
                  <h1>For Adding Data</h1>
                </div>
              </li>
              <li class="columns" v-for="item in shortCuts" :key="item.id">
                <div class="column is-4">
                  {{ item.keys }}
                </div>
                <div class="column is-8">
                  {{ item.desc }}
                </div>
              </li>
            </ul>
          </div>
          <div class="list-key">
            <ul>
              <li class="columns">
                <div class="column">
                  <h1>Go to Pages</h1>
                </div>
              </li>
              <li class="columns" v-for="item in shortCuts2" :key="item.id">
                <div class="column is-4">
                  {{ item.keys }}
                </div>
                <div class="column is-8">
                  {{ item.desc }}
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>
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
      isModalActive: false,
      shortCuts: [
        { keys: "Alt + S", desc: "Sale Invoice" },
        { keys: "Alt + P", desc: "Purchase invoice" },
        { keys: "Alt + I", desc: "Payment In" },
        { keys: "Alt + O", desc: "Payment Out" },
        { keys: "Alt + C", desc: "Sales Return" },
        { keys: "Alt + D", desc: "Purchase Return" },
        // { keys: "Alt + Q ", desc: "Estimate / Quotation" },
        { keys: "Alt + X", desc: "Expense" },
        { keys: "Alt + M", desc: "Item" },
        { keys: "Alt + N", desc: "Party" },
      ],
      shortCuts2: [
        { keys: "Shift + D", desc: "Dashboard" },
        { keys: "Shift + P", desc: "Parties" },
        { keys: "Shift + I", desc: "Items" },
        { keys: "Shift + X", desc: "Expenses" },
        { keys: "Shift + S", desc: "Settings" },
        { keys: "Shift + R", desc: "Reports" },
        { keys: "Shift + H", desc: "Help & Support" },
        { keys: "Shift + K", desc: "Keyboard Shortcuts" },
      ],
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

.keyboard-modal {
  z-index: 100;
  .close-button {
    border: none !important;
    .icon {
      font-size: 20px !important;
    }
  }
  .control.has-icons-left .icon,
  .control.has-icons-right .icon {
    color: #34a77f;
    top: 3px;
  }
  a.dropdown-item {
    font-size: 16px;
  }
  .modal-form {
    border-bottom: 1px solid #dbdbdb;
    padding-bottom: 1.5rem;
    padding-top: 1.5rem;
    padding-left: 20px;
    padding-right: 20px;
    display: flex;
    justify-content: space-between;
    &:first-child {
      padding-top: 0;
    }
    &:last-child {
      border-bottom: 0;
    }
    .list-key {
      width: 40%;
      ul {
        list-style: none;
        li {
          h1 {
            font-weight: 600;
            font-size: 17px;
          }
          div:first-child {
            font-weight: 600;
          }
        }
      }
    }
  }
  .modal-card {
    width: 60vw;
    border-radius: 6px;
    .modal-card-head,
    .modal-card-foot {
      padding: 10px 20px;
    }
    .modal-card-head {
      background-color: white;
      border-color: #dbdbdb;
      .modal-card-title {
        color: #1d262d;
        font-weight: 600;
      }
    }
    .modal-card-body {
      padding-top: 1.5rem;
      padding-bottom: 0;
      padding-left: 0;
      padding-right: 0;
    }
    .modal-card-foot {
      display: flex;
      justify-content: flex-end;
      background-color: white;
      padding-bottom: 1.5rem;
      border-top: 1px solid #dbdbdb;
      padding-top: 1.5rem;
      .buttons {
        .button {
          width: 12rem;
          border: none;
          display: block;
          height: 2.8em;
          &.is-primary {
            background-color: $green;
            color: white;
            &:focus {
              box-shadow: none;
              border: none;
            }
          }
          &.is-light {
            border: 1px solid $green;
            color: $green;
            &:focus {
              box-shadow: none;
            }
          }
        }
      }
    }
  }
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
  .received-label {
    color: #363636;
    font-size: 1rem;
    font-weight: 500;
    display: block;
    margin-bottom: 0.5rem;
  }
  .mid-equals {
    display: flex;
    align-items: center;
    padding: 0 10px;
  }
  ::-webkit-input-placeholder {
    color: #676767;
    font-size: 15px;
  }
  .amount-input-left {
    input {
      border-left: 0;
    }
  }
  .amount-input-right {
    input {
      border-right: 0;
      text-align: right;
    }
  }
  p.control {
    &.left-input {
      border: 1px solid #dbdbdb;
      border-radius: 4px 0 0 4px;
      height: 2.5em;
      padding: 8px 0px 8px 10px;
      border-right: 0;
    }
    &.right-input {
      border: 1px solid #dbdbdb;
      border-radius: 0 4px 4px 0;
      height: 2.5em;
      padding: 8px 10px 8px 0;
      border-left: 0;
    }
  }
  .pan-dropdown {
    .dropdown-menu {
      left: -7rem;
      top: -6rem;
    }
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
    font-weight: 500;
  }
}
</style>
