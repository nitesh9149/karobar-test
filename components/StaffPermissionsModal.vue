<template>
  <b-modal
    class="staff-permissions-modal"
    :active.sync="isModalActive"
    has-modal-card
    >{{ roleActive }}
    <div class="modal-card">
      <section class="modal-card-body">
        <b-button class="close-button" @click="cancel" type="is-light">
          <b-icon icon="close" size="is-small"> </b-icon
        ></b-button>
        <b-tabs v-model="activeTab">
          <b-tab-item label="Admin">
            <staff-permissions-table :data="data_admin" />
          </b-tab-item>
          <b-tab-item label="Business Partner">
            <staff-permissions-table :data="data_business_partner" />
          </b-tab-item>

          <b-tab-item label="Sales Person">
            <staff-permissions-table :data="data_sales_person" />
          </b-tab-item>

          <b-tab-item label="Inventory Manager">
            <staff-permissions-table :data="data_inventory_manager" />
          </b-tab-item>
          <b-tab-item label="Accountant">
            <staff-permissions-table :data="data_accountant" />
          </b-tab-item>
        </b-tabs>
      </section>
    </div>
  </b-modal>
</template>

<script>
import StaffPermissionsTable from "@/components/StaffPermissionsTable";
export default {
  name: "ModalBox",
  components: { StaffPermissionsTable },
  props: {
    isActive: {
      type: Boolean,
      default: false,
    },
    showAdd: {
      type: Boolean,
      default: true,
    },
    roleStatus: {
      type: String,
    },
  },
  data() {
    return {
      isModalActive: false,
      activeTab: 0,
      data_admin: [
        {
          title: "Sales",
          features: " - Sale Invoice, Estimate, Payment In & Sales Return",
          permissions: ["Create", "Edit", "View", "Delete"],
          condition: ["yes", "yes", "yes", "yes"],
        },
        {
          title: "Purchase",
          features: " - Purchase, Payment Out & Purchase Return",
          permissions: ["Create", "Edit", "View", "Delete"],
          condition: ["yes", "yes", "yes", "yes"],
        },
        {
          title: "Expenses & Income",
          features: "",
          permissions: ["Create", "Edit", "View", "Delete"],
          condition: ["yes", "yes", "yes", "yes"],
        },
        {
          title: "Parties",
          features: " - Customer",
          permissions: ["Create", "Edit", "View", "Delete"],
          condition: ["yes", "yes", "yes", "yes"],
        },
        {
          title: "Parties",
          features: " - Supplier",
          permissions: ["Create", "Edit", "View", "Delete"],
          condition: ["yes", "yes", "yes", "yes"],
        },
        {
          title: "Quick Billing",
          features: "",
          permissions: ["Create"],
          condition: ["yes"],
        },
        {
          title: "Bulk Item and Parties Import",
          features: "",
          permissions: ["Action"],
          condition: ["yes"],
        },
        {
          title: "Business Stats - All",
          features: "",
          permissions: ["View"],
          condition: ["yes"],
        },
        {
          title: "Current Business",
          features: "",
          permissions: ["Edit", "Delete"],
          condition: ["yes", "yes"],
        },
        {
          title: "Inventory",
          features: " - Items, Categories & Units",
          permissions: ["Create", "Edit", "View", "Delete"],
          condition: ["yes", "yes", "yes", "yes"],
        },

        {
          title: "Item Stock Adjustment",
          features: "",
          permissions: ["Create"],
          condition: ["yes"],
        },
        {
          title: "Manage Staffs",
          features: "",
          permissions: [
            "Add Staff",
            "Edit Staff",
            "Remove Staff",
            "View All Staff",
          ],
          condition: ["yes", "yes", "yes", "yes"],
        },
        {
          title: "Karobar Settings",
          features: "",
          permissions: [
            "App Settings",
            "Account Settings",
            "Business Settings",
            "Invoice Settings",
            "Delete Business",
          ],
          condition: ["yes", "yes", "yes", "yes", "yes"],
        },
        {
          title: "Reports",
          features: "",
          permissions: [
            "Transaction",
            "Party",
            "Item/Stock",
            "Expense",
            "Business Stats",
          ],
          condition: ["yes", "yes", "yes", "yes", "yes"],
        },
        {
          title: "Keyboard Shortcuts",
          features: "",
          permissions: ["All Shortcuts"],
          condition: ["yes"],
        },
        {
          title: "Cash In Hand",
          features: "",
          permissions: ["View", "Add/Reduce Cash", "Edit/Delete Cash"],
          condition: ["yes", "yes", "yes"],
        },
        {
          title: "Bank Balance",
          features: "",
          permissions: ["View", "Add/Reduce Money", "Edit/Delete Money"],
          condition: ["yes", "yes", "yes"],
        },
      ],
      data_business_partner: [
        {
          title: "Sales",
          features: " - Sale Invoice, Estimate, Payment In & Sales Return",
          permissions: ["Create", "Edit", "View", "Delete"],
          condition: ["yes", "yes", "yes", "yes"],
        },
        {
          title: "Purchase",
          features: " - Purchase, Payment Out & Purchase Return",
          permissions: ["Create", "Edit", "View", "Delete"],
          condition: ["yes", "yes", "yes", "yes"],
        },
        {
          title: "Expenses & Income",
          features: "",
          permissions: ["Create", "Edit", "View", "Delete"],
          condition: ["yes", "yes", "yes", "yes"],
        },
        {
          title: "Parties",
          features: " - Customer",
          permissions: ["Create", "Edit", "View", "Delete"],
          condition: ["yes", "yes", "yes", "yes"],
        },
        {
          title: "Parties",
          features: " - Supplier",
          permissions: ["Create", "Edit", "View", "Delete"],
          condition: ["yes", "yes", "yes", "yes"],
        },
        {
          title: "Quick Billing",
          features: "",
          permissions: ["Create"],
          condition: ["yes"],
        },
        {
          title: "Bulk Item and Parties Import",
          features: "",
          permissions: ["Action"],
          condition: ["yes"],
        },
        {
          title: "Business Stats - All",
          features: "",
          permissions: ["View"],
          condition: ["yes"],
        },
        {
          title: "Current Business",
          features: "",
          permissions: ["Edit", "Delete"],
          condition: ["yes", "no"],
        },
        {
          title: "Inventory",
          features: " - Items, Categories & Units",
          permissions: ["Create", "Edit", "View", "Delete"],
          condition: ["yes", "yes", "yes", "yes"],
        },

        {
          title: "Item Stock Adjustment",
          features: "",
          permissions: ["Create"],
          condition: ["yes"],
        },
        {
          title: "Manage Staffs",
          features: "",
          permissions: [
            "Add Staff",
            "Edit Staff",
            "Remove Staff",
            "View All Staff",
          ],
          condition: ["no", "no", "no", "yes"],
        },
        {
          title: "Karobar Settings",
          features: "",
          permissions: [
            "App Settings",
            "Account Settings",
            "Business Settings",
            "Invoice Settings",
            "Delete Business",
          ],
          condition: ["yes", "yes", "no", "yes", "no"],
        },
        {
          title: "Reports",
          features: "",
          permissions: [
            "Transaction",
            "Party",
            "Item/Stock",
            "Expense",
            "Business Stats",
          ],
          condition: ["yes", "yes", "yes", "yes", "yes"],
        },
        {
          title: "Keyboard Shortcuts",
          features: "",
          permissions: ["All Shortcuts"],
          condition: ["yes"],
        },
        {
          title: "Cash In Hand",
          features: "",
          permissions: ["View", "Add/Reduce Cash", "Edit/Delete Cash"],
          condition: ["yes", "yes", "yes"],
        },
        {
          title: "Bank Balance",
          features: "",
          permissions: ["View", "Add/Reduce Money", "Edit/Delete Money"],
          condition: ["yes", "yes", "yes"],
        },
      ],
      data_sales_person: [
        {
          title: "Sales",
          features: " - Sale Invoice, Estimate, Payment In & Sales Return",
          permissions: ["Create", "Edit", "View", "Delete"],
          condition: ["yes", "yes", "yes", "no"],
        },
        {
          title: "Purchase",
          features: " - Purchase, Payment Out & Purchase Return",
          permissions: ["Create", "Edit", "View", "Delete"],
          condition: ["no", "no", "no", "no"],
        },
        {
          title: "Expenses & Income",
          features: "",
          permissions: ["Create", "Edit", "View", "Delete"],
          condition: ["yes", "yes", "yes", "no"],
        },
        {
          title: "Parties",
          features: " - Customer",
          permissions: ["Create", "Edit", "View", "Delete"],
          condition: ["yes", "yes", "yes", "no"],
        },
        {
          title: "Parties",
          features: " - Supplier",
          permissions: ["Create", "Edit", "View", "Delete"],
          condition: ["no", "no", "no", "no"],
        },
        {
          title: "Quick Billing",
          features: "",
          permissions: ["Create"],
          condition: ["yes"],
        },
        {
          title: "Bulk Item and Parties Import",
          features: "",
          permissions: ["Action"],
          condition: ["no"],
        },
        {
          title: "Business Stats - All",
          features: "",
          permissions: ["View"],
          condition: ["no"],
        },
        {
          title: "Current Business",
          features: "",
          permissions: ["Edit", "Delete"],
          condition: ["no", "no"],
        },
        {
          title: "Inventory",
          features: " - Items, Categories & Units",
          permissions: ["Create", "Edit", "View", "Delete"],
          condition: ["no", "no", "yes", "no"],
        },

        {
          title: "Item Stock Adjustment",
          features: "",
          permissions: ["Create"],
          condition: ["no"],
        },
        {
          title: "Manage Staffs",
          features: "",
          permissions: [
            "Add Staff",
            "Edit Staff",
            "Remove Staff",
            "View All Staff",
          ],
          condition: ["no", "no", "no", "yes"],
        },
        {
          title: "Karobar Settings",
          features: "",
          permissions: [
            "App Settings",
            "Account Settings",
            "Business Settings",
            "Invoice Settings",
            "Delete Business",
          ],
          condition: ["yes", "yes", "no", "yes", "no"],
        },
        {
          title: "Reports",
          features: "",
          permissions: [
            "Transaction",
            "Party",
            "Item/Stock",
            "Expense",
            "Business Stats",
          ],
          condition: ["no", "only-Party-statement", "no", "no", "no"],
        },
        {
          title: "Keyboard Shortcuts",
          features: "",
          permissions: ["All Shortcuts"],
          condition: ["limited"],
        },
        {
          title: "Cash In Hand",
          features: "",
          permissions: ["View", "Add/Reduce Cash", "Edit/Delete Cash"],
          condition: ["no", "no", "no"],
        },
        {
          title: "Bank Balance",
          features: "",
          permissions: ["View", "Add/Reduce Money", "Edit/Delete Money"],
          condition: ["no", "no", "no"],
        },
      ],
      data_inventory_manager: [
        {
          title: "Sales",
          features: " - Sale Invoice, Estimate, Payment In & Sales Return",
          permissions: ["Create", "Edit", "View", "Delete"],
          condition: ["no", "no", "yes", "no"],
        },
        {
          title: "Purchase",
          features: " - Purchase, Payment Out & Purchase Return",
          permissions: ["Create", "Edit", "View", "Delete"],
          condition: ["yes", "yes", "yes", "no"],
        },
        {
          title: "Expenses & Income",
          features: "",
          permissions: ["Create", "Edit", "View", "Delete"],
          condition: ["yes", "yes", "yes", "no"],
        },
        {
          title: "Parties",
          features: " - Customer",
          permissions: ["Create", "Edit", "View", "Delete"],
          condition: ["no", "no", "no", "no"],
        },
        {
          title: "Parties",
          features: " - Supplier",
          permissions: ["Create", "Edit", "View", "Delete"],
          condition: ["yes", "yes", "yes", "no"],
        },
        {
          title: "Quick Billing",
          features: "",
          permissions: ["Create"],
          condition: ["no"],
        },
        {
          title: "Bulk Item and Parties Import",
          features: "",
          permissions: ["Action"],
          condition: ["no"],
        },
        {
          title: "Business Stats - All",
          features: "",
          permissions: ["View"],
          condition: ["no"],
        },
        {
          title: "Current Business",
          features: "",
          permissions: ["Edit", "Delete"],
          condition: ["no", "no"],
        },
        {
          title: "Inventory",
          features: " - Items, Categories & Units",
          permissions: ["Create", "Edit", "View", "Delete"],
          condition: ["yes", "yes", "yes", "no"],
        },

        {
          title: "Item Stock Adjustment",
          features: "",
          permissions: ["Create"],
          condition: ["yes"],
        },
        {
          title: "Manage Staffs",
          features: "",
          permissions: [
            "Add Staff",
            "Edit Staff",
            "Remove Staff",
            "View All Staff",
          ],
          condition: ["no", "no", "no", "yes"],
        },
        {
          title: "Karobar Settings",
          features: "",
          permissions: [
            "App Settings",
            "Account Settings",
            "Business Settings",
            "Invoice Settings",
            "Delete Business",
          ],
          condition: ["yes", "yes", "no", "no", "no"],
        },
        {
          title: "Reports",
          features: "",
          permissions: [
            "Transaction",
            "Party",
            "Item/Stock",
            "Expense",
            "Business Stats",
          ],
          condition: ["no", "only-Party-statement", "yes", "no", "no"],
        },
        {
          title: "Keyboard Shortcuts",
          features: "",
          permissions: ["All Shortcuts"],
          condition: ["limited"],
        },
        {
          title: "Cash In Hand",
          features: "",
          permissions: ["View", "Add/Reduce Cash", "Edit/Delete Cash"],
          condition: ["no", "no", "no"],
        },
        {
          title: "Bank Balance",
          features: "",
          permissions: ["View", "Add/Reduce Money", "Edit/Delete Money"],
          condition: ["no", "no", "no"],
        },
      ],
      data_accountant: [
        {
          title: "Sales",
          features: " - Sale Invoice, Estimate, Payment In & Sales Return",
          permissions: ["Create", "Edit", "View", "Delete"],
          condition: ["no", "no", "no", "no"],
        },
        {
          title: "Purchase",
          features: " - Purchase, Payment Out & Purchase Return",
          permissions: ["Create", "Edit", "View", "Delete"],
          condition: ["no", "no", "no", "no"],
        },
        {
          title: "Expenses & Income",
          features: "",
          permissions: ["Create", "Edit", "View", "Delete"],
          condition: ["no", "no", "no", "no"],
        },
        {
          title: "Parties",
          features: " - Customer",
          permissions: ["Create", "Edit", "View", "Delete"],
          condition: ["no", "no", "no", "no"],
        },
        {
          title: "Parties",
          features: " - Supplier",
          permissions: ["Create", "Edit", "View", "Delete"],
          condition: ["no", "no", "no", "no"],
        },
        {
          title: "Quick Billing",
          features: "",
          permissions: ["Create"],
          condition: ["no"],
        },
        {
          title: "Bulk Item and Parties Import",
          features: "",
          permissions: ["Action"],
          condition: ["no"],
        },
        {
          title: "Business Stats - All",
          features: "",
          permissions: ["View"],
          condition: ["no"],
        },
        {
          title: "Current Business",
          features: "",
          permissions: ["Edit", "Delete"],
          condition: ["no", "no"],
        },
        {
          title: "Inventory",
          features: " - Items, Categories & Units",
          permissions: ["Create", "Edit", "View", "Delete"],
          condition: ["no", "no", "no", "no"],
        },

        {
          title: "Item Stock Adjustment",
          features: "",
          permissions: ["Create"],
          condition: ["no"],
        },
        {
          title: "Manage Staffs",
          features: "",
          permissions: [
            "Add Staff",
            "Edit Staff",
            "Remove Staff",
            "View All Staff",
          ],
          condition: ["no", "no", "no", "no"],
        },
        {
          title: "Karobar Settings",
          features: "",
          permissions: [
            "App Settings",
            "Account Settings",
            "Business Settings",
            "Invoice Settings",
            "Delete Business",
          ],
          condition: ["yes", "yes", "no", "no", "no"],
        },
        {
          title: "Reports",
          features: "",
          permissions: [
            "Transaction",
            "Party",
            "Item/Stock",
            "Expense",
            "Business Stats",
          ],
          condition: ["yes", "yes", "yes", "yes", "yes"],
        },
        {
          title: "Keyboard Shortcuts",
          features: "",
          permissions: ["All Shortcuts"],
          condition: ["limited"],
        },
        {
          title: "Cash In Hand",
          features: "",
          permissions: ["View", "Add/Reduce Cash", "Edit/Delete Cash"],
          condition: ["no", "no", "no"],
        },
        {
          title: "Bank Balance",
          features: "",
          permissions: ["View", "Add/Reduce Money", "Edit/Delete Money"],
          condition: ["no", "no", "no"],
        },
      ],
    };
  },
  computed: {
    roleActive() {
      if (this.roleStatus) {
        if (this.roleStatus == "business-partner") {
          this.activeTab = 1;
        } else if (this.roleStatus == "sales-person") {
          this.activeTab = 2;
        } else if (this.roleStatus == "inventory-manager") {
          this.activeTab = 3;
        } else if (this.roleStatus == "accountant") {
          this.activeTab = 4;
        } else {
          this.activeTab = 0;
        }
      }
    },
  },
  watch: {
    isActive(newValue) {
      this.isModalActive = newValue;
    },
    isModalActive(newValue) {
      if (!newValue) {
        this.cancel();
      }
    },
  },

  methods: {
    cancel() {
      this.$emit("cancel");
    },
  },
};
</script>
<style lang="scss">
$green: #3ab98d;
.staff-permissions-modal {
  .button {
    height: 2.5em;
    box-shadow: none;
    background-color: transparent;
    border: 1px solid #dedede;
    &:focus {
      box-shadow: none;
      border: 1px solid #dedede;
    }
    &:hover {
      background-color: transparent;
      border: 1px solid #dedede;
    }
  }
  .close-button {
    border: none !important;
    position: absolute;
    right: 5px;
    top: 5px;
    .icon {
      font-size: 20px !important;
    }
  }
  .animation-content {
    max-width: 70vw;
  }
  .modal-card {
    width: 70vw;
    .modal-card-body {
      padding: 0;
      border-radius: 4px;
      .tabs a {
        font-weight: 600;
        border-bottom-width: 0;
        padding: 0.75rem 1.5rem;
      }
      .tabs ul {
        border-bottom-width: 1px;
      }
      .tabs li.is-active a {
        border-bottom-color: $green;
        color: $green;
        border-bottom-width: 2px;
        font-weight: 600;
      }
      .tabs a:hover {
        border-bottom-color: $green;
        border-bottom-width: 2px;
      }
      .b-tabs .tab-content {
        padding: 0;
      }
    }
  }
}
</style>
