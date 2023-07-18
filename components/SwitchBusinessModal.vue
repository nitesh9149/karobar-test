<template>
  <b-modal
    class="switch-business-modal"
    data:posts
    :active.sync="isModalActive"
    has-modal-card
  >
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">SWITCH BUSINESS</p>
        <b-button class="close-button" @click="cancel" type="is-light">
          <b-icon icon="close" size="is-small"> </b-icon
        ></b-button>
      </header>
      <section class="modal-card-body">
        <div v-for="business in businesses" :key="business.id" @click="switchBusiness(business)" class="modal-form">
          <div>{{business.name}}</div>
          <b-field>
            <b-radio v-model="selectedBusiness" :native-value="business.id" name="businessId"></b-radio>
          </b-field>
        </div>
      </section>
      <footer class="modal-card-foot">
        <div class="buttons">
          <b-button @click="confirmAdd" icon-left="plus" type="is-primary"
            >Add New Business
          </b-button>
          <!-- <b-button @click="confirm" icon-left="cog" type="is-primary"
            >Manage Business</b-button
          > -->
        </div>
      </footer>
    </div>
  </b-modal>
</template>

<script>
import axios from 'axios';
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
      radio: "default",
      isScrollable: false,
      maxHeight: 200,
      isModalActive: false,
      locale: undefined, // Browser locale
      routeAdd: "/addNewBusiness",
      route: "/manageBusiness",
      businesses:[],
      selectedBusiness:""
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
  async mounted(){
    let list = []

    const response = await axios.get('auth/user/',{
      headers:{
        Authorization: localStorage.getItem('auth._token.local')
      }
    })
     let id = Number(localStorage.getItem('business'));
     this.selectedBusiness = id;
     response.data.businesses.forEach(business => {
       list.push({name:business.business_name,id:business.business,role:business.role,checked:id === business.business ? true: false})
     });
   
    this.businesses = list
  },
  methods: {
    switchBusiness(business){
      localStorage.setItem('business',business.id)
      localStorage.setItem('role',business.role)
      window.location.assign('/')
    },
    cancel() {
      this.$emit("cancel");
    },
    confirmAdd() {
      this.$emit("confirm", this.routeAdd);
    },
    confirm() {
      this.$emit("confirm", this.route);
    },
  },
};
</script>
<style lang="scss">
$green: #34a77f;
.switch-business-modal {
  .close-button {
    border: none !important;
    background-color: white;
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
  .b-checkbox.checkbox input[type="checkbox"] + .check,
  .b-radio.radio input[type="radio"] + .check {
    border: 2px solid #acb1c0;
  }
  .b-radio.radio input[type="radio"]:checked + .check {
    border-color: #3ab98d;
  }
  .b-radio.radio input[type="radio"]:focus:checked + .check {
    box-shadow: none;
  }
  .b-radio.radio input[type="radio"] + .check:before {
    background-color: #3ab98d;
  }
  .b-radio.radio:hover input[type="radio"]:not(:disabled) + .check.is-primary {
    border-color: #3ab98d;
  }
  .b-radio.radio:hover input[type="radio"]:not(:disabled) + .check {
    border-color: #3ab98d;
  }
  .b-radio.radio:not(.button) {
    margin-top: 0.5em;
  }
  .modal-form {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 20px;
    &:hover{
      background-color: #fafafa;
      cursor: pointer;
    }
  }
  .modal-card {
    width: 35vw;
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
      }
    }
    .modal-card-body {
      padding: 0px;
    }
    .modal-card-foot {
      display: block;
      background-color: white;
      padding-bottom: 1.5rem;
      border-top: 1px solid #dbdbdb;
      padding-top: 1.5rem;
      .buttons {
        display: flex;
        justify-content: space-between;
        .button {
          border: none;
          padding: 0;
          margin: 0;
          &.is-primary {
            background-color: white;
            color: $green;
            border: none;
            &:focus {
              box-shadow: none;
              border: none;
            }
          }
          &.is-light {
            border: 1px solid #dbdbdb;
            color: #676767;
            &:focus {
              box-shadow: none;
            }
          }
        }
      }
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
}
</style>
