<template>
  <div>
    <party-modal
      :is-active="isModalActive"
      @confirm="trashConfirm"
      @cancel="trashCancel"
      @confirmAdd="confirmAdd"
    />
    <party-modal-edit
      :is-active="isModalActive2"
      @confirm="trashConfirm2"
      @cancel="trashCancel2"
      :party="party"
      :dateInput="dateNepali"
    />
    <delete-party
      :is-active="isModalActive3"
      @confirm="deleteConfirm"
      @cancel="deleteCancel"
    />
    <payment-in-modal
      :is-active="isModalActivePin"
      @confirm="trashConfirmPin"
      @cancel="trashCancel"
      @addConfirm="addConfirmIn"
      :party="partyPin"
      ref="parties1"
    />
    <payment-out-modal
      :is-active="isModalActivePout"
      @confirm="trashConfirmPout"
      @cancel="trashCancel"
      @addConfirm="addConfirmOut"
      :party="partyPout"
      ref="parties2"
    />
    <share-modal
      :is-active="isModalActiveShare"
      @confirm="trashConfirmShare"
      :share_code="share_code"
      @cancel="trashCancel"
    />
    <span style="display: none">{{ modalChange }}</span>
    <button
      style="display: none"
      v-shortkey="['alt', 'n']"
      @shortkey="theAction('n')"
    ></button>
    <section class="section is-title-bar">
      <div class="level">
        <div class="level-left">
          <div class="level-item">
            <ul>
              <li>All Parties</li>
            </ul>
          </div>
        </div>
        <div class="level-right">
          <div class="level-item">
            <div class="buttons is-right">
              <button
                v-if="
                  globalHelper('createPartiesSupplier') ||
                  globalHelper('createPartiesCustomer')
                "
                @click="trashModal()"
                class="button is-primary"
              >
                <b-icon icon="plus" custom-size="default" />
                <span class="button-title">Add New Party</span>
              </button>
              <b-dropdown class="title-bar-dropdown" aria-role="list">
                <template #trigger>
                  <b-button type="is-light" icon-right="menu-down"
                    ><span class="button-title"
                      >Create Transaction</span
                    ></b-button
                  >
                </template>

                <nuxt-link
                  v-if="globalHelper('createSale')"
                  class="dropdown-item"
                  @click.native="createTransaction(partyName, partyId)"
                  to="/saleInvoice"
                  aria-role="listitem"
                  >Sales Invoice</nuxt-link
                >
                <nuxt-link
                  v-if="globalHelper('createPurchase')"
                  class="dropdown-item"
                  @click.native="createTransaction(partyName, partyId)"
                  to="/createPurchaseInvoice"
                  aria-role="listitem"
                  >Purchase</nuxt-link
                >
                <b-dropdown-item
                  v-if="globalHelper('createSale')"
                  class="dropdown-item"
                  @click="paymentModal('Payment In')"
                  aria-role="listitem"
                  >Payment In</b-dropdown-item
                >
                <b-dropdown-item
                  v-if="globalHelper('createPurchase')"
                  class="dropdown-item"
                  @click="paymentModal('Payment Out')"
                  aria-role="listitem"
                  >Payment Out</b-dropdown-item
                >
                <nuxt-link
                  v-if="globalHelper('createSale')"
                  class="dropdown-item"
                  @click.native="createTransaction(partyName, partyId)"
                  to="/createsalesReturn"
                  aria-role="listitem"
                  >Sales Return</nuxt-link
                >
                <nuxt-link
                  v-if="globalHelper('createPurchase')"
                  class="dropdown-item"
                  @click.native="createTransaction(partyName, partyId)"
                  to="/createPurchaseReturn"
                  aria-role="listitem"
                  >Purchase Return</nuxt-link
                >
                <!-- <nuxt-link
                  v-if="globalHelper('createSale')"
                  class="dropdown-item"
                  @click.native="createTransaction(partyName, partyId)"
                  to="/createEstimate"
                  aria-role="listitem"
                  >Estimate/Quotation</nuxt-link
                > -->
              </b-dropdown>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section v-if="lists.length" class="parties section is-main-section">
      <div class="tile is-ancestor">
        <div class="tile is-parent parties-left-box">
          <article class="tile is-child notification is-white">
            <b-field class="search-btn">
              <b-input
                placeholder="Search Parties"
                type="search"
                icon="magnify"
                v-model="searchQuery"
                v-on:keyup.native="searchParties($event)"
              >
              </b-input>
            </b-field>
            <div class="subtitle">
              <p>
                Party
                <b-dropdown aria-role="list">
                  <template #trigger>
                    <button class="button">
                      <b-icon icon="filter" custom-size="default" />
                    </button>
                  </template>
                  <b-dropdown-item @click="allFilter" aria-role="listitem"
                    >All</b-dropdown-item
                  >
                  <b-dropdown-item @click="customerFilter" aria-role="listitem"
                    >Customer</b-dropdown-item
                  >
                  <b-dropdown-item @click="supplierFilter" aria-role="listitem"
                    >Supplier</b-dropdown-item
                  >
                </b-dropdown>
              </p>
              <p>Amount</p>
            </div>
            <div ref="scroll" v-on:scroll="onScroll" class="content">
              <ul class="parties-list" v-for="post in posts" :key="post.id">
                <li
                  :class="{ active: activeIndex === post.id }"
                  @click="itemClick(post)"
                >
                  <div class="list-left-party">
                    <img v-if="post.image" :src="post.image" :alt="post.name" />
                    <div v-else class="no-image-party-list">
                      <span class="placeholder">
                        <b-icon icon="account" size="is-medium"></b-icon>
                      </span>
                    </div>
                    <div>
                      <p class="bank-name">{{ post.name }}</p>
                      <p class="account-no">
                        {{ post.type_value }}
                      </p>
                    </div>
                  </div>
                  <div style="margin-left: auto">
                    <p
                      class="amount"
                      :class="
                        post.condition === 'To Receive'
                          ? 'color-green'
                          : post.condition === 'To Pay'
                          ? 'color-red'
                          : 'color-black'
                      "
                    >
                      Rs. {{ post.amount }}
                    </p>
                    <p class="amount small">{{ post.condition }}</p>
                  </div>
                  <b-dropdown aria-role="list">
                    <template #trigger>
                      <b-button type="is-primary" icon-right="dots-vertical" />
                    </template>

                    <b-dropdown-item
                      @click="editParty(post.id)"
                      aria-role="listitem"
                      >Edit</b-dropdown-item
                    >
                    <b-dropdown-item
                      v-if="
                        globalHelper('deletePartiesCustomer') ||
                        globalHelper('deletePartiesSupplier')
                      "
                      @click="deleteItem(post.id)"
                      aria-role="listitem"
                      >Delete</b-dropdown-item
                    >
                  </b-dropdown>
                </li>
              </ul>
            </div>
          </article>
        </div>
        <div class="tile is-vertical is-8 party-detail">
          <div class="tile is-parent">
            <article class="tile is-child notification is-white">
              <div class="box-top">
                <div class="columns">
                  <div class="column is-8">
                    <div class="left-box column is-12-mobile">
                      <div class="party-box-image">
                        <img
                          v-if="partyImage"
                          :src="partyImage"
                          :alt="partyName"
                        />
                        <div v-else class="no-image-party">
                          <span class="placeholder">
                            <b-icon icon="account" size="is-large"></b-icon>
                          </span>
                        </div>
                        <div>
                          <h1>{{ partyName }}</h1>
                          <ul class="left-box-ul">
                            <li>
                              <div>
                                <b-icon icon="phone" size="is-small"> </b-icon>
                              </div>
                              <div>
                                <a
                                  v-if="partyPhone != 'Phone Number Not Set'"
                                  :href="`tel:${partyPhone}`"
                                  >{{ partyPhone }}</a
                                >
                                <p v-else>{{ partyPhone }}</p>
                              </div>
                            </li>
                            <li>
                              <div>
                                <b-icon icon="email" size="is-small"> </b-icon>
                              </div>
                              <div>
                                <a
                                  v-if="partyEmail != 'Email Not Set'"
                                  :href="`mailto:${partyEmail}`"
                                  >{{ partyEmail }}</a
                                >
                                <p v-else>{{ partyEmail }}</p>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="column">
                    <div class="right-box column is-12-mobile">
                      <h1
                        :class="
                          this.partyCondition === 'To Receive'
                            ? 'color-green'
                            : this.partyCondition === 'To Pay'
                            ? 'color-red'
                            : 'color-black'
                        "
                      >
                        Rs. {{ partyAmount }}
                      </h1>
                      <ul class="right-box-ul">
                        <li
                          :class="
                            this.partyCondition === 'To Receive'
                              ? 'color-green'
                              : this.partyCondition === 'To Pay'
                              ? 'color-red'
                              : 'color-black'
                          "
                        >
                          {{ this.condtionText }}
                        </li>
                        <li>
                          <div>
                            <b-icon icon="map-marker" size="is-small"> </b-icon>
                          </div>
                          <div>{{ partyAddress }}</div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div class="box-bot">
                <b-button
                  @click="shareLink"
                  icon-left="share-variant"
                  type="is-secondary-outline"
                  >Share</b-button
                >
                <div class="buttons">
                  <b-button @click="editParty(partyId)" type="is-primary"
                    >Edit</b-button
                  >
                  <b-button
                    v-if="
                      globalHelper('deletePartiesCustomer') ||
                      globalHelper('deletePartiesSupplier')
                    "
                    @click="deleteItem(partyId)"
                    type="is-danger"
                    >Delete</b-button
                  >
                </div>
              </div>
            </article>
          </div>
          <card-component-parties
            class="has-table has-mobile-sort-spaced"
            title="User Transactions"
            @filterDate="filterDate"
            @filterType="filterType"
            ref="updateFilterName"
          >
            <parties-table
              :partyId="partyId"
              :partyAmount="partyAmount"
              :filterDate="dateFilter"
              :filterType="typeFilter"
              @updateFilter="updateFilter"
              @updateAmount="updateAmount"
              ref="reset"
            />
          </card-component-parties>
        </div>
      </div>
    </section>
    <section v-if="!lists.length">
      <template v-if="loading">
        <div class="tile is-ancestor">
          <div class="tile is-parent parties-left-box">
            <article class="tile is-child notification is-white">
              <b-skeleton height="40px"></b-skeleton>
              <div class="content" style="margin-top: 2rem">
                <ul
                  style="list-style: none; margin-left: 0"
                  class="parties-list"
                >
                  <li>
                    <b-skeleton height="60px"></b-skeleton>
                  </li>
                  <li>
                    <b-skeleton height="60px"></b-skeleton>
                  </li>
                  <li>
                    <b-skeleton height="60px"></b-skeleton>
                  </li>
                </ul>
              </div>
            </article>
          </div>
          <div class="tile is-vertical is-8 party-detail">
            <div class="tile is-parent">
              <article class="tile is-child notification is-white">
                <div class="box-top" style="height: 4rem">
                  <div class="columns">
                    <div class="column">
                      <div class="left-box column is-12-mobile">
                        <ul class="left-box-ul">
                          <b-skeleton width="50%"></b-skeleton>
                          <b-skeleton width="50%"></b-skeleton>
                          <b-skeleton width="50%"></b-skeleton>
                        </ul>
                      </div>
                    </div>
                    <div class="column">
                      <div class="right-box column is-12-mobile">
                        <ul class="right-box-ul" style="margin-left: 50%">
                          <b-skeleton></b-skeleton>
                          <b-skeleton></b-skeleton>
                          <b-skeleton></b-skeleton>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                <div style="margin-top: 6rem">
                  <b-skeleton height="50px"></b-skeleton>
                  <b-skeleton height="50px"></b-skeleton>
                  <b-skeleton height="50px"></b-skeleton>
                </div>
              </article>
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="emptyPage">
          <img src="@/img/Cash Payment-rafiki.png" alt="Empty Page Image" />
          <p>Start by creating your first party</p>
        </div>
      </template>
    </section>
  </div>
