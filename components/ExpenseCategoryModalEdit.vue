<template>
  <b-modal
    class="category-modal"
    :active.sync="isModalActive"
    has-modal-card
  >
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">EDIT CATEGORY</p>
        <b-button class="close-button" @click="cancel" type="is-light">
          <b-icon icon="close" size="is-small"> </b-icon
        ></b-button>
      </header>
      <section class="modal-card-body">
        <div class="modal-form">
          <div class="columns">
            <div class="column is-12">
              <b-field label="Category Name" expanded>
                <b-input v-model="posts.name" placeholder="Enter Category Name" type="text"></b-input>
              </b-field>
              <div v-if="$v.posts.name.$error" class="form-error">
                <span class="help is-danger">Category Name is Required</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      <footer class="modal-card-foot">
        <div class="buttons">
          <b-button @click="cancel" type="is-light"
            >CANCEL</b-button
          >
          <b-button @click="confirm" type="is-primary">SAVE</b-button>
        </div>
      </footer>
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
    posts:{
        type:Object
    },
    typeValue:{
      type:String
    }
  },
  data() {
    return {
      isModalActive: false,
    };
  },
  validations: {
    posts: {
      name: {
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
          let posts = this.posts;
          posts.business = localStorage.getItem("business");
          posts.user = this.$auth.user.id;
          let response = await axios.put(
        "transactions/income-expense-category/" + this.posts.id + "/?type=" + posts.type + "&business=" +
          localStorage.getItem("business"), this.posts,
        {
          headers: {
            Authorization: localStorage.getItem("auth._token.local"),
          },
        }
      );
          this.$emit("confirm",response.data );
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
$green: #34a77f;
.category-modal {
  .close-button{
    border: none !important;
    .icon{
      font-size: 20px !important;
    }
  }
  a.dropdown-item{
    font-size: 16px;
  }
  .modal-form {
    border-bottom: 1px solid #dbdbdb;
    padding-bottom: 1.5rem;
    padding-top: 1.5rem;
    padding-left: 20px;
    padding-right: 20px;
    &:first-child {
      padding-top: 0;
    }
    &:last-child {
      border-bottom: 0;
    }
  }
  .modal-card {
    width: 40vw;
    .modal-card-head, .modal-card-foot {
    padding: 10px 20px;
}
    .modal-card-head {
      background-color: white;
      border-color:#dbdbdb;
      .modal-card-title {
        color: #1d262d;
        font-weight: 600;
      }
    }
    .modal-card-body {
      padding-top: 1.5rem;
      padding-bottom: 0.5rem;
      padding-left: 0;
      padding-right: 0;
    }
    .modal-card-foot {
      display: flex;
      justify-content: flex-end;
      background-color: white;
      padding-bottom: 2rem;
      padding-top: 1.5rem;
      border-top: 1px solid #dbdbdb;
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
