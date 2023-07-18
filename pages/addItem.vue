<template>
  <div>
    {{ openingDate }}{{ unitChanges }}{{ unitChanges2 }}
    <title-bar :title-stack="titleStack" :nuxt-link="nuxtLink" :link="toLink" />
    <section class="section is-main-section add-item">
      <div class="card">
        <header class="card-header">
          <p class="card-header-title">Item Information</p>
        </header>
        <div class="card-content">
          <div class="columns">
            <div class="column is-4">
              <b-field label="Name" expanded>
                <b-input
                  v-model="items.name"
                  placeholder="Enter Item Name"
                  type="text"
                ></b-input>
              </b-field>
              <div v-if="$v.items.name.$error" class="form-error">
                <span class="help is-danger">Item Name is Required</span>
              </div>
            </div>
            <div class="column is-4">
              <b-field label="Item Category" expanded>
                <b-dropdown
                  expanded
                  :scrollable="isScrollable"
                  :max-height="maxHeight"
                  v-model="currentMenu"
                  aria-role="list"
                >
                  <template #trigger>
                    <b-button
                      expanded
                      :label="currentMenu.text"
                      icon-right="menu-down"
                    />
                  </template>

                  <b-dropdown-item
                    v-for="(menu, index) in menus"
                    :key="index"
                    :value="menu"
                    aria-role="listitem"
                    @click="chooseCategory(menu.value)"
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
            <div class="column is-4">
              <b-field label="Item Type" expanded>
                <b-dropdown
                  expanded
                  :scrollable="isScrollable"
                  :max-height="maxHeight"
                  v-model="currentType"
                  aria-role="list"
                >
                  <template #trigger>
                    <b-button
                      expanded
                      :label="currentType.text"
                      icon-right="menu-down"
                    />
                  </template>

                  <b-dropdown-item
                    v-for="(menu, index) in types"
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
        </div>
      </div>
      <div class="card">
        <header class="card-header">
          <p class="card-header-title">Item pricing</p>
        </header>
        <div v-if="currentType.text == 'Product'" class="card-content">
          <div class="columns">
            <div class="column is-4">
              <b-field label="Primary Unit">
                <b-autocomplete
                  v-model="searchTerm"
                  ref="autocomplete"
                  autocomplete="off"
                  :max-height="200"
                  dropdown-position="bottom"
                  :data="filteredData"
                  :open-on-focus="true"
                  placeholder="SELECT UNIT"
                  field="text"
                  icon-right="chevron-down"
                  @select="(option) => (selected = option)"
                >
                  <template slot-scope="props">
                    <div>
                      {{ props.option.text }} ({{ props.option.value }})
                    </div>
                  </template>
                  <template #empty>No results for {{ searchTerm }}</template>
                </b-autocomplete>
              </b-field>
            </div>
            <div class="column is-4">
              <div v-if="isUnitShow" class="add-button">
                <b-button
                  @click.prevent="showUnit"
                  class="button"
                  icon-left="plus"
                  type="is-add-white"
                  >Add Alternative Unit</b-button
                >
              </div>
              <b-field
                :class="{ d_none: !isSecUnitShow }"
                label="Secondary Unit"
                expanded
              >
                <b-autocomplete
                  v-model="searchTerm2"
                  ref="autocomplete"
                  autocomplete="off"
                  :max-height="200"
                  dropdown-position="bottom"
                  :data="filteredData2"
                  :open-on-focus="true"
                  placeholder="SELECT UNIT"
                  field="text"
                  icon-right="chevron-down"
                  @select="(option) => (selected2 = option)"
                >
                  <template slot-scope="props">
                    <div>
                      {{ props.option.text }} ({{ props.option.value }})
                    </div>
                  </template>
                  <template #empty>No results for {{ searchTerm2 }}</template>
                </b-autocomplete>
              </b-field>
            </div>
            <div
              class="column is-4"
              v-if="items.primary_unit && items.secondary_unit"
            >
              <span class="received-label">Enter Conversrion Rate</span>
              <b-field>
                <b-field class="bag_input colored-input">
                  <b-input
                    type="text"
                    :value="selected.data"
                    readonly
                  ></b-input>
                </b-field>
                <b-field class="mid-equals"><span>=</span></b-field>
                <b-field class="bag_input" expanded>
                  <b-input
                    expanded
                    type="number"
                    v-model="items.conversion_rate"
                    @input.native="restrictInput($event)"
                    oninput="validity.valid||(value='');"
                    min="0"
                    step="any"
                    class="attached"
                  ></b-input>
                  <p class="control">
                    <b-button>{{ selected2.preText2 }}</b-button>
                  </p>
                </b-field>
              </b-field>
            </div>
          </div>
          <div class="columns">
            <div class="column is-4">
              <span class="received-label">Sales Price</span>
              <b-field expanded>
                <p class="control left-input">Rs.</p>
                <b-input
                  v-model="items.sale_price"
                  expanded
                  type="number"
                  @input.native="restrictInput2($event)"
                  oninput="validity.valid||(value='');"
                  min="0"
                  step="any"
                  class="amount-input-left attached"
                ></b-input>
                <p v-if="selected" class="control">
                  <b-button>{{ selected.preText }}</b-button>
                </p>
              </b-field>
            </div>
            <div class="column is-4">
              <span class="received-label">Purchase Price</span>
              <b-field expanded>
                <p class="control left-input">Rs.</p>
                <b-input
                  v-model="items.purchase_price"
                  expanded
                  type="number"
                  @input.native="restrictInput3($event)"
                  oninput="validity.valid||(value='');"
                  min="0"
                  step="any"
                  class="amount-input-left attached"
                ></b-input>
                <p v-if="selected" class="control">
                  <b-button>{{ selected.preText }}</b-button>
                </p>
              </b-field>
            </div>
          </div>
        </div>
        <div v-if="currentType.text == 'Service'" class="card-content">
          <div class="columns">
            <div class="column is-4">
              <span class="received-label">Sales Price</span>
              <b-field expanded>
                <p class="control left-input">Rs.</p>
                <b-input
                  v-model="items.sale_price"
                  expanded
                  type="number"
                  @input.native="restrictInput2($event)"
                  oninput="validity.valid||(value='');"
                  min="0"
                  step="any"
                  class="amount-input-left attached"
                ></b-input>
              </b-field>
            </div>
            <div class="column is-4">
              <span class="received-label">Purchase Price</span>
              <b-field expanded>
                <p class="control left-input">Rs.</p>
                <b-input
                  v-model="items.purchase_price"
                  expanded
                  type="number"
                  @input.native="restrictInput3($event)"
                  oninput="validity.valid||(value='');"
                  min="0"
                  step="any"
                  class="amount-input-left attached"
                ></b-input>
              </b-field>
            </div>
          </div>
        </div>
      </div>
      <div v-if="currentType.text == 'Product'" class="card">
        <header class="card-header">
          <p class="card-header-title">Stock Details</p>
        </header>
        <div class="card-content">
          <div class="columns">
            <div class="column is-one-fifth">
              <span class="received-label">Opening Stock</span>
              <b-field expanded>
                <b-input
                  :class="{ 'adjust-left': selected }"
                  v-model="items.opening_stock"
                  expanded
                  type="number"
                  @input.native="restrictInput4($event)"
                  oninput="validity.valid||(value='');"
                  min="0"
                  step="any"
                ></b-input>
                <p v-if="selected" class="control">
                  <b-button style="border-left: 0">{{
                    selected.preText2
                  }}</b-button>
                </p>
              </b-field>
            </div>
            <div class="column is-one-fifth">
              <span class="received-label">Low Stock Quantity</span>
              <b-field expanded>
                <b-input
                  :class="{ 'adjust-left': selected }"
                  v-model="items.low_stock"
                  expanded
                  type="number"
                  @input.native="restrictInput5($event)"
                  oninput="validity.valid||(value='');"
                  min="0"
                  step="any"
                ></b-input>
                <p v-if="selected" class="control">
                  <b-button style="border-left: 0">{{
                    selected.preText2
                  }}</b-button>
                </p>
              </b-field>
            </div>
            <div class="column is-3">
              <b-field class="date-picker-down" label="As of Date">
                <v-nepalidatepicker
                  v-model="date"
                  placeholder="Select a date"
                  classValue="date_picker_page"
                />
              </b-field>
            </div>
          </div>
        </div>
      </div>
      <div class="card">
        <header class="card-header">
          <p class="card-header-title">Other Details</p>
        </header>
        <div v-if="currentType.text == 'Product'" class="card-content">
          <div class="columns">
            <div class="column is-4">
              <b-field label="Item Code" expanded>
                <b-input
                  v-model="items.item_code"
                  type="text"
                  placeholder="Enter Item Code"
                ></b-input>
              </b-field>
            </div>
            <div class="column is-4">
              <b-field label="Item Location" expanded>
                <b-input
                  v-model="items.location"
                  expanded
                  type="text"
                  placeholder="Enter Item Location"
                ></b-input>
              </b-field>
            </div>
            <div class="column is-4">
              <b-field label="Remarks" expanded>
                <b-input
                  v-model="items.remarks"
                  expanded
                  type="text"
                  placeholder="Enter Remarks"
                ></b-input>
              </b-field>
            </div>
          </div>
          <div class="buttons">
            <b-button @click="saveAdd" type="is-light"
              >SAVE &amp; ADD NEW</b-button
            >
            <b-button @click="save" type="is-primary">SAVE</b-button>
          </div>
        </div>
        <div v-if="currentType.text == 'Service'" class="card-content">
          <div class="columns">
            <div></div>
            <div class="column is-4">
              <b-field label="Remarks" expanded>
                <b-input
                  v-model="items.remarks"
                  expanded
                  type="text"
                  placeholder="Enter Remarks"
                ></b-input>
              </b-field>
            </div>
          </div>
          <div class="buttons">
            <b-button @click="saveAdd" type="is-light"
              >SAVE &amp; ADD NEW</b-button
            >
            <b-button @click="save" type="is-primary">SAVE</b-button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
