<template>
  <div>
    <section class="section is-title-bar">
      <div class="level">
        <div class="level-left">
          <div class="level-item">
            <ul>
              <li>Manage Business</li>
            </ul>
          </div>
        </div>
        <div class="level-right">
          <div class="level-item">
            <div class="buttons is-right">
              <nuxt-link to="/addNewBusiness" class="button is-primary">
                <b-icon icon="plus" custom-size="default" />
                <span class="button-title">Add New Business</span>
              </nuxt-link>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="section is-main-section">
      <card-component-staff
        class="has-table has-mobile-sort-spaced"
        title="Clients"
        icon="account-multiple"
      >
        <business-table />
      </card-component-staff>
    </section>
  </div>
</template>
<script>
// @ is an alias to /src
import TitleBar from "@/components/TitleBar";
import BusinessTable from "@/components/BusinessTable";
import CardComponentStaff from "@/components/CardComponentStaff";
export default {
auth: false,
  components: {
    TitleBar,
    BusinessTable,
    CardComponentStaff,
  },
  data() {
    return {
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
  },
  head() {
    return {
      title: "Manage Business - Karobar",
    };
  },
};
</script>
<style lang="scss">
$green: #3ab98d;
$black: #1f1f1f;

</style>
