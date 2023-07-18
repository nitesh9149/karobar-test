<template>
  <div class="card stock-card card-margin">
    <stock-modal-add
      :is-active="isModalActive"
      @confirm="trashConfirm"
      @cancel="trashCancel"
      :modalItemId="itemIdAdd"
      :itemUnit="itemUnit"
      :currentStock="currentStock"
    />
    <stock-modal-reduce
      :is-active="isModalActive2"
      @confirm="trashConfirm2"
      @cancel="trashCancel2"
      :modalItemId="itemIdReduce"
      :itemUnit="itemUnit"
      :currentStock="currentStock"
    />
    <header class="card-header">
      <p class="card-header-title">
        {{ title }}
      </p>
      <div v-if="stockButtons" class="box-buttons">
        <div v-if="globalHelper('createAdjustment')" class="buttons">
          <b-button @click="addStock" type="is-primary">ADD STOCK</b-button>
          <b-button @click="reduceStock" type="is-danger"
            >REDUCE STOCK</b-button
          >
        </div>
      </div>
    </header>
    <div class="card-content">
      <slot />
    </div>
  </div>
</template>

<script>
import StockModalAdd from "@/components/StockModalAdd";
import StockModalReduce from "@/components/StockModalReduce";
export default {
  name: "CardComponent",
  components: { StockModalAdd, StockModalReduce },
  props: {
    title: {
      type: String,
      default: null,
    },
    icon: {
      type: String,
      default: null,
    },
    headerIcon: {
      type: String,
      default: null,
    },
    itemIdProp: {
      type: Number,
    },
    itemUnit: {
      type: String,
    },
    currentStock: {
      type: Number,
    },
    stockButtons: {
      type: Boolean,
    },
  },
  // watch:{
  //   currentStock
  // },
  data() {
    return {
      isModalActive: false,
      isModalActive2: false,
      isScrollable: false,
      maxHeight: 200,
      itemIdAdd: 0,
      itemIdReduce: 0,
      currentMenu1: { text: "Filter by Date" },
      menus1: [
        { text: "All Time" },
        { text: "Today" },
        { text: "Yesterday" },
        { text: "This Week" },
        { text: "This Month" },
        { text: "This Year" },
      ],
      menusFix: [
        { text: "All Time" },
        { text: "Today" },
        { text: "Yesterday" },
        { text: "This Week" },
        { text: "This Month" },
        { text: "This Year" },
      ],
      currentMenu: { text: "All Transaction" },
      menus: [{ text: "Daily" }, { text: "Weekly" }, { text: "Monthly" }],
    };
  },
  methods: {
    headerIconClick() {
      this.$emit("header-icon-click");
    },
    filterByDate(menu) {
      this.$emit("filterDate", menu.text);
    },
    updateFilter() {
      this.currentMenu1.text = "Filter by Date";
      let list = [];
      this.menusFix.forEach((e) => {
        list.push({
          text: e.text,
        });
      });
      this.menus1 = list;
    },
    addStock() {
      this.itemIdAdd = this.itemIdProp;
      this.isModalActive = true;
    },
    trashConfirm(stock) {
      this.isModalActive = false;
      this.$emit("addStock", stock);
    },
    trashCancel() {
      this.isModalActive = false;
    },
    reduceStock() {
      this.itemIdReduce = this.itemIdProp;
      this.isModalActive2 = true;
    },
    trashConfirm2(stock) {
      this.isModalActive2 = false;
      this.$emit("reduceStock", stock);
    },
    trashCancel2() {
      this.isModalActive2 = false;
    },
  },
};
</script>
<style lang="scss">
$green: #34a77f;
.stock-card {
  .card-button {
    width: 8rem;
    display: flex;
    justify-content: space-between;
  }
  &.card-margin {
    margin: 0 0.75rem;
  }
  .box-buttons {
    padding: 0.5rem 0.75rem;
    .buttons {
      justify-content: flex-end;
      .button {
        width: 8rem;
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
</style>
