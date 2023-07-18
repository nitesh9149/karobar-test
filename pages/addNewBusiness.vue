<template>
  <div>
    <bank-details-modal
      :is-active="isModalActive"
      @confirm="trashConfirm"
      @cancel="trashCancel"
      :registerInfo="registerInfo"
    />
    <section class="section is-title-bar">
      <div class="level">
        <div class="level-left">
          <div class="level-item">
            <ul>
              <li>Add New Business</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
    <section class="section is-main-section">
      <div class="box settings-page-business">
        <div class="columns mb-0">
          <div class="settings-title column is-3">
            <div class="person-info">
              <div class="person-img">
                <div
                  class="image-input"
                  :style="{ 'background-image': `url(${imageData2})` }"
                  @click="chooseImage2"
                >
                  <span v-if="!imageData2" class="placeholder">
                    <b-icon icon="camera-plus" size="is-large"></b-icon>
                    <b-icon icon="plus-circle" size="default"></b-icon>
                  </span>
                  <input
                    class="file-input"
                    ref="fileInput2"
                    type="file"
                    accept="image/png, image/jpeg, image/jpg"
                    @input="onSelectFile2"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="settings-body column is-9">
            <div class="columns">
              <div class="column is-6">
                <b-field label="Business Name">
                  <b-input
                    v-model="registerInfo.name"
                    type="text"
                    placeholder="Enter Business Name"
                  ></b-input>
                </b-field>
                <div v-if="$v.registerInfo.name.$error" class="form-error">
                  <span class="help is-danger">Business Name is Required</span>
                </div>
              </div>
              <div class="column is-6">
                <b-field label="Business Address">
                  <b-input
                    v-model="registerInfo.address"
                    type="text"
                    placeholder="Enter Business Address"
                  ></b-input>
                </b-field>
                <div v-if="$v.registerInfo.address.$error" class="form-error">
                  <span class="help is-danger"
                    >Business Address is Required</span
                  >
                </div>
              </div>
            </div>
            <div class="columns">
              <div class="column is-6">
                <b-field label="Business Email">
                  <b-input
                    v-model="registerInfo.email"
                    type="email"
                    placeholder="Enter Business Email"
                  ></b-input>
                </b-field>
              </div>
              <div class="column is-6">
                <b-field label="Phone Number">
                  <b-input
                    v-model="registerInfo.contact_number"
                    type="text"
                    placeholder="Enter Business Phone Number"
                  ></b-input>
                </b-field>
                <div
                  v-if="$v.registerInfo.contact_number.$error"
                  class="form-error"
                >
                  <span class="help is-danger">Phone Number is Required</span>
                </div>
              </div>
            </div>
            <div class="columns">
              <div class="column is-6">
                <b-field label="Business Type" expanded>
                  <CustomSelectBusinessType
                    :options="business_type"
                    :default="'Select a Business Type'"
                    class="select"
                    @valueBusiness="valueBusiness"
                  />
                </b-field>
              </div>
              <div class="column is-6">
                <b-field label="Business Category" expanded>
                  <CustomSelect
                    :options="category"
                    :default="'Select a Business Category'"
                    class="select"
                    @value="value"
                  />
                </b-field>
              </div>
            </div>
            <div class="columns">
              <div class="column is-6">
                <span class="received-label">Business Registration Number</span>
                <b-field>
                  <b-input
                    expanded
                    v-model="registerInfo.pan_vat_number"
                    placeholder="Enter Business Registration Number"
                    type="text"
                  ></b-input>
                  <!-- <b-dropdown
                    class="pan-dropdown"
                    :scrollable="isScrollable"
                    :max-height="maxHeight"
                    v-model="currentVat"
                    aria-role="list"
                  >
                    <template #trigger>
                      <b-button
                        class="left-adjust"
                        :label="currentVat.text"
                        type="is-light"
                        icon-right="menu-down"
                      />
                    </template>

                    <b-dropdown-item
                      v-for="(Unit, index) in vats"
                      :key="index"
                      :value="Unit"
                      aria-role="listitem"
                    >
                      <div class="media">
                        <div class="media-content">
                          <h3>{{ Unit.text }}</h3>
                        </div>
                      </div>
                    </b-dropdown-item>
                  </b-dropdown> -->
                </b-field>
              </div>
            </div>
          </div>
        </div>
        <div class="settings-footer">
          <div></div>
          <b-button @click="save" type="is-primary">ADD BUSINESS</b-button>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
