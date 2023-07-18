<template>
  <section>
    <!-- {{ subTotalCalc }} -->
    {{ total }}
    <sale-item-modal
      :is-active="isModalActive"
      @confirm="trashConfirm"
      @cancel="trashCancel"
      :nameItem="itemName"
      :type="type"
    />
    <div v-if="!switchDiscount">
      <b-table
        :data="datas"
        :bordered="isBordered"
        class="todo-table"
        @click="tableRow($event)"
      >
        <template slot-scope="props">
          <b-table-column field="id" label="SN" width="60" numeric centered>
            <div class="sn-td">
              <div class="num">{{ sn(props.row.id) }}</div>
              <b-button
                size="is-small"
                @click="deleteItem(props.row.id)"
                icon-right="delete"
              />
            </div>
          </b-table-column>

          <b-table-column field="item" width="300" label="Item">
            <b-field>
              <b-autocomplete
                class="table-item"
                field="name"
                v-model="props.row.name"
                :open-on-focus="true"
                dropdown-position="bottom"
                ref="autocomplete"
                @typing="searchItems"
                :data="items"
                @input="getName(props.row.name)"
                @focus="focusRow($event, props.row.id)"
                placeholder="Enter Item Name"
                @select="clickRow($event, props.index)"
              >
                <template #header>
                  <div @click="trashModal" class="party-items-head">
                    <div class="item">
                      <span class="add-item"
                        ><b-icon icon="plus-circle-outline" size="is-small">
                        </b-icon>
                        Add Item
                      </span>
                    </div>
                    <div class="item">
                      <p v-if="type == 'purchase'" class="item-title">
                        Purchase Price
                      </p>
                      <p v-else class="item-title">Sale Price</p>
                    </div>
                    <div class="item">
                      <p class="item-title">Stock</p>
                    </div>
                  </div>
                </template>
                <template slot-scope="props">
                  <div class="party-items">
                    <div class="item">
                      <p class="item-title">
                        {{ props.option.name }}
                      </p>
                    </div>
                    <div class="item">
                      <p v-if="type == 'purchase'" class="item-title">
                        {{ props.option.purchase_price }}
                      </p>
                      <p v-else class="item-title">
                        {{ props.option.sale_price }}
                      </p>
                    </div>
                    <div class="item">
                      <p class="item-title">
                        {{ props.option.quantity }}
                        {{ props.option.primary_unit_value }}
                      </p>
                    </div>
                  </div>
                </template>
                <template #empty>No results for {{ name }}</template>
              </b-autocomplete>
            </b-field>
          </b-table-column>
          <b-table-column field="quantity" width="120" label="Quantity">
            <b-field grouped class="quantity-input">
              <b-input
                step="any"
                v-model="props.row.quantity"
                @input="enterData(props.index)"
                @input.native="restrictInput($event)"
                oninput="validity.valid||(value='');"
                min="0"
                type="number"
              >
              </b-input>
              <b-dropdown
                :scrollable="isScrollable"
                :max-height="maxHeight"
                v-model="props.row.currentUnit"
                aria-role="list"
              >
                <template #trigger>
                  <b-button
                    v-if="props.row.currentUnit.text"
                    :label="props.row.currentUnit.text"
                    type="is-light"
                    icon-right="menu-down"
                  ></b-button>
                </template>
                <b-dropdown-item
                  v-for="(Unit, index) in props.row.Units"
                  :key="index"
                  :value="Unit"
                  aria-role="listitem"
                  @click="unitCalculation(Unit)"
                >
                  <div class="media">
                    <div class="media-content">
                      <h3>{{ Unit.text }}</h3>
                    </div>
                  </div>
                </b-dropdown-item>
              </b-dropdown>
            </b-field>
          </b-table-column>
          <b-table-column class="rate-td" width="120" field="rate" label="Rate">
            <b-field>
              <span> Rs. </span>
              <b-input
                v-model="props.row.sale_price"
                type="number"
                @input="enterData(props.index)"
                @input.native="restrictInput2($event)"
                oninput="validity.valid||(value='');"
                min="0"
                step="any"
              ></b-input>
            </b-field>
          </b-table-column>
          <b-table-column
            width="150"
            class="discount-td"
            field="discount"
            label="Discount"
          >
            <div>
              <td>
                <b-field>
                  <b-input
                    @input="updateDiscountAmount($event, props.index)"
                    :value="props.row.d_value"
                    @input.native="restrictDiscount($event, props.index)"
                    step="any"
                    min="0"
                    max="100"
                    type="number"
                    oninput="validity.valid||(value='');"
                  ></b-input>
                  <span> % </span>
                </b-field>
              </td>
              <td>
                <b-field>
                  <span>Rs. </span>
                  <b-input
                    step="any"
                    :readonly="
                      !props.row.sale_price || !props.row.quantity
                        ? true
                        : false
                    "
                    :value="
                      !props.row.sale_price || !props.row.quantity
                        ? ''
                        : props.row.calDiscountAmt
                    "
                    @input="updateDiscount($event, props.index)"
                    type="number"
                    @input.native="restrictInput3($event, props.index)"
                    oninput="validity.valid||(value='');"
                    min="0"
                  ></b-input>
                </b-field>
              </td>
            </div>
          </b-table-column>
          <b-table-column
            class="amount-td"
            id="sum_data"
            width="140"
            field="amount"
            label="Amount"
          >
            <b-field>
              <span>Rs.</span>
              <b-input
                step="any"
                :readonly="props.row.readonly"
                :value="props.row.total"
                @focus="focusAmount(props.row.id)"
                min="0"
                @input.native="restrictInput4($event)"
                oninput="validity.valid||(value='');"
                type="number"
                @input="totalFunc"
              >
              </b-input>
            </b-field>
          </b-table-column>
        </template>
      </b-table>
    </div>
    <div v-else>
      <b-table
        :data="datas"
        :bordered="isBordered"
        class="todo-table"
        @click="tableRow($event)"
      >
        <template slot-scope="props">
          <b-table-column field="id" label="SN" width="60" numeric centered>
            <div class="sn-td">
              <div class="num">{{ sn(props.row.id) }}</div>
              <b-button
                size="is-small"
                @click="deleteItem(props.row.id)"
                icon-right="delete"
              />
            </div>
          </b-table-column>
          <b-table-column field="item" width="300" label="Item">
            <b-field>
              <b-autocomplete
                class="table-item"
                field="name"
                v-model="props.row.name"
                :open-on-focus="true"
                dropdown-position="bottom"
                ref="autocomplete"
                @typing="searchItems"
                :data="items"
                @input="getName(props.row.name)"
                @focus="focusRow($event, props.row.id)"
                placeholder="Enter Item Name"
                @select="clickRow($event, props.index)"
              >
                <template #header>
                  <div @click="trashModal" class="party-items-head">
                    <div class="item">
                      <span class="add-item"
                        ><b-icon icon="plus-circle-outline" size="is-small">
                        </b-icon>
                        Add Item
                      </span>
                    </div>
                    <div class="item">
                      <p v-if="type == 'purchase'" class="item-title">
                        Purchase Price
                      </p>
                      <p v-else class="item-title">Sale Price</p>
                    </div>
                    <div class="item">
                      <p class="item-title">Stock</p>
                    </div>
                  </div>
                </template>
                <template slot-scope="props">
                  <div class="party-items">
                    <div class="item">
                      <p class="item-title">
                        {{ props.option.name }}
                      </p>
                    </div>
                    <div class="item">
                      <p v-if="type == 'purchase'" class="item-title">
                        {{ props.option.purchase_price }}
                      </p>
                      <p v-else class="item-title">
                        {{ props.option.sale_price }}
                      </p>
                    </div>
                    <div class="item">
                      <p class="item-title">
                        {{ props.option.quantity }}
                        {{ props.option.primary_unit_value }}
                      </p>
                    </div>
                  </div>
                </template>
                <template #empty>No results for {{ name }}</template>
              </b-autocomplete>
            </b-field>
          </b-table-column>
          <b-table-column field="quantity" width="120" label="Quantity">
            <b-field grouped class="quantity-input">
              <b-input
                step="any"
                @input="enterData(props.index)"
                v-model="props.row.quantity"
                @input.native="restrictInput($event)"
                oninput="validity.valid||(value='');"
                min="0"
                type="number"
              >
              </b-input>
              <b-dropdown
                :scrollable="isScrollable"
                :max-height="maxHeight"
                v-model="props.row.currentUnit"
                aria-role="list"
              >
                <template #trigger>
                  <b-button
                    v-if="props.row.currentUnit.text"
                    :label="props.row.currentUnit.text"
                    type="is-light"
                    icon-right="menu-down"
                  ></b-button>
                </template>
                <b-dropdown-item
                  v-for="(Unit, index) in props.row.Units"
                  :key="index"
                  :value="Unit"
                  aria-role="listitem"
                  @click="unitCalculation(Unit)"
                >
                  <div class="media">
                    <div class="media-content">
                      <h3>{{ Unit.text }}</h3>
                    </div>
                  </div>
                </b-dropdown-item>
              </b-dropdown>
            </b-field>
          </b-table-column>
          <b-table-column class="rate-td" width="120" field="rate" label="Rate">
            <b-field>
              <span> Rs. </span>
              <b-input
                v-model="props.row.sale_price"
                type="number"
                @input="enterData(props.index)"
                @input.native="restrictInput2($event)"
                oninput="validity.valid||(value='');"
                min="0"
                step="any"
              ></b-input>
            </b-field>
          </b-table-column>
          <b-table-column
            class="amount-td"
            id="sum_data"
            width="140"
            field="amount"
            label="Amount"
          >
            <b-field>
              <span>Rs.</span>
              <b-input
                step="any"
                :value="props.row.total"
                @focus="focusAmount(props.row.id)"
                @input.native="restrictInput4($event)"
                oninput="validity.valid||(value='');"
                type="number"
                min="0"
                @input="totalFunc"
              >
              </b-input>
            </b-field>
          </b-table-column>
        </template>
      </b-table>
    </div>
    <div class="add-button todo-table-bottom">
      <div class="add-left">
        <b-button type="is-add" icon-left="plus" @click="addTodo">
          Add Billing Item
        </b-button>
      </div>
      <div class="totals">
        <div class="columns">
          <div class="column is-2 is-offset-5">
            <span v-if="datas.length" class="sub-total">Sub Total</span>
            <span v-else class="sub-total">&nbsp;</span>
          </div>
          <div
            v-if="!switchDiscount"
            class="column is-2 is-offset-1 total-discount"
          >
            <span v-if="disAmount">Rs {{ disAmount }}</span>
          </div>
          <div
            class="column is-2 total-amount"
            :class="{ 'is-offset-3': activeClass }"
          >
            <span v-if="subTotal">Rs {{ conversion(Math.abs(subTotal)) }}</span>
            <span v-else></span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import axios from "axios";
