<template>
  <div>
    <edit-category-item
      :is-active="isModalActiveEdit"
      @confirm="trashConfirmEdit"
      @cancel="trashCancelEdit"
      :post="itemPost"
    />
    <delete-category-item
      :is-active="isModalActive2"
      @confirm="deleteConfirm"
      @cancel="deleteCancel"
    />
    <section class="section is-title-bar">
      <div class="level">
        <div class="level-left">
          <div class="level-item">
            <ul>
              <li>Item Details</li>
            </ul>
          </div>
        </div>
        <div class="level-right">
          <div class="level-item">
            <div class="buttons is-right">
              <button
                v-if="globalHelper('createInventory')"
                @click="routeAddItem"
                class="button is-primary"
              >
                <b-icon icon="plus" custom-size="default" />
                <span class="button-title">Add New Item</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section v-if="lists.length" class="item-details section is-main-section">
      <div class="tile is-ancestor">
        <div class="tile is-parent expenses-left-box">
          <article class="tile is-child notification is-white">
            <b-field class="search-btn">
              <b-input
                placeholder="Search Items"
                type="search"
                icon="magnify"
                v-model="searchQuery"
                v-on:keyup.native="searchItems($event)"
              >
              </b-input>
            </b-field>
            <div class="subtitle">
              <p>All Items</p>
            </div>
            <div ref="scroll" v-on:scroll="onScroll" class="content">
              <ul class="category-list" v-for="post in clients" :key="post.id">
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
                <div class="box-title">
                  <h1>{{ itemDetails.name }}</h1>
                </div>
                <div
                  v-if="itemDetails.type_value == 'Product'"
                  class="box-content"
                >
                  <div class="columns">
                    <div class="column is-one-fifth">
                      <div class="left-box">
                        <p>Sale Price</p>
                        <h1>
                          {{ itemDetails.sale_price }}
                        </h1>
                      </div>
                    </div>
                    <div class="column is-one-fifth">
                      <div class="left-box">
                        <p>Purchase Price</p>
                        <h1>
                          {{ itemDetails.purchase_price }}
                        </h1>
                      </div>
                    </div>
                    <div class="column is-one-fifth">
                      <div class="left-box">
                        <p>Stock Quantity</p>
                        <h1>
                          {{ itemDetails.quantity }}
                          {{ itemDetails.primary_unit_value }}
                        </h1>
                      </div>
                    </div>
                    <div class="column is-one-fifth">
                      <div class="left-box">
                        <p>Stock Value</p>
                        <h1 v-if="itemDetails.stock_num == 0">
                          Rs. {{ itemDetails.stock_num }}
                        </h1>
                        <h1 v-else>
                          {{ itemDetails.stock_value }}
                        </h1>
                      </div>
                    </div>
                    <div class="column is-one-fifth">
                      <div class="left-box">
                        <p>Item Code</p>
                        <h1>{{ itemDetails.item_code }}</h1>
                      </div>
                    </div>
                  </div>
                  <div class="columns">
                    <div class="column is-one-fifth">
                      <div class="left-box">
                        <p>Location</p>
                        <h1>{{ itemDetails.location }}</h1>
                      </div>
                    </div>
                    <div class="column is-one-fifth">
                      <div class="left-box">
                        <p>Item Type</p>
                        <h1>{{ itemDetails.type_value }}</h1>
                      </div>
                    </div>
                    <div class="column is-one-fifth">
                      <div class="left-box">
                        <p>Category</p>
                        <h1>{{ itemDetails.category_value }}</h1>
                      </div>
                    </div>
                    <div class="column is-one-fifth">
                      <div class="left-box">
                        <p>S. Unit</p>
                        <h1>{{ itemDetails.secondary_unit_value }}</h1>
                      </div>
                    </div>
                    <div class="column is-one-fifth">
                      <div class="left-box">
                        <p>Remarks</p>
                        <h1>{{ itemDetails.remarks }}</h1>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  v-if="itemDetails.type_value == 'Service'"
                  class="box-content"
                >
                  <div class="columns">
                    <div class="column is-one-fifth">
                      <div class="left-box">
                        <p>Sale Price</p>
                        <h1>
                          {{ itemDetails.sale_price }}
                        </h1>
                      </div>
                    </div>
                    <div class="column is-one-fifth">
                      <div class="left-box">
                        <p>Purchase Price</p>
                        <h1>
                          {{ itemDetails.purchase_price }}
                        </h1>
                      </div>
                    </div>
                    <div class="column is-one-fifth">
                      <div class="left-box">
                        <p>Item Type</p>
                        <h1>{{ itemDetails.type_value }}</h1>
                      </div>
                    </div>
                    <div class="column is-one-fifth">
                      <div class="left-box">
                        <p>Category</p>
                        <h1>{{ itemDetails.category_value }}</h1>
                      </div>
                    </div>
                    <div class="column is-one-fifth">
                      <div class="left-box">
                        <p>Remarks</p>
                        <h1>{{ itemDetails.remarks }}</h1>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="box-bot">
                <div class="buttons">
                  <b-button
                    v-if="globalHelper('editInventory')"
                    @click="trashModalEdit(itemId)"
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
            </article>
          </div>
          <card-component-stock
            v-if="itemDetails.type_value == 'Product'"
            class="has-table has-mobile-sort-spaced"
            title="Activity"
            @addStock="addStock"
            @reduceStock="reduceStock"
            :itemIdProp="itemId"
            :itemUnit="itemUnit"
            :currentStock="currentStock"
            :stockButtons="true"
          >
            <stock-table
              :itemId="itemId"
              :addStock="add_Stock"
              @addStock="addStock"
              :reduceStock="reduce_Stock"
            />
          </card-component-stock>
          <card-component-stock
            v-if="itemDetails.type_value == 'Service'"
            class="has-table has-mobile-sort-spaced"
            title="Activity"
            :stockButtons="false"
            :itemIdProp="itemId"
          >
            <stock-table
              :itemId="itemId"
              :addStock="add_Stock"
              @addStock="addStock"
              :reduceStock="reduce_Stock"
            />
          </card-component-stock>
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
    </section>
  </div>