import axios from "axios";
import BankDetailsModal from "@/components/BankDetailsModal";
import { required } from "vuelidate/lib/validators";
import CustomSelect from "@/components/CustomSelect.vue";
import CustomSelectBusinessType from "@/components/CustomSelectBusinessType.vue";
export default {
  components: {
    BankDetailsModal,
    CustomSelect,
    CustomSelectBusinessType,
  },
  data() {
    return {
      isScrollable: true,
      isActive: false,
      maxHeight: 200,
      imageData2: null,
      isModalActive: false,
      file: "",
      registerInfo: {
        name: "",
        email: "",
        category: "",
        business_type: "",
        contact_number: "",
        address: "",
        pan_vat_number: "",
        user: this.$auth.user.id,
      },
      category: [
        { text: "Agriculture", value: "agriculture" },
        { text: "General Stores (Kirana)", value: "general" },
        { text: "Electronics", value: "electronics" },
        { text: "Consulting", value: "consulting" },
        { text: "Cosmetics", value: "cosmetics" },
        { text: "Fashion Accessories", value: "fashion" },
        { text: "Garment & Textiles", value: "garment" },
        { text: "Jwellery", value: "jwellery" },
        { text: "Maintenance Services", value: "maintenance" },
        { text: "Medical & Healthcare", value: "medical" },
        { text: "Mobile & Accessories", value: "mobile" },
        { text: "Stationary", value: "stationary" },
        { text: "Hardware", value: "hardware" },
        { text: "Footwear", value: "footwear" },
        { text: "Food & Beverages", value: "food" },
        { text: "Auto / Parts", value: "auto" },
        { text: "Bakery", value: "bakery" },
        { text: "Construction", value: "construction" },
        { text: "Dairy Products", value: "dairy" },
        { text: "Department Store", value: "department" },
        { text: "Education", value: "education" },
        { text: "Entertainment", value: "entertainment" },
        { text: "Financial Services", value: "financial" },
        { text: "Fruits & Vegetables", value: "fruits" },
        { text: "Furniture", value: "furniture" },
        { text: "Gift & Toys", value: "gift" },
        { text: "Information Technology", value: "it" },
        { text: "Non Profit", value: "nonprofit" },
        { text: "Nuresery", value: "nursery" },
        { text: "Sports & Fitness", value: "sports" },
        { text: "Sweet Shop", value: "sweets" },
        { text: "Tours & Travel", value: "tours" },
        { text: "Others", value: "others" },
      ],
      business_type: [
        { text: "Retailer", value: "retailer" },
        { text: "Wholesaler", value: "wholesaler" },
        { text: "Distributor", value: "distributor" },
        { text: "Manufacturer", value: "manufacturer" },
      ],
      currentVat: { text: "PAN" },
      vats: [{ text: "PAN" }, { text: "VAT" }],
    };
  },
  validations: {
    registerInfo: {
      name: {
        required,
      },
      address: {
        required,
      },
      contact_number: {
        required,
      },
    },
  },
  methods: {
    value(a) {
      this.registerInfo.category = a;
    },
    valueBusiness(a) {
      this.registerInfo.business_type = a;
    },
    async save() {
      const loadingComponent = this.$buefy.loading.open();
      if (!this.$v.$invalid) {
        if (
          this.registerInfo.category === "Select a Business Category" ||
          this.registerInfo.category === ""
        ) {
          this.$buefy.snackbar.open({
            message: "Please Select Your Business Category",
            type: "is-danger",
            position: "is-bottom",
            indefinite: false,
          });
        } else if (
          this.registerInfo.business_type === "Select a Business Type" ||
          this.registerInfo.business_type === ""
        ) {
          this.$buefy.snackbar.open({
            message: "Please Select Your Business Type",
            type: "is-danger",
            position: "is-bottom",
            indefinite: false,
          });
        } else {
          try {
            let formData = new FormData();
            formData.append("name", this.registerInfo.name);
            formData.append("email", this.registerInfo.email);
            formData.append("category", this.registerInfo.category);
            formData.append("business_type", this.registerInfo.business_type);
            formData.append("contact_number", this.registerInfo.contact_number);
            formData.append("address", this.registerInfo.address);
            formData.append("pan_vat_number", this.registerInfo.pan_vat_number);
            formData.append("user", this.registerInfo.user);
            formData.append(
              "is_vat",
              this.currentVat.text == "VAT" ? true : false
            );
            if (this.imageData2) {
              formData.append("photo", this.file);
            }

            const response = await axios.post(
              "/business/businesses/",
              formData,
              {
                headers: {
                  Authorization: localStorage.getItem("auth._token.local"),
                  "Content-type": "multipart/form-data",
                },
              }
            );
            this.isModalActive = false;
            this.isActive = true;
            localStorage.removeItem("business");
            window.location.assign("/");
            this.$buefy.snackbar.open({
              message: "Your new business has been successfully created.",
              type: "is-primary",
              position: "is-bottom",
              indefinite: false,
            });
          } catch (err) {
            this.$buefy.snackbar.open({
              message: err.response.data.detail,
              type: "is-primary",
              position: "is-bottom",
              actionText: "Retry",
              indefinite: false,
            });
          }
        }
      } else {
        this.$v.registerInfo.$touch();
      }
      loadingComponent.close();
    },
    trashModal() {
      this.isModalActive = true;
    },
    trashConfirm() {
      this.isModalActive = false;
      this.isActive = true;
    },
    trashCancel() {
      this.isModalActive = false;
    },
    chooseImage2() {
      this.$refs.fileInput2.click();
    },

    onSelectFile2() {
      const input = this.$refs.fileInput2;
      const files = input.files;
      this.file = files[0];
      if (files && files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.imageData2 = e.target.result;
        };
        reader.readAsDataURL(files[0]);
        this.$emit("input", files[0]);
      }
    },
  },
  head() {
    return {
      title: "Add New Business - Karobar",
    };
  },
};
</script>
<style lang="scss">
$green: #3ab98d;
.d_none {
  display: none;
}
.box.settings-page-business {
  box-shadow: none;
  padding: 0;
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
  .mb-0 {
    margin-bottom: 0;
  }
  .change-input {
    .input {
      border-right: 0;
      &:hover {
        border-right: 0;
      }
    }
  }
  .form-error {
    margin-bottom: -1rem;
    margin-top: -0.5rem;
  }
  .person-img {
    .image-input {
      display: block;
      width: 100%;
      height: 100%;
      cursor: pointer;
      background-repeat: no-repeat;
      background-size: cover;
      border-radius: 6px;
      background-position: center;
    }
    .file-input {
      display: none;
    }
  }
  .upload-btn-wrapper {
    position: relative;
    overflow: hidden;
    display: inline-block;
    width: 100%;
    height: 10rem;
  }

  .btn {
    border: 1px dotted #dbdbdb !important;
    height: 100% !important;
  }

  .upload-btn-wrapper input[type="file"] {
    position: absolute;
    left: 0;
    top: 0;
    opacity: 0;
    width: 100%;
    height: 100%;
    cursor: pointer;
  }
  .received-label {
    color: #363636;
    font-size: 1rem;
    font-weight: 500;
    display: block;
    margin-bottom: 0.5rem;
  }
  ::-webkit-input-placeholder {
    color: #676767;
    font-size: 15px;
  }
  .label {
    font-weight: 500;
  }
  .image-input {
    display: block;
    width: 100%;
    height: 100%;
    cursor: pointer;
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;
  }
  .image-input2 {
    display: block;
    width: 100%;
    height: 100%;
    cursor: pointer;
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;
  }

  .placeholder {
    border: 1px dotted #dbe3ee;
    border-radius: 2px;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 16px;
    color: #68768b;
    position: relative;
    .icon {
      &.default {
        position: absolute;
        right: -7px;
        bottom: -7px;
      }
    }
  }

  .file-input {
    display: none;
  }
  .file-input2 {
    display: none;
  }
  .settings-title {
    padding: 30px;
    .person-info {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      .person-img {
        width: 120px;
        height: 120px;
        background-color: #eff0f0;
        text-align: center;
        margin-right: 1.5rem;
        border-radius: 6px;
        margin: auto;
        .icon {
          color: $green;
          vertical-align: middle;
          &.is-large {
            width: 120px;
            height: 120px;
          }
        }
      }
      .person-detail {
        padding-top: 1.5rem;
        h1 {
          font-weight: 600;
          font-size: 21px;
          padding-top: 0.25rem;
        }
        a {
          color: #68768b;
        }
      }
    }
  }
  .settings-body {
    padding: 40px 30px;
    a.dropdown-item {
      font-size: 16px;
    }
    .button {
      height: 2.5em;
      box-shadow: none;
      background-color: white;
      border: 1px solid #dedede;
      display: flex;
      justify-content: space-between;
      &:focus {
        box-shadow: none;
        border: 1px solid #dedede;
      }
      &:hover {
        background-color: white;
        border: 1px solid #dedede;
      }
      &.is-light-outline {
        border: 1px solid $green;
        color: $green;
        &:focus {
          box-shadow: none;
        }
      }
      &.left-adjust {
        border-radius: 0 4px 4px 0;
      }
      &.bank-button {
        justify-content: center;
      }
      &.change-button {
        background-color: $green;
        color: white;
        border-radius: 0 4px 4px 0;
        border-left: 0;
      }
    }
    .control.has-icons-left .icon,
    .control.has-icons-right .icon {
      color: #34a77f;
      top: 3px;
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
    .add-signature {
      position: relative;
      .signature-box {
        cursor: pointer;
        height: 10rem;
        .button {
          position: absolute;
          right: 0;
          top: 0;
        }
        span {
          vertical-align: middle;
        }
      }
      .button {
        justify-content: center;
      }
    }
  }
  .settings-footer {
    display: flex;
    justify-content: space-between;
    padding: 15px 30px;
    flex-wrap: wrap;
    .button {
      text-align: middle;
      width: 12rem;
      height: 2.8rem;
      margin: 10px 0;
      &.is-danger {
        background-color: #e54f6d;
        &:focus {
          box-shadow: none;
        }
      }
      &.is-primary {
        background-color: $green;
        &:focus {
          box-shadow: none;
        }
      }
    }
  }
}
.bank-details-modal {
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
  .form-error {
    margin-bottom: -1rem;
    margin-top: -0.5rem;
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
    padding-bottom: 1.5rem;
    &:first-child {
      padding-top: 0;
    }
  }
  .modal-card {
    width: 45vw;
    .modal-card-head,
    .modal-card-foot {
      padding: 10px 20px;
    }
    .modal-card-head {
      background-color: $green;
      border-color: #dbdbdb;
      .modal-card-title {
        color: white;
        font-weight: 600;
      }
    }
    .modal-card-body {
      padding-top: 1.5rem;
      padding-bottom: 0;
      padding-left: 0;
      padding-right: 0;
      padding: 20px 30px;
      .show-balance {
        display: flex;
        justify-content: space-between;
        margin-top: -0.5rem;
        padding-bottom: 1.5rem;
      }
    }
    .modal-card-foot {
      display: flex;
      justify-content: flex-end;
      background-color: white;
      padding-bottom: 2rem;
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
      text-align: left;
    }
  }
  .amount-input-right {
    input {
      border-right: 0;
      text-align: left;
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
@media screen and (max-width: 480px) {
  .box.settings-page {
    .field {
      width: 100%;
    }
    .settings-title,
    .settings-body,
    .settings-footer {
      padding-left: 15px;
      padding-right: 15px;
    }
  }
}
</style>