import SaleItemModal from "@/components/SaleItemModal";

export default {
  components: {
    SaleItemModal,
  },
  data() {
    return {
      isEmpty: false,
      isScrollable: false,
      isModalActive: false,
      maxHeight: 200,
      isBordered: true,
      keepFirst: false,
      openOnFocus: false,
      activeClass: false,
      switchDiscount: false,
      index: null,
      valueShow: true,
      fromInput: true,
      name: "",
      inputName: "",
      clickName: "",
      itemName: "",
      rowId: 0,
      selected: "",
      clearable: false,
      items: [],
      subTotal: null,
      disAmount: null,
      disAmountPer: null,
      datasLength: 0,
      datas: [],
      next: "",
      event: "",
    };
  },
  props: {
    value: {
      type: Number,
    },
    billItem: {
      type: Array,
    },
    type: {
      type: String,
    },
  },

  watch: {
    async billItem(bill) {
      let discount = false;
      bill.forEach((element) => {
        if (element.discount_percent > 0) {
          discount = true;
        }
      });
      if (discount) {
        this.switchDiscount = false;
        this.activeClass = false;
      } else if (JSON.parse(localStorage.getItem("switchDiscount")) == false) {
        this.switchDiscount = true;
        this.activeClass = true;
      }
      let items = [];
      bill.forEach((e) => {
        if (e.discount_percent == 100) {
          e.readonly = true;
        } else {
          e.readonly = false;
        }
        items.push({
          id: Math.random().toString(36).substr(2, 7),
          billId: e.id,
          name: e.item_name,
          item_name: e.item_name,
          item: e.item,
          readonly: e.readonly,
          quantity: e.quantity,
          sale_price: Number(e.rate).toFixed(2),
          discountPer: e.discount_percent,
          discountPercent: e.discount_percent,
          calculateTotal: null,
          d_value:
            e.discount_percent > 0
              ? Number(e.discount_percent).toFixed(2)
              : null,
          secondary_unit: e.secondary_unit,
          unit: e.unit,
          conversion_rate: e.conversion_rate,
          primary_unit_value: e.primary_unit_value,
          secondary_unit_value: e.secondary_unit_value,
        });
      });
      this.datas = items.reverse();

      for (let index = 0; index < this.datas.length; index++) {
        if (this.datas[index].secondary_unit) {
          this.datas[index].currentUnit = {
            text: this.datas[index].secondary_unit_value,
            value: true,
          };
          this.datas[index].sale_price_value =
            this.datas[index].sale_price / this.datas[index].conversion_rate;
        } else {
          this.datas[index].currentUnit = {
            text: this.datas[index].primary_unit_value,
            value: false,
          };
          this.datas[index].sale_price_value = this.datas[index].sale_price;
        }
        if (this.datas[index].secondary_unit_value) {
          this.datas[index].Units = [
            { text: this.datas[index].primary_unit_value, value: false },
            { text: this.datas[index].secondary_unit_value, value: true },
          ];
        } else {
          this.datas[index].Units = [
            { text: this.datas[index].primary_unit_value, value: false },
          ];
        }
        this.datas[index].quantity = Number(this.datas[index].quantity);
        this.datas[index].sale_price = Number(
          this.datas[index].sale_price
        ).toFixed(2);
        let amount = this.datas[index].sale_price * this.datas[index].quantity;
        this.datas[index].disAmountPer =
          this.datas[index].sale_price *
          this.datas[index].quantity *
          (this.datas[index].discountPer / 100);
        this.datas[index].calDiscountAmt = (
          this.datas[index].sale_price *
          this.datas[index].quantity *
          (this.datas[index].discountPercent / 100)
        ).toFixed(2);
        let amountTotal = amount - this.datas[index].disAmountPer;
        this.datas[index].total = amountTotal.toFixed(2);
        this.datas[index].calculateTotal = amountTotal;
        this.$emit("itemsList", this.datas);
        let sub_total = 0;
        let disAmount = 0;
        for (let i = 0; i < this.datas.length; i++) {
          sub_total = sub_total + Number(this.datas[i].calculateTotal);
          disAmount = disAmount + Number(this.datas[i].disAmountPer);
        }
        if (sub_total) {
          this.subTotal = sub_total.toFixed(2);
          this.$emit("totalData", this.subTotal);
        } else {
          this.subTotal = 0;
          this.$emit("totalData", this.subTotal);
        }
        if (disAmount) {
          this.disAmount = disAmount.toFixed(2);
        } else {
          this.disAmount = 0;
        }
      }
      this.$emit("itemsList", this.datas);
    },
  },
  async mounted() {
    let list = [];
    let response = await axios.get(
      "/inventory/items/?business=" +
        localStorage.getItem("business") +
        "&user=" +
        this.$auth.user.id,
      {
        headers: {
          Authorization: localStorage.getItem("auth._token.local"),
        },
      }
    );
    this.next = response.data.next;
    response.data.results.forEach((element) => {
      list.push({
        name: element.name,
        type_value: element.type_value,
        category_value: element.category_value,
        id: element.id,
        quantity:
          element.type_value == "Product"
            ? Number(element.quantity).toFixed(2)
            : "-",
        sale_price_num: element.sale_price,
        sale_price: "Rs." + " " + this.conversion(Math.abs(element.sale_price)),
        purchase_price:
          element.type_value == "Product"
            ? "Rs." + " " + this.conversion(Math.abs(element.purchase_price))
            : "-",
        purchase_price_num: element.purchase_price,
        opening_stock: element.opening_stock,
        primary_unit_value:
          element.type_value == "Product" ? element.primary_unit_value : "",
        stock_value:
          element.type_value == "Product"
            ? "Rs." +
              " " +
              this.conversion(element.quantity * element.purchase_price)
            : "-",
        conversion_rate:
          element.conversion_rate == null ? 1 : element.conversion_rate,
        item_code:
          element.item_code == "" || element.item_code == null
            ? "-"
            : element.item_code,
        location:
          element.location == "" || element.location == null
            ? "-"
            : element.location,
        remarks:
          element.remarks == "" || element.remarks == null
            ? "-"
            : element.remarks,
        secondary_unit_value:
          element.secondary_unit_value == "" ||
          element.secondary_unit_value == null
            ? ""
            : element.secondary_unit_value,
      });
    });
    this.items = list;
  },
  computed: {
    total: function () {
      const index = this.datas.findIndex((data) => {
        return data.id == this.rowId;
      });
      this.index = index;
      this.datasLength = this.datas.length;
      if (index >= 0) {
        if (this.fromInput) {
          let amount =
            this.datas[index].sale_price * this.datas[index].quantity;
          this.datas[index].disAmountPer =
            this.datas[index].sale_price *
            this.datas[index].quantity *
            (this.datas[index].discountPer / 100);
          this.discountAmountCalc();
          let amountTotal = amount - this.datas[index].disAmountPer;
          if (amountTotal) {
            this.datas[index].total = amountTotal.toFixed(2);
            this.datas[index].calculateTotal = amountTotal;
          } else {
            this.datas[index].calculateTotal = 0;
            this.datas[index].total = "";
          }
        }
        let sub_total = 0;
        let disAmount = 0;
        for (let i = 0; i < this.datas.length; i++) {
          sub_total = sub_total + Number(this.datas[i].calculateTotal);
          disAmount = disAmount + Number(this.datas[i].disAmountPer);
        }
        if (sub_total) {
          this.subTotal = sub_total.toFixed(2);
          this.$emit("totalData", this.subTotal);
        } else {
          this.subTotal = 0;
          this.$emit("totalData", this.subTotal);
        }
        if (disAmount) {
          this.disAmount = disAmount
            .toString()
            .match(/^-?\d+(?:\.\d{0,2})?/)[0];
        } else {
          this.disAmount = 0;
        }
        if (this.datas[index].name) {
          this.datas[index].item_name = this.datas[index].name;
        } else {
          this.datas[index].item_name = "";
        }
        this.$emit("itemsList", this.datas);
      }
    },
    // subTotalCalc: function () {
    //   if (this.datas.length > 0) {
    //     let sub_total = 0;
    //     let disAmount = 0;
    //     for (let i = 0; i < this.datas.length; i++) {
    //       sub_total = sub_total + Number(this.datas[i].calculateTotal);
    //       disAmount = disAmount + Number(this.datas[i].disAmountPer);
    //     }
    //     if (sub_total) {
    //       this.subTotal = sub_total.toFixed(2);
    //       this.$emit("totalData", this.subTotal);
    //     } else {
    //       this.subTotal = 0;
    //       this.$emit("totalData", this.subTotal);
    //     }
    //     if (disAmount) {
    //       this.disAmount = disAmount.toFixed(2);
    //     } else {
    //       this.disAmount = 0;
    //     }
    //   } else {
    //     this.subTotal = null;
    //     this.$emit("totalData", this.subTotal);
    //     this.disAmount = null;
    //   }
    // },
  },
  methods: {
    onScroll() {
      let apiCall = async () => {
        if (
          Math.ceil(this.event.scrollTop) + this.event.clientHeight + 1 >=
            this.event.scrollHeight &&
          this.next
        ) {
          let list = [];
          let response = await axios.get(this.next, {
            headers: {
              Authorization: localStorage.getItem("auth._token.local"),
            },
          });
          this.next = response.data.next;
          response.data.results.forEach((element) => {
            list.push({
              name: element.name,
              type_value: element.type_value,
              category_value: element.category_value,
              id: element.id,
              quantity:
                element.type_value == "Product"
                  ? this.conversion(element.quantity)
                  : "-",
              sale_price_num: element.sale_price,
              sale_price:
                "Rs." + " " + this.conversion(Math.abs(element.sale_price)),
              purchase_price:
                element.type_value == "Product"
                  ? "Rs." +
                    " " +
                    this.conversion(Math.abs(element.purchase_price))
                  : "-",
              purchase_price_num: element.purchase_price,
              conversion_rate:
                element.conversion_rate == null ? 1 : element.conversion_rate,
              opening_stock: element.opening_stock,
              primary_unit_value:
                element.type_value == "Product"
                  ? element.primary_unit_value
                  : "",
              stock_value:
                element.type_value == "Product"
                  ? "Rs." +
                    " " +
                    this.conversion(element.quantity * element.purchase_price)
                  : "-",
              item_code:
                element.item_code == "" || element.item_code == null
                  ? "-"
                  : element.item_code,
              location:
                element.location == "" || element.location == null
                  ? "-"
                  : element.location,
              remarks:
                element.remarks == "" || element.remarks == null
                  ? "-"
                  : element.remarks,
              secondary_unit_value:
                element.secondary_unit_value == "" ||
                element.secondary_unit_value == null
                  ? null
                  : element.secondary_unit_value,
            });
          });
          this.items.push(...list);
        }
      };
      this.throttleFunction(apiCall, 200);
    },
    restrictDiscount(event, index) {
      let value = event.target.value;
      if (value.includes(".")) {
        const [integerPart, decimalPart] = value.split(".");
        event.target.value = `${integerPart.slice(0, 8)}.${decimalPart.slice(
          0,
          2
        )}`;
        this.datas[index].d_value = event.target.value;
        this.datas[index].discountPercent = event.target.value;
        this.datas[index].discountPer = event.target.value;
      }
    },
    restrictInput(event) {
      let value = event.target.value;
      if (value.includes(".")) {
        const [integerPart, decimalPart] = value.split(".");
        event.target.value = `${integerPart.slice(0, 8)}.${decimalPart.slice(
          0,
          2
        )}`;
        this.datas[this.index].quantity = event.target.value;
      } else if (value.length > 8) {
        event.target.value = value.slice(0, 8);
        this.datas[this.index].quantity = event.target.value;
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
        this.datas[this.index].sale_price = event.target.value;
      } else if (value.length > 8) {
        event.target.value = value.slice(0, 8);
        this.datas[this.index].sale_price = event.target.value;
      }
    },
    restrictInput3(event, index) {
      let value = event.target.value;
      if (value.includes(".")) {
        const [integerPart, decimalPart] = value.split(".");
        event.target.value = `${integerPart.slice(0, 8)}.${decimalPart.slice(
          0,
          2
        )}`;
        this.datas[index].calDiscountAmt = event.target.value;
        this.datas[index].disAmountPer = event.target.value;
      } else if (value.length > 8) {
        event.target.value = value.slice(0, 8);
        this.datas[index].calDiscountAmt = event.target.value;
        this.datas[index].disAmountPer = event.target.value;
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
      } else if (value.length > 8) {
        event.target.value = value.slice(0, 8);
      }
      this.datas[this.index].total = event.target.value;
    },
    throttleFunction(callback, time) {
      if (this.throttlePause) return;
      this.throttlePause = true;
      setTimeout(() => {
        callback();
        this.throttlePause = false;
      }, time);
    },
    async searchItems(event) {
      let list = [];
      let response = await axios.get(
        "/inventory/items/?business=" +
          localStorage.getItem("business") +
          "&search=" +
          event,
        {
          headers: {
            Authorization: localStorage.getItem("auth._token.local"),
          },
        }
      );
      this.next = response.data.next;
      response.data.results.forEach((element) => {
        list.push({
          name: element.name,
          type_value: element.type_value,
          category_value: element.category_value,
          id: element.id,
          quantity:
            element.type_value == "Product"
              ? this.conversion(element.quantity)
              : "-",
          sale_price_num: element.sale_price,
          sale_price:
            "Rs." + " " + this.conversion(Math.abs(element.sale_price)),
          purchase_price:
            element.type_value == "Product"
              ? "Rs." + " " + this.conversion(Math.abs(element.purchase_price))
              : "-",
          purchase_price_num: element.purchase_price,
          conversion_rate:
            element.conversion_rate == null ? 1 : element.conversion_rate,
          opening_stock: element.opening_stock,
          primary_unit_value:
            element.type_value == "Product" ? element.primary_unit_value : "",
          stock_value:
            element.type_value == "Product"
              ? "Rs." +
                " " +
                this.conversion(element.quantity * element.purchase_price)
              : "-",
          item_code:
            element.item_code == "" || element.item_code == null
              ? "-"
              : element.item_code,
          location:
            element.location == "" || element.location == null
              ? "-"
              : element.location,
          remarks:
            element.remarks == "" || element.remarks == null
              ? "-"
              : element.remarks,
          secondary_unit_value:
            element.secondary_unit_value == "" ||
            element.secondary_unit_value == null
              ? null
              : element.secondary_unit_value,
        });
      });
      this.items = list;
    },
    unitCalculation(val) {
      const index = this.datas.findIndex((data) => {
        return data.id === this.rowId;
      });
      if (index >= 0) {
        this.fromInput = true;
        if (val.value) {
          this.datas[index].sale_price = (
            this.datas[index].sale_price_value /
            this.datas[index].conversion_rate
          ).toFixed(2);
          this.datas[index].secondary_unit = true;
        } else {
          this.datas[index].sale_price = Number(
            this.datas[index].sale_price_value
          ).toFixed(2);
          this.datas[index].secondary_unit = false;
        }
      }
      this.discountAmountCalc();
    },
    focusAmount(id) {
      this.rowId = id;
    },
    focusRow(event, id) {
      this.searchItems("");
      this.event =
        event.target.parentElement.parentElement.querySelector(
          ".dropdown-content"
        );
      event.target.parentElement.parentElement
        .querySelector(".dropdown-content")
        .addEventListener("scroll", this.onScroll);
      this.rowId = id;
      this.name = "";
    },
    clickRow(event, index) {
      if (event) {
        this.datas[index].name = event.name;
        this.datas[index].item = event.id;
        this.datas[index].quantity = event.quantity;
        if (event.primary_unit_value) {
          this.datas[index].currentUnit = {
            text: event.primary_unit_value,
            value: false,
          };
        } else {
          this.datas[index].currentUnit = "";
        }
        this.datas[index].conversion_rate = event.conversion_rate;
        if (event.secondary_unit_value) {
          this.datas[index].Units = [
            { text: event.primary_unit_value, value: false },
            { text: event.secondary_unit_value, value: true },
          ];
        } else {
          this.datas[index].Units = [
            { text: event.primary_unit_value, value: false },
          ];
        }
        if (this.type == "purchase") {
          if (event.purchase_price_num) {
            this.datas[index].sale_price = event.purchase_price_num;
            this.datas[index].sale_price_value = Number(
              event.purchase_price_num
            );
          } else {
            this.datas[index].sale_price = event.purchase_price_num;
          }
        } else {
          if (event.sale_price_num) {
            this.datas[index].sale_price = event.sale_price_num;
            this.datas[index].sale_price_value = Number(event.sale_price_num);
          } else {
            this.datas[index].sale_price = event.sale_price_num;
          }
        }
        if (event.type_value == "Service") {
          this.datas[index].quantity = 1;
        } else {
          this.datas[index].quantity = 1;
        }
        this.discountAmountCalc();
      }
    },
    tableRow(event) {
      // const rowIndex = this.datas.indexOf(event);
      // this.index = rowIndex;
      this.rowId = event.id;
      this.name = "";
    },
    enterData(index) {
      this.fromInput = true;
    },
    getName(inputName) {
      if (inputName) {
        this.fromInput = true;
        this.name = inputName;
        this.inputName = inputName;
        let index = this.index;
        if (index == this.datasLength - 1) {
          let highestId = Math.random().toString(36).substr(2, 7);
          this.datas.push({
            id: highestId,
            billId: null,
            quantity: null,
            item_name: "",
            item: null,
            currentUnit: "",
            sale_price: null,
            conversion_rate: null,
            Units: [],
            discountPer: null,
            discount: null,
            d_value: null,
            total: null,
            discValue: null,
            calculateTotal: 0,
            disAmountPer: 0,
            calDiscountAmt: null,
          });
        }
      } else {
        this.name = "";
      }
    },
    totalFunc(value) {
      let index = this.index;
      if (value) {
        if (value.includes(".")) {
          const [integerPart, decimalPart] = value.split(".");
          value = `${integerPart.slice(0, 8)}.${decimalPart.slice(0, 2)}`;
        } else if (value.length > 8) {
          value = value.slice(0, 8);
        }
        this.fromInput = false;
        let total_amount =
          this.datas[index].sale_price * this.datas[index].quantity;
        if (this.datas[index].discountPer && total_amount) {
          this.datas[index].sale_price = (
            Number(value) /
            (Number(this.datas[index].quantity) *
              (1 - this.datas[index].discountPer / 100))
          ).toFixed(2);
          this.datas[index].disAmountPer =
            this.datas[index].sale_price *
            this.datas[index].quantity *
            (this.datas[index].discountPer / 100);
          this.datas[index].total = Number(value);
          this.datas[index].calculateTotal = Number(value);
        } else if (this.datas[index].quantity) {
          this.datas[index].sale_price = (
            Number(value) / Number(this.datas[index].quantity)
          ).toFixed(2);
          this.datas[index].total = Number(value);
          this.datas[index].calculateTotal = Number(value);
          this.datas[index].disAmountPer = 0;
        }
        this.discountAmountCalc();
      } else {
        this.datas[index].sale_price = null;
        this.datas[index].calculateTotal = 0;
        // this.datas[index].disAmountPer = 0;
        // this.datas[index].d_value = "";
        // this.datas[index].discountPer = null;
        // this.datas[index].discountPercent = 0;
        this.datas[index].calDiscountAmt = "";
        this.datas[index].total = "";
      }
    },
    trashModal() {
      this.isModalActive = true;
      this.itemName = this.inputName;
    },
    async trashConfirm() {
      let list = [];
      let response = await axios.get(
        "/inventory/items/?business=" +
          localStorage.getItem("business") +
          "&user=" +
          this.$auth.user.id,
        {
          headers: {
            Authorization: localStorage.getItem("auth._token.local"),
          },
        }
      );
      response.data.results.forEach((element) => {
        list.push({
          name: element.name,
          type_value: element.type_value,
          category_value: element.category_value,
          id: element.id,
          quantity: element.type_value == "Product" ? element.quantity : "-",
          sale_price_num: element.sale_price,
          sale_price:
            "Rs." + " " + this.conversion(Math.abs(element.sale_price)),
          purchase_price:
            element.type_value == "Product"
              ? "Rs." + " " + this.conversion(Math.abs(element.purchase_price))
              : "-",
          opening_stock: element.opening_stock,
          primary_unit_value:
            element.type_value == "Product" ? element.primary_unit_value : "",
          stock_value:
            element.type_value == "Product"
              ? "Rs." +
                " " +
                this.conversion(element.quantity * element.purchase_price)
              : "-",
          item_code:
            element.item_code == "" || element.item_code == null
              ? "-"
              : element.item_code,
          location:
            element.location == "" || element.location == null
              ? "-"
              : element.location,
          remarks:
            element.remarks == "" || element.remarks == null
              ? "-"
              : element.remarks,
          secondary_unit_value:
            element.secondary_unit_value == "" ||
            element.secondary_unit_value == null
              ? "-"
              : element.secondary_unit_value,
        });
      });
      this.items = list;
      this.$buefy.snackbar.open({
        message: "Item was added successfully",
        type: "is-primary",
        position: "is-bottom",
        indefinite: false,
      });
      this.isModalActive = false;
    },
    trashCancel() {
      this.isModalActive = false;
    },
    updateDiscount(num, index) {
      this.fromInput = false;
      if (num.includes(".")) {
        const [integerPart, decimalPart] = num.split(".");
        num = `${integerPart.slice(0, 8)}.${decimalPart.slice(0, 2)}`;
      } else if (num.length > 8) {
        num = num.slice(0, 8);
      }
      let total_amount =
        this.datas[index].sale_price * this.datas[index].quantity;
      let amountTotal = total_amount - Number(num);
      if (total_amount) {
        if (num) {
          let d_value = (num / total_amount) * 100;
          if (d_value <= 100 && num >= 0) {
            if (d_value == 100) {
              this.datas[index].readonly = true;
            } else {
              this.datas[index].readonly = false;
            }
            this.datas[index].total = amountTotal.toFixed(2);
            this.datas[index].calculateTotal = amountTotal;
            this.datas[index].d_value = d_value.toFixed(2);
            this.datas[index].disAmountPer = num;
            this.datas[index].calDiscountAmt = num;
            this.datas[index].discountPer = d_value;
            this.datas[index].discountPercent = d_value;
          } else {
            this.datas[index].d_value = null;
            this.datas[index].discountPer = null;
            this.datas[index].discountPercent = 0;
            this.datas[index].calDiscountAmt = "";
            this.datas[index].disAmountPer = 0;
            this.datas[index].readonly = false;
            this.datas[index].total = total_amount.toFixed(2);
            this.datas[index].calculateTotal = total_amount;
          }
        } else {
          this.datas[index].d_value = "";
          this.datas[index].discountPer = null;
          this.datas[index].discountPercent = 0;
          this.datas[index].disAmountPer = 0;
          this.datas[index].readonly = false;
          this.datas[index].total = total_amount.toFixed(2);
          this.datas[index].calculateTotal = total_amount;
        }
      } else {
        this.datas[index].calculateTotal = 0;
        this.datas[index].total = "";
      }
    },
    updateDiscountAmount(num, index) {
      this.fromInput = true;
      if (num) {
        if (num < 101 && num >= 0) {
          if (num == 100) {
            this.datas[index].readonly = true;
          } else {
            this.datas[index].readonly = false;
          }
          this.datas[index].d_value = num;
          this.datas[index].discountPercent = num;
          this.datas[index].discountPer = num;
          this.discountAmountCalc();
        } else {
          this.datas[index].discountPer = 0;
          this.datas[index].discountPercent = 0;
          this.datas[index].calDiscountAmt = null;
          this.datas[index].readonly = false;
        }
      } else {
        this.datas[index].d_value = "";
        this.datas[index].discountPer = 0;
        this.datas[index].discountPercent = 0;
        this.datas[index].calDiscountAmt = null;
        this.datas[index].readonly = false;
      }
    },
    discountAmountCalc() {
      const index = this.datas.findIndex((data) => {
        return data.id === this.rowId;
      });
      let total_amount =
        this.datas[index].sale_price * this.datas[index].quantity;
      if (this.datas[index].discountPercent && total_amount) {
        this.datas[index].calDiscountAmt = (
          total_amount *
          (this.datas[index].discountPercent / 100)
        )
          .toString()
          .match(/^-?\d+(?:\.\d{0,2})?/)[0];
      }
    },
    addNewItem() {
      this.$router.push("/addItem");
      localStorage.removeItem("currentCategoryId");
    },
    addTodo() {
      let highestId = Math.random().toString(36).substr(2, 7);
      this.datas.push({
        id: highestId,
        billId: null,
        name:"",
        quantity: null,
        item_name: "",
        item: null,
        currentUnit: "",
        sale_price: null,
        conversion_rate: null,
        Units: [],
        discountPer: null,
        discount: null,
        d_value: null,
        total: null,
        discValue: null,
        calculateTotal: 0,
        disAmountPer: 0,
        calDiscountAmt: null,
      });
      this.rowId = highestId;
      this.name = "";
    },
    async deleteItem(item) {
      const index = this.datas.findIndex((data) => {
        return data.id === item;
      });
      this.datas.splice(index, 1);
      if (this.datas.length) {
        let sub_total = 0;
        let disAmount = 0;
        for (let i = 0; i < this.datas.length; i++) {
          sub_total = sub_total + this.datas[i].calculateTotal;
          disAmount = disAmount + Number(this.datas[i].disAmountPer);
        }
        if (sub_total) {
          this.subTotal = sub_total.toFixed(2);
          this.$emit("itemsList", this.datas);
          this.$emit("totalData", this.subTotal);
        } else {
          this.subTotal = null;
          this.$emit("itemsList", []);
        }
        if (disAmount) {
          this.disAmount = disAmount
            .toString()
            .match(/^-?\d+(?:\.\d{0,2})?/)[0];
        } else {
          this.disAmount = 0;
        }
      } else {
        this.subTotal = null;
        this.$emit("totalData", this.subTotal);
        this.disAmount = null;
        this.$emit("itemsList", []);
      }
    },
    sn(num) {
      this.datas.id = Math.random().toString(36).substr(2, 7);
      const index = this.datas.findIndex((data) => {
        return data.id === num;
      });
      return index + 1;
    },
  },
};
</script>
<style lang="scss">
$green: #34a77f;
$black: hsl(0, 0%, 12%);
.todo-table {
  .table {
    border-collapse: collapse;
  }
  tr.is-empty {
    display: none;
  }
  .input {
    box-shadow: none;
    border-color: white;
    padding: 0;
    background-color: white !important;
    &:focus {
      box-shadow: none;
      border-color: white;
    }
    &:hover {
      box-shadow: none;
      border-color: white;
    }
  }
  thead {
    th {
      color: #000000 !important;
      text-transform: uppercase;

      &:nth-child(5) {
        .th-wrap {
          justify-content: center;
        }
      }
    }
  }
  .table.is-bordered td {
    border-width: 0.5px;
    border-color: #dedede;
    vertical-align: middle;
    text-align: center;
    padding: 0.4em;
    .sn-td {
      display: flex;
      justify-content: center;
      padding: 0 0.6em;
      .button {
        border: none;
        box-shadow: none;
        .icon {
          font-size: 20px;
          color: #d1d2d2;
        }
        &:hover .icon {
          color: #e54f6d;
        }
        &:focus {
          box-shadow: none;
        }
      }
      .num {
        padding-top: 3px;
        padding-right: 0.4rem;
      }
    }
    .quantity-input {
      justify-content: space-between;
      .button {
        box-shadow: none;
        &.is-light {
          background-color: white;
          border-color: #f5f5f5;
        }
        span {
          &:first-child {
            font-size: 14px;
          }
        }
      }
      .control {
        flex: 2;
        margin-right: 0;
      }
      .input {
        width: 100%;
        text-align: left;
        padding: 0;
      }
      .select select {
        border: 1px solid #f5f5f5;
        &:focus {
          box-shadow: none;
        }
        option {
          box-shadow: 0 0.5em 1em -0.125em hsla(0deg, 0%, 4%, 0.1),
            0 0 0 1px hsla(0deg, 0%, 4%, 0.02);
          margin: 40px;
          text-shadow: 0 1px 0 rgba(0, 0, 0, 0.4);
        }
      }
    }
    &.rate-td {
      span {
        padding-top: 8px;
        padding-left: 5px;
        padding-right: 5px;
      }
      .input {
        text-align: right;
      }
    }
    &.discount-td {
      padding: 0;
      td {
        border: none;
        &:first-child {
          border-right: 1px solid #dedede;
          .input {
            padding: 0;
            width: 2.7rem;
            text-align: right;
          }
        }
        &:last-child {
          .input {
            text-align: right;
          }
        }
        span {
          padding-top: 8px;
          padding-left: 5px;
          padding-right: 5px;
        }
      }
    }
    &.amount-td {
      span {
        padding-top: 8px;
        padding-left: 5px;
        padding-right: 5px;
      }
      .input {
        text-align: right;
      }
    }
  }

  .table.is-bordered th {
    border-width: 0.5px;
    border-color: #dedede;
    background-color: #f8f9fb;
  }

  .select select:not([multiple]) {
    padding-right: 1.6em;
  }
  //   &.is-bordered tr:last-child td {
  //     border-left: 1px solid red;
  // }
}
.todo-table .select:not(.is-multiple):not(.is-loading)::after {
  border-color: #6d6d6d;
  font-size: 12px;
  border-width: 1px;
  right: 1em;
}
.todo-table-bottom {
  display: flex;
  justify-content: space-between;
  border: 1px solid #f5f5f5;
  margin-right: 0 !important;
  padding: 0;
  .add-left {
    .button {
      padding-top: 1em;
      text-transform: uppercase;
    }
  }
  .totals {
    flex-grow: 1;
    text-align: right;
    .columns {
      margin-left: 0;
      margin-right: 0;
      margin-top: 0;
      margin-bottom: 0;
    }
    .sub-total {
      text-transform: uppercase;
    }
    .total-discount {
      font-weight: 600;
      padding-right: 25px;
    }
    .total-amount {
      font-weight: 600;
    }
  }
}
.autocomplete.table-item {
  .button {
    width: 100%;
    height: 2.5em;
  }
  .dropdown-menu {
    min-width: 35rem !important;
  }
  .dropdown-content {
    max-height: 300px !important;
    padding-top: 0;
    .dropdown-item {
      &:first-child {
        background-color: #f5f5f5;
        padding: 0.75rem;
      }
    }
  }
  a {
    padding: 0.75rem;
    border-top: 1px solid #f5f5f5;
    &:first-child {
      background-color: #fafafa;
    }
  }
  .party-items-head {
    display: flex;
    justify-content: space-between;
    .item {
      &:nth-child(2) {
        margin-left: 5rem;
      }
      .add-item {
        font-weight: 600;
        color: #3ab98d;
        .icon.is-small {
          font-size: 1px;
          .mdi:before,
          .mdi-set {
            font-weight: 600;
          }
        }
      }
    }
  }
  .party-items {
    display: inline-flex;
    .item {
      &:nth-child(1) {
        width: 15rem;
        padding-right: 1rem;
        white-space: initial;
      }
      &:nth-child(2) {
        width: 7.6rem;
        text-align: right;
      }
      &:nth-child(3) {
        text-align: right;
        width: 9rem;
        margin-left: 1rem;
      }
    }
  }
}
@media screen and (max-width: 768px) {
  .todo-table-bottom .totals .total-discount {
    padding-right: 12px;
  }
}
</style>
<style lang="scss" scoped>
.d_none {
  display: none;
}
.table.is-bordered tr:last-child > td:nth-child(5) {
  position: relative;
  &::after {
    content: "";
    position: absolute;
    top: 3.2rem;
    left: -1px;
    height: 3.2rem;
    width: 1px;
    background-color: #dedede;
  }
}
.table.is-bordered tr:last-child > td:last-child {
  position: relative;
  &::after {
    content: "";
    position: absolute;
    top: 3.2rem;
    left: -1px;
    height: 3.2rem;
    width: 1px;
    background-color: #dedede;
  }
}
</style>