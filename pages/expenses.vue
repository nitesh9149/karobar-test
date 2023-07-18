<template>
  <div>
    <expense-modal
      :is-active="isModalActive"
      @confirm="trashConfirm"
      @cancel="trashCancel"
      @confirmAdd="confirmAdd"
      :categoryName="categoryName"
      :categoryId="categoryId"
      :categoryList="posts"
    />
    <expense-category-modal
      :is-active="isModalActive2"
      @confirm="trashConfirm2"
      @cancel="trashCancel2"
      :typeValue="typeValue"
    />
    <expense-category-modal-edit
      :is-active="isModalActiveEdit"
      @confirm="trashConfirmEdit"
      @cancel="trashCancelEdit"
      :posts="expense"
    />
    <delete-expense
      :is-active="isModalActive3"
      @confirm="deleteConfirm"
      @cancel="deleteCancel"
    />
    <span style="display: none">{{ modalChange }}</span>
    <button
      style="display: none"
      v-shortkey="['alt', 'x']"
      @shortkey="theAction('x')"
    ></button>
    <section class="section is-title-bar">
      <div class="level">
        <div class="level-left">
          <div class="level-item">
            <ul>
              <li>Expenses</li>
            </ul>
          </div>
        </div>
        <div class="level-right">
          <div class="level-item">
            <div v-if="globalHelper('createExpense')" class="buttons is-right">
              <button
                v-if="this.posts.length"
                @click="trashModal()"
                class="button is-primary"
              >
                <b-icon icon="plus" custom-size="default" />
                <span class="button-title">Add New Expense</span>
              </button>
              <button @click="trashModal2()" class="button is-light">
                <b-icon icon="plus" custom-size="default" />
                <span class="button-title">Add New Category</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section v-if="posts.length" class="expenses section is-main-section">
      <div class="tile is-ancestor">
        <div class="tile is-parent expenses-left-box">
          <article class="tile is-child notification is-white">
            <p class="title">All Categories</p>
            <div class="subtitle">
              <p>Name</p>
              <p>Total Amounts</p>
            </div>
            <div class="content">
              <ul class="category-list" v-for="post in posts" :key="post.id">
                <li
                  :class="{ active: activeIndex === post.id }"
                  @click="itemClick(post)"
                >
                  <div>
                    <p class="category-name">{{ post.name }}</p>
                  </div>
                  <div style="margin-left: auto">
                    <p class="amount">
                      Rs. {{ conversion(post.total_amount) }}
                    </p>
                  </div>
                  <b-dropdown aria-role="list">
                    <template #trigger>
                      <b-button type="is-primary" icon-right="dots-vertical" />
                    </template>

                    <b-dropdown-item
                      v-if="globalHelper('editExpense')"
                      @click="editExpense(post.id)"
                      aria-role="listitem"
                      >Edit</b-dropdown-item
                    >
                    <b-dropdown-item
                      v-if="globalHelper('deleteExpense')"
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
        <div class="tile is-vertical is-8 expense-detail">
          <div class="tile is-parent">
            <article class="tile is-child notification is-white">
              <div class="box-top">
                <div class="columns">
                  <div class="column">
                    <div class="left-box column is-12-mobile">
                      <h1>{{ categoryName }}</h1>
                    </div>
                  </div>
                  <div class="column">
                    <div class="right-box column is-12-mobile">
                      <h1>Rs. {{ conversion(categoryAmount) }}</h1>
                    </div>
                  </div>
                </div>
              </div>
              <div class="box-bot">
                <div class="buttons">
                  <b-button
                    v-if="globalHelper('editExpense')"
                    @click="editExpense(categoryId)"
                    type="is-primary"
                    >Edit</b-button
                  >
                  <b-button
                    v-if="globalHelper('deleteExpense')"
                    @click="deleteItem(categoryId)"
                    type="is-danger"
                    >Delete</b-button
                  >
                </div>
              </div>
            </article>
          </div>
          <card-component-expenses
            class="has-table has-mobile-sort-spaced"
            title="All Expenses"
            label="View Expense report"
            icon="account-multiple"
            :categoryName="categoryName"
            @filterDate="filterDate"
            ref="updateFilterName"
          >
            <expense-table
              :expensePost="expensePost"
              :filterDate="dateFilter"
              :categoryId="categoryId"
              @updateAmount="updateAmount"
              ref="reset"
            />
          </card-component-expenses>
        </div>
      </div>
    </section>
    <section v-if="!posts.length">
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
          <img src="@/img/Plain credit card-cuate.png" alt="Empty Page Image" />
          <p>Record your business expenses</p>
        </div>
      </template>
    </section>
  </div>