</template>
<script>
import axios from "axios";
import NepaliDate from "nepali-date-converter";
import DeleteCategoryItem from "@/components/DeleteCategoryItem";
import EditCategoryItem from "@/components/EditCategoryItem";
import CardComponentStock from "@/components/CardComponentStock";
import StockTable from "@/components/StockTable";
export default {
  middleware: "auth-business",
  components: {
    DeleteCategoryItem,
    EditCategoryItem,
    CardComponentStock,
    StockTable,
  },
  data() {
    return {
      clients: [],
      lists: [],
      isModalActive2: false,
      isModalActiveEdit: false,
      activeIndex: null,
      searchQuery: "",
      loading: true,
      add_Stock: {},
      reduce_Stock: {},
      itemDetails: {},
      itemUnit: "",
      currentStock: 0,
      sale_price: 0,
      itemPost: {},
      itemId: 0,
      next: "",
    };
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
        date: element.as_of_date,
        category_value: element.category_value,
        id: element.id,
        quantity: this.conversion(element.quantity),
        sale_price_num: element.sale_price,
        purchase_price_num: element.purchase_price,
        sale_price: "Rs." + " " + this.conversion(element.sale_price),
        purchase_price: "Rs." + " " + this.conversion(element.purchase_price),
        type_value: element.type_value,
        primary_unit_value: element.primary_unit_value,
        secondary_unit_value:
          element.secondary_unit_value == "" ||
          element.secondary_unit_value == null
            ? "-"
            : element.secondary_unit_value,
        stock_num: Number(element.quantity * element.purchase_price),
        stock_value:
          "Rs." +
          " " +
          this.conversion(element.quantity * element.purchase_price),
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
      });
    });
    this.clients = list;
    this.lists = list;
    if (!list.length) {
      this.$router.push("/items");
      return;
    }
    var item = JSON.parse(localStorage.getItem("item"));
    let id = item.id;
    let res = await axios.get(
      "/inventory/items/" +
        id +
        "/?business=" +
        localStorage.getItem("business") +
        "&user=" +
        this.$auth.user.id,
      {
        headers: {
          Authorization: localStorage.getItem("auth._token.local"),
        },
      }
    );
    let obj = {
      name: res.data.name,
      date: res.data.as_of_date,
      category_value: res.data.category_value,
      id: res.data.id,
      quantity: this.conversion(res.data.quantity),
      sale_price_num: res.data.sale_price,
      purchase_price_num: res.data.purchase_price,
      sale_price: "Rs." + " " + this.conversion(res.data.sale_price),
      purchase_price: "Rs." + " " + this.conversion(res.data.purchase_price),
      type_value: res.data.type_value,
      primary_unit_value: res.data.primary_unit_value,
      secondary_unit_value:
        res.data.secondary_unit_value == "" ||
        res.data.secondary_unit_value == null
          ? "-"
          : res.data.secondary_unit_value,
      stock_num: Number(res.data.quantity * res.data.purchase_price),
      stock_value:
        "Rs." +
        " " +
        this.conversion(res.data.quantity * res.data.purchase_price),
      item_code:
        res.data.item_code == "" || res.data.item_code == null
          ? "-"
          : res.data.item_code,
      location:
        res.data.location == "" || res.data.location == null
          ? "-"
          : res.data.location,
      remarks:
        res.data.remarks == "" || res.data.remarks == null
          ? "-"
          : res.data.remarks,
    };
    let date1 = new Date(obj.date);
    let datePass = new NepaliDate(date1).format("YYYY-MM-DD");
    this.$store.dispatch("dateTransfer", datePass);
    this.itemDetails = obj;
    this.itemUnit = obj.primary_unit_value;
    this.currentStock = Number(obj.quantity);
    this.itemId = obj.id;
    this.activeIndex = obj.id;
    this.loading = false;
  },
  methods: {
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
          let response = await axios.get(this.next, {
            headers: {
              Authorization: localStorage.getItem("auth._token.local"),
            },
          });
          this.next = response.data.next;
          response.data.results.forEach((element) => {
            list.push({
              name: element.name,
              date: element.as_of_date,
              category_value: element.category_value,
              id: element.id,
              quantity: this.conversion(element.quantity),
              sale_price_num: element.sale_price,
              purchase_price_num: element.purchase_price,
              sale_price: "Rs." + " " + this.conversion(element.sale_price),
              purchase_price:
                "Rs." + " " + this.conversion(element.purchase_price),
              type_value: element.type_value,
              primary_unit_value: element.primary_unit_value,
              secondary_unit_value:
                element.secondary_unit_value == "" ||
                element.secondary_unit_value == null
                  ? "-"
                  : element.secondary_unit_value,
              stock_num: Number(element.quantity * element.purchase_price),
              stock_value:
                "Rs." +
                " " +
                this.conversion(element.quantity * element.purchase_price),
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
            });
          });
          this.clients.push(...list);
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
    searchItems(event) {
      if (event.key == "Enter" || !event.target.value) {
        this.reset();
      }
    },
    async trashModalEdit(id) {
      this.$router.push("/editItems");
      localStorage.setItem("editItemId", id);
    },
    trashConfirmEdit(post) {
      let id = post.id;
      const index = this.clients.findIndex((data) => data.id == id);
      this.itemDetails.name = post.name;
      this.clients.splice(index, 1, post);
      this.lists.splice(index, 1, post);
      this.isModalActiveEdit = false;
    },
    async trashCancelEdit() {
      this.isModalActiveEdit = false;
    },
    deleteItem() {
      this.isModalActive2 = true;
    },
    async deleteConfirm() {
      this.loading = true;
      const loadingComponent = this.$buefy.loading.open();
      try {
        let response = await axios.delete(
          "/inventory/items/" + this.itemId + "/",
          {
            headers: {
              Authorization: localStorage.getItem("auth._token.local"),
            },
          }
        );
        this.$buefy.snackbar.open({
          message: "Item was deleted successfully",
          type: "is-primary",
          position: "is-bottom",
          indefinite: false,
        });
        this.searchQuery = "";
        this.reset("delete");
      } catch (err) {
        this.$buefy.snackbar.open({
          message: err.response.data.detail,
          type: "is-primary",
          position: "is-bottom",
          indefinite: false,
        });
      }
      loadingComponent.close();
      this.isModalActive2 = false;
      this.loading = false;
    },
    deleteCancel() {
      this.isModalActive2 = false;
    },
    itemClick(post) {
      let date1 = new Date(post.date);
      let datePass = new NepaliDate(date1).format("YYYY-MM-DD");
      this.$store.dispatch("dateTransfer", datePass);
      this.activeIndex = post.id;
      this.itemDetails = post;
      this.itemUnit = post.primary_unit_value;
      this.currentStock = Number(post.quantity);
      this.itemId = post.id;
      localStorage.setItem("item", JSON.stringify(post));
    },
    async addStock() {
      let res = await axios.get(
        "/inventory/items/" +
          this.itemId +
          "/" +
          "?business=" +
          localStorage.getItem("business"),
        {
          headers: {
            Authorization: localStorage.getItem("auth._token.local"),
          },
        }
      );
      let stock = res.data;
      this.add_Stock = stock;
      this.currentStock = Number(stock.quantity);
      this.itemDetails.quantity = this.currentStock;
      this.itemDetails.stock_value =
        "Rs." +
        " " +
        this.conversion(
          this.itemDetails.quantity * this.itemDetails.purchase_price_num
        );
      this.reset();
    },
    async reduceStock() {
      let res = await axios.get(
        "/inventory/items/" +
          this.itemId +
          "/" +
          "?business=" +
          localStorage.getItem("business"),
        {
          headers: {
            Authorization: localStorage.getItem("auth._token.local"),
          },
        }
      );
      let stock = res.data;
      this.reduce_Stock = stock;
      this.currentStock = Number(stock.quantity);
      this.itemDetails.quantity = this.currentStock;
      this.itemDetails.stock_value =
        "Rs." +
        " " +
        this.conversion(
          this.itemDetails.quantity * this.itemDetails.purchase_price_num
        );
      this.reset();
    },
    routeAddItem() {
      this.$router.push("/addItem");
      localStorage.removeItem("currentCategoryId");
    },
    async reset(value) {
      let list = [];
      let response = await axios.get(
        "/inventory/items/?business=" +
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
          date: element.as_of_date,
          category_value: element.category_value,
          id: element.id,
          quantity: this.conversion(element.quantity),
          sale_price_num: element.sale_price,
          purchase_price_num: element.purchase_price,
          sale_price: "Rs." + " " + this.conversion(element.sale_price),
          purchase_price: "Rs." + " " + this.conversion(element.purchase_price),
          type_value: element.type_value,
          primary_unit_value: element.primary_unit_value,
          secondary_unit_value:
            element.secondary_unit_value == "" ||
            element.secondary_unit_value == null
              ? "-"
              : element.secondary_unit_value,
          stock_num: Number(element.quantity * element.purchase_price),
          stock_value:
            "Rs." +
            " " +
            this.conversion(element.quantity * element.purchase_price),
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
        });
      });
      this.clients = list;
      if (value == "delete") {
        this.lists = this.clients;
        if (!this.lists.length) {
          this.$router.push("/items");
          return;
        }
        this.itemClick(this.clients[0]);
      }
    },
  },
  head() {
    return {
      title: "Item Details - Karobar",
    };
  },
};
</script>
<style lang="scss">
$green: #3ab98d;
$black: #1f1f1f;
.item-details {
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
    // height: 13rem;
    .box-title {
      padding: 15px;
      h1 {
        font-weight: 600;
        font-size: 18px;
      }
    }
    .box-content {
      padding: 0 15px 15px 15px;
      .left-box {
        p {
          font-size: 15px;
          color: #6e6e70;
        }
        h1 {
          color: #1b2121;
          padding-bottom: 7px;
          font-weight: 600;
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
        box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 6px -1px,
          rgba(0, 0, 0, 0.06) 0px 2px 4px -1px;
        &.is-primary {
          background-color: #34a77f;
          border-color: transparent;
          color: white;
          &:hover {
            background-color: $green;
          }
        }
        &.is-danger {
          background-color: #e54f6d;
        }
      }
    }
  }
}
.item-details.is-main-section {
  .expenses-left-box {
    .content {
      height: 39.8rem;
      overflow-y: auto;
      overflow-x: hidden;
    }
  }
}
.item-details .tile .content .category-list li .dropdown-menu {
  left: -6rem;
}
</style>