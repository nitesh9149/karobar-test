<template>
  <div>
    <delete-business
      :is-active="isModalActive2"
      @confirm="trashConfirm2"
      @cancel="trashCancel2"
    />
    <bank-details-modal
      :is-active="isModalActive"
      @confirm="trashConfirm"
      @cancel="trashCancel"
      :registerData="registerInfo"
    />
    <section class="section is-title-bar">
      <div class="level">
        <div class="level-left">
          <div class="level-item">
            <ul>
              <li>Edit Business</li>
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
                    maxlength="10"
                    @keypress.native="isNumber($event)"
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
                  <b-dropdown
                    expanded
                    :scrollable="isScrollable"
                    :max-height="maxHeight"
                    v-model="current_business_type"
                    aria-role="list"
                  >
                    <template #trigger>
                      <b-button
                        expanded
                        :label="current_business_type.text"
                        icon-right="menu-down"
                      />
                    </template>

                    <b-dropdown-item
                      v-for="(menu, index) in business_type"
                      :key="index"
                      :value="menu"
                      aria-role="listitem"
                    >
                      <div class="media">
                        <div class="media-content">
                          <h3>{{ menu.text }}</h3>
                        </div>
                      </div>
                    </b-dropdown-item>
                  </b-dropdown>
                </b-field>
              </div>
              <div class="column is-6">
                <b-field label="Business Category" expanded>
                  <b-dropdown
                    expanded
                    :scrollable="isScrollable"
                    :max-height="maxHeight"
                    v-model="current_category"
                    aria-role="list"
                  >
                    <template #trigger>
                      <b-button
                        expanded
                        :label="current_category.text"
                        icon-right="menu-down"
                      />
                    </template>

                    <b-dropdown-item
                      v-for="(menu, index) in category"
                      :key="index"
                      :value="menu"
                      aria-role="listitem"
                    >
                      <div class="media">
                        <div class="media-content">
                          <h3>{{ menu.text }}</h3>
                        </div>
                      </div>
                    </b-dropdown-item>
                  </b-dropdown>
                </b-field>
              </div>
            </div>
            <div class="columns">
              <div class="column is-6">
                <span class="received-label">PAN Number</span>
                <b-field>
                  <b-input
                    expanded
                    v-model="registerInfo.pan_vat_number"
                    @keypress.native="isNumber($event)"
                    maxlength="9"
                    placeholder="Enter Pan Number"
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
                <div
                  v-if="$v.registerInfo.pan_vat_number.$error"
                  class="form-error"
                >
                  <span class="help is-danger">Enter valid PAN number</span>
                </div>
              </div>
              <div class="column is-6">
                <div v-if="this.registerInfo.bank_name" class="change-input">
                  <span class="received-label">Bank Account</span>
                  <b-field expanded>
                    <b-input
                      expanded
                      style="user-select: none"
                      readonly
                      :value="registerInfo.bank_name"
                      type="text"
                    ></b-input>
                    <b-button
                      @click="trashModal()"
                      class="change-button"
                      type="is-light-outline"
                      >Change</b-button
                    >
                  </b-field>
                </div>
                <b-field
                  v-if="!this.registerInfo.bank_name"
                  :class="{ d_none: isActive }"
                  expanded
                  label="Bank Details"
                >
                  <b-button
                    @click="trashModal()"
                    expanded
                    class="bank-button"
                    type="is-light-outline"
                    >ADD BANK DETAILS</b-button
                  >
                </b-field>
              </div>
            </div>
            <div class="columns">
              <div class="column is-6">
                <span class="received-label">Authorized Signature</span>
                <div class="add-signature">
                  <b-field class="signature-box">
                    <b-button
                      v-if="imageData"
                      @click="deleteImage"
                      icon-left="close"
                    ></b-button>
                    <div
                      class="image-input"
                      :style="{ 'background-image': `url(${imageData})` }"
                      @click="chooseImage"
                    >
                      <span v-if="!imageData" class="placeholder">
                        Click here to Add Signature
                      </span>
                      <input
                        class="file-input"
                        ref="fileInput"
                        type="file"
                        accept="image/png, image/jpeg, image/jpg"
                        @input="onSelectFile"
                      />
                    </div>
                  </b-field>
                  <b-button
                    expanded
                    type="is-light-outline"
                    @click="chooseImage"
                    >UPLOAD SIGNATURE</b-button
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="settings-footer">
          <!-- <b-button @click="trashModal2()" type="is-danger-outline"
            >DELETE</b-button
          > -->
          <div></div>
          <b-button @click="save" type="is-primary">SAVE</b-button>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
