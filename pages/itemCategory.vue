<template>
  <div>
    <category-modal
      :is-active="isModalActive"
      @confirm="trashConfirm"
      @cancel="trashCancel"
    />
    <edit-category
      :is-active="isModalActiveEdit"
      @confirm="trashConfirmEdit"
      @cancel="trashCancelEdit"
      :post="categoryPost"
    />
    <delete-category
      :is-active="isModalActive2"
      @confirm="deleteConfirm"
      @cancel="deleteCancel"
    />
    <section class="section is-title-bar">
      <div class="level">
        <div class="level-left">
          <div class="level-item">
            <ul>
              <li>Item Categories</li>
            </ul>
          </div>
        </div>
        <div class="level-right">
          <div class="level-item">
            <div class="buttons is-right">
              <button
                v-if="globalHelper('createInventory')"
                @click="selectCategory"
                class="button is-primary"
              >
                <b-icon icon="plus" custom-size="default" />
                <span class="button-title">Add New Item</span>
              </button>
              <button
                v-if="globalHelper('createInventory')"
                @click="trashModal()"
                class="button is-primary"
              >
                <b-icon icon="plus" custom-size="default" />
                <span class="button-title">Add Category</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="categories section is-main-section">
      <div class="tile is-ancestor">
        <div class="tile is-parent expenses-left-box">
          <article class="tile is-child notification is-white">
            <b-field class="search-btn">
              <b-input
                placeholder="Search Categories"
                type="search"
                icon="magnify"
                v-model="searchQuery"
              >
              </b-input>
            </b-field>
            <div class="subtitle">
              <p>All Categories</p>
              <p>Total Items</p>
            </div>
            <div class="content">
              <ul
                class="category-list"
                v-for="post in resultQuery"
                :key="post.id"
              >
                <li
                  :class="{ active: activeIndex === post.id }"
                  @click="itemClick(post)"
                >
                  <div>
                    <p class="category-name">{{ post.name }}</p>
                  </div>
                  <div style="margin-left: auto">
                    <p class="amount">
                      {{ post.total_items }}
                    </p>
                  </div>
                  <b-dropdown aria-role="list">
                    <template #trigger>
                      <b-button type="is-primary" icon-right="dots-vertical" />
                    </template>

                    <b-dropdown-item
                      v-if="globalHelper('editInventory')"
                      @click="trashModalEdit(post.id)"
                      aria-role="listitem"
                      >Edit</b-dropdown-item
                    >
                    <b-dropdown-item
                      v-if="globalHelper('deleteInventory')"
                      @click="deleteItem()"
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
                      <div class="box-bot">
                        <div class="buttons">
                          <b-button
                            v-if="globalHelper('editInventory')"
                            @click="trashModalEdit(categoryId)"
                            type="is-primary"
                            >Edit</b-button
                          >
                          <b-button
                            v-if="globalHelper('deleteInventory')"
                            @click="deleteItem()"
                            type="is-danger"
                            >Delete</b-button
                          >
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          </div>
          <card-component-category
            class="has-table has-mobile-sort-spaced"
            title="Clients"
            icon="account-multiple"
          >
            <category-table :categoryId="categoryId" />
          </card-component-category>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
