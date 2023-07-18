<template>
  <div>
    <section class="section is-title-bar">
      <div class="level">
        <div class="level-left">
          <div class="level-item">
            <ul>
              <li>{{ sale.type }} {{ sale.value }}</li>
            </ul>
          </div>
        </div>
        <div class="level-right">
          <div class="level-item">
            <div class="buttons is-right">
              <b-button @click="print" type="is-light">
                <b-icon icon="printer" custom-size="default" />
                <span class="button-title">Print</span>
              </b-button>
              <b-button @click="generateReport" type="is-primary">
                <b-icon icon="download" custom-size="default" />
                <span class="button-title">Download</span>
              </b-button>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="section is-main-section payment-generate">
      <div class="columns">
        <div class="column is-3">
          <div class="invoice-select">
            <div class="card">
              <header class="card-header">
                <p class="card-header-title">Color</p>
              </header>
              <div v-if="type == true" class="card-content">
                <div class="color-button">
                  <b-button
                    :class="{ 'is-active-white': ischeckWhite }"
                    @click="showCheckedWhite"
                    type="is-white"
                    ><b-icon size="is-medium" icon="check"></b-icon
                  ></b-button>
                  <b-button
                    :active="ischeckPink"
                    @click="showCheckedPink"
                    type="is-pink"
                    ><b-icon size="is-medium" icon="check"></b-icon
                  ></b-button>
                </div>
              </div>
              <div v-if="type == false" class="card-content">
                <div class="color-button">
                  <b-button
                    :active="ischeck1"
                    @click="showChecked1"
                    type="is-green"
                    ><b-icon size="is-medium" icon="check"></b-icon
                  ></b-button>
                  <b-button
                    :active="ischeck2"
                    @click="showChecked2"
                    type="is-red"
                    ><b-icon size="is-medium" icon="check"></b-icon
                  ></b-button>
                  <b-button
                    :active="ischeck3"
                    @click="showChecked3"
                    type="is-blue"
                    ><b-icon size="is-medium" icon="check"></b-icon
                  ></b-button>
                  <b-button
                    :active="ischeck4"
                    @click="showChecked4"
                    type="is-orange"
                    ><b-icon size="is-medium" icon="check"></b-icon
                  ></b-button>
                  <b-button
                    :active="ischeck5"
                    @click="showChecked5"
                    type="is-sky"
                    ><b-icon size="is-medium" icon="check"></b-icon
                  ></b-button>
                  <b-button
                    :active="ischeck6"
                    @click="showChecked6"
                    type="is-black"
                    ><b-icon size="is-medium" icon="check"></b-icon
                  ></b-button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="column is-9">
          <client-only>
            <vue-html2pdf
              :manual-pagination="true"
              :float-layout="false"
              :pdf-quality="2"
              pdf-content-width="100%"
              :filename="fileName"
              ref="html2Pdf"
            >
              <section slot="pdf-content">
                <div v-if="showDoc == 0" class="pdf-wrapper-generate">
                  <div class="pdf-content-doc simple">
                    <div class="pdf-header">
                      <div class="company-info">
                        <h1 :style="{ color: green }">
                          {{ business.name }}
                        </h1>
                        <p v-if="showPan && business.pan_vat_number">
                          PAN. : {{ business.pan_vat_number }}
                        </p>
                        <p v-if="business.contact_number && showPhone">
                          <span>Phone: </span> {{ business.contact_number }}
                        </p>
                        <p v-if="business.email && showEmail">
                          <span>Email: </span> {{ business.email }}
                        </p>
                        <p v-if="business.address && showAddress">
                          <span>Address: </span>{{ business.address }}
                        </p>
                        <!-- <p v-if="business.is_vat && business.pan_vat_number">
                          Vat No. : {{ business.pan_vat_number }}
                        </p>-->
                      </div>
                      <div v-if="business.photo" class="company-logo">
                        <img :src="business.photo" alt="business logo" />
                      </div>
                    </div>
                    <div class="mid-title">
                      <h1>
                        {{ sale.type_capital }}
                        {{ sale.value_capital }}
                      </h1>
                    </div>
                    <div class="pdf-details">
                      <div class="page-info">
                        <p class="bold">Received From:</p>
                        <p class="bold">{{ sale.party_value }}</p>
                        <p v-if="showPan && sale.party_pan_vat_number">
                          PAN : {{ sale.party_pan_vat_number }}
                        </p>
                        <p v-if="sale.party_number">
                          Phone : {{ sale.party_number }}
                        </p>
                      </div>
                      <div class="page-info">
                        <p class="bold">
                          <span class="bold" v-if="sale.type === 'Receipt'"
                            >Receipt No:</span
                          >
                          <span class="bold" v-else>Payment No:</span>
                          <span v-if="sale.number">{{ sale.number }}</span>
                          <span v-else>N/A</span>
                        </p>
                        <p class="bold">
                          Date:
                          <span>
                            {{ date }}
                          </span>
                        </p>
                        <p class="bold">
                          Payment Mode: <span>{{ sale.payment_mode }}</span>
                        </p>
                      </div>
                    </div>
                    <div class="pdf-table pdf-table-simple">
                      <hr :style="{ background: green }" />
                      <div class="simple-table-bottom-payment">
                        <div class="bottom-left">
                          <ul>
                            <li>
                              <p class="bold">Amount in Words</p>
                              <p>
                                {{ inWords }}
                                <span v-if="inWords && numDec[0] != '0'"
                                  >Rupees and</span
                                >
                                <span v-if="numDec.length == 2">
                                  {{ b[numDec[0]] + " " + a[numDec[1]] }} Paisa
                                  Only</span
                                >
                                <span
                                  v-if="numDec.length == 1 && numDec[0] != '0'"
                                  >{{ a[numDec[0]] }} Paisa Only</span
                                >
                                <span v-if="numDec[0] == '0'">Rupees Only</span>
                              </p>
                            </li>
                            <li v-if="sale.note">
                              <p class="bold">Remarks</p>
                              <p>
                                {{ sale.note }}
                              </p>
                            </li>
                          </ul>
                        </div>
                        <div class="bottom-right">
                          <ul>
                            <li>
                              <div class="result_amount_payment">
                                <p class="bold">Total</p>
                                <p class="s_bold">Rs. {{ sale.total_value }}</p>
                              </div>
                            </li>
                          </ul>
                          <div class="signature_payment">
                            <div class="signature-content">
                              <img
                                v-if="business.signature"
                                :src="business.signature"
                                alt="signature image"
                              />
                              <div
                                style="width: 145px; height: 90px"
                                v-else
                              ></div>
                              <p>Authorized Signature</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-if="showDoc == 1" class="pdf-wrapper-generate">
                  <div class="pdf-content-doc simple">
                    <div class="pdf-header">
                      <div class="company-info">
                        <h1 :style="{ color: green }">
                          {{ business.name }}
                        </h1>
                        <p v-if="showPan && business.pan_vat_number">
                          PAN : {{ business.pan_vat_number }}
                        </p>
                        <p v-if="business.contact_number && showPhone">
                          <span>Phone: </span> {{ business.contact_number }}
                        </p>
                        <p v-if="business.email && showEmail">
                          <span>Email: </span> {{ business.email }}
                        </p>
                        <p v-if="business.address && showAddress">
                          <span>Address: </span>{{ business.address }}
                        </p>
                        <!-- <p v-if="business.is_vat && business.pan_vat_number">
                          Vat No. : {{ business.pan_vat_number }}
                        </p>-->
                      </div>
                      <div v-if="business.photo" class="company-logo">
                        <img :src="business.photo" alt="business logo" />
                      </div>
                    </div>
                    <div class="mid-title">
                      <h1>
                        {{ sale.type_capital }}
                        {{ sale.value_capital }}
                      </h1>
                    </div>
                    <div class="pdf-details">
                      <div class="page-info">
                        <p class="bold">Paid To:</p>
                        <p class="bold">{{ sale.party_value }}</p>
                        <p v-if="showPan && sale.party_pan_vat_number">
                          PAN : {{ sale.party_pan_vat_number }}
                        </p>
                        <p v-if="sale.party_number">
                          Phone : {{ sale.party_number }}
                        </p>
                      </div>
                      <div class="page-info">
                        <p class="bold">
                          <span class="bold" v-if="sale.type === 'Receipt'"
                            >Receipt No:</span
                          >
                          <span class="bold" v-else>Payment No:</span>
                          <span v-if="sale.number">{{ sale.number }}</span>
                          <span v-else>N/A</span>
                        </p>
                        <p class="bold">
                          Date:
                          <span>
                            {{ date }}
                          </span>
                        </p>
                        <p class="bold">
                          Payment Mode: <span>{{ sale.payment_mode }}</span>
                        </p>
                      </div>
                    </div>
                    <div class="pdf-table pdf-table-simple">
                      <hr :style="{ background: green }" />
                      <div class="simple-table-bottom-payment">
                        <div class="bottom-left">
                          <ul>
                            <li>
                              <p class="bold">Amount in Words</p>
                              <p>
                                {{ inWords }}
                                <span v-if="inWords && numDec[0] != '0'"
                                  >Rupees and</span
                                >
                                <span v-if="numDec.length == 2">
                                  {{ b[numDec[0]] + " " + a[numDec[1]] }} Paisa
                                  Only</span
                                >
                                <span
                                  v-if="numDec.length == 1 && numDec[0] != '0'"
                                  >{{ a[numDec[0]] }} Paisa Only</span
                                >
                                <span v-if="numDec[0] == '0'">Rupees Only</span>
                              </p>
                            </li>
                            <li v-if="sale.note">
                              <p class="bold">Remarks</p>
                              <p>
                                {{ sale.note }}
                              </p>
                            </li>
                          </ul>
                        </div>
                        <div class="bottom-right">
                          <ul>
                            <li>
                              <div class="result_amount_payment">
                                <p class="bold">Total</p>
                                <p class="s_bold">Rs. {{ sale.total_value }}</p>
                              </div>
                            </li>
                          </ul>
                          <div v-if="showSignature" class="signature_payment">
                            <div class="signature-content">
                              <img
                                v-if="business.signature"
                                :src="business.signature"
                                alt="signature image"
                              />
                              <div
                                style="width: 145px; height: 90px"
                                v-else
                              ></div>
                              <p>Authorized Signature</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </vue-html2pdf>
          </client-only>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