import axios from "axios";
import BankDetailsModal from "@/components/BankDetailsModal";
import DeleteBusiness from "@/components/DeleteBusiness";
import { required, minLength } from "vuelidate/lib/validators";
export default {
  layout: "settings",
  components: {
    BankDetailsModal,
    DeleteBusiness,
  },
  data() {
    return {
      isScrollable: true,
      isActive: false,
      maxHeight: 200,
      imageData2: null,
      imageData: null,
      isModalActive: false,
      isModalActive2: false,
      firstBusinessId: "",
      file: "",
      fileSignature: "",
      defaultText: "",
      defaultCategory: "",
      deleteId: null,
      registerInfo: {
        name: "",
        email: "",
        contact_number: "",
        address: "",
        pan_vat_number: "",
        bank_name: "",
        account_number: "",
        account_holder_name: "",
        user: this.$auth.user.id,
      },
      current_category: {
        text: "SeLect a Business Category",
        value: "business",
      },
      category: [
        { text: "Agriculture", value: "agriculture" },
        { text: "Auto / Parts", value: "auto" },
        { text: "Bakery", value: "bakery" },
        { text: "Beauty Parlour", value: "beauty" },
        { text: "Clothing", value: "clothing" },
        { text: "Computer Services", value: "computer" },
        { text: "Construction", value: "construction" },
        { text: "Consulting", value: "consulting" },
        { text: "Cosmetics", value: "cosmetics" },
        { text: "Catering", value: "catering" },
        { text: "Dairy Products", value: "dairy" },
        { text: "Education", value: "education" },
        { text: "Electronics", value: "electronics" },
        { text: "Entertainment", value: "entertainment" },
        { text: "Fashion Accessories", value: "fashion" },
        { text: "Financial Services", value: "financial" },
        { text: "Food & Beverages", value: "food" },
        { text: "Footwear", value: "footwear" },
        { text: "Fresh House", value: "freshhouse" },
        { text: "Fruits & Vegetables", value: "fruits" },
        { text: "Furniture", value: "furniture" },
        { text: "Garage", value: "garage" },
        { text: "General Stores (Kirana)", value: "general" },
        { text: "Gift & Toys", value: "gift" },
        { text: "Hardware", value: "hardware" },
        { text: "Hotel", value: "hotel" },
        { text: "Information Technology", value: "it" },
        { text: "Jwellery", value: "jwellery" },
        { text: "Kitchen Utensils", value: "kitchen" },
        { text: "Maintenance Services", value: "maintenance" },
        { text: "Medical & Healthcare", value: "medical" },
        { text: "Mobile & Accessories", value: "mobile" },
        { text: "Nuresery", value: "nursery" },
        { text: "Personal", value: "personal" },
        { text: "Pet Stores", value: "pet" },
        { text: "Printing", value: "printing" },
        { text: "Pooja Bhandar", value: "pooja" },
        { text: "Poultry", value: "poultry" },
        { text: "Restaurant & Cafe", value: "restaurant" },
        { text: "Sailon", value: "salon" },
        { text: "Sports & Fitness", value: "sports" },
        { text: "Stationery", value: "stationery" },
        { text: "Sweet Shop", value: "sweets" },
        { text: "Tailoring", value: "tailoring" },
        { text: "Textiles", value: "textiles" },
        { text: "Tours & Travel", value: "tours" },
        { text: "Veterinary", value: "veterinary" },
        { text: "Others", value: "others" },
      ],
      current_business_type: {
        text: "SeLect a Business Type",
        value: "business",
      },
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
        minLength: minLength(10),
      },
      pan_vat_number: {
        minLength: minLength(9),
      },
    },
  },
  async mounted() {
    let response = await axios.get(
      "/business/businesses/" + localStorage.getItem("business") + "/",
      {
        headers: {
          Authorization: localStorage.getItem("auth._token.local"),
        },
      }
    );
    this.registerInfo = response.data;
    this.registerInfo.email = response.data.email ? response.data.email : "";
    this.imageData2 = response.data.photo;
    this.imageData = response.data.signature;
    this.current_business_type.text = response.data.business_type_value;
    this.current_business_type.value = response.data.business_type;
    this.current_category.text = response.data.category_value;
    this.current_category.value = response.data.category;
    this.deleteId = response.data.id;
    if (response.data.is_vat) {
      this.currentVat.text = "VAT";
    } else {
      this.currentVat.text = "PAN";
    }
  },
  methods: {
    value(a) {
      this.registerInfo.category = a;
    },
    isNumber(event) {
      const charCode = event.which ? event.which : event.keyCode;

      // Allow only numbers (0-9)
      if (charCode < 48 || charCode > 57) {
        event.preventDefault();
      }
    },
    valueBusiness(a) {
      this.registerInfo.business_type = a;
    },
    async save() {
      const loadingComponent = this.$buefy.loading.open();
      if (!this.$v.$invalid) {
        if (!this.current_category.value) {
          this.$buefy.snackbar.open({
            message: "Please Select Your Business Category",
            type: "is-danger",
            position: "is-bottom",
            indefinite: false,
          });
        } else if (!this.current_business_type.value) {
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
            formData.append("category", this.current_category.value);
            formData.append("business_type", this.current_business_type.value);
            formData.append("contact_number", this.registerInfo.contact_number);
            formData.append("address", this.registerInfo.address);
            formData.append("pan_vat_number", this.registerInfo.pan_vat_number);
            formData.append("user", this.registerInfo.user);
            formData.append("bank_name", this.registerInfo.bank_name);
            formData.append("account_number", this.registerInfo.account_number);
            formData.append(
              "account_holder_name",
              this.registerInfo.account_holder_name
            );
            formData.append(
              "is_vat",
              this.currentVat.text == "VAT" ? true : false
            );
            if (this.imageData2 && this.file) {
              formData.append("photo", this.file);
            }
            if (this.imageData && this.fileSignature) {
              formData.append("signature", this.fileSignature);
            }
            if (this.file_signature === "close") {
              formData.append("signature", "");
            }
            const response = await axios.put(
              "/business/businesses/" + this.deleteId + "/",
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
            window.location.assign("/");
            this.$buefy.snackbar.open({
              message: "Your business has been successfully updated.",
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
    trashConfirm(data) {
      this.isModalActive = false;
      this.isActive = true;
      this.registerInfo.bank_name = data.bank_name;
      this.registerInfo.account_holder_name = data.account_holder_name;
      this.registerInfo.account_number = data.account_number;
    },
    trashCancel() {
      this.isModalActive = false;
    },
    trashModal2() {
      this.isModalActive2 = true;
    },
    trashCancel2() {
      this.isModalActive2 = false;
    },
    async trashConfirm2() {
      try {
        await axios.delete("/business/businesses/" + this.deleteId + "/", {
          headers: {
            Authorization: localStorage.getItem("auth._token.local"),
          },
        });
        let res = await axios.get("/business/businesses/", {
          headers: {
            Authorization: localStorage.getItem("auth._token.local"),
          },
        });
        if (res.data.length) {
          this.firstBusinessId = res.data[0].id;
        } else {
          window.location.assign("/createBusiness");
        }
        this.isModalActive2 = false;
        localStorage.removeItem("business");
        this.$buefy.snackbar.open({
          message: "Business has been successfully deleted.",
          type: "is-primary",
          position: "is-bottom",
          indefinite: false,
        });
        window.location.assign("/");
      } catch (err) {
        this.$buefy.snackbar.open({
          message: err.response.data.detail,
          type: "is-danger",
          position: "is-bottom",
          indefinite: false,
        });
      }
    },
    chooseImage() {
      this.$refs.fileInput.click();
    },
    chooseImage2() {
      this.$refs.fileInput2.click();
    },
    onSelectFile() {
      const input = this.$refs.fileInput;
      const files = input.files;
      this.fileSignature = files[0];
      this.file_signature = files[0];
      if (files && files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.imageData = e.target.result;
        };
        reader.readAsDataURL(files[0]);
        this.$emit("input", files[0]);
      }
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
    deleteImage() {
      this.imageData = null;
      this.$refs.fileInput.value = "";
      this.file_signature = "close";
    },
  },
  head() {
    return {
      title: "Edit Business - Karobar",
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
      &.is-danger-outline {
        border-color: #e54f6d;
        box-shadow: none;
        color: #e54f6d;
        &:focus {
          border-color: #e54f6d;
          box-shadow: none;
        }
        &:hover {
          background-color: #e54f6d;
          box-shadow: none;
          color: white;
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