// @ is an alias to /src
import axios from "axios";
import TitleBar from "@/components/TitleBar";
import CategoryTable from "@/components/CategoryTable";
import CardComponentCategory from "@/components/CardComponentCategory";
import CategoryModal from "@/components/CategoryModal";
import DeleteCategory from "@/components/DeleteCategory";
import EditCategory from "@/components/EditCategory";
export default {
  name: "Home",
  middleware: "auth-business",
  components: {
    TitleBar,
    CategoryTable,
    CardComponentCategory,
    CategoryModal,
    DeleteCategory,
    EditCategory,
  },
  data() {
    return {
      isModalActive: false,
      isModalActive2: false,
      isModalActiveEdit: false,
      clients: [],
      activeIndex: null,
      searchFilter: [],
      categoryPost: {},
      searchQuery: "",
      categoryName: "",
      total_items: "",
      categoryId: 0,
    };
  },
  async mounted() {
    let list = [];
    let response = await axios.get(
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
    response.data.forEach((element) => {
      list.push({
        name: element.name,
        total_items: element.total_items,
        id: element.id,
      });
    });
    this.searchFilter = list;
    this.clients = list.reverse();
    this.activeIndex = this.clients[0].id;
    this.categoryName = this.clients[0].name;
    this.total_items = this.clients[0].total_items;
    this.categoryId = this.clients[0].id;
  },
  computed: {
    resultQuery() {
      if (this.searchQuery) {
        return this.clients.filter((item) => {
          return this.searchQuery
            .toLowerCase()
            .split(" ")
            .every((v) => item.name.toLowerCase().includes(v));
        });
      } else {
        return this.clients;
      }
    },
    titleStack() {
      return ["Item Categories"];
    },
    nuxtLink() {
      return ["Add Category"];
    },
    toLink() {
      return "#23";
    },
  },
  methods: {
    trashModal() {
      this.isModalActive = true;
    },
    trashCancel() {
      this.isModalActive = false;
    },
    trashConfirm(post) {
      this.categoryPost = post;
      this.clients.unshift({
        name: post.name,
        total_items: post.total_items,
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
      this.total_items = post.total_items;
      this.categoryId = post.id;
      this.isModalActive = false;
    },
    async trashModalEdit(id) {
      this.isModalActiveEdit = true;
      const loadingComponent = this.$buefy.loading.open();
      let response = await axios.get("/inventory/categories/" + id + "/", {
        headers: {
          Authorization: localStorage.getItem("auth._token.local"),
        },
      });
      this.categoryPost = response.data;
      loadingComponent.close();
    },
    trashConfirmEdit(post) {
      let id = post.id;
      const index = this.clients.findIndex((data) => data.id == id);
      this.clients.splice(index, 1, post);
      this.categoryName = post.name;
      this.total_items = post.total_items;
      this.isModalActiveEdit = false;
    },
    async trashCancelEdit() {
      this.isModalActiveEdit = false;
    },
    deleteItem() {
      this.isModalActive2 = true;
    },
    async deleteConfirm() {
      try {
        let response = await axios.delete(
          "/inventory/categories/" + this.categoryId + "/",
          {
            headers: {
              Authorization: localStorage.getItem("auth._token.local"),
            },
          }
        );
        this.$buefy.snackbar.open({
          message: "Category was deleted successfully",
          type: "is-primary",
          position: "is-bottom",
          indefinite: false,
        });
        const id = this.categoryId;
        const index = this.clients.findIndex((data) => data.id == id);
        this.clients.splice(index, 1);
        if (this.clients.length) {
          this.activeIndex = this.clients[0].id;
          this.categoryName = this.clients[0].name;
          this.total_items = this.clients[0].total_items;
          this.categoryId = this.clients[0].id;
        } else {
          this.activeIndex = "";
          this.categoryName = "";
          this.total_items = "";
          this.categoryId = "";
        }
      } catch (err) {
        this.$buefy.snackbar.open({
          message: err.response.data.detail,
          type: "is-primary",
          position: "is-bottom",
          indefinite: false,
        });
      }
      this.isModalActive2 = false;
    },
    deleteCancel() {
      this.isModalActive2 = false;
    },
    itemClick(post) {
      this.activeIndex = post.id;
      this.categoryName = post.name;
      this.categoryAmount = post.total_amount;
      this.categoryId = post.id;
    },
    selectCategory() {
      this.$router.push("/addItem");
      localStorage.setItem("currentCategoryId", this.categoryId);
    },
  },
  head() {
    return {
      title: "Item Categories - Karobar",
    };
  },
};
</script>
<style lang="scss">
$green: #3ab98d;
$black: #1f1f1f;
.categories {
  .search-btn {
    padding: 0.75rem;
    margin-bottom: 0;
    .control.has-icons-left .icon.is-left {
      left: -8px;
      top: -8px;
      font-size: 23px;
    }
  }
  .tile {
    &.notification {
      border-radius: 8px 8px 0 0;
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
      .tile.is-parent {
        padding-bottom: 0;
      }
    }
  }
  .box-top {
    position: relative;
    color: #4a4a4a;
    padding: 5px 15px;
    .left-box {
      margin-top: 0.35rem;
      h1 {
        color: #1b2121;
        font-weight: 600;
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
    .buttons {
      justify-content: flex-end;
      padding-bottom: 0.5rem;
      .button {
        width: 6rem;
        margin-bottom: 0;
        &.is-danger {
          background-color: #e54f6d;
        }
      }
    }
  }
}
.categories.is-main-section {
  .expenses-left-box {
    .content {
      height: 38.4rem;
      overflow-y: scroll;
      overflow-x: hidden;
    }
  }
}
.categories .tile .content .category-list li .dropdown-menu {
  left: -6rem;
}
@media screen and (max-width: 768px) {
  .categories.is-main-section .expenses-left-box .content {
    height: auto;
  }
  .categories .box-bot .buttons {
    justify-content: flex-start;
  }
}
</style>
