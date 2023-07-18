<template>
  <div>
    <section class="section is-title-bar">
      <div class="level">
        <div class="level-left">
          <div class="level-item">
            <ul>
              <li>Reports</li>
            </ul>
          </div>
        </div>
        <div class="level-right">
          <div class="level-item">
            <div class="buttons is-right">
              <!-- <b-button type="is-light">
                <b-icon icon="file-pdf" custom-size="default" />
                <span class="button-title">Download PDF</span>
              </b-button> -->
              <download-excel
                v-if="activeIndex != null"
                class="button is-light"
                :data="json_data"
                :fields="json_fields"
                :before-generate="startDownload"
                worksheet="My Worksheet"
                :name="excelName"
              >
                <b-icon icon="file-excel" custom-size="default" />
                <span class="button-title">Download Excel</span>
              </download-excel>
              <!-- <nuxt-link to="/saleInvoice" class="button is-primary">
                <b-icon icon="printer" custom-size="default" />
                <span class="button-title">Print Report</span>
              </nuxt-link> -->
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="report section is-main-section">
      <div class="tile is-ancestor">
        <div class="tile is-parent">
          <article class="tile is-child notification is-bordered is-white">
            <b-field class="search-btn">
              <b-input
                v-model="searchQuery"
                placeholder="Search Report"
                type="search"
                icon="magnify"
              >
              </b-input>
            </b-field>
            <div class="content-wrapper">
              <section v-if="globalHelper('transactionsReport')">
                <div v-if="resultQueryTransaction.length" class="subtitle">
                  <p>Transaction</p>
                </div>
                <div v-if="resultQueryTransaction.length" class="content">
                  <ul
                    class="bank-list"
                    v-for="post in resultQueryTransaction"
                    :key="post._id"
                  >
                    <li
                      @click="
                        setActive(
                          post._id,
                          post.footer,
                          post.name,
                          post.amountTitle
                        )
                      "
                      :class="{ active: activeIndex === post._id }"
                    >
                      <div>
                        <p class="bank-name">{{ post.name }}</p>
                      </div>
                      <b-tooltip
                        type="is-dark"
                        :label="post.desc"
                        position="is-right"
                      >
                        <b-button
                          icon-right="information-outline"
                          type="is-primary"
                        />
                      </b-tooltip>
                    </li>
                  </ul>
                </div>
              </section>
              <section>
                <div v-if="resultQueryParty.length" class="subtitle">
                  <p>Party Report</p>
                </div>
                <div v-if="resultQueryParty.length" class="content">
                  <ul
                    class="bank-list"
                    v-for="post in resultQueryParty"
                    :key="post._id"
                  >
                    <li
                      v-if="globalPartyReport(post._id)"
                      @click="setActive(post._id, post.footer, post.name)"
                      :class="{ active: activeIndex === post._id }"
                    >
                      <div>
                        <p class="bank-name">{{ post.name }}</p>
                      </div>
                      <b-tooltip
                        type="is-dark"
                        :label="post.desc"
                        position="is-right"
                      >
                        <b-button
                          icon-right="information-outline"
                          type="is-primary"
                        />
                      </b-tooltip>
                    </li>
                  </ul>
                </div>
              </section>
              <section v-if="globalHelper('itemStockReport')">
                <div v-if="resultQueryItems.length" class="subtitle">
                  <p>Items Report</p>
                </div>
                <div v-if="resultQueryItems.length" class="content">
                  <ul
                    class="bank-list"
                    v-for="post in resultQueryItems"
                    :key="post._id"
                  >
                    <li
                      @click="setActive(post._id, post.footer, post.name)"
                      :class="{ active: activeIndex === post._id }"
                    >
                      <div>
                        <p class="bank-name">{{ post.name }}</p>
                      </div>
                      <b-tooltip
                        type="is-dark"
                        :label="post.desc"
                        position="is-right"
                      >
                        <b-button
                          icon-right="information-outline"
                          type="is-primary"
                        />
                      </b-tooltip>
                    </li>
                  </ul>
                </div>
              </section>
              <section v-if="globalHelper('expenseReport')">
                <div v-if="resultQueryExpense.length" class="subtitle">
                  <p>Income Expense Report</p>
                </div>
                <div v-if="resultQueryExpense.length" class="content">
                  <ul
                    class="bank-list"
                    v-for="post in resultQueryExpense"
                    :key="post._id"
                  >
                    <li
                      @click="setActive(post._id, post.footer, post.name)"
                      :class="{ active: activeIndex === post._id }"
                    >
                      <div>
                        <p class="bank-name">{{ post.name }}</p>
                      </div>
                      <b-tooltip
                        type="is-dark"
                        :label="post.desc"
                        position="is-right"
                      >
                        <b-button
                          icon-right="information-outline"
                          type="is-primary"
                        />
                      </b-tooltip>
                    </li>
                  </ul>
                </div>
              </section>
              <section v-if="globalHelper('businessStatsReport')">
                <div v-if="resultQueryBusiness.length" class="subtitle">
                  <p>Business Report</p>
                </div>
                <div v-if="resultQueryBusiness.length" class="content">
                  <ul
                    class="bank-list"
                    v-for="post in resultQueryBusiness"
                    :key="post._id"
                  >
                    <li
                      @click="setActive(post._id, post.footer, post.name)"
                      :class="{ active: activeIndex === post._id }"
                    >
                      <div>
                        <p class="bank-name">{{ post.name }}</p>
                      </div>
                      <b-tooltip
                        type="is-dark"
                        :label="post.desc"
                        position="is-right"
                      >
                        <b-button
                          icon-right="information-outline"
                          type="is-primary"
                        />
                      </b-tooltip>
                    </li>
                  </ul>
                </div>
              </section>
            </div>
          </article>
        </div>
        <div class="tile is-vertical is-8">
          <div class="tile is-parent">
            <article
              class="tile is-child notification is-white is-fix-height"
              :class="{ 'is-fix-height-short': addClass }"
            >
              <section v-if="showReport == null" class="empty-report">
                <div>
                  <b-icon icon="chart-bar" size="is-small"></b-icon>
                  <p>Click on any reports to view</p>
                </div>
              </section>
              <card-component-report
                v-if="showReport === 0"
                :title="title"
                :activeIndex="activeIndex"
                :footer="footer"
                :totalSum="totalSum"
                :amountTitle="amountTitle"
                @filterDate="filterDate"
                @selectDate1="selectDate1"
                @fileName="fileName"
                class="has-table has-mobile-sort-spaced"
                icon="account-multiple"
              >
                <report-table-sales
                  @totalSum="totalAmount"
                  @excelData="excelData"
                  :filterDate="dateFilter"
                  :dateSelect1="dateSelect1"
                />
              </card-component-report>
              <card-component-report
                v-if="showReport === 1"
                :totalSum="totalSum"
                :title="title"
                :footer="footer"
                :amountTitle="amountTitle"
                :activeIndex="activeIndex"
                @filterDate="filterDate"
                @selectDate1="selectDate1"
                @fileName="fileName"
                class="has-table has-mobile-sort-spaced"
                icon="account-multiple"
              >
                <report-table-sales-return
                  @totalSum="totalAmount"
                  @excelData="excelData"
                  :filterDate="dateFilter"
                  :dateSelect1="dateSelect1"
                />
              </card-component-report>
              <card-component-report
                v-if="showReport === 2"
                :title="title"
                :footer="footer"
                :amountTitle="amountTitle"
                :activeIndex="activeIndex"
                @filterDate="filterDate"
                :totalSum="totalSum"
                @selectDate1="selectDate1"
                @fileName="fileName"
                class="has-table has-mobile-sort-spaced"
                icon="account-multiple"
              >
                <report-table-purchase
                  @totalSum="totalAmount"
                  @excelData="excelData"
                  :filterDate="dateFilter"
                  :dateSelect1="dateSelect1"
                />
              </card-component-report>
              <card-component-report
                v-if="showReport === 3"
                :title="title"
                :footer="footer"
                :amountTitle="amountTitle"
                :activeIndex="activeIndex"
                @filterDate="filterDate"
                :totalSum="totalSum"
                @selectDate1="selectDate1"
                @fileName="fileName"
                class="has-table has-mobile-sort-spaced"
                icon="account-multiple"
              >
                <report-table-purchase-return
                  @totalSum="totalAmount"
                  :filterDate="dateFilter"
                  @excelData="excelData"
                  :dateSelect1="dateSelect1"
                />
              </card-component-report>
              <card-component-report-daybook
                v-if="showReport === 4"
                :title="title"
                :footer="footer"
                @fileName="fileName"
                @selectDate1="selectDate1"
                :totalSum="totalSum"
                class="has-table has-mobile-sort-spaced"
                icon="account-multiple"
              >
                <day-book-table
                  @totalSum="totalAmount"
                  :dateSelect1="dateSelect1"
                  @excelData="excelData"
                />
              </card-component-report-daybook>
              <card-component-report-transaction
                v-if="showReport === 17"
                :title="title"
                :footer="footer"
                @filterDate="filterDate"
                @fileName="fileName"
                @filterType="filterType"
                @selectDate1="selectDate1"
                class="has-table has-mobile-sort-spaced"
                icon="account-multiple"
              >
                <report-table-transaction
                  :filterType="typeFilter"
                  :filterDate="dateFilter"
                  @excelData="excelData"
                  :dateSelect1="dateSelect1"
                />
              </card-component-report-transaction>
              <card-component-report-statement
                v-if="showReport === 5"
                :title="title"
                :footer="footer"
                @filterDate="filterDate"
                @filterType="filterType"
                @fileName="fileName"
                :totalSum="totalSum"
                @selectDate1="selectDate1"
                class="has-table has-mobile-sort-spaced"
                icon="account-multiple"
              >
                <report-table-statement
                  @totalSum="totalAmount"
                  :filterType="dateFilterParty"
                  @excelData="excelData"
                  :filterDate="dateFilter"
                  :dateSelect1="dateSelect1"
                />
              </card-component-report-statement>
              <card-component-report-all
                v-if="showReport === 6"
                :title="title"
                :footer="footer"
                @fileName="fileName"
                @filterDate="filterDate"
                @filterType="filterType"
                :totalSum="totalSum"
                class="has-table has-mobile-sort-spaced"
                icon="account-multiple"
              >
                <report-table-all
                  @totalSum="totalAmount"
                  @excelData="excelData"
                  :filterType="typeFilter"
                  :filterDate="dateFilter"
                />
              </card-component-report-all>
              <card-component-report-stock
                v-if="showReport === 8"
                :title="title"
                :footer="footer"
                @filterDate="filterDate"
                @filterType="filterType"
                @fileName="fileName"
                :totalSum="totalSum"
                class="has-table has-mobile-sort-spaced"
                icon="account-multiple"
              >
                <report-table-stock
                  @totalSum="totalAmount"
                  @excelData="excelData"
                  :filterType="typeFilter"
                  :filterDate="dateFilter"
                />
              </card-component-report-stock>

              <card-component-report-stock-low
                v-if="showReport === 9"
                :title="title"
                :footer="footer"
                @fileName="fileName"
                @filterType="filterType"
                class="has-table has-mobile-sort-spaced"
                icon="account-multiple"
              >
                <report-table-stock-low
                  :filterType="typeFilter"
                  @excelData="excelData"
                />
              </card-component-report-stock-low>
              <card-component-report-stock-details
                v-if="showReport === 10"
                :title="title"
                :footer="footer"
                @fileName="fileName"
                class="has-table has-mobile-sort-spaced"
                icon="account-multiple"
                @filterDate="filterDate"
                @filterType="filterType"
              >
                <report-table-stock-details
                  :filterType="typeFilter"
                  @excelData="excelData"
                  :filterDate="dateFilter"
                />
              </card-component-report-stock-details>
              <card-component-report-expense-transaction
                v-if="showReport === 11"
                :key="showReport"
                :title="title"
                :type="'expense'"
                :footer="footer"
                @filterDate="filterDate"
                @filterType="filterType"
                @fileName="fileName"
                :totalSum="totalSum"
                @selectDate1="selectDate1"
                class="has-table has-mobile-sort-spaced"
                icon="account-multiple"
              >
                <report-table-expense-transaction
                  @totalSum="totalAmount"
                  :filterType="dateFilterParty"
                  :filterDate="dateFilter"
                  @excelData="excelData"
                  :dateSelect1="dateSelect1"
                />
              </card-component-report-expense-transaction>
              <card-component-report-expense-transaction
                v-if="showReport === 51"
                :key="showReport"
                :title="title"
                :type="'income'"
                :footer="footer"
                @filterDate="filterDate"
                @filterType="filterType"
                @fileName="fileName"
                :totalSum="totalSum"
                @selectDate1="selectDate1"
                class="has-table has-mobile-sort-spaced"
                icon="account-multiple"
              >
                <report-table-income-transaction
                  @totalSum="totalAmount"
                  :filterType="dateFilterParty"
                  :filterDate="dateFilter"
                  @excelData="excelData"
                  :dateSelect1="dateSelect1"
                />
              </card-component-report-expense-transaction>
              <card-component-report-expense-category
                v-if="showReport === 12"
                :key="showReport"
                :title="title"
                :footer="footer"
                @fileName="fileName"
                class="has-table has-mobile-sort-spaced"
                icon="account-multiple"
                :totalSum="totalSum"
              >
                <report-table-expense-category
                  @totalSum="totalAmount"
                  @excelData="excelData"
                />
              </card-component-report-expense-category>
              <card-component-report-expense-category
                v-if="showReport === 52"
                :key="showReport"
                :title="title"
                :footer="footer"
                @fileName="fileName"
                class="has-table has-mobile-sort-spaced"
                icon="account-multiple"
                :totalSum="totalSum"
              >
                <report-table-income-category
                  @totalSum="totalAmount"
                  @excelData="excelData"
                />
              </card-component-report-expense-category>
              <card-component-report-business-bank
                v-if="showReport === 14"
                :title="title"
                :footer="footer"
                @filterDate="filterDate"
                @fileName="fileName"
                :totalSum="totalSum"
                @selectDate1="selectDate1"
                class="has-table has-mobile-sort-spaced"
                icon="account-multiple"
              >
                <report-table-cashinhand
                  @totalSum="totalAmount"
                  :filterDate="dateFilter"
                  @excelData="excelData"
                  :dateSelect1="dateSelect1"
                />
              </card-component-report-business-bank>
              <card-component-report-business-bank
                v-if="showReport === 15"
                :title="title"
                :footer="footer"
                :activeIndex="activeIndex"
                @filterDate="filterDate"
                @fileName="fileName"
                :totalSum="totalSum"
                @selectDate1="selectDate1"
                class="has-table has-mobile-sort-spaced"
                icon="account-multiple"
              >
                <report-table-banks
                  @totalSum="totalAmount"
                  @excelData="excelData"
                  :filterDate="dateFilter"
                  :dateSelect1="dateSelect1"
                />
              </card-component-report-business-bank>
              <card-component-report-discount
                v-if="showReport === 20"
                :title="title"
                :footer="footer"
                :totalSum="totalSum"
                @fileName="fileName"
                @filterDate="filterDate"
                class="has-table has-mobile-sort-spaced"
                icon="account-multiple"
              >
                <report-table-discount
                  @totalSum="totalAmount"
                  @excelData="excelData"
                  :filterDate="dateFilter"
                />
              </card-component-report-discount>
              <!-- <card-component-report-vat
                v-if="showReport === 21"
                :title="title"
                :footer="footer"
                :activeIndex="activeIndex"
                @fileName="fileName"
                :totalSum="totalSum"
                @filterDate="filterDate"
                @selectDate1="selectDate1"
                class="has-table has-mobile-sort-spaced"
                icon="account-multiple"
              >
                <report-table-vat
                  @totalSum="totalAmount"
                  @excelData="excelData"
                  :filterDate="dateFilter"
                  :dateSelect1="dateSelect1"
                />
              </card-component-report-vat>
              <card-component-report-vat
                v-if="showReport === 22"
                :title="title"
                :footer="footer"
                :activeIndex="activeIndex"
                @fileName="fileName"
                :totalSum="totalSum"
                @filterDate="filterDate"
                @selectDate1="selectDate1"
                class="has-table has-mobile-sort-spaced"
                icon="account-multiple"
              >
                <report-table-vat-purchase
                  @totalSum="totalAmount"
                  @excelData="excelData"
                  :filterDate="dateFilter"
                  :dateSelect1="dateSelect1"
                />
              </card-component-report-vat> -->
            </article>
          </div>
        </div>
        <!-- <div v-else class="tile is-vertical is-8">
          <div class="tile is-parent">
            <article
              class="tile is-child notification is-white is-fix-height-short"
            >
              <card-component-report
                v-if="showReport == null"
                :title="title"
                :footer="footer"
                class="has-table has-mobile-sort-spaced"
                icon="account-multiple"
              >
              </card-component-report>
            </article>
          </div>
        </div> -->
      </div>
    </section>
  </div>
