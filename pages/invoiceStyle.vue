<template>
  <div>
    <section class="section is-title-bar">
      <div class="level">
        <div class="level-left">
          <div class="level-item">
            <ul>
              <li>Invoice Style</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
    <section class="section is-main-section invoice-style">
      <div class="columns">
        <div class="column is-3">
          <div class="invoice-select">
            <div class="card">
              <header class="card-header">
                <p class="card-header-title">Invoice Type</p>
              </header>
              <div class="card-content">
                <div class="type-button">
                  <b-button :active="isActive1" @click="showClicked1"
                    >Standard <b-icon size="is-small" icon="check"></b-icon>
                  </b-button>
                  <!-- <b-button :active="isActive2" @click="showClicked2">
                    Nepali <b-icon size="is-small" icon="check"></b-icon>
                  </b-button> -->
                  <b-button :active="isActive3" @click="showClicked3"
                    >Simple <b-icon size="is-small" icon="check"></b-icon>
                  </b-button>
                  <b-button :active="isActive2" @click="showClicked2">
                    Compact <b-icon size="is-small" icon="check"></b-icon>
                  </b-button>
                </div>
              </div>
            </div>
            <div class="card">
              <header class="card-header">
                <p class="card-header-title">Color Type</p>
              </header>
              <!-- <div v-if="type == true" class="card-content">
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
              </div> -->
              <div class="card-content">
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
          <div v-if="showDoc == 0" class="pdf-wrapper">
            <div class="pdf-content-doc standard">
              <div class="pdf-header" :style="{ background: green }">
                <div class="company-info">
                  <h1>Hamro Pasal</h1>
                  <p>PAN : 123456789</p>
                  <p>Gothgaun, Morang</p>
                  <p>9812345678</p>
                </div>
                <div class="company-logo">
                  <p>
                    Sale <br />
                    <span>Invoice</span>
                  </p>
                </div>
              </div>
              <div class="pdf-details">
                <div class="page-info">
                  <p class="bold">Invoice to</p>
                  <p>Hari Prasad</p>
                  <p>PAN : 123456789</p>
                  <p>Sanepa, Lalitpur</p>
                </div>
                <div class="page-info">
                  <p class="bold">Invoice Number</p>
                  <p>NA015</p>
                  <p class="bold">Date of Issue</p>
                  <p>Magh 1 2070</p>
                </div>
                <div class="page-info text-right">
                  <p class="bold">Invoice Total</p>
                  <p class="super-bold" :style="{ color: green }">Rs. 2,070</p>
                </div>
              </div>
              <div class="pdf-table pdf-table-standard">
                <pdf-table-standard
                  :billingItem="billing_items"
                  :color="color"
                />
                <div class="standard-table-bottom">
                  <div class="bottom-left">
                    <ul>
                      <li>
                        <p class="bold">Amount in Words</p>
                        <p>Two Thousand and Seventy Rupees Only.</p>
                      </li>
                      <li>
                        <p class="bold">Bank Details</p>
                        <p>Bank Name: NMB Bank</p>
                        <p>Account Number: 06000123456780</p>
                        <p>Account Name: Hamro Pasal</p>
                      </li>
                      <li>
                        <p class="bold">Terms &amp; Conditions</p>
                        <p>Thank you for doing business with us.</p>
                      </li>
                    </ul>
                  </div>
                  <div class="bottom-right">
                    <ul>
                      <li>
                        <div class="result_amount">
                          <p class="bold" :style="{ color: green }">Subtotal</p>
                          <p class="bold">Rs. 2,300</p>
                        </div>
                      </li>
                      <li>
                        <div class="result_amount">
                          <p class="bold" :style="{ color: green }">
                            Discount (10%)
                          </p>
                          <p class="bold">Rs. 230</p>
                        </div>
                      </li>
                      <!-- <li>
                        <div class="result_amount">
                          <p class="bold" :style="{ color: green }">
                            VAT (13%)
                          </p>
                          <p class="bold">Rs. 100</p>
                        </div>
                      </li> -->
                      <li>
                        <div class="result_amount">
                          <p class="bold" :style="{ color: green }">Total</p>
                          <p class="bold">Rs. 2,070</p>
                        </div>
                      </li>
                      <li>
                        <div class="result_amount">
                          <p class="bold" :style="{ color: green }">
                            Received Amount
                          </p>
                          <p class="bold">Rs. 1,000</p>
                        </div>
                      </li>
                      <li>
                        <div class="result_amount">
                          <p class="bold" :style="{ color: green }">Balance</p>
                          <p class="bold">Rs. 1,070</p>
                        </div>
                      </li>
                    </ul>
                    <div class="signature">
                      <div class="signature-content">
                        <img src="@/img/signature.png" alt="signature image" />
                        <p>Authorized Signature</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <footer>
              <div class="footer-left">
                <p>Generated From</p>
                <img src="@/img/Logo.png" alt="logo image" />
              </div>
              <div class="footer-right">
                <p>www.karobarapp.com</p>
              </div>
            </footer>
          </div>
          <div
            v-if="showDoc == 1"
            class="pdf-wrapper"
            :style="{ background: nepali_color }"
          >
            <div class="pdf-content-doc nepali">
              <div class="pdf-header">
                <h1 :style="{ color: green }">HAMRO PASAL</h1>
                <div class="is-flex sub-header">
                  <p>Gothgaun, Morang</p>
                  <span>|</span>
                  <p>Tel: 9801234567</p>
                  <span>|</span>
                  <p>PAN : 123456789</p>
                </div>

                <h2>SALE INVOICE</h2>
              </div>
              <div class="pdf-details">
                <div class="page-info">
                  <p class="bold">
                    Bill to:
                    <span>Hari Prasad</span>
                  </p>
                  <p class="bold">
                    Invoice No:
                    <span style="font-weight: 400">NA015</span>
                  </p>

                  <p class="bold">
                    PAN :
                    <span style="font-weight: 400">123456789</span>
                  </p>
                </div>
                <div class="page-info">
                  <p class="bold">
                    Invoice Date:
                    <span style="font-weight: 400">2021-01-21</span>
                  </p>
                </div>
              </div>
              <div class="pdf-table pdf-table-nepali">
                <pdf-table-nepali />
                <div class="simple-table-bottom">
                  <div class="bottom-left">
                    <ul>
                      <li>
                        <p class="bold">Amount in Words</p>
                        <p>
                          Six Thousand Seven Hundered and Twenty Rupees Only.
                        </p>
                      </li>
                      <li>
                        <p class="bold">Bank Details</p>
                        <p>Bank Name: NMB Bank</p>
                        <p>Account Number: 06000123456780</p>
                        <p>Account Name: Hamro Pasal</p>
                      </li>
                      <li>
                        <p class="bold">Terms &amp; Conditions</p>
                        <p>Thank you for doing business with us.</p>
                      </li>
                    </ul>
                  </div>
                  <div class="bottom-right">
                    <ul>
                      <li>
                        <div class="result_amount">
                          <p>Subtotal</p>
                          <p class="bold">Rs. 8,400</p>
                        </div>
                      </li>
                      <li>
                        <div class="result_amount">
                          <p>Discount (20%)</p>
                          <p class="bold">Rs. 1,680</p>
                        </div>
                      </li>
                      <li>
                        <div class="result_amount">
                          <p>Total</p>
                          <p class="bold">Rs. 6,720</p>
                        </div>
                      </li>
                      <li>
                        <div class="result_amount">
                          <p>Received Amount</p>
                          <p class="bold">Rs. 2,000</p>
                        </div>
                      </li>
                      <li>
                        <div class="result_amount">
                          <p>Balance</p>
                          <p class="bold">Rs. 4,720</p>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <footer class="footer-generate compact">
              <div class="footer-left">
                <p>
                  Generated From
                  <span style="font-weight: 700">Karobar App</span>
                </p>
              </div>
              <div class="footer-right">
                <div class="signature">
                  <div class="signature-content">
                    <img src="@/img/signature.png" alt="signature image" />
                    <p>Authorized Signature</p>
                  </div>
                </div>
              </div>
            </footer>
          </div>
          <div v-if="showDoc == 2" class="pdf-wrapper">
            <div class="pdf-content-doc simple">
              <div class="pdf-header">
                <div class="company-info">
                  <h1 :style="{ color: green }">HAMRO PASAL</h1>
                  <p>PAN : 123456789</p>
                  <p><span>Phone: </span> 9812345678</p>
                  <p><span>Address: </span> Gothgaun, Morang</p>
                </div>
                <div class="company-logo">
                  <img src="@/img/Logo.png" alt="logo image" />
                </div>
              </div>
              <div class="mid-title">
                <h1>SALES INVOICE</h1>
              </div>
              <div class="pdf-details">
                <div class="page-info">
                  <p class="bold">Bill to:</p>
                  <p class="bold">Hari Prasad</p>
                  <p>PAN : 123456789</p>
                  <p><span>Phone: </span> 9842156874</p>
                </div>
                <div class="page-info">
                  <p class="bold">Invoice No.: <span>NA015</span></p>
                  <p class="bold">Invoice Date: <span>2021-01-21</span></p>
                  <p class="bold">Due Date: <span>2021-02-21</span></p>
                </div>
              </div>
              <div class="pdf-table pdf-table-simple">
                <hr :style="{ background: green }" />
                <pdf-table />
                <div class="simple-table-bottom">
                  <div class="bottom-left">
                    <ul>
                      <li>
                        <p class="bold">Amount in Words</p>
                        <p>
                          Six Thousand Seven Hundered and Twenty Rupees Only.
                        </p>
                      </li>
                      <li>
                        <p class="bold">Bank Details</p>
                        <p>Bank Name: NMB Bank</p>
                        <p>Account Number: 06000123456780</p>
                        <p>Account Name: Hamro Pasal</p>
                      </li>
                      <li>
                        <p class="bold">Terms &amp; Conditions</p>
                        <p>Thank you for doing business with us.</p>
                      </li>
                    </ul>
                  </div>
                  <div class="bottom-right">
                    <ul>
                      <li>
                        <div class="result_amount">
                          <p class="bold" :style="{ color: green }">Subtotal</p>
                          <p class="bold">Rs. 8,400</p>
                        </div>
                      </li>
                      <li>
                        <div class="result_amount">
                          <p class="bold" :style="{ color: green }">
                            Discount (20%)
                          </p>
                          <p class="bold">Rs. 1,680</p>
                        </div>
                      </li>
                      <li>
                        <div class="result_amount">
                          <p class="bold" :style="{ color: green }">Total</p>
                          <p class="bold">Rs. 6,720</p>
                        </div>
                      </li>
                      <li>
                        <div class="result_amount">
                          <p class="bold" :style="{ color: green }">
                            Received Amount
                          </p>
                          <p class="bold">Rs. 2,000</p>
                        </div>
                      </li>
                      <li>
                        <div class="result_amount">
                          <p class="bold" :style="{ color: green }">Balance</p>
                          <p class="bold">Rs. 4,720</p>
                        </div>
                      </li>
                    </ul>
                    <div class="signature">
                      <div class="signature-content">
                        <img src="@/img/signature.png" alt="signature image" />
                        <p>Authorized Signature</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <footer>
              <div class="footer-left">
                <p>Generated From</p>
                <img src="@/img/Logo.png" alt="logo image" />
              </div>
              <div class="footer-right">
                <p>www.karobarapp.com</p>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