</template>
<script>
import axios from "axios";
import NepaliDate from "nepali-date-converter";
import { mapState } from "vuex";
import SubtitleBar from "@/components/SubtitleBar";
import TitleBar from "@/components/TitleBar";
import PartiesTable from "@/components/PartiesTable";
import PartyModal from "@/components/PartyModal";
import PartyModalEdit from "@/components/PartyModalEdit";
import CardComponentParties from "@/components/CardComponentParties";
import DeleteParty from "@/components/DeleteParty";
import PaymentOutModal from "@/components/PaymentOutModal";
import PaymentInModal from "@/components/PaymentInModal";
import ShareModal from "@/components/ShareModal.vue";
export default {
  middleware: "auth-business",
  components: {
    TitleBar,
    SubtitleBar,
    PartiesTable,
    PartyModal,
    CardComponentParties,
    PartyModalEdit,
    DeleteParty,
    PaymentOutModal,
    PaymentInModal,
    ShareModal,
  },
  data() {
    return {
      isModalActive: false,
      isModalActive2: false,
      isModalActive3: false,
      isModalActivePin: false,
      isModalActivePout: false,
      isModalActiveShare: false,
      loading: true,
      posts: [],
      lists: [],
      activeIndex: null,
      searchQuery: "",
      party: {
        name: "",
        phone_number: "",
        opening_balance: "",
        address: "",
        email: "",
        pan_vat_number: "",
        user: this.$auth.user.id,
      },
      partyPin: {},
      partyPout: {},
      partyImage: "",
      share_code: "",
      dateNepali: "",
      partyId: null,
      dateFilter: "",
      typeFilter: "",
      partyName: "",
      partyEmail: "",
      partyPhone: "",
      partyAddress: "",
      partyAmount: "",
      partyCondition: "",
      condtionText: "",
      next: "",
      throttlePause: false,
    };
  },
  async mounted() {
    if (localStorage.getItem("openModal")) {
      this.isModalActive = true;
    }
    localStorage.removeItem("openModal");
    localStorage.removeItem("from_parties");
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
          image: element.image,
          type_value: element.type_value,
          amount:
            element.amount < 0
              ? this.conversion(-element.amount)
              : element.amount > 0
              ? this.conversion(element.amount)
              : this.conversion(element.amount),
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
          opening_date: element.opening_date,
        });
      });
      this.posts = list;
      this.lists = list;
      this.activeIndex = this.posts[0].id;
      this.partyImage = this.posts[0].image;
      this.partyName = this.posts[0].name;
      this.partyEmail = this.posts[0].email;
      this.partyPhone = this.posts[0].phone_number;
      this.partyAddress = this.posts[0].address;
      this.partyAmount = this.posts[0].amount;
      this.partyCondition = this.posts[0].condition;
      this.partyId = this.posts[0].id;
      let date1 = new Date(this.posts[0].opening_date);
      this.dateNepali = new NepaliDate(date1).format("YYYY-MM-DD");
      this.condtionText =
        this.posts[0].condition == "To Receive"
          ? "Receivable"
          : this.posts[0].condition == "To Pay"
          ? "Payable"
          : "Settled";
    } catch (err) {}
    this.loading = false;
  },
  computed: {
    titleSub() {
      return ["Items"];
    },
    ...mapState(["pageModal", "pageModalOpen"]),
    modalChange() {
      if (this.pageModal) {
        this.isModalActive = true;
        // this.$store.commit("toggleModal");
      } else {
        this.isModalActive = false;
      }
    },
  },
  methods: {
    createTransaction(name, id) {
      localStorage.setItem("party_details", JSON.stringify([name, id]));
      localStorage.setItem("from_parties", true);
    },
    searchParties(event) {
      if (event.key == "Enter" || !event.target.value) {
        this.reset();
      }
    },
    onScroll() {
      let apiCall = async () => {
        if (
          Math.ceil(this.$refs.scroll.scrollTop) +
            this.$refs.scroll.clientHeight +
            1 >=
            this.$refs.scroll.scrollHeight &&
          this.next
        ) {
          let list = [];
          try {
            let response = await axios.get(this.next, {
              headers: {
                Authorization: localStorage.getItem("auth._token.local"),
              },
            });
            this.next = response.data.next;
            response.data.results.forEach((element) => {
              list.push({
                name: element.name,
                image: element.image,
                type_value: element.type_value,
                amount:
                  element.amount < 0
                    ? this.conversion(-element.amount)
                    : element.amount > 0
                    ? this.conversion(element.amount)
                    : this.conversion(element.amount),
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
                opening_date: element.opening_date,
              });
            });
            this.posts.push(...list);
          } catch (error) {}
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
    async paymentModal(p) {
      if (this.lists.length) {
        const loadingComponent = this.$buefy.loading.open();
        let response = await axios.get(
          "/parties/parties/" + this.partyId + "/",
          {
            headers: {
              Authorization: localStorage.getItem("auth._token.local"),
            },
          }
        );
        if (p == "Payment In") {
          this.partyPin = response.data;
        } else {
          this.partyPout = response.data;
        }
        loadingComponent.close();
      } else {
        this.party = {
          name: "",
          phone_number: "",
          opening_balance: "",
          address: "",
          email: "",
          pan_vat_number: "",
          user: this.$auth.user.id,
        };
      }
      if (p == "Payment In") {
        this.isModalActivePin = true;
        this.$refs.parties1.modalActivate();
      } else {
        this.isModalActivePout = true;
        this.$refs.parties2.modalActivate();
      }
    },
    async updateAmount() {
      try {
        this.reset();
      } catch (err) {}
    },
    filterDate(filterDate) {
      this.dateFilter = filterDate;
    },
    filterType(filterType) {
      this.typeFilter = filterType;
    },
    trashModal() {
      this.isModalActive = true;
    },
    confirmAdd(post) {
      this.posts.unshift({
        name: post.name,
        image: post.image,
        type_value: post.type_value,
        amount:
          post.amount < 0
            ? this.conversion(-post.amount)
            : post.amount > 0
            ? this.conversion(post.amount)
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
        opening_date: post.opening_date,
      });
      this.lists = this.posts;
      this.activeIndex = this.posts[0].id;
      this.partyImage = this.posts[0].image;
      this.partyName = this.posts[0].name;
      this.partyEmail = this.posts[0].email;
      this.partyPhone = this.posts[0].phone_number;
      this.partyAddress = this.posts[0].address;
      this.partyAmount = this.posts[0].amount;
      this.partyCondition = this.posts[0].condition;
      this.partyId = this.posts[0].id;
      let date1 = new Date(this.posts[0].opening_date);
      this.dateNepali = new NepaliDate(date1).format("YYYY-MM-DD");
      this.condtionText =
        this.posts[0].condition == "To Receive"
          ? "Receivable"
          : this.posts[0].condition == "To Pay"
          ? "Payable"
          : "Settled";
      this.$buefy.snackbar.open({
        message: "Party was added successfully",
        type: "is-primary",
        position: "is-bottom",
        indefinite: false,
      });
      if (this.$refs.reset) {
        this.$refs.reset.reset();
      }
      this.isModalActive = true;
    },
    trashConfirm(post) {
      this.posts.unshift({
        name: post.name,
        image: post.image,
        type_value: post.type_value,
        amount:
          post.amount < 0
            ? this.conversion(-post.amount)
            : post.amount > 0
            ? this.conversion(post.amount)
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
        opening_date: post.opening_date,
      });
      this.lists = this.posts;
      this.activeIndex = this.posts[0].id;
      this.partyImage = this.posts[0].image;
      this.partyName = this.posts[0].name;
      this.partyEmail = this.posts[0].email;
      this.partyPhone = this.posts[0].phone_number;
      this.partyAddress = this.posts[0].address;
      this.partyAmount = this.posts[0].amount;
      this.partyCondition = this.posts[0].condition;
      this.partyId = this.posts[0].id;
      let date1 = new Date(this.posts[0].opening_date);
      this.dateNepali = new NepaliDate(date1).format("YYYY-MM-DD");
      this.condtionText =
        this.posts[0].condition == "To Receive"
          ? "Receivable"
          : this.posts[0].condition == "To Pay"
          ? "Payable"
          : "Settled";
      this.$buefy.snackbar.open({
        message: "Party was added successfully",
        type: "is-primary",
        position: "is-bottom",
        indefinite: false,
      });
      if (this.$refs.reset) {
        this.$refs.reset.reset();
      }
      this.isModalActive = false;
    },
    async shareLink() {
      this.isModalActiveShare = true;
      try {
        let response = await this.$axios.post(
          "/parties/view/" + "?party=" + this.partyId,
          {
            headers: {
              Authorization: localStorage.getItem("auth._token.local"),
            },
          }
        );
        this.share_code = response.data.share_code;
      } catch (error) {}
    },
    trashConfirmShare() {
      this.isModalActiveShare = false;
    },
    trashCancel() {
      this.isModalActive = false;
      this.isModalActivePin = false;
      this.isModalActivePout = false;
      this.isModalActiveShare = false;
      this.$store.commit("modalClose");
    },
    trashConfirm2(post) {
      this.isModalActive2 = false;
      const id = post.id;
      post.condition =
        post.amount > 0
          ? "To Receive"
          : post.amount == 0
          ? "Settled"
          : "To Pay";
      (post.amount =
        post.amount < 0
          ? this.conversion(-post.amount)
          : post.amount > 0
          ? this.conversion(post.amount)
          : this.conversion(post.amount)),
        (post.email =
          post.email === "" || post.email === null
            ? "Email Not Set"
            : post.email);
      post.phone_number =
        post.phone_number === "" || post.phone_number === null
          ? "Phone Number Not Set"
          : post.phone_number;
      post.address =
        post.address === "" || post.address === null
          ? "Address Not Set"
          : post.address;
      const index = this.posts.findIndex((data) => data.id == id);
      this.posts.splice(index, 1, post);
      this.lists.splice(index, 1, post);
      this.partyName = post.name;
      this.partyImage = post.image;
      this.partyEmail = post.email;
      this.partyPhone = post.phone_number;
      this.partyAddress = post.address;
      this.partyAmount = post.amount;
      this.partyCondition = post.condition;
      this.partyId = post.id;
      this.condtionText =
        post.condition == "To Receive"
          ? "Receivable"
          : post.condition == "To Pay"
          ? "Payable"
          : "Settled";
      this.$refs.reset.reset();
    },
    trashConfirmPin(data) {
      this.isModalActivePin = false;
      this.$buefy.snackbar.open({
        message: "Payment In was added successfully",
        type: "is-primary",
        position: "is-bottom",
        indefinite: false,
      });
      this.$refs.reset.reset();
      this.reset();
    },
    trashConfirmPout() {
      this.isModalActivePout = false;
      this.$buefy.snackbar.open({
        message: "Payment Out was added successfully",
        type: "is-primary",
        position: "is-bottom",
        indefinite: false,
      });
      this.$refs.reset.reset();
      this.reset();
    },
    async addConfirmIn() {
      this.$buefy.snackbar.open({
        message: "Payment In was added successfully",
        type: "is-primary",
        position: "is-bottom",
        indefinite: false,
      });
      this.$refs.reset.reset();
      let response = await axios.get("/parties/parties/" + this.partyId + "/", {
        headers: {
          Authorization: localStorage.getItem("auth._token.local"),
        },
      });
      this.party = response.data;
      this.reset();
      this.isModalActivePin = true;
    },
    async addConfirmOut() {
      this.$buefy.snackbar.open({
        message: "Payment Out was added successfully",
        type: "is-primary",
        position: "is-bottom",
        indefinite: false,
      });
      this.$refs.reset.reset();
      let response = await axios.get("/parties/parties/" + this.partyId + "/", {
        headers: {
          Authorization: localStorage.getItem("auth._token.local"),
        },
      });
      this.party = response.data;
      this.reset();
      this.isModalActivePout = true;
    },
    trashCancel2() {
      this.isModalActive2 = false;
    },
    async deleteConfirm() {
      const loadingComponent = this.$buefy.loading.open();
      try {
        await axios.delete(
          "/parties/parties/" +
            localStorage.getItem("deletePartyId") +
            "/?business=" +
            localStorage.getItem("business") +
            "&delete_confirm=yes",
          {
            headers: {
              Authorization: localStorage.getItem("auth._token.local"),
            },
          }
        );
        this.$buefy.snackbar.open({
          message: "Party was deleted successfully",
          type: "is-primary",
          position: "is-bottom",
          indefinite: false,
        });
        this.searchQuery = "";
        this.reset("delete");
        // const id = localStorage.getItem("deletePartyId");
        // const index = this.posts.findIndex((data) => data.id == id);
        // this.posts.splice(index, 1);
        // this.lists.splice(index, 1);
        // if (this.posts.length) {
        //   this.activeIndex = this.posts[0].id;
        //   this.partyName = this.posts[0].name;
        //   this.partyEmail = this.posts[0].email;
        //   this.partyPhone = this.posts[0].phone_number;
        //   this.partyAddress = this.posts[0].address;
        //   this.partyAmount = this.posts[0].amount;
        //   this.partyCondition = this.posts[0].condition;
        //   this.condtionText =
        //     this.posts[0].condition == "To Receive"
        //       ? "Receivable"
        //       : this.posts[0].condition == "To Pay"
        //       ? "Payable"
        //       : "Settled";
        //   this.partyId = this.posts[0].id;
        // } else {
        //   this.posts = this.lists;
        //   this.itemClick(this.lists[0]);
        // }
      } catch (err) {
        this.$buefy.snackbar.open({
          message: err.response.data.detail,
          type: "is-primary",
          position: "is-bottom",
          indefinite: false,
        });
      }
      loadingComponent.close();
      this.isModalActive3 = false;
    },
    deleteCancel() {
      this.isModalActive3 = false;
    },
    async reset(value) {
      let list = [];
      try {
        let response = await axios.get(
          "/parties/parties/?business=" +
            localStorage.getItem("business") +
            "&search=" +
            this.searchQuery,
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
            image: element.image,
            type_value: element.type_value,
            amount:
              element.amount < 0
                ? this.conversion(-element.amount)
                : element.amount > 0
                ? this.conversion(element.amount)
                : this.conversion(element.amount),
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
            opening_date: element.opening_date,
          });
        });
        this.posts = list;
        if (value == "delete") {
          this.lists = this.posts;
          this.itemClick(this.posts[0]);
          return;
        }
        const index = this.posts.findIndex((data) => data.id == this.partyId);
        this.partyAmount = this.posts[index].amount;
        this.partyCondition = this.posts[index].condition;
        this.condtionText =
          this.posts[index].condition == "To Receive"
            ? "Receivable"
            : this.posts[index].condition == "To Pay"
            ? "Payable"
            : "Settled";
      } catch (err) {}
    },
    allFilter() {
      this.reset();
    },
    async customerFilter() {
      let list = [];
      try {
        let response = await axios.get(
          "/parties/parties/?business=" +
            localStorage.getItem("business") +
            "&type=customer",
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
            image: element.image,
            type_value: element.type_value,
            amount:
              element.amount < 0
                ? this.conversion(-element.amount)
                : element.amount > 0
                ? this.conversion(element.amount)
                : this.conversion(element.amount),
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
            opening_date: element.opening_date,
          });
        });
      } catch (err) {}
      this.posts = list;
    },
    async supplierFilter() {
      let list = [];
      try {
        let response = await axios.get(
          "/parties/parties/?business=" +
            localStorage.getItem("business") +
            "&type=supplier",
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
            image: element.image,
            type_value: element.type_value,
            amount:
              element.amount < 0
                ? this.conversion(-element.amount)
                : element.amount > 0
                ? this.conversion(element.amount)
                : this.conversion(element.amount),
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
            opening_date: element.opening_date,
          });
        });
      } catch (err) {}
      this.posts = list;
    },
    deleteItem(id) {
      this.isModalActive3 = true;
      localStorage.setItem("deletePartyId", id);
    },
    updateFilter() {
      this.$refs.updateFilterName.updateFilter();
    },
    itemClick(post) {
      this.$refs.updateFilterName.updateFilter();
      this.typeFilter = "";
      this.activeIndex = post.id;
      this.partyImage = post.image;
      this.partyName = post.name;
      this.partyEmail = post.email;
      this.partyPhone = post.phone_number;
      this.partyAddress = post.address;
      this.partyAmount = post.amount;
      this.partyCondition = post.condition;
      this.partyId = post.id;
      let date1 = new Date(post.opening_date);
      this.dateNepali = new NepaliDate(date1).format("YYYY-MM-DD");
      this.condtionText =
        post.condition == "To Receive"
          ? "Receivable"
          : post.condition == "To Pay"
          ? "Payable"
          : "Settled";
    },
    async editParty(id) {
      this.isModalActive2 = true;
      const loadingComponent = this.$buefy.loading.open();
      localStorage.setItem("partyId", id);
      let response = await axios.get("/parties/parties/" + id + "/", {
        headers: {
          Authorization: localStorage.getItem("auth._token.local"),
        },
      });
      this.party = response.data;
      this.party.opening_balance_value = Number(response.data.opening_balance);
      this.party.opening_balance = Math.abs(response.data.opening_balance);
      let date1 = new Date(response.data.opening_date);
      (this.party.nepdate_string = new NepaliDate(date1).format("YYYY-MM-DD")),
        loadingComponent.close();
    },
    theAction(key) {
      if (localStorage.getItem("business")) {
        let i = 0;

        this.$auth.user.businesses.forEach((element, index) => {
          if (
            element.business == JSON.parse(localStorage.getItem("business"))
          ) {
            i = index;
          }
        });
        let business = this.$auth.user.businesses[i];
        if (business.own_business == true) {
          if (business.package != "2") {
            window.location.assign("/upgradePlan");
            return;
          }
          if (business.expired == true) {
            this.$router.push("/subscription");
            return;
          }
        } else {
          if (business.expired == true) {
            this.$router.push("/renewSubscription");
            return;
          }
        }
      }
      let permissions = {
        admin: {
          s: true,
          p: true,
          i: true,
          o: true,
          c: true,
          d: true,
          q: true,
          x: true,
          m: true,
          n: true,
          sd: true,
          sp: true,
          si: true,
          sx: true,
          ss: true,
          sr: true,
          sh: true,
          sk: true,
        },
        "business-partner": {
          s: true,
          p: true,
          i: true,
          o: true,
          c: true,
          d: true,
          q: true,
          x: true,
          m: true,
          n: true,
          sd: true,
          sp: true,
          si: true,
          sx: true,
          ss: true,
          sr: true,
          sh: true,
          sk: true,
        },
        "sales-person": {
          s: true,
          p: false,
          i: true,
          o: false,
          c: true,
          d: false,
          q: true,
          x: true,
          m: false,
          n: true,
          sd: true,
          sp: true,
          si: true,
          sx: true,
          ss: true,
          sr: true,
          sh: true,
          sk: true,
        },
        "inventory-manager": {
          s: false,
          p: true,
          i: false,
          o: true,
          c: false,
          d: true,
          q: false,
          x: true,
          m: true,
          n: true,
          sd: true,
          sp: true,
          si: true,
          sx: true,
          ss: true,
          sr: true,
          sh: true,
          sk: true,
        },
        accountant: {
          s: false,
          p: false,
          i: false,
          o: false,
          c: false,
          d: false,
          q: false,
          x: false,
          m: false,
          n: false,
          sd: true,
          sp: false,
          si: false,
          sx: false,
          ss: true,
          sr: true,
          sh: true,
          sk: true,
        },
      };
      let role = localStorage.getItem("role");
      if (!permissions[role][key]) {
        this.$buefy.snackbar.open({
          message: "You can't perform this action as " + role,
          type: "is-primary",
          position: "is-bottom",
          indefinite: false,
        });
        return;
      }
      this.$emit("actionKeyClose");
      this.$store.commit("toggleModal");
    },
  },
  head() {
    return {
      title: "All Parties - Karobar",
    };
  },
};
</script>
<style lang="scss" scoped>
.emptyPage {
  width: 40%;
  margin: auto;
  padding-top: 3rem;
  text-align: center;
  img {
    width: 100%;
    padding-bottom: 1rem;
  }
}
</style>