// @ is an alias to /src
import axios from "axios";
import NepaliDate from "nepali-date-converter";
import VNepaliDatePicker from "v-nepalidatepicker";
import { required } from "vuelidate/lib/validators";
import SubtitleBar from "@/components/SubtitleBar";
import TitleBar from "@/components/TitleBar";
import CardComponent from "@/components/CardComponent";
import SelectModal from "@/components/SelectModal";
export default {
  name: "Home",
  middleware: "auth-business",
  components: {
    TitleBar,
    SubtitleBar,
    CardComponent,
    SelectModal,
    VNepaliDatePicker,
  },
  data() {
    return {
      items: {
        name: "",
        category: "",
        item_code: "",
        primary_unit: null,
        secondary_unit: null,
        conversion_rate: null,
        purchase_price: null,
        opening_stock: null,
        low_stock: null,
        sale_price: null,
        location: "",
        remarks: "",
        as_of_date: new Date(),
        user: this.$auth.user.id,
      },
      date: "",
      searchTerm: "",
      searchTerm2: "",
      isUnitShow: false,
      isSecUnitShow: false,
      openOnFocus: true,
      isModalActive: false,
      isSwitchedCustom: "Product",
      isScrollable: true,
      selected: null,
      selected2: null,
      showWeekNumber: false,
      locale: undefined,
      maxHeight: 200,
      isActive: true,
      currentMenu: {},
      menus: [],
      currentType: { text: "Product", value: "product" },
      types: [
        { text: "Product", value: "product" },
        { text: "Service", value: "service" },
      ],
      units: [],
      secondUnits: [],
      preview: null,
      image: null,
      preview_list: [],
      image_list: [],
    };
  },
  validations: {
    items: {
      name: {
        required,
      },
    },
  },
  async mounted() {
    const loadingComponent = this.$buefy.loading.open();
    let list = [];
    let response1 = await axios.get(
      "/inventory/categories/?business=" +
        localStorage.getItem("business") +
        "&user=" +
        this.$auth.user.id,
      {
        headers: {
          Authorization: localStorage.getItem("auth._token.local"),
        },
      }
    );
    response1.data.forEach((element) => {
      list.push({
        text: element.name,
        value: element.id,
      });
    });
    this.menus = list.reverse();
    if (localStorage.getItem("currentCategoryId")) {
      let response = await axios.get(
        "/inventory/categories/" +
          localStorage.getItem("currentCategoryId") +
          "/",
        {
          headers: {
            Authorization: localStorage.getItem("auth._token.local"),
          },
        }
      );

      this.currentMenu.text = response.data.name;
      this.items.category = response.data.id;
    } else {
      this.currentMenu.text = this.menus[0].text;
      this.currentMenu.value = this.menus[0].value;
      this.items.category = this.menus[0].value;
    }
    localStorage.removeItem("currentCategoryId");
    let listUnits = [];
    let response2 = await axios.get(
      "/inventory/units/?business=" +
        localStorage.getItem("business") +
        "&user=" +
        this.$auth.user.id,
      {
        headers: {
          Authorization: localStorage.getItem("auth._token.local"),
        },
      }
    );
    response2.data.forEach((element) => {
      listUnits.push({
        text: element.name,
        value: element.short,
        preText: "/" + element.short,
        preText2: element.short,
        data: "1" + " " + element.short,
        dataNum: 0,
        id: element.id,
      });
    });
    this.units = listUnits;
    this.secondUnits = listUnits;
    loadingComponent.close();
  },
  updated() {
    if (document.querySelector(".date_picker_page")) {
      document.querySelector(".date_picker_page").readOnly = true;
    }
  },
  computed: {
    openingDate() {
      if (this.date) {
        let nepDate = new NepaliDate(this.date);
        let engDate = nepDate.toJsDate();
        this.items.as_of_date = engDate;
      } else {
        this.items.as_of_date = new Date();
      }
    },
    sampleFormat() {
      const dtf = new Intl.DateTimeFormat(this.locale);
      return dtf.format(new Date(2000, 11, 25, 12));
    },
    filteredData() {
      return this.units.filter(
        (item) =>
          item.text.toLowerCase().indexOf(this.searchTerm.toLowerCase()) >= 0
      );
    },
    filteredData2() {
      return this.secondUnits.filter(
        (item) =>
          item.text.toLowerCase().indexOf(this.searchTerm2.toLowerCase()) >= 0
      );
    },
    unitChanges() {
      if (this.selected) {
        if (this.selected.text.toLowerCase() == this.searchTerm.toLowerCase()) {
          this.items.primary_unit = this.selected.id;
          if (!this.isSecUnitShow) {
            this.isUnitShow = true;
          }
        } else {
          this.items.primary_unit = null;
          this.isUnitShow = false;
        }
      } else {
        this.items.primary_unit = null;
        this.isUnitShow = false;
        this.isSecUnitShow = false;
        this.items.secondary_unit = null;
        this.searchTerm2 = "";
      }
    },
    unitChanges2() {
      if (this.selected2) {
        if (
          this.selected2.text.toLowerCase() == this.searchTerm2.toLowerCase()
        ) {
          this.items.secondary_unit = this.selected2.id;
          this.isActive = false;
        } else {
          this.items.secondary_unit = null;
          this.isActive = true;
          this.items.conversion_rate = null;
        }
      } else {
        this.items.secondary_unit = null;
        this.isActive = true;
        this.items.conversion_rate = null;
      }
    },
    titleStack() {
      return ["Add New Item"];
    },
    titleSub() {
      return ["Items"];
    },
    nuxtLink() {
      return null;
    },
    toLink() {
      return "/Banks";
    },
  },
  
  methods: {
    chooseCategory(value) {
      this.items.category = value;
    },
    showUnit() {
      this.isUnitShow = false;
      this.isSecUnitShow = true;
    },
    restrictInput(event) {
      let value = event.target.value;
      if (value.includes(".")) {
        const [integerPart, decimalPart] = value.split(".");
        event.target.value = `${integerPart.slice(0, 8)}.${decimalPart.slice(
          0,
          2
        )}`;
        this.items.conversion_rate = event.target.value;
      } else if (value.length > 8) {
        event.target.value = value.slice(0, 8);
        this.items.conversion_rate = event.target.value;
      }
    },
    restrictInput2(event) {
      let value = event.target.value;
      if (value.includes(".")) {
        const [integerPart, decimalPart] = value.split(".");
        event.target.value = `${integerPart.slice(0, 8)}.${decimalPart.slice(
          0,
          2
        )}`;
        this.items.sale_price = event.target.value;
      } else if (value.length > 8) {
        event.target.value = value.slice(0, 8);
        this.items.sale_price = event.target.value;
      }
    },
    restrictInput3(event) {
      let value = event.target.value;
      if (value.includes(".")) {
        const [integerPart, decimalPart] = value.split(".");
        event.target.value = `${integerPart.slice(0, 8)}.${decimalPart.slice(
          0,
          2
        )}`;
        this.items.purchase_price = event.target.value;
      } else if (value.length > 8) {
        event.target.value = value.slice(0, 8);
        this.items.purchase_price = event.target.value;
      }
    },
    restrictInput4(event) {
      let value = event.target.value;
      if (value.includes(".")) {
        const [integerPart, decimalPart] = value.split(".");
        event.target.value = `${integerPart.slice(0, 8)}.${decimalPart.slice(
          0,
          2
        )}`;
        this.items.opening_stock = event.target.value;
      } else if (value.length > 8) {
        event.target.value = value.slice(0, 8);
        this.items.opening_stock = event.target.value;
      }
    },
    restrictInput5(event) {
      let value = event.target.value;
      if (value.includes(".")) {
        const [integerPart, decimalPart] = value.split(".");
        event.target.value = `${integerPart.slice(0, 8)}.${decimalPart.slice(
          0,
          2
        )}`;
        this.items.low_stock = event.target.value;
      } else if (value.length > 8) {
        event.target.value = value.slice(0, 8);
        this.items.low_stock = event.target.value;
      }
    },
    async save() {
      if (!this.$v.$invalid) {
        if (this.currentMenu.text === "Select Item Category") {
          this.$buefy.snackbar.open({
            message: "Please Select Item Category",
            type: "is-danger",
            position: "is-bottom",
            indefinite: false,
          });
        } else if (
          this.searchTerm &&
          this.items.primary_unit == null &&
          this.currentType.value == "product"
        ) {
          this.$buefy.snackbar.open({
            message: "Please Select a unit from given units list",
            type: "is-danger",
            position: "is-bottom",
            indefinite: false,
          });
        } else {
          try {
            let posts = this.items;
            posts.sale_price = this.items.sale_price
              ? this.items.sale_price
              : 0;
            posts.purchase_price = this.items.purchase_price
              ? this.items.purchase_price
              : 0;
            if (this.currentType.value == "product") {
              posts.opening_stock = this.items.opening_stock
                ? this.items.opening_stock
                : 0;
              posts.low_stock = this.items.low_stock ? this.items.low_stock : 0;
              posts.item_code = this.items.item_code.trim();
            } else if (this.currentType.value == "service") {
              posts.primary_unit = null;
              posts.secondary_unit = null;
              posts.conversion_rate = null;
              posts.opening_stock = 0;
              posts.low_stock = 0;
            }
            posts.name = this.items.name.trim();
            posts.business = localStorage.getItem("business");
            posts.type = this.currentType.value;
            const response = await axios.post(
              "/inventory/items/?business=" + localStorage.getItem("business"),
              posts,
              {
                headers: {
                  Authorization: localStorage.getItem("auth._token.local"),
                },
              }
            );
            this.$router.push("/items");
          } catch (err) {
            this.$buefy.snackbar.open({
              message: err.response.data.detail,
              type: "is-primary",
              position: "is-bottom",
              indefinite: false,
            });
          }
        }
      } else {
        this.$v.items.$touch();
      }
    },
    async saveAdd() {
      if (!this.$v.$invalid) {
        if (this.currentMenu.text === "Select Item Category") {
          this.$buefy.snackbar.open({
            message: "Please Select Item Category",
            type: "is-danger",
            position: "is-bottom",
            indefinite: false,
          });
        } else if (this.searchTerm && this.items.primary_unit == null) {
          this.$buefy.snackbar.open({
            message: "Please Select a unit from given units list",
            type: "is-danger",
            position: "is-bottom",
            indefinite: false,
          });
        } else {
          try {
            let posts = this.items;
            posts.sale_price = this.items.sale_price
              ? this.items.sale_price
              : 0;
            posts.purchase_price = this.items.purchase_price
              ? this.items.purchase_price
              : 0;
            posts.opening_stock = this.items.opening_stock
              ? this.items.opening_stock
              : 0;
            posts.low_stock = this.items.low_stock ? this.items.low_stock : 0;
            posts.name = this.items.name.trim();
            posts.item_code = this.items.item_code.trim();
            posts.business = localStorage.getItem("business");
            posts.type = this.currentType.value;
            const response = await axios.post(
              "/inventory/items/?business=" + localStorage.getItem("business"),
              posts,
              {
                headers: {
                  Authorization: localStorage.getItem("auth._token.local"),
                },
              }
            );
            this.$router.go();
          } catch (err) {
            this.$buefy.snackbar.open({
              message: err.response.data.detail,
              type: "is-primary",
              position: "is-bottom",
              indefinite: false,
            });
          }
        }
      } else {
        this.$v.items.$touch();
      }
    },
  },
  head() {
    return {
      title: "Add New Item - Karobar",
    };
  },
};
</script>
<style lang="scss">
$green: #3ab98d;
$black: #1f1f1f;
.d_none {
  display: none !important;
}
.add-item {
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
  .adjust-left {
    .input {
      border-right: 0;
    }
  }
  a.dropdown-item {
    font-size: 16px;
  }
  .control.has-icons-left .icon,
  .control.has-icons-right .icon {
    top: 3px;
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
    margin-bottom: -0.25rem;
  }
  ::-webkit-input-placeholder {
    color: #676767;
    font-size: 15px;
  }
  .amount-input-left {
    input {
      border-left: 0;
      text-align: right;
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
  }
  .add-button {
    margin-top: 2em;
    .button {
      border: none;
      box-shadow: none;
      padding-left: 0;
      padding-right: 0;
      &:focus {
        box-shadow: none;
      }
      .icon {
        font-size: 20px;
      }
      &.is-add {
        background-color: #f8f9fb;
        color: $green;
      }
      &.is-add-white {
        background-color: white;
        color: $green;
      }
    }
  }
  .label {
    font-weight: 500;
  }
  .card {
    border-radius: 0;
    border: 1px solid #dbdbdb;
    .card-header {
      background-color: #fafafa;
      padding: 0;
      .card-header-title {
        text-transform: uppercase;
      }
    }
    .card-content {
      padding: 1.5rem 1rem;
      .bag_input {
        margin-bottom: 0;
        .input {
          text-align: right;
        }
        &.colored-input {
          .input {
            color: #3ab98d;
            border-color: #3ab98d;
          }
        }
      }
      .buttons {
        justify-content: flex-end;
        padding-bottom: 1rem;
        padding-top: 1rem;
        .button {
          border: none;
          height: 2.8em;
          width: 11rem;
          display: block;
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
  .card:not(:last-child) {
    margin-bottom: 0;
    border-bottom: 0;
  }
}
</style>