import axios from "axios";
import PdfTable from "@/components/PDFTable";
import PdfTableStandard from "@/components/PDFTableStandard";
import PdfTableNepali from "@/components/PDFTableNepali";
import VueHtml2pdf from "vue-html2pdf";
export default {
  layout: "settings",
  components: {
    PdfTable,
    PdfTableStandard,
    PdfTableNepali,
    VueHtml2pdf,
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
      ischeckWhite: true,
      ischeckPink: false,
      showDoc: 0,
      green: "#3ab98d",
      nepali_color: "#fff",
      color: 1,
      type: false,
      sale: [],
      billing_items: [],
      charges: [],
      business: [],
    };
  },
  mounted() {},
  methods: {
    generateReport() {
      this.$refs.html2Pdf.generatePdf();
    },
    showClicked1() {
      this.isActive1 = true;
      this.isActive2 = false;
      this.isActive3 = false;
      this.showDoc = 0;
      this.type = false;
      this.showChecked1();
      localStorage.setItem("document", 0);
    },
    showClicked2() {
      this.isActive2 = true;
      this.isActive1 = false;
      this.isActive3 = false;
      this.showDoc = 1;
      this.type = true;
      this.showChecked6();
      localStorage.setItem("document", 1);
    },
    showClicked3() {
      this.isActive3 = true;
      this.isActive1 = false;
      this.isActive2 = false;
      this.showDoc = 2;
      this.type = false;
      this.showChecked1();
      localStorage.setItem("document", 2);
    },
    showChecked1() {
      this.ischeck1 = true;
      this.ischeck2 = false;
      this.ischeck3 = false;
      this.ischeck4 = false;
      this.ischeck5 = false;
      this.ischeck6 = false;
      this.green = "#3ab98d";
      this.color = 1;
      localStorage.setItem("color", JSON.stringify(["#3ab98d", 1]));
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
      this.color = 1;
      localStorage.setItem("colorNepali", 7);
    },
    showCheckedPink() {
      (this.ischeckWhite = false),
        (this.ischeckPink = true),
        (this.nepali_color = "#E078A7");
      this.color = 2;
      localStorage.setItem("colorNepali", 8);
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
.invoice-style {
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
.pdf-wrapper {
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
  background-color: white;
  user-select: none;
  .pdf-content-doc {
    &.standard {
      .pdf-header {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        align-items: center;
        line-height: 1.8;
        padding: 2rem;
        background-color: #3ab98d;
        color: white;
        h1 {
          font-size: 21px;
        }
        .company-logo {
          p {
            line-height: 1;
            font-size: 1.4rem;
            span {
              font-size: 3rem;
              font-weight: 600;
            }
          }
        }
      }
      .mid-title {
        text-align: center;
        padding: 15px 0;
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
            }
          }
          &.text-right {
            text-align: right;
            p.super-bold {
              font-weight: 600;
              font-size: 2.5rem;
            }
          }
        }
      }
    }
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
            }
          }
        }
      }
    }
    &.nepali {
      .pdf-header {
        text-align: center;
        line-height: 1.8;
        padding: 1rem 2rem;
        .sub-header {
          align-items: center;
          justify-content: center;
          column-gap: 0.3rem;
        }
        h1 {
          font-size: 26px;
          font-weight: 700;
        }
        h2 {
          font-weight: 500;
          font-size: 20px;
          text-decoration: underline;
        }
      }
      .pdf-details {
        display: flex;
        justify-content: space-between;
        line-height: 1.8;
        padding: 1rem 2rem;
        .page-info {
          color: black;
          p.bold {
            font-weight: 600;
            span {
              font-weight: 500;
            }
          }
          &.text-right {
            text-align: right;
            p.super-bold {
              font-weight: 600;
              font-size: 2.5rem;
            }
          }
        }
      }
    }
  }
  .pdf-table {
    margin-bottom: 4rem;
    &.pdf-table-standard {
      .standard-table-bottom {
        display: flex;
        justify-content: space-between;
        padding-top: 1rem;
        padding-left: 2rem;
        padding-right: 2rem;
        padding-bottom: 2rem;
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
              .result_amount {
                display: flex;
                justify-content: space-between;
                flex-grow: 4;
                width: 20rem;
                text-align: right;
                p {
                  font-size: 14px;
                  width: 10rem;
                }
                p.bold {
                  font-weight: 600;
                }
              }
            }
          }
        }
      }
    }
    &.pdf-table-simple {
      padding-left: 1.5rem;
      padding-right: 1.5rem;
      hr {
        height: 5.1px;
        margin: 0;
      }
      .simple-table-bottom {
        display: flex;
        justify-content: space-between;
        padding-top: 1rem;
        padding-left: 0.5rem;
        padding-right: 0.5rem;
        padding-bottom: 2rem;
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
              .result_amount {
                display: flex;
                justify-content: space-between;
                flex-grow: 4;
                width: 20rem;
                text-align: right;
                p {
                  font-size: 14px;
                  width: 10rem;
                }
                p.bold {
                  font-weight: 600;
                }
              }
            }
          }
        }
      }
    }
    &.pdf-table-nepali {
      padding-left: 1.5rem;
      padding-right: 1.5rem;
      margin-bottom: 0;
      .simple-table-bottom {
        display: flex;
        justify-content: space-between;
        padding-top: 1rem;
        padding-left: 0.5rem;
        padding-right: 0.5rem;
        padding-bottom: 1rem;
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
              .result_amount {
                display: flex;
                justify-content: space-between;
                flex-grow: 4;
                width: 20rem;
                text-align: right;
                p {
                  font-size: 14px;
                  width: 10rem;
                }
                p.bold {
                  font-weight: 600;
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
  .signature {
    display: flex;
    justify-content: flex-end;
    padding-top: 1rem;
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
footer {
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
  &.compact {
    background-color: transparent;
    align-items: flex-end;
    padding-bottom: 2rem;
    .signature {
      padding-top: 0;
      text-align: center;
      p {
        border-top: 1px solid #d5dae1;
      }
    }
  }
}
.footer-white {
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