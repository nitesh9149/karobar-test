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
    <section class="section is-main-section invoice-generate">
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
                <p class="card-header-title">Color</p>
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
          <client-only>
            <vue-html2pdf
              :manual-pagination="true"
              :float-layout="false"
              :enable-download="true"
              :pdf-quality="2"
              pdf-content-width="100%"
              :filename="fileName"
              :html-to-pdf-options="pdfOptions"
              ref="html2Pdf"
            >
              <section slot="pdf-content">
                <div
                  v-if="showDoc == 0"
                  id="printMe"
                  class="pdf-wrapper-generate"
                >
                  <div class="pdf-content-doc standard">
                    <div class="pdf-header" :style="{ background: green }">
                      <div class="company-info">
                        <img
                          v-if="business.photo && showLogo"
                          :src="business.photo"
                          alt="logo image"
                        />
                        <div>
                          <h1>{{ business.name }}</h1>
                          <p v-if="showPan && business.pan_vat_number">
                            PAN : {{ business.pan_vat_number }}
                          </p>
                          <p v-if="business.contact_number && showPhone">
                            {{ business.contact_number }}
                          </p>
                          <p v-if="business.email && showEmail">
                            {{ business.email }}
                          </p>
                          <p v-if="business.address && showAddress">
                            {{ business.address }}
                          </p>
                        </div>

                        <!-- <p v-if="business.is_vat && business.pan_vat_number">
                          Vat No. : {{ business.pan_vat_number }}
                        </p> -->
                      </div>
                      <div class="company-logo">
                        <p v-if="sale.type == 'Estimate'">
                          <span>{{ sale.type }}</span>
                        </p>
                        <p v-else>
                          {{ sale.type }} <br />
                          <span>{{ sale.value }}</span>
                        </p>
                      </div>
                    </div>
                    <div class="pdf-details">
                      <div class="page-info">
                        <p v-if="sale.type == 'Estimate'" class="bold">
                          Estimate For
                        </p>
                        <p v-else class="bold">Invoice to</p>
                        <p v-if="sale.party_name">{{ sale.party_name }}</p>
                        <p v-else>{{ cashSale }}</p>
                        <p v-if="showPan && sale.party_pan_vat_number">
                          PAN : {{ sale.party_pan_vat_number }}
                        </p>
                        <p>{{ sale.party_address }}</p>
                      </div>
                      <div class="page-info">
                        <p v-if="sale.type == 'Estimate'" class="bold">
                          Estimate Number
                        </p>
                        <p v-else class="bold">Invoice Number</p>
                        <p v-if="sale.number">{{ sale.number }}</p>
                        <p v-else>N/A</p>
                        <p class="bold">Date of Issue</p>
                        <p>
                          {{ date }}
                        </p>
                      </div>
                      <div class="page-info text-right">
                        <p v-if="sale.type == 'Estimate'" class="bold">
                          Estimate Total
                        </p>
                        <p v-else class="bold">Invoice Total</p>
                        <p class="super-bold" :style="{ color: green }">
                          Rs. {{ sale.total_value }}
                        </p>
                      </div>
                    </div>
                    <div class="pdf-table pdf-table-standard">
                      <standard-generate
                        :billingItem="billing_items"
                        :color="color"
                      />
                      <div class="standard-table-bottom">
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
                            <li
                              v-if="
                                business.bank_name ||
                                business.account_number ||
                                business.account_holder_name
                              "
                            >
                              <div v-if="showBanks">
                                <p class="bold">Bank Details</p>
                                <p v-if="business.bank_name">
                                  Bank Name: {{ business.bank_name }}
                                </p>
                                <p v-if="business.account_number">
                                  Account Number: {{ business.account_number }}
                                </p>
                                <p v-if="business.account_holder_name">
                                  Account Name:
                                  {{ business.account_holder_name }}
                                </p>
                              </div>
                            </li>
                            <li v-if="business.terms_conditions">
                              <p class="bold">Terms &amp; Conditions</p>
                              <p>{{ business.terms_conditions }}</p>
                            </li>
                          </ul>
                        </div>
                        <div class="bottom-right">
                          <ul>
                            <li v-if="billing_items.length">
                              <div class="result_amount">
                                <p class="bold" :style="{ color: green }">
                                  Subtotal
                                </p>
                                <p class="bold">
                                  Rs. {{ sale.sub_total_value }}
                                </p>
                              </div>
                            </li>
                            <li v-if="sale.discount_percent">
                              <div class="result_amount">
                                <p class="bold" :style="{ color: green }">
                                  Discount ({{ sale.discount_percent + "%" }})
                                </p>
                                <p class="bold">
                                  Rs.
                                  {{ conversion(sale.discount_amount) }}
                                </p>
                              </div>
                            </li>
                            <!-- <li v-if="sale.vat_amount">
                              <div class="result_amount">
                                <p class="bold" :style="{ color: green }">
                                  VAT (13%)
                                </p>
                                <p class="bold">
                                  Rs.
                                  {{ conversion(sale.vat_amount) }}
                                </p>
                              </div>
                            </li> -->
                            <li v-for="charge in this.charges" :key="charge.id">
                              <div class="result_amount">
                                <p class="bold">{{ charge.title }}</p>
                                <p class="bold">
                                  Rs.
                                  {{ conversion(charge.charge) }}
                                </p>
                              </div>
                            </li>
                            <li>
                              <div class="result_amount">
                                <p class="bold" :style="{ color: green }">
                                  Total
                                </p>
                                <p class="bold">Rs. {{ sale.total_value }}</p>
                              </div>
                            </li>
                            <li v-if="sale.type_value == 'paid'">
                              <div class="result_amount">
                                <p class="bold" :style="{ color: green }">
                                  Paid Amount
                                </p>
                                <p class="bold">
                                  Rs. {{ sale.received_value }}
                                </p>
                              </div>
                            </li>
                            <li v-if="sale.type_value == 'received'">
                              <div class="result_amount">
                                <p class="bold" :style="{ color: green }">
                                  Received Amount
                                </p>
                                <p class="bold">
                                  Rs. {{ sale.received_value }}
                                </p>
                              </div>
                            </li>
                            <li v-if="sale.type != 'Estimate'">
                              <div class="result_amount">
                                <p class="bold" :style="{ color: green }">
                                  Balance
                                </p>
                                <p class="bold">
                                  Rs.
                                  {{ balance }}
                                </p>
                              </div>
                            </li>
                          </ul>
                          <div v-if="showSignature" class="signature">
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
                  <footer v-if="showbranding" class="footer-generate">
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
                  class="pdf-wrapper-generate"
                  :style="{ background: nepali_color }"
                >
                  <div class="pdf-content-doc nepali">
                    <div class="pdf-header">
                      <h1 :style="{ color: green }">
                        <img
                          v-if="business.photo && showLogo"
                          :src="business.photo"
                          alt="logo image"
                        />
                        {{ business.name.toUpperCase() }}
                      </h1>
                      <div class="is-flex sub-header">
                        <p v-if="business.address && showAddress">
                          {{ business.address }}
                        </p>
                        <span v-if="business.contact_number && showPhone"
                          >|</span
                        >
                        <p v-if="business.contact_number && showPhone">
                          Tel: {{ business.contact_number }}
                        </p>
                        <span v-if="showPan && business.pan_vat_number">|</span>
                        <p v-if="showPan && business.pan_vat_number">
                          PAN : {{ business.pan_vat_number }}
                        </p>
                      </div>

                      <h2>
                        {{ sale.type.toUpperCase() }}
                        {{ sale.value.toUpperCase() }}
                      </h2>
                    </div>
                    <div class="pdf-details">
                      <div class="page-info">
                        <p class="bold">
                          Invoice No:
                          <span style="font-weight: 400" v-if="sale.number">{{
                            sale.number
                          }}</span>
                          <span style="font-weight: 400" v-else>N/A</span>
                        </p>
                        <p class="bold">
                          Bill to:
                          <span v-if="sale.party_name">{{
                            sale.party_name
                          }}</span
                          ><span v-else>{{ cashSale }}</span>
                        </p>

                        <p
                          class="bold"
                          v-if="showPan && sale.party_pan_vat_number"
                        >
                          PAN :
                          <span style="font-weight: 400">{{
                            sale.party_pan_vat_number
                          }}</span>
                        </p>
                        <p>{{ sale.party_address }}</p>
                      </div>
                      <div class="page-info">
                        <p class="bold">
                          Invoice Date:
                          <span style="font-weight: 400">{{ date }}</span>
                        </p>
                      </div>
                    </div>
                    <div class="pdf-table pdf-table-nepali">
                      <pdf-table-nepali-generate :billingItem="billing_items" />
                      <div class="simple-table-bottom">
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
                            <li
                              v-if="
                                business.bank_name ||
                                business.account_number ||
                                business.account_holder_name
                              "
                            >
                              <div v-if="showBanks">
                                <p class="bold">Bank Details</p>
                                <p v-if="business.bank_name">
                                  Bank Name: {{ business.bank_name }}
                                </p>
                                <p v-if="business.account_number">
                                  Account Number: {{ business.account_number }}
                                </p>
                                <p v-if="business.account_holder_name">
                                  Account Name:
                                  {{ business.account_holder_name }}
                                </p>
                              </div>
                            </li>
                            <li v-if="business.terms_conditions">
                              <p class="bold">Terms &amp; Conditions</p>
                              <p>{{ business.terms_conditions }}</p>
                            </li>
                          </ul>
                        </div>
                        <div class="bottom-right">
                          <ul>
                            <li v-if="billing_items.length">
                              <div class="result_amount">
                                <p>Subtotal</p>
                                <p class="bold">
                                  Rs. {{ sale.sub_total_value }}
                                </p>
                              </div>
                            </li>
                            <li v-if="sale.discount_percent">
                              <div class="result_amount">
                                <p>
                                  Discount ({{ sale.discount_percent + "%" }})
                                </p>
                                <p class="bold">
                                  Rs.
                                  {{ conversion(sale.discount_amount) }}
                                </p>
                              </div>
                            </li>
                            <!-- <li v-if="sale.vat_amount">
                              <div class="result_amount">
                                <p class="bold">
                                  VAT (13%)
                                </p>
                                <p class="bold">
                                  Rs.
                                  {{ conversion(sale.vat_amount) }}
                                </p>
                              </div>
                            </li> -->
                            <li v-for="charge in this.charges" :key="charge.id">
                              <div class="result_amount">
                                <p>{{ charge.title }}</p>
                                <p class="bold">
                                  Rs.
                                  {{ conversion(charge.charge) }}
                                </p>
                              </div>
                            </li>
                            <li>
                              <div class="result_amount">
                                <p>Total</p>
                                <p class="bold">Rs. {{ sale.total_value }}</p>
                              </div>
                            </li>
                            <li v-if="sale.type_value == 'paid'">
                              <div class="result_amount">
                                <p>Paid Amount</p>
                                <p class="bold">
                                  Rs. {{ sale.received_value }}
                                </p>
                              </div>
                            </li>
                            <li v-if="sale.type_value == 'received'">
                              <div class="result_amount">
                                <p>Received Amount</p>
                                <p class="bold">
                                  Rs. {{ sale.received_value }}
                                </p>
                              </div>
                            </li>
                            <li v-if="sale.type != 'Estimate'">
                              <div class="result_amount">
                                <p>Balance</p>
                                <p class="bold">Rs. {{ balance }}</p>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  <footer class="footer-generate compact">
                    <div v-if="showbranding" class="footer-left">
                      <p>
                        Generated From
                        <span style="font-weight: 700">Karobar App</span>
                      </p>
                    </div>
                    <div v-else></div>
                    <div class="footer-right">
                      <div v-if="showSignature" class="signature">
                        <div class="signature-content">
                          <img
                            v-if="business.signature"
                            :src="business.signature"
                            alt="signature image"
                          />
                          <div style="width: 145px; height: 90px" v-else></div>
                          <p>Authorized Signature</p>
                        </div>
                      </div>
                    </div>
                  </footer>
                </div>
                <div v-if="showDoc == 2" class="pdf-wrapper-generate">
                  <div class="pdf-content-doc simple">
                    <div class="pdf-header">
                      <div class="company-info">
                        <h1 :style="{ color: green }">
                          {{ business.name.toUpperCase() }}
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
                      <div class="company-logo">
                        <img
                          v-if="business.photo && showLogo"
                          :src="business.photo"
                          alt="logo image"
                        />
                      </div>
                    </div>
                    <div class="mid-title">
                      <h1>
                        {{ sale.type.toUpperCase() }}
                        {{ sale.value.toUpperCase() }}
                      </h1>
                    </div>
                    <div class="pdf-details">
                      <div class="page-info">
                        <p v-if="sale.type == 'Estimate'" class="bold">
                          Estimate For:
                        </p>
                        <p v-else class="bold">Bill to:</p>
                        <p class="bold" v-if="sale.party_name">
                          {{ sale.party_name }}
                        </p>
                        <p class="bold" v-else>{{ cashSale }}</p>
                        <p v-if="showPan && sale.party_pan_vat_number">
                          PAN : {{ sale.party_pan_vat_number }}
                        </p>
                        <p v-if="sale.party_number">
                          <span>Phone: </span>
                          {{ sale.party_number }}
                        </p>
                        <p>{{ sale.party_address }}</p>
                      </div>
                      <div class="page-info">
                        <p class="bold" v-if="sale.type == 'Estimate'">
                          Estimate No.:
                          <span v-if="sale.number">{{ sale.number }}</span>
                          <span v-else>N/A</span>
                        </p>
                        <p v-else class="bold">
                          Invoice No.:
                          <span v-if="sale.number">{{ sale.number }}</span>
                          <span v-else>N/A</span>
                        </p>
                        <p class="bold" v-if="sale.type == 'Estimate'">
                          Date:
                          <span>
                            {{ date }}
                          </span>
                        </p>
                        <p v-else class="bold">
                          Invoice Date:
                          <span>
                            {{ date }}
                          </span>
                        </p>
                        <p v-if="sale.due" class="bold">
                          Due Date:
                          <span>{{ due }}</span>
                        </p>
                      </div>
                    </div>
                    <div class="pdf-table pdf-table-simple">
                      <hr :style="{ background: green }" />
                      <pdf-table-generate
                        :billingItem="billing_items"
                        :color="color"
                      />
                      <div class="simple-table-bottom">
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
                            <li
                              v-if="
                                business.bank_name ||
                                business.account_number ||
                                business.account_holder_name
                              "
                            >
                              <div v-if="showBanks">
                                <p class="bold">Bank Details</p>
                                <p v-if="business.bank_name">
                                  Bank Name: {{ business.bank_name }}
                                </p>
                                <p v-if="business.account_number">
                                  Account Number: {{ business.account_number }}
                                </p>
                                <p v-if="business.account_holder_name">
                                  Account Name:
                                  {{ business.account_holder_name }}
                                </p>
                              </div>
                            </li>
                            <li v-if="business.terms_conditions">
                              <p class="bold">Terms &amp; Conditions</p>
                              <p>{{ business.terms_conditions }}</p>
                            </li>
                          </ul>
                        </div>
                        <div class="bottom-right">
                          <ul>
                            <li v-if="billing_items.length">
                              <div class="result_amount">
                                <p class="bold" :style="{ color: green }">
                                  Subtotal
                                </p>
                                <p class="bold">
                                  Rs. {{ sale.sub_total_value }}
                                </p>
                              </div>
                            </li>
                            <li v-if="sale.discount_percent">
                              <div class="result_amount">
                                <p class="bold" :style="{ color: green }">
                                  Discount ({{ sale.discount_percent + "%" }})
                                </p>
                                <p class="bold">
                                  Rs.
                                  {{ conversion(sale.discount_amount) }}
                                </p>
                              </div>
                            </li>
                            <li v-if="sale.vat_amount">
                              <div class="result_amount">
                                <p class="bold" :style="{ color: green }">
                                  VAT (13%)
                                </p>
                                <p class="bold">
                                  Rs.
                                  {{ conversion(sale.vat_amount) }}
                                </p>
                              </div>
                            </li>
                            <li v-for="charge in this.charges" :key="charge.id">
                              <div class="result_amount">
                                <p class="bold">{{ charge.title }}</p>
                                <p class="bold">
                                  Rs.
                                  {{ conversion(charge.charge) }}
                                </p>
                              </div>
                            </li>
                            <li>
                              <div class="result_amount">
                                <p class="bold" :style="{ color: green }">
                                  Total
                                </p>
                                <p class="bold">Rs. {{ sale.total_value }}</p>
                              </div>
                            </li>
                            <li v-if="sale.type_value == 'paid'">
                              <div class="result_amount">
                                <p class="bold" :style="{ color: green }">
                                  Paid Amount
                                </p>
                                <p class="bold">
                                  Rs. {{ sale.received_value }}
                                </p>
                              </div>
                            </li>
                            <li v-if="sale.type_value == 'received'">
                              <div class="result_amount">
                                <p class="bold" :style="{ color: green }">
                                  Received Amount
                                </p>
                                <p class="bold">
                                  Rs. {{ sale.received_value }}
                                </p>
                              </div>
                            </li>
                            <li v-if="sale.type != 'Estimate'">
                              <div class="result_amount">
                                <p class="bold" :style="{ color: green }">
                                  Balance
                                </p>
                                <p class="bold">Rs. {{ balance }}</p>
                              </div>
                            </li>
                          </ul>
                          <div v-if="showSignature" class="signature">
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
                  <footer v-if="showbranding" class="footer-generate">
                    <div class="footer-left">
                      <p>Generated From</p>
                      <img src="@/img/Logo.png" alt="logo image" />
                    </div>
                    <div class="footer-right">
                      <p>www.karobarapp.com</p>
                    </div>
                  </footer>
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
import PdfTableGenerate from "@/components/PDFTableGenerate";
import StandardGenerate from "@/components/StandardGenerate";
import PdfTableNepaliGenerate from "@/components/PDFTableNepaliGenerate";
import VueHtml2pdf from "vue-html2pdf";
import VueHtmlToPaper from "vue-html-to-paper";
export default {
  middleware: "auth-business",
  components: {
    PdfTableGenerate,
    StandardGenerate,
    PdfTableNepaliGenerate,
    VueHtml2pdf,
    VueHtmlToPaper,
  },
  data() {
    return {
      show: false,
      pdfOptions: {
        filename: "",
        image: { type: "png" },
        html2canvas: {
          useCORS: true,
        },
        margin: [0, 0, 14, 0],
      },
      isActive1: true,
      isActive2: false,
      isActive3: false,
      ischeck1: true,
      ischeck2: false,
      ischeck3: false,
      ischeck4: false,
      ischeck5: false,
      ischeck6: false,
      cashSale: "",
      ischeckWhite: true,
      ischeckPink: false,
      printLoading: true,
      showPan: true,
      componentKey: 0,
      componentKey2: 0,
      showDoc: 0,
      numDec: [],
      showPhone: true,
      showAddress: true,
      showSignature: true,
      showLogo: true,
      showbranding: false,
      showEmail: false,
      showBanks: false,
      green: "#3ab98d",
      nepali_color: "#fff",
      color: 1,
      date: null,
      due: null,
      colorNepali: 7,
      type: false,
      sale: {},
      billing_items: [],
      charges: [],
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
      testImg: "",
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
      switch (localStorage.getItem("generate")) {
        case "sale":
          response = await axios.get(
            "/transactions/bulk-sale/?sale=" + localStorage.getItem("sale"),
            {
              headers: {
                Authorization: localStorage.getItem("auth._token.local"),
              },
            }
          );
          this.sale = response.data.sale;
          this.cashSale = "Cash Sale";
          this.sale.type_value = "received";
          var date1 =
            this.sale.date != null ? new Date(this.sale.date) : new Date();
          this.date = new NepaliDate(date1).format("YYYY-MM-DD");
          var date2 =
            this.sale.due != null ? new Date(this.sale.due) : new Date();
          this.due = new NepaliDate(date2).format("YYYY-MM-DD");
          this.sale.type = "Sale";
          this.sale.value = "Invoice";
          this.sale.total_value = this.conversion(response.data.sale.total);
          this.sale.payment_value =
            response.data.sale.payment_mode.charAt(0).toUpperCase() +
            response.data.sale.payment_mode.slice(1);
          this.sale.sub_total_value = this.conversion(
            Math.abs(response.data.sale.sub_total)
          );
          this.sale.received = response.data.sale.received;
          this.sale.received_value = this.conversion(
            Math.abs(response.data.sale.received)
          );
          break;
        case "sale_return":
          response = await axios.get(
            "/transactions/bulk-sale-return/?sale_return=" +
              localStorage.getItem("sales_return"),
            {
              headers: {
                Authorization: localStorage.getItem("auth._token.local"),
              },
            }
          );
          this.sale = response.data.sale_return;
          this.cashSale = "Cash Sale Return";
          this.sale.type = "Sales";
          this.sale.value = "Return";
          this.sale.type_value = "paid";
          var date1 =
            this.sale.date != null ? new Date(this.sale.date) : new Date();
          this.date = new NepaliDate(date1).format("YYYY-MM-DD");
          var date2 =
            this.sale.due != null ? new Date(this.sale.due) : new Date();
          this.due = new NepaliDate(date2).format("YYYY-MM-DD");
          this.sale.total_value = this.conversion(
            response.data.sale_return.total
          );
          this.sale.payment_value =
            response.data.sale_return.payment_mode.charAt(0).toUpperCase() +
            response.data.sale_return.payment_mode.slice(1);
          this.sale.sub_total_value = this.conversion(
            Math.abs(response.data.sale_return.sub_total)
          );
          this.sale.received = response.data.sale_return.paid;
          this.sale.received_value = this.conversion(
            Math.abs(response.data.sale_return.paid)
          );
          break;
        case "purchase":
          response = await axios.get(
            "/transactions/bulk-purchase/?purchase=" +
              localStorage.getItem("purchase"),
            {
              headers: {
                Authorization: localStorage.getItem("auth._token.local"),
              },
            }
          );
          this.sale = response.data.purchase;
          this.cashSale = "Cash Purchase";
          this.sale.type = "Purchase";
          this.sale.value = "Invoice";
          this.sale.type_value = "paid";
          var date1 =
            this.sale.date != null ? new Date(this.sale.date) : new Date();
          this.date = new NepaliDate(date1).format("YYYY-MM-DD");
          var date2 =
            this.sale.due != null ? new Date(this.sale.due) : new Date();
          this.due = new NepaliDate(date2).format("YYYY-MM-DD");
          this.sale.total_value = this.conversion(response.data.purchase.total);
          this.sale.payment_value =
            response.data.purchase.payment_mode.charAt(0).toUpperCase() +
            response.data.purchase.payment_mode.slice(1);
          this.sale.sub_total_value = this.conversion(
            Math.abs(response.data.purchase.sub_total)
          );
          this.sale.received = response.data.purchase.paid;
          this.sale.received_value = this.conversion(
            Math.abs(response.data.purchase.paid)
          );
          break;
        case "purchase_return":
          response = await axios.get(
            "/transactions/bulk-purchase-return/?purchase_return=" +
              localStorage.getItem("purchase_return"),
            {
              headers: {
                Authorization: localStorage.getItem("auth._token.local"),
              },
            }
          );
          this.sale = response.data.purchase_return;
          this.cashSale = "Cash Purchase Return";
          this.sale.type = "Purchase";
          this.sale.value = "Return";
          this.sale.type_value = "received";
          var date1 =
            this.sale.date != null ? new Date(this.sale.date) : new Date();
          this.date = new NepaliDate(date1).format("YYYY-MM-DD");
          var date2 =
            this.sale.due != null ? new Date(this.sale.due) : new Date();
          this.due = new NepaliDate(date2).format("YYYY-MM-DD");
          this.sale.total_value = this.conversion(
            response.data.purchase_return.total
          );
          this.sale.payment_value =
            response.data.purchase_return.payment_mode.charAt(0).toUpperCase() +
            response.data.purchase_return.payment_mode.slice(1);
          this.sale.sub_total_value = this.conversion(
            Math.abs(response.data.purchase_return.sub_total)
          );
          this.sale.received = response.data.purchase_return.received;
          this.sale.received_value = this.conversion(
            Math.abs(response.data.purchase_return.received)
          );
          break;
        case "estimate":
          response = await axios.get(
            "/transactions/bulk-estimate/?estimate=" +
              localStorage.getItem("estimate"),
            {
              headers: {
                Authorization: localStorage.getItem("auth._token.local"),
              },
            }
          );
          this.sale = response.data.estimate;
          var date1 =
            this.sale.date != null ? new Date(this.sale.date) : new Date();
          this.date = new NepaliDate(date1).format("YYYY-MM-DD");
          var date2 =
            this.sale.due != null ? new Date(this.sale.due) : new Date();
          this.due = new NepaliDate(date2).format("YYYY-MM-DD");
          this.sale.type = "Estimate";
          this.sale.value = "";
          this.sale.total_value = this.conversion(response.data.estimate.total);
          this.sale.payment_value =
            response.data.estimate.payment_mode.charAt(0).toUpperCase() +
            response.data.estimate.payment_mode.slice(1);
          this.sale.sub_total_value = this.conversion(
            Math.abs(response.data.estimate.sub_total)
          );
      }
      this.billing_items = response.data.billing_items.reverse();
      this.charges = response.data.additional_charges.reverse();
      if (this.sale.party_name && this.sale.number) {
        this.pdfOptions.filename =
          this.sale.type +
          this.sale.value +
          "_" +
          this.sale.number +
          "_" +
          this.sale.party_name;
      } else if (!this.sale.party_name && this.sale.number) {
        this.pdfOptions.filename =
          this.sale.type +
          this.sale.value +
          "_" +
          this.sale.number +
          "_" +
          "OnCash";
      } else if (this.sale.party_name && !this.sale.number) {
        this.pdfOptions.filename =
          this.sale.type + this.sale.value + "_" + this.sale.party_name;
      } else {
        this.pdfOptions.filename =
          this.sale.type + this.sale.value + "_" + "OnCash";
      }
      this.pdfOptions.filename = this.pdfOptions.filename.replace(/\./g, "_");
    } catch (err) {}
    // axios({
    //   url: "https://image.shutterstock.com/image-vector/sample-stamp-rubber-style-red-260nw-1811246308.jpg",
    //   method: "GET",
    //   responseType: "blob",
    // }).then((response) => {
    //   const url = window.URL.createObjectURL(new Blob([response.data]));
    //   this.testImg = url
    // });
    if (JSON.parse(localStorage.getItem("switchPhone")) == false) {
      this.showPhone = false;
    }
    if (JSON.parse(localStorage.getItem("switchAddress")) == false) {
      this.showAddress = false;
    }
    if (JSON.parse(localStorage.getItem("switchSignature")) == false) {
      this.showSignature = false;
    }
    if (JSON.parse(localStorage.getItem("logoStatus")) == false) {
      this.showLogo = false;
    }
    if (JSON.parse(localStorage.getItem("switchBranding")) == false) {
      this.showbranding = true;
    }
    if (JSON.parse(localStorage.getItem("switchEmail")) == true) {
      this.showEmail = true;
    }
    if (JSON.parse(localStorage.getItem("switchBanks")) == true) {
      this.showBanks = true;
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
    let doc = JSON.parse(localStorage.getItem("document"));
    let colorNepali = JSON.parse(localStorage.getItem("colorNepali"));
    if (colorNepali) {
      switch (colorNepali) {
        case 7:
          this.showCheckedWhite();
          break;
        case 8:
          this.showCheckedPink();
      }
    }
    if (doc) {
      switch (doc) {
        case 0:
          this.showClicked1();
          break;
        case 1:
          this.showClicked2();
          break;
        case 2:
          this.showClicked3();
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
      let num = parseInt(this.sale.total);
      let m = Number(this.sale.total);
      if (m) {
        let integr = Math.floor(m);
        let decimal = ((m - integr).toFixed(2) * 100).toFixed();
        if (Number(decimal) > 19) {
          this.numDec = ("" + decimal).split("");
        } else {
          this.numDec = [decimal];
        }
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
      if (this.sale.party_name && this.sale.number) {
        this.pdfOptions.filename =
          this.sale.type +
          this.sale.value +
          "_" +
          this.sale.number +
          "_" +
          this.sale.party_name;
      } else if (!this.sale.party_name && this.sale.number) {
        this.pdfOptions.filename =
          this.sale.type +
          this.sale.value +
          "_" +
          this.sale.number +
          "_" +
          "OnCash";
      } else if (this.sale.party_name && !this.sale.number) {
        this.pdfOptions.filename =
          this.sale.type + this.sale.value + "_" + this.sale.party_name;
      } else {
        this.pdfOptions.filename =
          this.sale.type + this.sale.value + "_" + "OnCash";
      }
      this.pdfOptions.filename = this.pdfOptions.filename.replace(/\./g, "_");
      this.$refs.html2Pdf.generatePdf();
    },
    showClicked1() {
      this.isActive1 = true;
      this.isActive2 = false;
      this.isActive3 = false;
      this.showDoc = 0;
      this.type = false;
      localStorage.setItem("document", 0);
      this.showChecked1();
    },
    showClicked2() {
      this.isActive2 = true;
      this.isActive1 = false;
      this.isActive3 = false;
      this.showDoc = 1;
      this.type = true;
      localStorage.setItem("document", 1);
      this.showChecked6();
    },
    showClicked3() {
      this.isActive3 = true;
      this.isActive1 = false;
      this.isActive2 = false;
      this.showDoc = 2;
      this.type = false;
      localStorage.setItem("document", 2);
      this.showChecked1();
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
        .querySelector(".invoice-generate .column.is-3")
        .classList.add("d-none");
      document
        .querySelector(".invoice-generate .column.is-9")
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
.invoice-generate {
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
  // box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
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
        .company-info {
          display: flex;
          align-items: center;
          column-gap: 0.75rem;
          img {
            width: 7rem;
            height: 7rem;
            object-fit: cover;
          }
        }
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
          img {
            width: 4rem;
            margin-left: -4rem;
          }
          justify-content: center;
          display: flex;
          align-items: center;
          column-gap: 0.75rem;
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
        padding-bottom: 4rem;
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
        padding-bottom: 4rem;
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
    padding-top: 4rem;
    // padding-bottom: 2rem;
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
@media screen and (max-width: 768px) {
  .simple-table-bottom,
  .standard-table-bottom {
    flex-wrap: wrap;
  }
  .simple-table-bottom .bottom-left {
    padding-right: 1rem;
    width: 100%;
  }

  .simple-table-bottom .bottom-right ul li .result_amount {
    width: auto;
  }
  .simple-table-bottom .bottom-right {
    width: 100%;
  }

  .simple-table-bottom .bottom-right ul li .result_amount {
    text-align: left !important;
  }

  .simple-table-bottom .bottom-right ul li .result_amount p {
    width: max-content;
  }

  .standard-table-bottom .bottom-left {
    padding-right: 1rem;
    width: 100%;
  }

  .standard-table-bottom .bottom-right ul li .result_amount {
    width: auto;
  }
  .standard-table-bottom .bottom-right {
    width: 100%;
  }

  .standard-table-bottom .bottom-right ul li .result_amount {
    text-align: left !important;
  }

  .standard-table-bottom .bottom-right ul li .result_amount p {
    width: max-content;
  }
}
@media print {
  @page {
    margin: 0;
  }
}
</style>