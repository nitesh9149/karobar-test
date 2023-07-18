<template>
  <div>
    <staff-modal
      :is-active="isModalActive"
      @confirm="trashConfirm"
      @cancel="trashCancel"
      @openModal="trashOpen"
    />
    <section class="section is-title-bar">
      <div class="level">
        <div class="level-left">
          <div class="level-item">
            <ul>
              <li>Manage Staffs</li>
            </ul>
          </div>
        </div>
        <div class="level-right">
          <div class="level-item">
            <div class="buttons is-right">
              <button
                v-if="globalHelper('addStaff')"
                @click="trashModal()"
                class="button is-primary"
              >
                <b-icon icon="plus" custom-size="default" />
                <span class="button-title">Add New Staff</span>
              </button>
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
        <staff-table ref="reset" />
      </card-component-staff>
    </section>
  </div>
</template>
<script>
// @ is an alias to /src
import TitleBar from "@/components/TitleBar";
import StaffTable from "@/components/StaffTable";
import CardComponentStaff from "@/components/CardComponentStaff";
import StaffModal from "@/components/StaffModal";
export default {
  layout: "settings",
  middleware: "auth-business",
  components: {
    TitleBar,
    StaffTable,
    CardComponentStaff,
    StaffModal,
  },
  data() {
    return {
      isModalActive: false,
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
    trashConfirm(a) {
      this.isModalActive = false;
      this.$refs.reset.reset();
      this.$buefy.snackbar.open({
        message: "Staff was added successfully",
        type: "is-primary",
        position: "is-bottom",
        indefinite: false,
      });
    },
    trashCancel() {
      this.isModalActive = false;
    },
    trashOpen() {
      this.isModalActive = true;
    },
  },
  head() {
    return {
      title: "Staff Settings - Karobar",
    };
  },
};
</script>
<style lang="scss">
$green: #3ab98d;
$black: #1f1f1f;
</style>
