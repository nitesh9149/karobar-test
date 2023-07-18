<template>
  <div>
    <party-modal
      :is-active="isModalActive"
      @confirm="trashConfirm"
      @cancel="trashCancel"
      :showAdd="false"
    />
    <delete-sale
      :is-active="isModalActive2"
      :title="'Purchase Invoice'"
      @confirm="trashConfirm2"
      @cancel="trashCancel2"
    />
    {{ openingDate }}{{ formatValue }}{{ dueComputed }}{{ pushImages }}
    <section class="section is-title-bar">
      <div class="level">
        <div class="level-left">
          <div class="level-item">
            <ul>
              <li v-if="globalHelper('editPurchase')">Edit Purchase Invoice</li>
              <li v-else>Purchase Invoice</li>
            </ul>
          </div>
        </div>
        <div class="level-right">
          <div class="level-item">
            <div class="buttons is-right">
              <b-button @click="generateReport" type="is-primary">
                <b-icon icon="file-pdf" custom-size="default" />
                <span class="button-title">Generate Invoice</span>
              </b-button>
            </div>
          </div>
        </div>
      </div>
    </section>
    <span style="display: none">{{ receiveDisplay }}</span>
    <section class="section is-main-section sale-invoice-o">
      <div class="sale-form">
        <div class="box">
          <div class="form-section">
            <div class="columns">
              <div class="column is-5">
                <b-field label="Biling Party">
                  <b-autocomplete
                    class="billing-party"
                    v-model="name"
                    @typing="searchParty($event)"
                    ref="autocomplete"
                    dropdown-position="bottom"
                    :data="data"
                    :open-on-focus="true"
                    field="name"
                    placeholder="Enter Party Name"
                    icon-right="chevron-down"
                    @select="(option) => (selected = option)"
                  >
                    <template slot-scope="props">
                      <div class="party-items">
                        <div class="item-left">
                          <p class="item-title">
                            {{ props.option.name }}
                          </p>
                          <p class="sub-title">
                            {{ props.option.phone_number }}
                          </p>
                        </div>
                        <div class="item-right">
                          <p
                            class="item-title"
                            :class="
                              props.option.condition === 'To Receive'
                                ? 'color-green'
                                : props.option.condition === 'To Pay'
                                ? 'color-red'
                                : 'color-black'
                            "
                          >
                            {{ props.option.amount }}
                          </p>
                          <p class="sub-title">{{ props.option.condition }}</p>
                        </div>
                      </div>
                    </template>
                    <template #header>
                      <b-button
                        class="button"
                        type="is-light"
                        @click="trashModal"
                        icon-left="plus"
                      >
                        <span> Add New Party </span>
                      </b-button>
                    </template>
                    <template #empty>No results for {{ name }}</template>
                  </b-autocomplete>
                </b-field>
              </div>
              <div class="column is-6 is-offset-1">
                <div class="form-section-right">
                  <div class="columns">
                    <div class="column is-4 is-offset-3">
                      <b-field
                        expanded
                        class="invoice-input"
                        label="Invoice Number"
                      >
                        <b-input
                          expanded
                          v-model="sale.number"
                          placeholder="Enter Invoice No."
                          type="text"
                          step="any"
                        ></b-input>
                      </b-field>
                    </div>
                    <div class="column is-5">
                      <b-field
                        label="Invoice Date"
                        class="date-picker-down date-content"
                      >
                        <v-nepalidatepicker
                          :key="componentKey"
                          v-model="date"
                          placeholder="Select a date"
                          @click.native="hideC2"
                          classValue="date_picker_page"
                          ref="dateValue"
                        />
                      </b-field>
                      <div
                        :class="{ d_none: !isActive }"
                        class="add-date add-button"
                      >
                        <b-button
                          @click.prevent="addDueDate"
                          class="button"
                          icon-left="plus"
                          type="is-add-white"
                          >Add Due Date</b-button
                        >
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="form-section" :class="{ d_none: !displayDue }">
            <div class="columns">
              <div class="column is-6 is-offset-6">
                <div class="form-section-right">
                  <div class="columns">
                    <div class="column is-4 is-offset-3">
                      <div class="invoice-input">
                        <span class="received-label">Due Period</span>
                        <b-field expanded class="due-period">
                          <b-input
                            :value="duePeriod"
                            @input="inputPeriod"
                            class="due-period-input"
                            expanded
                            oninput="validity.valid||(value='');"
                            min="0"
                            type="number"
                            step="any"
                          ></b-input>
                          <p class="control left-input">Days</p>
                        </b-field>
                      </div>
                    </div>
                    <div class="column is-5">
                      <div class="date-content">
                        <b-field
                          label="Due Date"
                          class="date-picker-down date-content"
                        >
                          <v-nepalidatepicker
                            :key="componentKey2"
                            v-model="dueDate"
                            placeholder="Select a date"
                            @click.native="hideC1"
                            classValue="date_picker_page2"
                            ref="dueValue"
                          />
                        </b-field>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="product-table">
        <div class="box">
          <todo-table-edit
            :type="'purchase'"
            :billItem="billItem"
            @totalData="totalDatas"
            @itemsList="itemsList"
          />
        </div>
      </div>
      <div class="sale-bottom">
        <div class="box">
          <div class="columns">
            <div class="column is-6">
              <div class="sale-bottom-note">
                <b-field label="Note">
                  <b-input
                    v-model="sale.note"
                    placeholder="Write Short Note"
                    type="textarea"
                  ></b-input>
                </b-field>
              </div>
              <span class="label">Attach Images</span>
              <div class="upload-transaction-img">
                <div
                  v-if="invoice_images.length < 3"
                  class="image-input"
                  @click="chooseImage"
                >
                  <span class="placeholder">
                    <b-icon icon="camera-plus" size="is-large"></b-icon>
                  </span>
                  <input
                    class="file-input"
                    ref="fileInput"
                    type="file"
                    accept="image/png, image/jpeg, image/jpg"
                    :key="imageData"
                    @input="onSelectFile"
                  />
                </div>
                <div
                  v-for="(image, index) in invoice_images"
                  :key="index"
                  class="image-output"
                >
                  <a :href="image" target="_blank"
                    ><img :src="image" alt="image"
                  /></a>
                  <span @click="removeImage(index)"
                    ><b-icon icon="close" size="is-small"></b-icon
                  ></span>
                </div>
              </div>
            </div>
            <div class="column is-5 is-offset-1">
              <div v-if="totalvalue" class="buttons-top-form">
                <ul v-for="post in discount" :key="post._id">
                  <li>
                    <div class="additional-charges">
                      <b-field grouped>
                        <b-field label="Discount(%)" expanded>
                          <b-input
                            @input="updateDiscountAmount"
                            :value="d_value"
                            @input.native="restrictDiscount($event)"
                            min="0"
                            max="100"
                            type="number"
                            oninput="validity.valid||(value='');"
                            step="any"
                          ></b-input>
                        </b-field>
                        <b-field class="mid-equals">
                          <span
                            ><b-icon
                              icon="link-variant"
                              size="is-small"
                            ></b-icon
                          ></span>
                        </b-field>
                        <b-field label="Discount Amount" expanded>
                          <b-input
                            :key="num"
                            @input="updateDiscount"
                            :value="calDiscountAmt"
                            type="number"
                            @input.native="restrictInput($event)"
                            oninput="validity.valid||(value='');"
                            min="0"
                            step="any"
                          ></b-input>
                        </b-field>
                        <b-button
                          size="is-small"
                          @click="deleteDiscount"
                          icon-right="delete"
                        />
                      </b-field>
                    </div>
                  </li>
                </ul>
                <ul v-for="post in vat" :key="post._id">
                  <li>
                    <div class="additional-charges">
                      <b-field grouped>
                        <b-field label="VAT(%)" expanded>
                          <b-input
                            :value="vatValue"
                            readonly
                            type="text"
                          ></b-input>
                        </b-field>
                        <b-field class="mid-equals">
                          <span
                            ><b-icon
                              icon="link-variant"
                              size="is-small"
                            ></b-icon
                          ></span>
                        </b-field>
                        <b-field label="VAT Amount" expanded>
                          <b-input
                            :readonly="isReadOnly"
                            v-model="vatNum"
                            type="text"
                            step="any"
                          ></b-input>
                        </b-field>
                        <b-button
                          size="is-small"
                          @click="deleteVat"
                          icon-right="delete"
                        />
                      </b-field>
                    </div>
                  </li>
                </ul>
                <div :class="{ d_none: isActiveDiscount }" class="add-button">
                  <b-button
                    @click.prevent="addDiscount"
                    class="button"
                    icon-left="plus"
                    type="is-add-white"
                    >Add Discount</b-button
                  >
                </div>
                <!-- <div :class="{ d_none: isActiveVat }" class="add-button">
                  <b-button
                    @click.prevent="addVat"
                    class="button"
                    icon-left="plus"
                    type="is-add-white"
                    >VAT</b-button
                  >
                </div> -->
                <div v-if="!charges.length" class="add-button">
                  <b-button
                    @click.prevent="addCharges"
                    class="button"
                    icon-left="plus"
                    type="is-add-white"
                    >{{ Add_Charges }}</b-button
                  >
                </div>
              </div>
              <ul v-if="totalvalue">
                <li>
                  <div class="additional-charges">
                    <div class="charges-label" :class="{ d_none: isShowLabel }">
                      <span class="received-label">Additional Charges</span>
                      <span class="received-label">Amount</span>
                    </div>
                    <ul>
                      <li v-for="(post, index) in charges" :key="post.id">
                        <b-field grouped>
                          <b-field>
                            <b-input
                              v-model="post.name"
                              type="text"
                              placeholder="Enter Charge Name"
                              style="width: 220px"
                            ></b-input>
                          </b-field>
                          <b-field expanded>
                            <div class="group-amount">
                              <p class="control"><span>Rs.</span></p>
                              <b-input
                                v-model="post.amount"
                                @input.native="restrictInput2($event, index)"
                                oninput="validity.valid||(value='');"
                                min="0"
                                type="number"
                                step="any"
                              ></b-input>
                            </div>
                          </b-field>
                          <b-button
                            class="charges-button"
                            @click.prevent="deleteCharges(post.id)"
                            size="is-small"
                            icon-right="delete"
                          />
                        </b-field>
                      </li>
                    </ul>
                  </div>
                </li>
              </ul>
              <div v-if="totalvalue && charges.length" class="add-button">
                <b-button
                  @click.prevent="addCharges"
                  class="button"
                  icon-left="plus"
                  type="is-add-white"
                  >{{ Add_Charges }}</b-button
                >
              </div>
              <div class="sale-bottom-form">
                <span class="received-label">Total Amount</span>
                <b-field>
                  <p class="control" :class="{ readOnly: isReadOnly }">
                    <span>Rs.</span>
                  </p>
                  <b-input
                    :readonly="isReadOnly"
                    v-model="totalDataDis"
                    type="number"
                    @input.native="restrictInput3($event)"
                    oninput="validity.valid||(value='');"
                    min="0"
                    step="any"
                    expanded
                  ></b-input>
                </b-field>
                <span :class="{ d_none: receiveField }" class="received-label"
                  >Paid Amount</span
                >
                <b-field :class="{ d_none: receiveField }">
                  <b-dropdown
                    :scrollable="isScrollable"
                    :max-height="maxHeight"
                    v-model="currentUnit"
                    aria-role="list"
                  >
                    <template #trigger>
                      <b-button
                        :label="currentUnit.text"
                        type="is-light"
                        icon-right="menu-down"
                      />
                    </template>

                    <b-dropdown-item
                      v-for="(Unit, index) in Units"
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
                  </b-dropdown>
                  <p class="control received_amount"><span>Rs.</span></p>
                  <b-input
                    v-model="receiveData"
                    expanded
                    type="number"
                    @input.native="restrictInput4($event)"
                    oninput="validity.valid||(value='');"
                    step="any"
                    min="0"
                  ></b-input>
                </b-field>
                <span style="display: none">{{ total }}</span>
                <div
                  v-if="totalSum > 0"
                  class="balance-amount"
                  :class="{ d_none: receiveField }"
                >
                  <div>Balance Amount:</div>
                  <div>Rs. {{ totalSum.toFixed(2) }}</div>
                </div>
                <div
                  v-if="totalSum < 0"
                  class="balance-amount"
                  :class="{ d_none: receiveField }"
                >
                  <div class="redAmt">
                    Received amount can't be greater than total amount
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="columns">
            <div class="column is-6">
              <b-button
                v-if="globalHelper('deletePurchase')"
                @click="trashModal2"
                class="button-trash is-danger-outline"
              >
                <span class="button-title">Delete</span>
              </b-button>
            </div>
            <div class="column is-5 is-offset-1">
              <div class="buttons">
                <b-button
                  v-if="globalHelper('editPurchase')"
                  @click="saveInvoice"
                  type="is-success"
                  >SAVE PURCHASE INVOICE</b-button
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
// @ is an alias to /src
import axios from "axios";
import { mapState } from "vuex";
import NepaliDate from "nepali-date-converter";
import VNepaliDatePicker from "v-nepalidatepicker";
import SubtitleBar from "@/components/SubtitleBar";
import TitleBar from "@/components/TitleBar";
import TodoTableEdit from "@/components/TodoTableEdit";
import IssueDate from "@/components/Date/IssueDate";
import PartyModal from "@/components/PartyModal";
import DeleteSale from "@/components/DeleteSale";
import VueHtml2pdf from "vue-html2pdf";
export default {
  name: "Home",
  middleware: "auth-business",
  components: {
    TitleBar,
    SubtitleBar,
    TodoTableEdit,
    IssueDate,
    PartyModal,
    DeleteSale,
    VueHtml2pdf,
    VNepaliDatePicker,
  },
  data() {
    return {
      all_data: {},
      show: false,
      sale: {
        id: "",
        user: this.$auth.user.id,
        sub_total: "",
        business: localStorage.getItem("business"),
        on_cash: false,
        vat_enabled: false,
        discount_percent: null,
        payment_mode: "cash",
        note: "",
        date: new Date(),
        number: null,
        due: null,
        paid: null,
        party: null,
        party_value: null,
        party_name: "",
      },
      num: 1,
      fromInput: true,
      calDiscountAmt: "",
      date: "",
      dueDate: "",
      dateDue: "",
      componentKey: 0,
      componentKey2: 0,
      billItem: [],
      billing_items: [],
      additional_charges: [],
      data: [],
      isScrollable: false,
      maxHeight: 200,
      duePeriod: null,
      isActive: false,
      displayDue: false,
      isShowLabel: true,
      isModalActive: false,
      isModalActive2: false,
      isActiveVat: false,
      isReadOnly: false,
      discountPer: 0,
      discountPercent: null,
      previousValue: null,
      discountAmount: null,
      discountAmountValue: null,
      totalvalue: null,
      vatNum: null,
      vatCheck: false,
      vatValue: "13%",
      receiveField: true,
      d_value: null,
      isActiveDiscount: false,
      isSwitchedCustom: "Cash",
      isNotShowTerms: true,
      totalData: null,
      totalDataDis: null,
      receiveData: null,
      charge_total: null,
      Add_Charges: "Add Charges",
      keepFirst: false,
      openOnFocus: false,
      name: "",
      selected: null,
      clearable: false,
      currentUnit: { text: "Cash" },
      Units: [{ text: "Cash" }, { text: "Cheque" }, { text: "Online" }],
      initial_charges: [],
      charges: [],
      discount: [],
      vat: [],
      imageData: "",
      invoice_images: [],
      deleteImage: false,
      next: "",
    };
  },
  async mounted() {
    this.$refs.autocomplete.$el
      .querySelector(".dropdown-content")
      .addEventListener("scroll", this.onScroll);
    const loadingComponent = this.$buefy.loading.open();
    try {
      let res = await axios.get(
        "/transactions/bulk-purchase/?purchase=" +
          localStorage.getItem("purchase"),
        {
          headers: {
            Authorization: localStorage.getItem("auth._token.local"),
          },
        }
      );
      this.sale.id = res.data.purchase.id;
      if (res.data.purchase.on_cash == true) {
        this.name = "Cash Purchase";
        this.sale.on_cash = true;
        this.sale.party_value = null;
      } else {
        this.name = res.data.purchase.party_name;
        this.sale.party = res.data.purchase.party;
      }
      if (res.data.purchase.image_url_1) {
        this.invoice_images[0] = res.data.purchase.image_url_1;
      }
      if (res.data.purchase.image_url_2) {
        this.invoice_images[1] = res.data.purchase.image_url_2;
      }
      if (res.data.purchase.image_url_3) {
        this.invoice_images[2] = res.data.purchase.image_url_3;
      }
      this.sale.number = res.data.purchase.number;
      let date2 = new Date(res.data.purchase.date);
      let nepDate2 = new NepaliDate(date2).format("YYYY-MM-DD");
      this.date = nepDate2;
      if (res.data.purchase.due) {
        this.sale.due = res.data.purchase.due;
        this.displayDue = true;
        let due = new Date(res.data.purchase.due);
        let nepDate = new NepaliDate(due).format("YYYY-MM-DD");
        this.dueDate = nepDate;
      }
      this.sale.note = res.data.purchase.note;
      if (res.data.purchase.vat_enabled) {
        this.addVat();
      }
      this.totalDataDis = res.data.purchase.total;
      this.receiveData = res.data.purchase.paid;
      this.currentUnit.text =
        res.data.purchase.payment_mode.charAt(0).toUpperCase() +
        res.data.purchase.payment_mode.slice(1);
      if (res.data.billing_items.length) {
        this.billItem = res.data.billing_items;
      }
      if (res.data.additional_charges.length) {
        this.isShowLabel = false;
        let addCharges = [];
        res.data.additional_charges.forEach((e) => {
          addCharges.push({
            id: e.id,
            chargeId: e.id,
            name: e.title,
            amount: e.charge,
          });
        });
        this.charges = addCharges.reverse();
      }
      if (res.data.purchase.discount_percent > 0) {
        this.discountPercent = res.data.purchase.discount_percent;
        this.discountPer = res.data.purchase.discount_percent;
        this.d_value = res.data.purchase.discount_percent;
        this.addDiscount();
        this.updateDiscountAmount(res.data.purchase.discount_percent);
      }
    } catch (err) {}
    let list = [];
    try {
      let response = await axios.get(
        "/parties/parties/?business=" + localStorage.getItem("business"),
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
          amount:
            element.amount < 0
              ? "Rs" + " " + this.conversion(Math.abs(-element.amount))
              : element.amount > 0
              ? "Rs" + " " + this.conversion(Math.abs(element.amount))
              : this.conversion(element.amount),
          id: element.id,
          condition:
            element.amount > 0
              ? "To Receive"
              : element.amount == 0
              ? "Settled"
              : "To Pay",
          email:
            element.email === "" || element.email === null
              ? "Email Not Set"
              : element.email,
          phone_number:
            element.phone_number === "" || element.phone_number === null
              ? "Phone Number Not Set"
              : element.phone_number,
          address:
            element.address === "" || element.address === null
              ? "Address Not Set"
              : element.address,
          id: element.id,
        });
      });
      list.unshift({
        name: "Cash Purchase",
        phone_number: "Select this option if the purchase is in cash",
        value: "cash sale",
      });
      this.data = list;
    } catch (err) {}
    this.componentKey += 1;
    this.componentKey2 += 1;
    loadingComponent.close();
  },
  updated() {
    document.querySelector(".date_picker_page").readOnly = true;
    document.querySelector(".date_picker_page2").readOnly = true;
  },
  computed: {
    titleStack() {
      return ["Edit Purchase Invoice"];
    },
    titleSub() {
      return ["Items"];
    },
    delLabel() {
      if (this.charges.id === null) {
        this.isActive = true;
      }
    },
    openingDate() {
      if (this.date) {
        let nepDate = new NepaliDate(this.date);
        let engDate = nepDate.toJsDate();
        this.sale.date = engDate;
      } else {
        this.sale.date = new Date();
      }
    },
    dueComputed() {
      if (this.dateDue) {
        let nepDate = new NepaliDate(this.dateDue);
        let engDate = nepDate.toJsDate();
        this.sale.due = engDate;
      } else {
        this.sale.due = null;
      }
    },
    formatValue() {
      if (this.dueDate) {
        this.dateDue = this.dueDate;
        this.$refs.dueValue.formatedValue = this.dueDate;
        let nepDate = new NepaliDate(this.dueDate);
        let date1 = new Date();
        let date2 = nepDate.toJsDate();
        let timeInMilisec = date2.getTime() - date1.getTime();
        let daysBetweenDates = Math.ceil(timeInMilisec / (1000 * 60 * 60 * 24));
        if (daysBetweenDates >= 0) {
          this.duePeriod = daysBetweenDates;
        } else if (daysBetweenDates < 0) {
          this.duePeriod = null;
        } else {
          this.duePeriod = 0;
        }
      }
    },
    total: function () {
      let total = 0;
      if (this.totalvalue) {
        total = this.totalvalue;
      }
      if (total) {
        if (this.discountPercent) {
          this.discountAmount = total * (this.discountPercent / 100);
          if (this.fromInput) {
            this.discountAmountCalc();
          }
          let totalData = total - this.discountAmount;
          this.totalDataDis = totalData.toFixed(2);
        } else {
          this.discountPercent = 0;
          this.discountAmount = 0;
          this.discountPer = 0;
          this.d_value = null;
          let totalData = total - this.discountAmount;
          this.totalDataDis = totalData.toFixed(2);
        }
        if (this.vatCheck) {
          let vatNum = Number(this.totalDataDis) * 0.13;
          this.vatNum = vatNum.toFixed(2);
          let vatAmt = Number(this.totalDataDis) + vatNum;
          this.totalDataDis = vatAmt.toFixed(2);
        }
      }

      let sub_total = null;
      let total_charge = 0;
      if (this.totalDataDis) {
        sub_total = this.totalDataDis;
      }
      if (this.charges.length > 0) {
        for (let i = 0; i < this.charges.length; i++) {
          total_charge = total_charge + Number(this.charges[i].amount);
        }
        this.charge_total = total_charge;
        if (this.charge_total > 0) {
          this.totalDataDis = (this.charge_total + Number(sub_total)).toFixed(
            2
          );
        } else {
          this.totalDataDis = sub_total;
        }
      } else {
        this.totalDataDis = sub_total;
      }
      return total;
    },
    totalSum: function () {
      let totalAmt = this.totalDataDis - this.receiveData;
      return totalAmt;
    },
    receiveDisplay: function () {
      if (this.name) {
        this.sale.party_name = this.name.trim();
      } else {
        this.sale.party_name = "";
      }
      if (this.selected != null) {
        if (
          this.selected.value == "cash sale" ||
          this.name.trim().toLowerCase() == "cash purchase"
        ) {
          this.sale.on_cash = true;
          this.sale.party = null;
          this.receiveField = true;
          this.displayDue = false;
          this.isActive = false;
        } else {
          this.sale.on_cash = false;
          this.sale.party = this.selected.id;
          if (this.totalDataDis > 0) {
            this.receiveField = false;
          } else {
            this.receiveField = true;
            this.isActive = false;
          }
          if (Number(this.totalSum) > 0) {
            if (!this.displayDue) {
              this.isActive = true;
            }
          } else {
            this.isActive = false;
          }
        }
      } else {
        if (this.totalDataDis > 0) {
          if (this.name.trim().toLowerCase() == "cash purchase") {
            this.receiveField = true;
          } else {
            this.receiveField = false;
          }
        } else {
          this.receiveField = true;
          this.isActive = false;
        }
        if (Number(this.totalSum) > 0) {
          if (this.name.trim().toLowerCase() == "cash purchase") {
            this.isActive = false;
          } else if (this.sale.due == null) {
            if (!this.displayDue) {
              this.isActive = true;
            }
          }
        } else {
          this.isActive = false;
        }
      }
    },
    pushImages() {
      if (this.imageData && !this.deleteImage) {
        this.invoice_images.push(this.imageData);
      }
    },
  },
  methods: {
    hideC1() {
      this.$refs.dateValue.hide();
    },
    hideC2() {
      this.$refs.dueValue.hide();
    },
    restrictDiscount(event) {
      let value = event.target.value;
      if (value.includes(".")) {
        const [integerPart, decimalPart] = value.split(".");
        event.target.value = `${integerPart.slice(0, 8)}.${decimalPart.slice(
          0,
          2
        )}`;
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
        this.calDiscountAmt = event.target.value;
      } else if (value.length > 8) {
        event.target.value = value.slice(0, 8);
        this.calDiscountAmt = event.target.value;
      }
    },
    restrictInput2(event, index) {
      let value = event.target.value;
      if (value.includes(".")) {
        const [integerPart, decimalPart] = value.split(".");
        event.target.value = `${integerPart.slice(0, 8)}.${decimalPart.slice(
          0,
          2
        )}`;
        this.charges[index].amount = event.target.value;
      } else if (value.length > 8) {
        event.target.value = value.slice(0, 8);
        this.charges[index].amount = event.target.value;
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
        this.totalDataDis = event.target.value;
      } else if (value.length > 8) {
        event.target.value = value.slice(0, 8);
        this.totalDataDis = event.target.value;
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
        this.receiveData = event.target.value;
      } else if (value.length > 8) {
        event.target.value = value.slice(0, 8);
        this.receiveData = event.target.value;
      }
    },
    onScroll() {
      let apiCall = async () => {
        if (
          Math.ceil(
            this.$refs.autocomplete.$el.querySelector(".dropdown-content")
              .scrollTop
          ) +
            this.$refs.autocomplete.$el.querySelector(".dropdown-content")
              .clientHeight +
            1 >=
            this.$refs.autocomplete.$el.querySelector(".dropdown-content")
              .scrollHeight &&
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
              amount:
                element.amount < 0
                  ? "Rs" + " " + this.conversion(Math.abs(-element.amount))
                  : element.amount > 0
                  ? "Rs" + " " + this.conversion(Math.abs(element.amount))
                  : this.conversion(element.amount),
              id: element.id,
              condition:
                element.amount > 0
                  ? "To Receive"
                  : element.amount == 0
                  ? "Settled"
                  : "To Pay",
              email:
                element.email === "" || element.email === null
                  ? "Email Not Set"
                  : element.email,
              phone_number:
                element.phone_number === "" || element.phone_number === null
                  ? "Phone Number Not Set"
                  : element.phone_number,
              address:
                element.address === "" || element.address === null
                  ? "Address Not Set"
                  : element.address,
              id: element.id,
            });
          });
          this.data.push(...list);
        }
      };
      this.throttleFunction(apiCall, 200);
    },
    throttleFunction(callback, time) {
      if (this.throttlePause) return;
      this.throttlePause = true;
      setTimeout(() => {
        callback();
        this.throttlePause = false;
      }, time);
    },
    async searchParty(event) {
      let list = [];
      try {
        let response = await axios.get(
          "/parties/parties/?business=" +
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
            amount:
              element.amount < 0
                ? "Rs" + " " + this.conversion(Math.abs(-element.amount))
                : element.amount > 0
                ? "Rs" + " " + this.conversion(Math.abs(element.amount))
                : this.conversion(element.amount),
            id: element.id,
            condition:
              element.amount > 0
                ? "To Receive"
                : element.amount == 0
                ? "Settled"
                : "To Pay",
            email:
              element.email === "" || element.email === null
                ? "Email Not Set"
                : element.email,
            phone_number:
              element.phone_number === "" || element.phone_number === null
                ? "Phone Number Not Set"
                : element.phone_number,
            address:
              element.address === "" || element.address === null
                ? "Address Not Set"
                : element.address,
            id: element.id,
          });
        });
        this.data = list;
      } catch (err) {}
      if (!event) {
        this.data.unshift({
          name: "Cash Purchase",
          phone_number: "Select this option if the purchase is in cash",
          value: "cash sale",
        });
      }
    },
    inputPeriod(e) {
      if (e > 0) {
        let today = new Date();
        let afterToday = new Date();
        afterToday.setDate(today.getDate() + Math.abs(e));
        let nepDate = new NepaliDate(afterToday);
        this.$refs.dueValue.formatedValue = nepDate.format("YYYY-MM-DD");
        this.dateDue = nepDate.format("YYYY-MM-DD");
      } else {
        this.dateDue = null;
        this.$refs.dueValue.formatedValue = "";
      }
    },
    generateReport() {
      this.$router.push("/generateInvoice");
    },
    totalDatas(data) {
      this.fromInput = true;
      if (data) {
        this.totalData = data;
        this.totalvalue = data;
      } else {
        this.totalvalue = "";
        this.isReadOnly = false;
      }
    },
    trashModal() {
      this.isModalActive = true;
    },
    trashConfirm(post) {
      this.name = post.name;
      this.sale.party = post.id;
      this.data.unshift({
        name: post.name,
        type_value: post.type_value,
        amount:
          post.amount < 0
            ? this.conversion(Math.abs(-post.amount))
            : post.amount > 0
            ? this.conversion(Math.abs(post.amount))
            : this.conversion(post.amount),
        id: post.id,
        condition:
          post.amount > 0
            ? "To Receive"
            : post.amount == 0
            ? "Settled"
            : "To Pay",
        email:
          post.email === "" || post.email === null
            ? "Email Not Set"
            : post.email,
        phone_number:
          post.phone_number === "" || post.phone_number === null
            ? "Phone Number Not Set"
            : post.phone_number,
        address:
          post.address === "" || post.address === null
            ? "Address Not Set"
            : post.address,
        pan_vat_number: post.pan_vat_number,
      });
      this.$buefy.snackbar.open({
        message: "Party was added successfully",
        type: "is-primary",
        position: "is-bottom",
        indefinite: false,
      });
      this.isModalActive = false;
    },
    trashCancel() {
      this.isModalActive = false;
    },
    addCharges() {
      let highestId = Math.random().toString(36).substr(2, 7);
      this.charges.push({
        id: highestId,
        name: "",
        chargeId: null,
        amount: null,
      });
      this.isShowLabel = false;
    },

    addDiscount() {
      let highestId = Math.random().toString(36).substr(2, 7);
      this.discount.push({
        id: highestId + 1,
      });
      this.isActiveDiscount = true;
    },
    addVat() {
      let highestId = this.vat.id;
      this.vat.push({
        id: highestId + 1,
      });
      this.isActiveVat = true;
      this.vatCheck = true;
      this.isReadOnly = true;
    },
    addDueDate() {
      this.isActive = false;
      this.displayDue = true;
    },
    addTerms() {
      this.isNotShowTerms = false;
    },
    async deleteCharges(item) {
      const index = this.charges.findIndex((data) => {
        return data.id === item;
      });
      this.charges.splice(index, 1);
      if (this.charges.length === 0) {
        this.isShowLabel = true;
      }
    },
    deleteDiscount(item) {
      const index = this.discount.findIndex((data) => {
        return data.id === item;
      });
      this.discount.splice(index, 1);
      this.isActiveDiscount = false;
      this.discountPercent = null;
      this.d_value = "";
      this.calDiscountAmt = "";
    },
    deleteVat(item) {
      const index = this.vat.findIndex((data) => {
        return data.id === item;
      });
      this.vat.splice(index, 1);
      this.isActiveVat = false;
      this.vatCheck = false;
    },
    deleteTerms() {
      this.isShowTerms = false;
    },
    updateDiscount(num) {
      this.fromInput = false;
      let total_amount = Number(this.totalData);

      if (num.includes(".")) {
        const [integerPart, decimalPart] = num.split(".");
        num = `${integerPart.slice(0, 8)}.${decimalPart.slice(0, 2)}`;
      } else if (num.length > 8) {
        num = value.slice(0, 8);
      }
      num = Number(num);
      if (num) {
        let d_value = Number((num / total_amount) * 100);
        if (d_value <= 100 && num >= 0) {
          this.d_value = d_value.toFixed(2);
          this.calDiscountAmt = num;
          if (total_amount) {
            this.discountPer = d_value;
            this.discountPercent = d_value;
          } else {
            this.discountPercent = "";
            this.discountPer = d_value;
          }
        } else {
          this.d_value = "";
          this.discountPercent = "";
          this.discountPer = 0;
          this.calDiscountAmt = "";
        }
      } else {
        this.d_value = "";
        this.discountPercent = 0;
        this.calDiscountAmt = "";
      }
    },
    discountAmountCalc() {
      let total = null;
      if (this.discountPer) {
        total = (this.totalData * (this.discountPer / 100)).toFixed(2);
        this.calDiscountAmt = total;
      }
    },
    updateDiscountAmount(num) {
      this.fromInput = true;
      if (num.includes(".")) {
        const [integerPart, decimalPart] = num.split(".");
        num = `${integerPart.slice(0, 8)}.${decimalPart.slice(0, 2)}`;
      }
      if (num) {
        if (num <= 100 && num >= 0) {
          this.discountPercent = num;
          this.discountPer = num;
          this.d_value = num;
          this.discountAmountCalc();
        }
      } else {
        this.calDiscountAmt = "";
        this.discountPercent = 0;
        this.discountPer = 0;
        this.d_value = "";
        this.num++;
      }
    },
    itemsList(list) {
      this.fromInput = true;
      if (list.length) {
        let interval = setInterval(() => {
          if (list[0].quantity || list[0].sale_price) {
            this.isReadOnly = true;
          } else {
            this.isReadOnly = false;
          }
          clearInterval(interval);
        }, 200);
        let listItems = [];
        list.forEach((element) => {
          listItems.push({
            id: element.billId,
            rate:
              element.sale_price == "" || element.sale_price == null
                ? null
                : element.sale_price,
            quantity:
              element.quantity == "" || element.quantity == null
                ? null
                : element.quantity,
            item: element.item,
            item_name: element.item_name.trim(),
            secondary_unit: element.secondary_unit,
            type: "purchase",
            note: "",
            sub_total: element.total,
            discount_percent:
              element.discountPer === null ? 0 : element.discountPer,
            user: this.$auth.user.id,
            business: localStorage.getItem("business"),
          });
        });
        this.billing_items = listItems;
      } else {
        this.billing_items = [];
        this.totalDataDis = "";
        this.charges = [];
        this.discount = [];
        this.vat = [];
        this.receiveData = "";
        this.discountPercent = null;
        this.isActiveDiscount = false;
        this.isActiveVat = false;
        this.vatCheck = false;
        this.isShowLabel = true;
        this.totalvalue = null;
        this.billing_items = [];
        this.d_value = "";
        this.calDiscountAmt = "";
      }
    },
    chooseImage() {
      this.$refs.fileInput.click();
    },
    async onSelectFile() {
      this.deleteImage = false;
      const input = this.$refs.fileInput;
      const files = input.files;
      this.file = files[0];
      const loadingComponent = this.$buefy.loading.open();
      if (files && files[0]) {
        try {
          let formData = new FormData();
          formData.append("type", "purchase");
          formData.append("image", this.file);
          formData.append("business", localStorage.getItem("business"));
          formData.append("user", this.$auth.user.id);
          const response = await axios.post("/transactions/image/", formData, {
            headers: {
              Authorization: localStorage.getItem("auth._token.local"),
            },
          });
          this.imageData = response.data.image;
        } catch (error) {}
      }
      loadingComponent.close();
    },
    removeImage(index) {
      this.deleteImage = true;
      this.invoice_images.splice(index, 1);
      this.imageData = "";
    },
    saveData() {
      this.sale.sub_total = Number(this.sale.sub_total);
      if (this.sale.on_cash == true) {
        this.sale.on_cash = true;
        this.receiveData = this.totalDataDis;
        this.dueDate = null;
      } else {
        this.sale.on_cash = false;
      }
      this.sale.image_url_1 = this.invoice_images[0]
        ? this.invoice_images[0]
        : "";
      this.sale.image_url_2 = this.invoice_images[1]
        ? this.invoice_images[1]
        : "";
      this.sale.image_url_3 = this.invoice_images[2]
        ? this.invoice_images[2]
        : "";
      this.sale.sub_total = this.totalDataDis;
      this.sale.vat_enabled = this.vatCheck;
      this.sale.discount_percent =
        this.discountPercent == null ? 0 : this.discountPercent;
      this.sale.payment_mode = this.currentUnit.text.toLowerCase();
      if (!this.receiveData) {
        this.sale.paid = "0";
      } else {
        this.sale.paid = this.receiveData;
      }
      let list = [];
      this.charges.forEach((element) => {
        list.push({
          id: element.chargeId,
          title: element.name,
          charge: element.amount,
          type: "purchase",
          user: this.$auth.user.id,
          business: localStorage.getItem("business"),
        });
      });
      this.additional_charges = list;
      this.all_data = {
        purchase: this.sale,
        billing_items: this.billing_items,
        additional_charges: this.additional_charges,
      };
    },
    async saveInvoice() {
      this.saveData();
      let emptyBill = false;
      let billingItems = this.all_data.billing_items;
      const arr = billingItems.filter(
        (item) => item.rate || item.quantity || item.item_name
      );
      this.all_data.billing_items = arr;
      this.all_data.billing_items.forEach((element) => {
        if (!element.item_name) {
          emptyBill = true;
        }
      });
      let empty = false;
      let addCharges = this.all_data.additional_charges;
      addCharges.forEach((element) => {
        if (
          (element.title == "" && element.charge == null) ||
          (element.title == "" && element.charge == "")
        ) {
          const add = addCharges.filter(
            (item) =>
              (item.title != "" && item.charge != null) ||
              (item.title != "" && item.charge != "")
          );
          this.all_data.additional_charges = add;
        } else if (
          element.title == "" ||
          element.charge == "" ||
          element.charge == null
        ) {
          empty = true;
        }
      });

      if (this.sale.due != null) {
        let now =
          this.sale.date != null ? new Date(this.sale.date) : new Date();
        let due = new Date(this.sale.due);
        if (due.getTime() < now.getTime()) {
          this.$buefy.snackbar.open({
            message: "Due date should be greater than current date",
            type: "is-danger",
            position: "is-bottom",
            indefinite: false,
          });
          loadingComponent.close();
          return;
        }
      }
      if (this.sale.party_name == "") {
        this.$buefy.snackbar.open({
          message: "Please Select Billing Party",
          type: "is-danger",
          position: "is-bottom",
          indefinite: false,
        });
      } else if (emptyBill) {
        this.$buefy.snackbar.open({
          message: "Please Fill All Billing Item Details",
          type: "is-danger",
          position: "is-bottom",
          indefinite: false,
        });
      } else if (empty) {
        this.$buefy.snackbar.open({
          message: "Please Fill All Additional Charges Details",
          type: "is-danger",
          position: "is-bottom",
          indefinite: false,
        });
      } else if (!Number(this.sale.sub_total)) {
        this.$buefy.snackbar.open({
          message: "Please enter valid total amount",
          type: "is-danger",
          position: "is-bottom",
          indefinite: false,
        });
      } else {
        if (this.totalSum >= 0) {
          const loadingComponent = this.$buefy.loading.open();
          try {
            const response = await axios.put(
              "/transactions/bulk-purchase/?purchase=" +
                localStorage.getItem("purchase"),
              this.all_data,
              {
                headers: {
                  Authorization: localStorage.getItem("auth._token.local"),
                },
              }
            );
            this.$buefy.snackbar.open({
              message: "Purchase Invoice has been updated",
              type: "is-primary",
              position: "is-bottom",
              indefinite: false,
            });
            if (JSON.parse(localStorage.getItem("from_parties"))) {
              this.$router.push("/parties");
            } else {
              this.$router.push("/purchaseList");
            }
          } catch (err) {
            this.$buefy.snackbar.open({
              message: err.response.data.detail,
              type: "is-primary",
              position: "is-bottom",
              indefinite: false,
            });
          }
          loadingComponent.close();
        }
      }
    },
    trashModal2() {
      this.isModalActive2 = true;
    },
    trashCancel2() {
      this.isModalActive2 = false;
    },
    async trashConfirm2() {
      const loadingComponent = this.$buefy.loading.open();
      try {
        const response = await axios.delete(
          "/transactions/purchases/" + localStorage.getItem("purchase") + "/",
          {
            headers: {
              Authorization: localStorage.getItem("auth._token.local"),
            },
          }
        );
        this.$buefy.snackbar.open({
          message: "Purchase Invoice has been deleted",
          type: "is-primary",
          position: "is-bottom",
          indefinite: false,
        });
        this.$router.push("/purchaseList");
      } catch (err) {
        this.$buefy.snackbar.open({
          message: err.response.data.detail,
          type: "is-primary",
          position: "is-bottom",
          indefinite: false,
        });
      }
      loadingComponent.close();
    },
  },
  head() {
    return {
      title: "Edit Purchase Invoice - Karobar",
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
.due-period {
  span {
    font-weight: 600;
    margin-bottom: 0.5rem;
  }
  input {
    text-align: right;
  }
  p.control {
    border-radius: 0 4px 4px 0 !important;
    border-left: 0 !important;
  }
}
.autocomplete.billing-party {
  .dropdown-content {
    max-height: 300px !important;
  }
  .button {
    width: 100%;
    height: 2.5em;
    box-shadow: none;
    margin-top: -0.5rem;
    justify-content: flex-start;
    padding-left: 0;
    &.is-light {
      background-color: white;
      border-color: transparent;
      color: $green;
      &:hover {
        background-color: white;
        border-color: transparent;
        color: $green;
      }
      &:focus {
        box-shadow: none;
      }
    }
  }

  a {
    padding-right: 1rem;
    border-top: 1px solid #f5f5f5;
    padding-top: 10px;
    padding-bottom: 10px;
    &:first-child {
      border-top: 0;
    }
  }
  .party-items {
    display: flex;
    justify-content: space-between;
    .item-left {
      text-align: left;
      p.item-title {
        font-size: 15px;
      }
      p.sub-title {
        font-size: 14px;
      }
    }
    .item-right {
      text-align: right;
      p.item-title {
        font-size: 15px;
      }
      p.sub-title {
        font-size: 14px;
      }
    }
  }
}
.sale-invoice-o {
  p.control {
    border: 1px solid #dbdbdb;
    border-radius: 4px 0 0 4px;
    height: 2.5em;
    padding: 8px 10px;
    &.received_amount {
      border-radius: 0;
      border-left: 0;
    }
    &.readOnly {
      background-color: #f8f9fb;
    }
  }
  .received-label {
    color: #363636;
    font-size: 1rem;
    font-weight: 600;
    display: block;
    margin-bottom: 0.5rem;
  }
  .input[readonly] {
    background-color: #f8f9fb;
  }
  input {
    height: 2.5em;
    &:focus {
      box-shadow: none;
      border-color: #dbdbdb;
    }
    &:hover {
      box-shadow: none;
      border-color: #dbdbdb;
    }
  }
  ::-webkit-input-placeholder {
    color: #676767;
    font-size: 14px;
  }
  .box {
    box-shadow: none;
    border-radius: 0;
    padding: 1.25rem;
  }

  .add-button {
    margin-right: 0.5rem;
    .button {
      border: none;
      box-shadow: none;
      padding-left: 0.5em;
      padding-right: 0.5em;
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
  .sale-form {
    .box {
      .buttons {
        border-bottom: 1px solid #dddd;

        .button {
          border-radius: 0;
          width: 6rem;
          border-left: 0;
          border-top: 0;
          border-right: 0;
          border-bottom: 2px solid #ffffff;
          margin-bottom: 0;
          box-shadow: none;
          &:focus {
            box-shadow: none;
          }
          &:hover {
            background-color: #ffffff;
            color: #000;
            border-bottom: 2px solid #3ab98d;
          }

          span {
            font-size: 14px;
          }

          &.is-clicked {
            background-color: #ffffff;
            color: #000;
            border-bottom: 2px solid #3ab98d;
          }

          &:last-child {
            margin-left: 15px;
          }
        }
      }

      .form-section {
        .form-section-right {
          .due-period-input {
            input {
              border-right: 0;
            }
          }
        }
        .control.has-icons-left .icon,
        .control.has-icons-right .icon {
          height: 2.7em;
        }
        .date-content {
          // display: flex;
          // flex-wrap: wrap;
          // justify-content: flex-end;
          .datepicker {
            .input {
              border-radius: 4px !important;
              background-color: white;
            }
            .icon {
              color: $green;
            }
          }
          // p.control {
          //   border-radius: 0 4px 4px 0;
          // }
        }

        .add-date {
          display: flex;
          justify-content: flex-start;
        }
      }
      .dropdown {
        .dropdown-menu {
          left: -7.5rem;
        }
      }
    }
  }
  .product-table {
    .box {
      box-shadow: none;
      background-color: #f8f9fb;
      padding: 0;
    }
  }
  .sale-bottom {
    .box {
      padding-bottom: 2rem;
    }
    .button-trash.is-danger-outline {
      border-color: #e54f6d;
      box-shadow: none;
      color: #e54f6d;
      background-color: transparent;
      height: 3em;
      padding: 0 3rem;
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
    .sale-bottom-note {
      margin-bottom: 1rem;
      .textarea {
        &:focus {
          box-shadow: none;
          border-color: #dbdbdb;
        }
        &:hover {
          border-color: #dbdbdb;
        }
      }
    }
    .additional-charges {
      .charges-label {
        display: flex;
        justify-content: flex-start;
        span {
          &:last-child {
            margin-left: 5.4rem;
          }
        }
      }
      .button {
        border: none;
        box-shadow: none;
        top: 2.2rem;
        &.charges-button {
          top: 7px;
        }
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
      .group-amount {
        display: flex;
        p.control {
          border: 1px solid #dbdbdb;
          border-radius: 4px 0 0 4px;
          height: 2.5em;
          padding: 8px 10px;
          width: 2.5em;
          border-right: 0;
          &.received_amount {
            border-radius: 0;
            border-left: 0;
          }
        }
        .input {
          border-radius: 0px 4px 4px 0;
          border-left: 0;
          text-align: right;
        }
      }
      .mid-equals {
        display: flex;
        align-items: center;
        margin-top: 2rem;
        .icon {
          transform: rotate(45deg);
          color: $green;
          font-weight: 600;
          font-size: 18px;
        }
      }
    }
    .sale-bottom-form {
      margin-bottom: 0.6rem;
      .button {
        box-shadow: none;
        height: 2.5em;
        border-radius: 4px 0 0 4px;
        &.is-light {
          background-color: white;
          border-color: #dbdbdb;
        }
        span {
          &:first-child {
            font-size: 15px;
          }
        }
      }
      .input {
        height: 2.5em;
        border-left: 0;
        &:focus {
          box-shadow: none;
          border-color: #dbdbdb;
        }
        &:hover {
          border-color: #dbdbdb;
        }
      }
      .select select {
        border: 1px solid #dbdbdb;
        height: 2.5em;
      }
      .select:not(.is-multiple):not(.is-loading)::after {
        border-color: #dbdbdb;
        font-size: 14px;
        top: 20px;
      }
      .balance-amount {
        display: flex;
        justify-content: space-between;
        div {
          &:last-child {
            color: $green;
            font-weight: 600;
          }
          &.redAmt {
            color: #e54f6d;
            font-weight: 500;
          }
        }
      }
    }
    .buttons-top-form {
      display: flex;
      justify-content: flex-start;
      padding-bottom: 1rem;
      flex-wrap: wrap;
    }
    .buttons {
      .button {
        width: 100%;
        height: 3em;
        &.is-success {
          background-color: $green;
        }
      }
    }
  }
}
</style>