</template>
<script>
import axios from "axios";
import { mapState } from "vuex";
import SubtitleBar from "@/components/SubtitleBar";
import TitleBar from "@/components/TitleBar";
import ExpenseTable from "@/components/ExpenseTable";
import ExpenseModal from "@/components/ExpenseModal";
import ExpenseCategoryModal from "@/components/ExpenseCategoryModal";
import ExpenseCategoryModalEdit from "@/components/ExpenseCategoryModalEdit";
import CardComponentExpenses from "@/components/CardComponentExpenses";
import DeleteExpense from "@/components/DeleteExpense";
export default {
  name: "Home",
  middleware: "auth-business",
  components: {
    TitleBar,
    SubtitleBar,
    ExpenseTable,
    ExpenseModal,
    CardComponentExpenses,
    ExpenseCategoryModal,
    DeleteExpense,
    ExpenseCategoryModalEdit,
  },
  data() {
    return {
      keepFirst: false,
      openOnFocus: false,
      name: "",
      loading: true,
      selected: null,
      activeIndex: null,
      clearable: false,
      isModalActive: false,
      isModalActive2: false,
      isModalActive3: false,
      isModalActiveEdit: false,
      expensePost: {},
      typeValue: "expense",
      dateFilter: "",
      posts: [],
      expense: {},
      categoryName: "",
      categoryAmount: "",
      categoryId: 0,
    };
  },
  async mounted() {
    if (localStorage.getItem("openModal")) {
      this.isModalActive = true;
    }
    localStorage.removeItem("openModal");
    let list = [];
    try {
      let response = await axios.get(
        "/transactions/income-expense-category/?type=expense&business=" +
          localStorage.getItem("business"),
        {
          headers: {
            Authorization: localStorage.getItem("auth._token.local"),
          },
        }
      );
      response.data.forEach((element) => {
        list.push({
          name: element.name,
          type_value: element.type_value,
          total_amount: Math.abs(element.total_amount),
          id: element.id,
        });
      });
      this.posts = list;
      this.activeIndex = this.posts[0].id;
      this.categoryName = this.posts[0].name;
      this.categoryAmount = this.posts[0].total_amount;
      this.categoryId = this.posts[0].id;
    } catch (err) {}
    this.loading = false;
  },
  computed: {
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
    filterDate(filterDate) {
      this.dateFilter = filterDate;
    },
    async updateAmount(category) {
      const loadingComponent = this.$buefy.loading.open();
      try {
        let res = await axios.get(
          "/transactions/income-expense-category/" +
            this.categoryId +
            "?type=expense&business=" +
            localStorage.getItem("business"),
          {
            headers: {
              Authorization: localStorage.getItem("auth._token.local"),
            },
          }
        );
        const index2 = this.posts.findIndex(
          (data) => data.id == this.categoryId
        );

        this.posts[index2].total_amount = Math.abs(res.data.total_amount);
      } catch (err) {}
      try {
        let response = await axios.get(
          "/transactions/income-expense-category/" +
            category +
            "?type=expense&business=" +
            localStorage.getItem("business"),
          {
            headers: {
              Authorization: localStorage.getItem("auth._token.local"),
            },
          }
        );
        const index = this.posts.findIndex((data) => data.id == category);
        this.activeIndex = this.posts[index].id;
        this.posts[index].total_amount = Math.abs(response.data.total_amount);
        this.categoryAmount = Math.abs(response.data.total_amount);
        this.categoryName = this.posts[index].name;
        this.categoryId = this.posts[index].id;
      } catch (err) {}
      loadingComponent.close();
    },
    trashModal() {
      this.isModalActive = true;
    },
    async trashConfirm(post) {
      const loadingComponent = this.$buefy.loading.open();
      this.isModalActive = false;
      this.expensePost = post;
      try {
        let res = await axios.get(
          "/transactions/income-expense-category/" +
            this.categoryId +
            "?type=expense&business=" +
            localStorage.getItem("business"),
          {
            headers: {
              Authorization: localStorage.getItem("auth._token.local"),
            },
          }
        );
        const index2 = this.posts.findIndex(
          (data) => data.id == this.categoryId
        );

        this.posts[index2].total_amount = Math.abs(res.data.total_amount);
      } catch (err) {}
      let list = [];
      try {
        let response = await axios.get(
          "/transactions/income-expense-category/?type=expense&business=" +
            localStorage.getItem("business"),
          {
            headers: {
              Authorization: localStorage.getItem("auth._token.local"),
            },
          }
        );
        response.data.forEach((element) => {
          list.push({
            name: element.name,
            type_value: element.type_value,
            total_amount: Math.abs(element.total_amount),
            id: element.id,
          });
        });
        this.posts = list;
        const index = this.posts.findIndex(
          (data) => data.id == this.categoryId
        );
        this.activeIndex = this.posts[index].id;
        this.categoryName = this.posts[index].name;
        this.categoryAmount = this.posts[index].total_amount;
        this.categoryId = this.posts[index].id;
      } catch (err) {}
      this.$buefy.snackbar.open({
        message: "Expense was added successfully",
        type: "is-primary",
        position: "is-bottom",
        indefinite: false,
      });
      loadingComponent.close();
    },
    async confirmAdd(post) {
      const loadingComponent = this.$buefy.loading.open();
      this.isModalActive = false;
      this.expensePost = post;
      try {
        let res = await axios.get(
          "/transactions/income-expense-category/" +
            this.categoryId +
            "?type=expense&business=" +
            localStorage.getItem("business"),
          {
            headers: {
              Authorization: localStorage.getItem("auth._token.local"),
            },
          }
        );
        const index2 = this.posts.findIndex(
          (data) => data.id == this.categoryId
        );

        this.posts[index2].total_amount = Math.abs(res.data.total_amount);
      } catch (err) {}
      let list = [];
      try {
        let response = await axios.get(
          "/transactions/income-expense-category/?type=expense&business=" +
            localStorage.getItem("business"),
          {
            headers: {
              Authorization: localStorage.getItem("auth._token.local"),
            },
          }
        );
        response.data.forEach((element) => {
          list.push({
            name: element.name,
            type_value: element.type_value,
            total_amount: Math.abs(element.total_amount),
            id: element.id,
          });
        });
        this.posts = list;
        const index = this.posts.findIndex(
          (data) => data.id == this.categoryId
        );
        this.activeIndex = this.posts[index].id;
        this.categoryName = this.posts[index].name;
        this.categoryAmount = this.posts[index].total_amount;
        this.categoryId = this.posts[index].id;
      } catch (err) {}
      this.$buefy.snackbar.open({
        message: "Expense was added successfully",
        type: "is-primary",
        position: "is-bottom",
        indefinite: false,
      });
      this.isModalActive = true;
      loadingComponent.close();
    },
    trashCancel() {
      this.isModalActive = false;
      this.$store.commit("modalClose");
    },
    trashModal2() {
      this.isModalActive2 = true;
    },
    trashConfirm2(post) {
      this.posts.unshift({
        name: post.name,
        type_value: post.type_value,
        total_amount: Math.abs(post.total_amount),
        id: post.id,
      });
      this.$buefy.snackbar.open({
        message: "Category was added successfully",
        type: "is-primary",
        position: "is-bottom",
        indefinite: false,
      });
      this.activeIndex = post.id;
      this.categoryName = post.name;
      this.categoryAmount = post.total_amount;
      this.categoryId = post.id;
      this.isModalActive2 = false;
    },
    trashCancel2() {
      this.isModalActive2 = false;
    },
    async editExpense(id) {
      const loadingComponent = this.$buefy.loading.open();
      this.isModalActiveEdit = true;
      localStorage.setItem("expenseId", id);
      let response = await axios.get(
        "/transactions/income-expense-category/" + id + "/",
        {
          headers: {
            Authorization: localStorage.getItem("auth._token.local"),
          },
        }
      );
      this.expense = response.data;
      loadingComponent.close();
    },
    trashConfirmEdit(post) {
      let id = post.id;
      const index = this.posts.findIndex((data) => data.id == id);
      post.total_amount = Math.abs(post.total_amount);
      this.posts.splice(index, 1, post);
      this.categoryName = post.name;
      this.categoryAmount = Math.abs(post.total_amount);
      this.isModalActiveEdit = false;
      this.$refs.reset.reset();
    },
    trashCancelEdit() {
      this.isModalActiveEdit = false;
    },
    deleteItem() {
      this.isModalActive3 = true;
    },
    async deleteConfirm() {
      const loadingComponent = this.$buefy.loading.open();
      try {
        let response = await axios.delete(
          "/transactions/income-expense-category/" + this.categoryId + "/",
          {
            headers: {
              Authorization: localStorage.getItem("auth._token.local"),
            },
          }
        );
        this.$buefy.snackbar.open({
          message: "Category was deleted sucessfully",
          type: "is-primary",
          position: "is-bottom",
          indefinite: false,
        });
        const index = this.posts.findIndex(
          (data) => data.id == this.categoryId
        );
        this.posts.splice(index, 1);
        if (this.posts.length) {
          this.activeIndex = this.posts[0].id;
          this.categoryName = this.posts[0].name;
          this.categoryAmount = this.posts[0].total_amount;
          this.categoryId = this.posts[0].id;
        } else {
          this.activeIndex = "";
          this.categoryName = "";
          this.categoryAmount = "";
          this.categoryId = 0;
        }
      } catch (err) {
        this.$buefy.snackbar.open({
          message: err.response.data.detail,
          type: "is-primary",
          position: "is-bottom",
          indefinite: false,
        });
      }
      this.isModalActive3 = false;
      loadingComponent.close();
    },
    itemClick(post) {
      this.activeIndex = post.id;
      this.categoryName = post.name;
      this.categoryAmount = post.total_amount;
      this.categoryId = post.id;
      this.$refs.updateFilterName.updateFilter();
    },
    deleteCancel() {
      this.isModalActive3 = false;
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
      title: "Expenses - Karobar",
    };
  },
};
</script>
<style lang="scss">
$green: #3ab98d;
$black: #1f1f1f;
.dropdown-search {
  .dropdown-content {
    padding-bottom: 0;
    padding-top: 0;
  }
}
.expenses {
  .tile {
    &.notification {
      border-radius: 8px;
      padding: 0;
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
      .category-list {
        margin: 0;
        a {
          text-decoration: none;
          &:last-child {
            li {
              border-bottom: 0;
            }
          }
        }

        li {
          display: flex;
          justify-content: space-between;
          border-bottom: 1px solid #eaeaea;
          padding: 1.125rem 1.5rem;
          border-left: 3px solid white;
          position: relative;
          cursor: pointer;
          .button {
            background-color: transparent;
            color: #c6c8cc;
            box-shadow: none;
            position: absolute;
            left: -8px;
            top: -7px;
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
          p.category-name {
            font-size: 15px;
            margin-bottom: 0;
          }
          p.account-no {
            font-size: 12px;
            color: #6e6e70;
          }
          p.amount {
            font-size: 14px;
            padding-left: 20px;
            padding-right: 5px;
          }
        }
      }
    }
  }
  .tile {
    &.expense-detail {
      height: 12rem;
    }
  }
  .box-top {
    position: relative;
    color: #4a4a4a;
    padding: 5px;
    .left-box {
      h1 {
        color: #1b2121;
        padding-bottom: 7px;
        font-weight: 600;
      }
      .left-box-ul {
        li {
          display: flex;
          justify-content: start;
          padding-top: 4px;
          font-size: 14px;
          &.active {
            border-left: 3px solid #3ab98d;
            background-color: #e7f4ef;
          }
          div:first-child {
            padding-right: 12px;
          }
        }
      }
      input {
        height: 2em;

        &:focus {
          box-shadow: none;
          border-color: #b5b5b5;
        }
      }

      span {
        margin: 4px 0;
        color: #aaaaaa;
        font-size: 15px;
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
      .right-box-ul {
        li {
          display: flex;
          justify-content: flex-end;
          padding-top: 4px;
          font-size: 14px;
          div:first-child {
            padding-right: 10px;
          }
        }
      }
      .field {
        padding-top: 2.3rem;
      }
      .field.has-addons {
        justify-content: flex-end;
      }

      h1 {
        font-weight: 700;
        text-align: right;
        padding-bottom: 7px;
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
  .box-bot {
    border-top: 1px solid #eaeaea;
    padding: 0.5rem 0.75rem;
    .buttons {
      justify-content: flex-end;
      padding-bottom: 0.5rem;
      .button {
        width: 6rem;
        margin-bottom: 0;
        &.is-primary {
          background-color: $green;
        }
        &.is-danger {
          background-color: #e54f6d;
        }
      }
    }
  }
}
.expenses.is-main-section {
  .expenses-left-box {
    .content {
      height: 40.2rem;
      overflow-y: auto;
      overflow-x: hidden;
    }
  }
}
.expenses .tile .content .category-list li .dropdown-menu {
  left: -6rem;
}
@media screen and (max-width: 768px) {
  .expenses.is-main-section .expenses-left-box .content {
    height: auto;
  }
  .expenses .box-top {
    .columns {
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>
<style lang="scss" scoped>
.emptyPage {
  width: 20rem;
  margin: auto;
  padding-top: 3rem;
  text-align: center;
  img {
    width: 100%;
    padding-bottom: 1rem;
  }
}
</style>