</template>
<script>
import downloadExcel from "vue-json-excel";
import SubtitleBar from "@/components/SubtitleBar";
import TitleBar from "@/components/TitleBar";
import ReportTable from "@/components/ReportTable";
import ReportTableSales from "@/components/ReportTableSales";
import ReportTableSalesReturn from "@/components/ReportTableSalesReturn";
import ReportTablePurchase from "@/components/ReportTablePurchase";
import ReportTablePurchaseReturn from "@/components/ReportTablePurchaseReturn";
import ReportTableTransaction from "@/components/ReportTableTransaction";
import ReportTableStatement from "@/components/ReportTableStatement";
import ReportTableAll from "@/components/ReportTableAll";
import ReportTableStock from "@/components/ReportTableStock";
import ReportTableStockLow from "@/components/ReportTableStockLow";
import ReportTableStockDetails from "@/components/ReportTableStockDetails";
import ReportTableExpenseTransaction from "@/components/ReportTableExpenseTransaction";
import ReportTableIncomeTransaction from "@/components/ReportTableIncomeTransaction";
import ReportTableExpenseCategory from "@/components/ReportTableExpenseCategory";
import ReportTableIncomeCategory from "@/components/ReportTableIncomeCategory";
import ReportTableCashinhand from "@/components/ReportTableCashinhand";
import ReportTableBanks from "@/components/ReportTableBanks";
import ReportTableDiscount from "@/components/ReportTableDiscount";
import ReportTableVat from "@/components/ReportTableVat";
import ReportTableVatPurchase from "@/components/ReportTableVatPurchase";
import DayBookTable from "@/components/DayBookTable";
import ModalBox from "@/components/ModalBox";
import ModalTransfer from "@/components/ModalTransfer";
import CardComponentReportNull from "@/components/CardComponentReportNull";
import CardComponentReport from "@/components/CardComponentReport";
import CardComponentReportDaybook from "@/components/CardComponentReportDaybook";
import CardComponentReportTransaction from "@/components/CardComponentReportTransaction";
import CardComponentReportStatement from "@/components/CardComponentReportStatement";
import CardComponentReportAll from "@/components/CardComponentReportAll";
import CardComponentReportStock from "@/components/CardComponentReportStock";
import CardComponentReportStockLow from "@/components/CardComponentReportStockLow";
import CardComponentReportStockDetails from "@/components/CardComponentReportStockDetails";
import CardComponentReportExpenseTransaction from "@/components/CardComponentReportExpenseTransaction";
import CardComponentReportExpenseCategory from "@/components/CardComponentReportExpenseCategory";
import CardComponentReportBusinessBank from "@/components/CardComponentReportBusinessBank";
import CardComponentReportDiscount from "@/components/CardComponentReportDiscount";
import CardComponentReportVat from "@/components/CardComponentReportVat";
export default {
  name: "Home",
  middleware: "auth-business",
  components: {
    TitleBar,
    downloadExcel,
    SubtitleBar,
    ReportTable,
    ReportTableSales,
    ReportTableSalesReturn,
    ReportTablePurchase,
    ReportTablePurchaseReturn,
    ReportTableTransaction,
    ReportTableStatement,
    ReportTableAll,
    ReportTableStock,
    ReportTableStockLow,
    ReportTableStockDetails,
    ReportTableExpenseTransaction,
    ReportTableIncomeTransaction,
    ReportTableExpenseCategory,
    ReportTableIncomeCategory,
    ReportTableCashinhand,
    ReportTableBanks,
    ReportTableDiscount,
    ReportTableVat,
    ReportTableVatPurchase,
    DayBookTable,
    ModalBox,
    ModalTransfer,
    CardComponentReportNull,
    CardComponentReport,
    CardComponentReportDaybook,
    CardComponentReportTransaction,
    CardComponentReportStatement,
    CardComponentReportAll,
    CardComponentReportStock,
    CardComponentReportStockLow,
    CardComponentReportStockDetails,
    CardComponentReportExpenseTransaction,
    CardComponentReportExpenseCategory,
    CardComponentReportBusinessBank,
    CardComponentReportDiscount,
    CardComponentReportVat,
  },
  data() {
    return {
      isModalActive: false,
      isModalActive2: false,
      activeIndex: null,
      totalSum: null,
      dateFilter: "",
      dateSelect1: {},
      excelName: "",
      dateFilterbook: new Date(),
      dateFilterParty: {},
      typeFilter: null,
      addClass: true,
      title: "Sales",
      footer: "Sales",
      amountTitle: "Received",
      showReport: null,
      searchQuery: "",
      json_fields: {},
      json_data: [],
      json_meta: [
        [
          {
            key: "charset",
            value: "utf-8",
          },
        ],
      ],
      transaction: [
        {
          _id: 0,
          name: "Sales",
          footer: "Sales",
          amountTitle: "Received",
          desc: "Check your business sale in a given time.",
        },
        {
          _id: 1,
          footer: "Sales Return",
          amountTitle: "Paid",
          name: "Sales Return",
          desc: "View all sales return records.",
        },
        {
          _id: 2,
          footer: "Purchase",
          amountTitle: "Paid",
          name: "Purchase",
          desc: "Check your business purchase in a given time.",
        },
        {
          _id: 3,
          footer: "Purchase Ret.",
          amountTitle: "Received",
          desc: "View all purchase return records.",
          name: "Purchase Return",
        },
        {
          _id: 4,
          desc: "View all your business transaction on any single day.",
          name: "Day Book",
          footer: "Money in - money out",
        },
        {
          _id: 17,
          footer: "Transactions",
          desc: "View all your party transaction in a given time.",
          name: "All Transactions",
        },
      ],
      party: [
        {
          _id: 5,
          footer: "Sales",
          desc: "Check all the transaction made by certain party.",
          name: "Party Statement",
        },
        {
          _id: 6,
          footer: "Sales",
          desc: "Check receivable/payable due of every party.",
          name: "All Parties",
        },
      ],
      items: [
        {
          _id: 8,
          footer: "Sales",
          desc: "Check stock quantity & value of each item.",
          name: "Stock Summary",
        },
        {
          _id: 9,
          footer: "Sales",
          desc: "Shows all quantity of items whose quantity is low.",
          name: "Low Stock Report",
        },
        {
          _id: 10,
          footer: "Sales",
          desc: "Shows opening and closing quantity for each item.",
          name: "Stock Detail Report",
        },
      ],
      expense: [
        {
          _id: 11,
          footer: "Sales",
          desc: "Check all the expense made by business in a given time.",
          name: "Expense Transactions",
        },
        {
          _id: 51,
          footer: "Sales",
          desc: "Check all the income made by business in a given time.",
          name: "Income Transactions",
        },
        {
          _id: 12,
          footer: "Sales",
          desc: "Check the categorized expense report in a given time.",
          name: "Expense Category",
        },
        {
          _id: 52,
          footer: "Sales",
          desc: "Check the categorized income report in a given time.",
          name: "Income Category",
        },
      ],
      business: [
        {
          _id: 14,
          footer: "Cash",
          desc: "Check all the transaction made with cash.",
          name: "Cash in Hand",
        },
        {
          _id: 15,
          footer: "Money",
          desc: "Check all the transaction made with bank.",
          name: "Bank Statement",
        },
        {
          _id: 20,
          footer: "",
          desc: "Check the total discounted amount made by each parties in purchase & sales",
          name: "Discount Report",
        },
        // {
        //   _id: 21,
        //   footer: "Report",
        //   desc: "Check report of all TAX applicable sales.",
        //   name: "VAT Sales",
        // },
        // {
        //   _id: 22,
        //   footer: "Report",
        //   desc: "Check report of all TAX applicable purchase.",
        //   name: "VAT Purchases",
        // },
      ],
    };
  },
  mounted() {
    if (localStorage.getItem("report_title") == "expense") {
      this.dateFilter = null;
      this.activeIndex = 11;
      this.addClass = true;
      this.title = "Expense Transactions";
      this.showReport = 11;
    }
    if (localStorage.getItem("report_title") == "income") {
      this.dateFilter = null;
      this.activeIndex = 51;
      this.addClass = true;
      this.title = "Income Transactions";
      this.showReport = 51;
    }
    if (localStorage.getItem("report_title") == "sales") {
      this.dateFilter = null;
      this.activeIndex = 0;
      this.addClass = true;
      this.title = "Sales";
      this.footer = "Sales";
      this.amountTitle = "Received";
      this.showReport = 0;
    }
    if (localStorage.getItem("report_title") == "sales-return") {
      this.dateFilter = null;
      this.activeIndex = 1;
      this.addClass = true;
      this.title = "Sales Return";
      this.footer = "Sales Return";
      this.amountTitle = "Paid";
      this.showReport = 1;
    }
    if (localStorage.getItem("report_title") == "sales-return") {
      this.dateFilter = null;
      this.activeIndex = 1;
      this.addClass = true;
      this.title = "Sales Return";
      this.footer = "Sales Return";
      this.amountTitle = "Paid";
      this.showReport = 1;
    }
    if (localStorage.getItem("report_title") == "purchase") {
      this.dateFilter = null;
      this.activeIndex = 2;
      this.addClass = true;
      this.title = "Purchase";
      this.footer = "Purchase";
      this.amountTitle = "Paid";
      this.showReport = 2;
    }
    if (localStorage.getItem("report_title") == "purchase-return") {
      this.dateFilter = null;
      this.activeIndex = 3;
      this.addClass = true;
      this.title = "Purchase Return";
      this.footer = "Purchase Ret.";
      this.amountTitle = "Received";
      this.showReport = 3;
    }
    if (localStorage.getItem("report_title") == "cash-in-hand") {
      this.dateFilter = null;
      this.activeIndex = 14;
      this.addClass = true;
      this.title = "Cash in Hand";
      this.footer = "Cash";
      this.showReport = 14;
    }
    if (localStorage.getItem("report_title") == "bank-balance") {
      this.dateFilter = null;
      this.activeIndex = 15;
      this.addClass = true;
      this.title = "Bank Statement";
      this.footer = "Money";
      this.showReport = 15;
    }
    localStorage.removeItem("report_title");
  },
  computed: {
    titleSub() {
      return ["Income and Expenses"];
    },
    resultQueryTransaction() {
      if (this.searchQuery) {
        return this.transaction.filter((item) => {
          return this.searchQuery
            .toLowerCase()
            .split(" ")
            .every((v) => item.name.toLowerCase().includes(v));
        });
      } else {
        return this.transaction;
      }
    },
    resultQueryParty() {
      if (this.searchQuery) {
        return this.party.filter((item) => {
          return this.searchQuery
            .toLowerCase()
            .split(" ")
            .every((v) => item.name.toLowerCase().includes(v));
        });
      } else {
        return this.party;
      }
    },
    resultQueryItems() {
      if (this.searchQuery) {
        return this.items.filter((item) => {
          return this.searchQuery
            .toLowerCase()
            .split(" ")
            .every((v) => item.name.toLowerCase().includes(v));
        });
      } else {
        return this.items;
      }
    },
    resultQueryExpense() {
      if (this.searchQuery) {
        return this.expense.filter((item) => {
          return this.searchQuery
            .toLowerCase()
            .split(" ")
            .every((v) => item.name.toLowerCase().includes(v));
        });
      } else {
        return this.expense;
      }
    },
    resultQueryBusiness() {
      if (this.searchQuery) {
        return this.business.filter((item) => {
          return this.searchQuery
            .toLowerCase()
            .split(" ")
            .every((v) => item.name.toLowerCase().includes(v));
        });
      } else {
        return this.business;
      }
    },
  },
  methods: {
    totalAmount(sum) {
      if (sum) {
        this.addClass = false;
      }
      this.totalSum = sum;
    },
    startDownload() {
      if (!this.json_data.length) {
        this.$buefy.snackbar.open({
          message: "There is no report to download",
          type: "is-danger",
          position: "is-bottom",
          indefinite: false,
        });
      }
    },
    fileName(text) {
      this.excelName = text.replace(/\./g, "_");
    },
    excelData(data, allAmt, type) {
      if (type == "sale") {
        let list = [];
        data.forEach((element) => {
          list.push({
            balanceAmt: element.balanceAmt,
            date: element.date,
            type: element.type,
            id: element.id,
            number: element.number,
            party_value: element.party_value,
            totalAmt: element.totalAmt,
            receivedAmt: element.receivedAmt
              ? element.receivedAmt
              : element.paidAmt,
          });
        });
        this.json_data = list;
        if (allAmt.type == "received")
          this.json_fields = {
            Date: "date",
            "Party Name": "party_value",
            "Bill No.": "number",
            "Total Amt": "totalAmt",
            "Received Amt": "receivedAmt",
            "Balance Amt": "balanceAmt",
          };
        else if (allAmt.type == "paid") {
          this.json_fields = {
            Date: "date",
            "Party Name": "party_value",
            "Bill No.": "number",
            "Total Amt": "totalAmt",
            "Paid Amt": "receivedAmt",
            "Balance Amt": "balanceAmt",
          };
        }
        let item = {
          date: "",
          party_value: "TOTAL",
          number: "",
          totalAmt: this.conversion(allAmt.sum),
          receivedAmt: this.conversion(allAmt.paid),
          balanceAmt: this.conversion(allAmt.unpaid),
        };
        this.json_data.push(item);
      } else if (type == "daybook") {
        this.json_data = [...data];
        this.json_fields = {
          "Txn. Type": "type_value",
          "Party Name": "party_value",
          Amount: "amount_value",
          "Money In": "money_in_value",
          "Money Out": "money_out_value",
        };
        let item = {
          party_value: "TOTAL",
          amount_value: this.conversion(allAmt.sum),
          money_in_value: this.conversion(allAmt.paid),
          money_out_value: this.conversion(allAmt.unpaid),
        };
        this.json_data.push(item);
      } else if (type == "all-transaction") {
        this.json_data = [...data];
        this.json_fields = {
          "Txn. Type": "type_value",
          "Party Name": "party_value",
          Date: "date",
          "Bill no.": "number",
          "Total Amount": "totalAmt",
          "Rec/Paid Amt": "rpAmt",
          "Balance Amt": "balanceAmt",
        };
      } else if (type == "party-statement") {
        this.json_data = [...data];
        this.json_fields = {
          Date: "date",
          Particular: "type_value",
          "Bill no.": "num",
          Debit: "debit_value",
          Credit: "credit_value",
          "Bill Total": "balance",
        };
        let item = {
          type_value: "TOTAL",
          debit_value: this.conversion(allAmt.debitTotal),
          credit_value: this.conversion(allAmt.creditTotal),
          balance: this.conversion(allAmt.total),
        };
        this.json_data.push(item);
      } else if (type == "all-parties") {
        this.json_data = [...data];
        this.json_fields = {
          "Party Name": "party_value",
          Contact: "phone_number",
          Receivable: "receivableAmt",
          Payable: "payableAmt",
        };
        let item = {
          party_value: "TOTAL",
          receivableAmt: this.conversion(allAmt.paid),
          payableAmt: this.conversion(allAmt.sum),
        };
        this.json_data.push(item);
      } else if (type == "stock") {
        this.json_data = [...data];
        this.json_fields = {
          "Item Name": "name",
          "Sale Price": "sale_priceExcel",
          "Purchase Price": "purchase_priceExcel",
          "Stock QTY.": "quantity",
          "Stock Value": "stockExcel",
        };
      } else if (type == "stock-low") {
        this.json_data = [...data];
        this.json_fields = {
          SN: "id",
          "Item Name": "name",
          "Low Stock": "low_stock",
          "Stock QTY.": "quantity",
        };
      } else if (type == "stock-detail") {
        this.json_data = [...data];
        this.json_fields = {
          "Item Name": "name",
          "Opening QTY.": "opening_quantity",
          "QTY. In": "quantity_in",
          "QTY. Out.": "quantity_out",
          "Closing QTY.": "closing_quantity",
        };
      } else if (type == "expense") {
        this.json_data = [...data];
        this.json_fields = {
          Date: "date",
          Category: "category_value",
          Note: "note",
          Amount: "totalAmt",
        };
        let item = {
          category_value: "TOTAL",
          totalAmt: this.conversion(allAmt.sum),
        };
        this.json_data.push(item);
      } else if (type == "income") {
        this.json_data = [...data];
        this.json_fields = {
          Date: "date",
          Category: "category_value",
          Note: "note",
          Amount: "totalAmt",
        };
        let item = {
          category_value: "TOTAL",
          totalAmt: this.conversion(allAmt.sum),
        };
        this.json_data.push(item);
      } else if (type == "expense-category") {
        this.json_data = [...data];
        this.json_fields = {
          SN: "id",
          Category: "name",
          "Total Expense": "total_amount_value",
        };
        let item = {
          name: "TOTAL",
          total_amount_value: this.conversion(allAmt.sum),
        };
        this.json_data.push(item);
      } else if (type == "income-category") {
        this.json_data = [...data];
        this.json_fields = {
          SN: "id",
          Category: "name",
          "Total Income": "total_amount_value",
        };
        let item = {
          name: "TOTAL",
          total_amount_value: this.conversion(allAmt.sum),
        };
        this.json_data.push(item);
      } else if (type == "cash") {
        this.json_data = [...data];
        this.json_fields = {
          Date: "date",
          Particular: "type_value",
          Remarks: "remarks",
          "Cash In": "money_in_value",
          "Cash Out": "money_out_value",
        };
      } else if (type == "bank") {
        this.json_data = [...data];
        this.json_fields = {
          Date: "date",
          Particular: "type_value",
          Remarks: "remarks",
          Withdraw: "money_out_value",
          Deposit: "money_in_value",
        };
      } else if (type == "discount") {
        this.json_data = [...data];
        this.json_fields = {
          SN: "id",
          "Party Name": "name",
          "Total Sale Discount": "total_sale_discount_Amt",
          "Total Purchase Discount": "total_purchase_discount_Amt",
        };
        let item = {
          name: "TOTAL",
          total_sale_discount_Amt: this.conversion(allAmt.sale_discount),
          total_purchase_discount_Amt: this.conversion(
            allAmt.purchase_discount
          ),
        };
        this.json_data.push(item);
      } else if (type == "vat") {
        this.json_data = [...data];
        this.json_fields = {
          Date: "date",
          "Bill no.": "number",
          "Party Name": "party_value",
          "Vat/Pan no.": "pan_vat_num",
          "Taxable Amt.": "totalAmt",
          Vat: "vat_amount",
          Total: "balanceAmt",
        };
        let item = {
          party_value: "TOTAL",
          totalAmt: this.conversion(allAmt.paid),
          vat_amount: this.conversion(allAmt.unpaid),
          balanceAmt: this.conversion(allAmt.sum),
        };
        this.json_data.push(item);
      } else if (type == "vat-purchase") {
        this.json_data = [...data];
        this.json_fields = {
          Date: "date",
          "Bill no.": "number",
          "Party Name": "party_value",
          "Vat/Pan no.": "pan_vat_num",
          "Taxable Amt.": "totalAmt",
          Vat: "vat_amount",
          Total: "balanceAmt",
        };
        let item = {
          party_value: "TOTAL",
          totalAmt: this.conversion(allAmt.paid),
          vat_amount: this.conversion(allAmt.unpaid),
          balanceAmt: this.conversion(allAmt.sum),
        };
        this.json_data.push(item);
      }
    },
    selectDate1(selectDate1) {
      this.dateSelect1 = selectDate1;
    },
    filterDate(filterDate) {
      if (typeof filterDate == "object") {
        this.dateFilterbook = filterDate;
      } else {
        this.dateFilter = filterDate;
      }
    },
    filterType(filterType) {
      if (typeof filterType == "object") {
        this.dateFilterParty = filterType;
      } else {
        this.typeFilter = filterType;
      }
    },
    trashModal() {
      this.isModalActive = true;
    },
    trashModal2() {
      this.isModalActive2 = true;
    },
    trashConfirm(a) {
      this.isModalActive = false;
      this.posts._id = Math.random().toString(36).substr(2, 7);
      this.posts.push({ name: a.bank_name, ac_no: a.ac_no, amount: a.amount });
      this.$buefy.snackbar.open({
        message: "Confirmed",
        queue: false,
      });
    },
    trashCancel() {
      this.isModalActive = false;
    },
    trashCancel2() {
      this.isModalActive2 = false;
    },
    setActive(id, footer, name, amountTitle) {
      this.dateFilter = null;
      this.activeIndex = id;
      this.addClass = true;
      this.title = name;
      this.footer = footer;
      this.amountTitle = amountTitle;
      this.showReport = id;
    },
  },
  head() {
    return {
      title: "Reports-Karobar",
    };
  },
};
</script>
<style lang="scss">
$green: #3ab98d;
$black: #1f1f1f;
.tag {
  cursor: pointer;
}
.buttons {
  &.is-m-right {
    margin-left: 4rem;
  }
}
.report {
  .empty-report {
    display: grid;
    place-items: center;
    text-align: center;
    height: 70vh;
    .icon {
      font-size: 6rem;
      color: #aaaaaa;
    }
    p {
      color: #333a4d;
      font-size: 20px;
    }
  }
  .tile {
    &.notification {
      border-radius: 8px;
      padding: 0;
      &.is-bordered {
        border: 1px solid #dedede;
      }
      &.is-fix-height {
        height: 45rem;
      }
      &.is-fix-height-short {
        height: 0 !important;
      }
      a {
        text-decoration: none;
      }
    }
    p.title {
      font-size: 16px;
      padding: 1.125rem 1.5rem;
    }
    .subtitle {
      background-color: #f8f8f8;
      padding: 1rem 1.5rem;
      display: flex;
      justify-content: space-between;
      font-size: 16px;
    }
    .content {
      margin-top: -1.5rem;
      margin-bottom: 0;
      .bank-list {
        margin: 0;

        li {
          display: flex;
          justify-content: space-between;
          border-bottom: 1px solid #eaeaea;
          padding: 0.5rem 1.5rem;
          border-left: 3px solid white;
          position: relative;
          cursor: pointer;
          div {
            margin: auto 0;
          }
          .b-tooltip {
            right: -1rem;
          }
          .button {
            background-color: transparent;
            color: #dedede;
            box-shadow: none;
            .icon {
              font-size: 20px;
            }
          }
          .dropdown-menu {
            .dropdown-content {
              width: max-content;
            }
          }
          &.active {
            border-left: 3px solid #3ab98d;
            background-color: #e7f4ef;
          }
          &:hover {
            border-left: 3px solid #3ab98d;
            background-color: #e7f4ef;
          }
          p.bank-name {
            font-size: 15px;
            margin-bottom: 0;
          }
          p.account-no {
            font-size: 12px;
            color: #6e6e70;
          }
          p.amount {
            font-size: 14px;
            margin-top: 0.5rem;
            padding-left: 20px;
          }
        }
      }
    }
  }
  .search-btn {
    padding: 0.75rem;
    margin-bottom: 0;
  }
  .search-btn .control.has-icons-left .icon.is-left {
    left: -8px;
    top: -8px;
    font-size: 23px;
  }
  .box-top {
    position: relative;
    .hr {
      height: 1px;
      width: 100%;
      background-color: #eaeaea;
      position: absolute;
      top: 4rem;
    }
    .left-box {
      .entries {
        display: flex;
        padding-top: 2rem;
      }
      input {
        height: 2em;

        &:focus {
          box-shadow: none;
          border-color: #b5b5b5;
        }
      }

      span {
        margin: 5px 5px;
      }

      .select {
        vertical-align: middle;

        select {
          font-size: 14px;

          &:focus {
            box-shadow: none;
            border-color: #999999;
          }
        }

        &:not(.is-multiple):not(.is-loading)::after {
          border-color: #1f1f1f;
          right: 14px;
          font-size: 13px;
        }
      }
    }

    .right-box {
      .field {
        padding-top: 2rem;
      }
      .field.has-addons {
        justify-content: flex-end;
      }

      h1 {
        color: $green;
        font-weight: 500;
        text-align: right;
      }

      span {
        padding-top: 4px;
        padding-right: 10px;
      }

      .input {
        height: 2em;
        border-radius: 3px !important;

        &:focus {
          box-shadow: none;
          border-color: #b5b5b5;
        }
      }
    }
  }
  // .content-wrapper {
  //   height: 42rem;
  //   overflow-x: hidden;
  //   overflow-y: scroll;
  // }
}
@media screen and (max-width: 768px) {
  .report-card .card-header .field {
    padding: 0 1rem;
  }
  .report-card .card-header .datepicker .date_picker_page.from-input,
  .report-card .card-header .datepicker .date_picker_page2.from-input {
    border-radius: 0 4px 4px 0;
    border-right: 1px solid #dedede;
  }
  .report-card .card-header .field span.input-side.b-0 {
    border-radius: 4px 0 0 4px;
  }
}
</style>