import axios from "axios";
import NepaliDate from "nepali-date-converter";
import VueHtml2pdf from "vue-html2pdf";
import VueHtmlToPaper from "vue-html-to-paper";
export default {
  middleware: "auth-business",
  components: {
    VueHtml2pdf,
    VueHtmlToPaper,
  },
  data() {
    return {
      show: false,
      isActive1: true,
      isActive2: false,
      isActive3: false,
      ischeck1: true,
      ischeck2: false,
      ischeck3: false,
      ischeck4: false,
      ischeck5: false,
      ischeck6: false,
      date: null,
      showPan: true,
      showPhone: true,
      showAddress: true,
      showEmail: false,
      showSignature: true,
      ischeckWhite: true,
      ischeckPink: false,
      printLoading: true,
      displayNepali: true,
      showDoc: 0,
      numDec: [],
      green: "#3ab98d",
      nepali_color: "#fff",
      color: 1,
      colorNepali: 7,
      type: false,
      sale: [],
      business: [],
      fileName: "",
      a: [
        "",
        "One ",
        "Two ",
        "Three ",
        "Four ",
        "Five ",
        "Six ",
        "Seven ",
        "Eight ",
        "Nine ",
        "Ten ",
        "Eleven ",
        "Twelve ",
        "Thirteen ",
        "Fourteen ",
        "Fifteen ",
        "Sixteen ",
        "Seventeen ",
        "Eighteen ",
        "Nineteen ",
      ],
      b: [
        "",
        "",
        "Twenty",
        "Thirty",
        "Forty",
        "Fifty",
        "Sixty",
        "Seventy",
        "Eighty",
        "Ninety",
      ],
    };
  },
  async mounted() {
    const loadingComponent = this.$buefy.loading.open();
    try {
      let business = await axios.get(
        "business/businesses/" + localStorage.getItem("business") + "/",
        {
          headers: {
            Authorization: localStorage.getItem("auth._token.local"),
          },
        }
      );
      this.business = business.data;
      let response = {};
      switch (localStorage.getItem("payment")) {
        case "payment-in":
          this.showDoc = 0;
          response = await axios.get(
            "/transactions/payment-in/" +
              JSON.parse(localStorage.getItem("payment_in")) +
              "/" +
              "?business=" +
              localStorage.getItem("business"),
            {
              headers: {
                Authorization: localStorage.getItem("auth._token.local"),
              },
            }
          );
          this.sale = response.data;
          var date1 =
            response.data.date != null
              ? new Date(response.data.date)
              : new Date();
          (this.date = new NepaliDate(date1).format("YYYY-MM-DD")),
            (this.sale.type = "Payment");
          this.sale.value = "In";
          this.sale.type_capital = "PAYMENT";
          this.sale.value_capital = "IN";
          this.sale.total_value = this.conversion(
            Math.abs(response.data.amount)
          );
          this.sale.payment_mode =
            response.data.payment_mode.charAt(0).toUpperCase() +
            response.data.payment_mode.slice(1);
          break;
        case "payment-out":
          this.showDoc = 1;
          response = await axios.get(
            "/transactions/payment-out/" +
              JSON.parse(localStorage.getItem("payment_out")) +
              "/" +
              "?business=" +
              localStorage.getItem("business"),
            {
              headers: {
                Authorization: localStorage.getItem("auth._token.local"),
              },
            }
          );
          this.sale = response.data;
          this.sale.type = "Payment";
          this.sale.value = "Out";
          this.sale.type_capital = "PAYMENT";
          this.sale.value_capital = "OUT";
          var date1 =
            response.data.date != null
              ? new Date(response.data.date)
              : new Date();
          (this.date = new NepaliDate(date1).format("YYYY-MM-DD")),
            (this.sale.total_value = this.conversion(
              Math.abs(response.data.amount)
            ));
          this.sale.payment_mode =
            response.data.payment_mode.charAt(0).toUpperCase() +
            response.data.payment_mode.slice(1);
      }
      if (this.sale.party_value && this.sale.number) {
        this.fileName =
          this.sale.type +
          this.sale.value +
          "_" +
          this.sale.number +
          "_" +
          this.sale.party_value;
      } else if (!this.sale.party_value && this.sale.number) {
        this.fileName =
          this.sale.type +
          this.sale.value +
          "_" +
          this.sale.number +
          "_" +
          "OnCash";
      } else if (this.sale.party_value && !this.sale.number) {
        this.fileName =
          this.sale.type + this.sale.value + "_" + this.sale.party_value;
      } else {
        this.fileName = this.sale.type + this.sale.value + "_" + "OnCash";
      }
      this.fileName = this.fileName.replace(/\./g, "_");
    } catch (err) {}
    if (JSON.parse(localStorage.getItem("switchPhone")) == false) {
      this.showPhone = false;
    }
    if (JSON.parse(localStorage.getItem("switchAddress")) == false) {
      this.showAddress = false;
    }
    if (JSON.parse(localStorage.getItem("switchEmail")) == true) {
      this.showEmail = true;
    }
    if (JSON.parse(localStorage.getItem("switchSignature")) == false) {
      this.showSignature = false;
    }
    if (JSON.parse(localStorage.getItem("switchPan")) == false) {
      this.showPan = false;
    }
    if (localStorage.getItem("color")) {
      this.green = JSON.parse(localStorage["color"])[0];
      let store = JSON.parse(localStorage["color"])[1];
      if (store) {
        if (store == 1) {
          this.showChecked1();
        }
        if (store == 2) {
          this.showChecked2();
        }
        if (store == 3) {
          this.showChecked3();
        }
        if (store == 4) {
          this.showChecked4();
        }
        if (store == 5) {
          this.showChecked5();
        }
        if (store == 6) {
          this.showChecked6();
        }
      }
    }
    loadingComponent.close();
  },
  computed: {
    balance() {
      let balance = 0;
      if (this.sale.received) {
        balance = this.sale.total - this.sale.received;
        balance = this.conversion(balance);
      } else if (this.sale.total) {
        balance = this.sale.total;
        balance = this.conversion(balance);
      }
      return balance;
    },
    inWords() {
      let num = parseInt(this.sale.amount);
      let m = parseFloat(this.sale.amount);
      let integr = Math.floor(m);
      let decimal = ((m - integr).toFixed(2) * 100).toFixed();
      if (Number(decimal) > 19) {
        this.numDec = ("" + decimal).split("");
      } else {
        this.numDec = [decimal];
      }
      if ((num = num.toString()).length > 9) return "overflow";
      let n = ("000000000" + num)
        .substr(-9)
        .match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
      if (!n) return;
      var str = "";
      str +=
        n[1] != 0
          ? (this.a[Number(n[1])] || b[n[1][0]] + " " + this.a[n[1][1]]) +
            "Crore "
          : "";
      str +=
        n[2] != 0
          ? (this.a[Number(n[2])] || this.b[n[2][0]] + " " + this.a[n[2][1]]) +
            "Lakh "
          : "";
      str +=
        n[3] != 0
          ? (this.a[Number(n[3])] || this.b[n[3][0]] + " " + this.a[n[3][1]]) +
            "Thousand "
          : "";
      str +=
        n[4] != 0
          ? (this.a[Number(n[4])] || this.b[n[4][0]] + " " + this.a[n[4][1]]) +
            "Hundred "
          : "";
      str +=
        n[5] != 0
          ? (str != "" ? "and " : "") +
            (this.a[Number(n[5])] || this.b[n[5][0]] + " " + this.a[n[5][1]])
          : "";
      return str;
    },
  },
  methods: {
    generateReport() {
      if (this.sale.party_value && this.sale.number) {
        this.fileName =
          this.sale.type +
          this.sale.value +
          "_" +
          this.sale.number +
          "_" +
          this.sale.party_value;
      } else if (!this.sale.party_value && this.sale.number) {
        this.fileName =
          this.sale.type +
          this.sale.value +
          "_" +
          this.sale.number +
          "_" +
          "OnCash";
      } else if (this.sale.party_value && !this.sale.number) {
        this.fileName =
          this.sale.type + this.sale.value + "_" + this.sale.party_value;
      } else {
        this.fileName = this.sale.type + this.sale.value + "_" + "OnCash";
      }
      this.fileName = this.fileName.replace(/\./g, "_");
      this.$refs.html2Pdf.generatePdf();
    },
    showChecked1() {
      this.ischeck1 = true;
      this.ischeck2 = false;
      this.ischeck3 = false;
      this.ischeck4 = false;
      this.ischeck5 = false;
      this.ischeck6 = false;
      this.green = "#3ab98d";
      localStorage.setItem("color", JSON.stringify(["#3ab98d", 1]));
      this.color = 1;
    },
    showChecked2() {
      this.ischeck1 = false;
      this.ischeck2 = true;
      this.ischeck3 = false;
      this.ischeck4 = false;
      this.ischeck5 = false;
      this.ischeck6 = false;
      this.green = "#e54f6d";
      this.color = 2;
      localStorage.setItem("color", JSON.stringify(["#e54f6d", 2]));
    },
    showChecked3() {
      this.ischeck1 = false;
      this.ischeck2 = false;
      this.ischeck3 = true;
      this.ischeck4 = false;
      this.ischeck5 = false;
      this.ischeck6 = false;
      this.green = "#0094fa";
      this.color = 3;
      localStorage.setItem("color", JSON.stringify(["#0094fa", 3]));
    },
    showChecked4() {
      this.ischeck1 = false;
      this.ischeck2 = false;
      this.ischeck3 = false;
      this.ischeck4 = true;
      this.ischeck5 = false;
      this.ischeck6 = false;
      this.green = "#ff6600";
      this.color = 4;
      localStorage.setItem("color", JSON.stringify(["#ff6600", 4]));
    },
    showChecked5() {
      this.ischeck1 = false;
      this.ischeck2 = false;
      this.ischeck3 = false;
      this.ischeck4 = false;
      this.ischeck5 = true;
      this.ischeck6 = false;
      this.green = "#00bcd5";
      this.color = 5;
      localStorage.setItem("color", JSON.stringify(["#00bcd5", 5]));
    },
    showChecked6() {
      this.ischeck1 = false;
      this.ischeck2 = false;
      this.ischeck3 = false;
      this.ischeck4 = false;
      this.ischeck5 = false;
      this.ischeck6 = true;
      this.green = "#1f1f1f";
      this.color = 6;
      localStorage.setItem("color", JSON.stringify(["#1f1f1f", 6]));
    },
    showCheckedWhite() {
      (this.ischeckWhite = true), (this.ischeckPink = false);
      this.nepali_color = "#fff";
      this.colorNepali = 7;
      localStorage.setItem("colorNepali", 7);
    },
    showCheckedPink() {
      (this.ischeckWhite = false),
        (this.ischeckPink = true),
        (this.nepali_color = "#E078A7");
      this.colorNepali = 8;
      localStorage.setItem("colorNepali", 8);
    },
    print() {
      document.querySelector(".has-navbar-fixed-top").style.padding = "0";
      document.querySelector(".has-navbar-fixed-top").style.backgroundColor =
        "white";
      document.body.style.paddingLeft = "0";
      document.querySelector(".section.is-main-section").style.padding = "0";
      document.querySelector(".aside").classList.add("d-none");
      document.querySelector(".navbar").classList.add("d-none");
      document.querySelector(".invoice-select").classList.add("d-none");
      document.querySelector(".is-title-bar").classList.add("d-none");
      document
        .querySelector(".payment-generate .column.is-3")
        .classList.add("d-none");
      document
        .querySelector(".payment-generate .column.is-9")
        .classList.add("full");
      window.print();
      location.reload();
    },
  },
  head() {
    return {
      title: "Invoice Style - Karobar",
    };
  },
};
</script>
<style lang="scss">
$green: #3ab98d;
.d-none {
  display: none !important;
}
.zero {
  width: 0 !important;
}
.full {
  width: 100% !important;
}
.payment-generate {
  .invoice-select {
    box-shadow: rgba(17, 17, 26, 0.1) 0px 0px 16px;
    .card:not(:last-child) {
      margin-bottom: 0;
      border-bottom: 0;
    }
    .card {
      border-radius: 0;
      .card-header {
        background-color: #fafafa;
        border: 1px solid rgba(24, 28, 33, 0.06);
        padding: 0;
        .card-header-title {
          padding: 1rem;
        }
      }
      .card-content {
        padding: 1.5rem 2rem;
        .type-button {
          display: flex;
          justify-content: center;
          flex-direction: column;
          .button {
            margin: 10px 0;
            box-shadow: none;
            height: 2.7em;
            position: relative;
            z-index: 0;
            .icon {
              display: none;
              position: absolute;
              right: -3px;
              top: -10px;
              color: white;
              background-color: $green;
              border-radius: 50%;
            }
            &:hover {
              border-color: $green;
              color: $green;
            }
            &.is-active {
              border-color: $green;
              color: $green;
              .icon {
                display: block;
              }
            }
          }
        }
        .color-button {
          display: flex;
          justify-content: center;
          flex-direction: column;
          .button {
            margin: 10px auto;
            box-shadow: none;
            width: 4em;
            height: 4em;
            position: relative;
            z-index: 0;
            border-radius: 50%;
            border: none;
            .icon {
              display: none;
              position: absolute;
              left: 0;
              right: 0;
              width: 4em;
              height: 4em;
              margin: auto;
              top: 5px;
              color: white;
              background-color: transparent;
            }
            &.is-active {
              border-color: $green;
              color: $green;
              .icon {
                display: block;
              }
            }
            &.is-active-white {
              border-color: #f8f9fb;
              .icon {
                display: block;
                color: #717171;
              }
            }
            &.is-white {
              background-color: #f8f9fb;
            }
            &.is-green {
              background-color: $green;
            }
            &.is-red {
              background-color: #e54f6d;
            }
            &.is-pink {
              background-color: #e078a7;
            }
            &.is-blue {
              background-color: #0094fa;
            }
            &.is-orange {
              background-color: #ff6600;
            }
            &.is-sky {
              background-color: #00bcd5;
            }
            &.is-black {
              background-color: #1f1f1f;
            }
          }
        }
      }
    }
  }
}
.pdf-wrapper-generate {
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
  background-color: white;
  user-select: none;
  .pdf-content-doc {
    &.simple {
      .pdf-header {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        line-height: 1.8;
        padding: 2rem;
        h1 {
          font-size: 26px;
          font-weight: 600;
        }
        .company-logo {
          width: 9rem;
          margin: auto 0;
        }
      }
      .mid-title {
        text-align: center;
        padding: 15px 2rem;
        h1 {
          font-size: 21px;
          font-weight: 600;
          color: black;
        }
      }
      .pdf-details {
        display: flex;
        justify-content: space-between;
        line-height: 1.8;
        padding: 2rem;
        .page-info {
          color: black;
          p.bold {
            font-weight: 600;
            span {
              font-weight: 500;
              &.bold {
                font-weight: 600;
              }
            }
          }
        }
      }
    }
  }
  .pdf-table {
    margin-bottom: 4rem;
    &.pdf-table-simple {
      padding-left: 1.5rem;
      padding-right: 1.5rem;
      hr {
        height: 5.1px;
        margin: 0;
      }
      .simple-table-bottom-payment {
        display: flex;
        justify-content: space-between;
        padding-top: 2rem;
        padding-left: 0.5rem;
        padding-right: 0.5rem;
        padding-bottom: 12rem;
        color: black;
        .bottom-left {
          padding-right: 5rem;
          ul {
            li {
              padding-bottom: 1.5rem;
              p {
                font-size: 14px;
              }
              p.bold {
                font-weight: 600;
              }
            }
          }
        }
        .bottom-right {
          ul {
            li {
              padding-bottom: 1rem;
              .result_amount_payment {
                text-align: right;
                p {
                  font-size: 14px;
                }
                p.bold {
                  font-weight: 600;
                }
                p.s_bold {
                  font-weight: 700;
                }
              }
            }
          }
        }
      }
    }

    // p{
    //   padding-top: 1rem;
    //   color: black;
    // }
  }
  .signature_payment {
    display: flex;
    justify-content: flex-end;
    padding-top: 5rem;
    &.pad_bot {
      padding-bottom: 2rem;
    }
    .signature-content {
      width: 9rem;
      p {
        font-size: 14px;
        &.lined {
          border-top: 1px solid black;
        }
      }
    }
  }
}
.footer-generate {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  background-color: #f9f9f9;
  padding: 15px 30px;
  .footer-left {
    line-height: 1.8;
    img {
      width: 6rem;
    }
  }
  .footer-right {
    margin: auto 0;
  }
}
.footer-white-generate {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  background-color: white;
  padding: 15px 30px;
  .footer-left {
    line-height: 1.4;
    h1 {
      font-weight: 700;
      font-size: 18px;
    }
    // img {
    //   width: 6rem;
    // }
  }
  .footer-right {
    margin: auto 0;
  }
}
</style>