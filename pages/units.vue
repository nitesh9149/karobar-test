<template>
  <div>
    <category-modal-unit
      :is-active="isModalActive"
      @confirm="trashConfirm"
      @cancel="trashCancel"
    />
    <section class="section is-title-bar">
      <div class="level">
        <div class="level-left">
          <div class="level-item">
            <ul>
              <li>All Units</li>
            </ul>
          </div>
        </div>
        <div class="level-right">
          <div class="level-item">
            <div class="buttons is-right">
              <button v-if="globalHelper('createInventory')" @click="trashModal()" class="button is-primary">
                <b-icon icon="plus" custom-size="default" />
                <span class="button-title">Add New Unit</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="section is-main-section">
      <card-component-category-unit
        class="has-table has-mobile-sort-spaced"
        title="Clients"
        icon="account-multiple"
        @search="searchTransaction"
      >
        <category-table-unit
        :units="units"
        :searchTransaction="searchItem"
         />
      </card-component-category-unit>
    </section>
  </div>
</template>
<script>
// @ is an alias to /src
import TitleBar from "@/components/TitleBar";
import CategoryTableUnit from "@/components/CategoryTableUnit";
import CardComponentCategoryUnit from "@/components/CardComponentCategoryUnit";
import CategoryModalUnit from "@/components/CategoryModalUnit";
export default {
  name: "Home",
  middleware: "auth-business",
  components: {
    TitleBar,
    CategoryTableUnit,
    CardComponentCategoryUnit,
    CategoryModalUnit,
  },
  data() {
    return {
      isModalActive: false,
      units: {},
      searchItem:"",
    };
  },
  computed: {
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
    trashConfirm(units) {
      this.units = units
      this.isModalActive = false;
      this.$buefy.snackbar.open({
        message: "Unit was added successfully",
        type: "is-primary",
        position: "is-bottom",
        indefinite: false,
      });
    },
    trashCancel() {
      this.isModalActive = false;
    },
    searchTransaction(a){
       this.searchItem = a
     },
  },
  head() {
    return {
      title: "Units - Karobar",
    };
  },
};
</script>
<style lang="scss">
$green: #3ab98d;
$black: #1f1f1f;
</style>
