<template>
  <div>
    <staff-modal-edit
      :is-active="isModalActive"
      @confirm="trashConfirm"
      @cancel="trashCancel"
      :staff="staff"
    />
    <staff-modal-delete
      :is-active="isModalActive2"
      @confirm="trashConfirm2"
      @cancel="trashCancel2"
    />
    <b-table
      class="staff-table"
      aria-next-label="Next page"
      aria-previous-label="Previous page"
      :checked-rows.sync="checkedRows"
      :checkable="false"
      :paginated="false"
      :per-page="5"
      :striped="false"
      :hoverable="true"
      default-sort="name"
      :data="clients"
    >
      <template slot-scope="props">
        <b-table-column class="pad_left" label="Name" field="name">
          {{ props.row.name }}
        </b-table-column>
        <b-table-column class="pad_left" label="Phone No." field="phone">
          {{ props.row.phone_number }}
        </b-table-column>
        <b-table-column class="pad_left" label="Role" field="role">
          {{ props.row.role_value }}
        </b-table-column>
        <b-table-column>
          <div v-if="props.row.role == 'admin'" class="buttons"></div>
          <div v-else-if="$auth.loggedIn" class="buttons">
            <b-button
              v-if="globalHelper('editStaff')"
              @click="trashModal(props.row)"
              type="is-primary"
              >Edit</b-button
            >
            <b-button
              v-if="
                globalHelper('removeStaff') ||
                $auth.user.phone_number == props.row.phone_number
              "
              @click="trashModal2(props.row)"
              type="is-danger"
              >Delete</b-button
            >
          </div>
        </b-table-column>
      </template>
      <section slot="empty">
        <div class="content has-text-grey has-text-centered">
          <template v-if="loading">
            <b-skeleton height="50px" :animated="true"></b-skeleton>
            <b-skeleton height="50px" :animated="true"></b-skeleton>
            <b-skeleton height="50px" :animated="true"></b-skeleton>
            <b-skeleton height="50px" :animated="true"></b-skeleton>
          </template>
          <template v-else>
            <p class="pad-empty">
              <b-icon icon="emoticon-sad" size="is-large" />
            </p>
            <p>Nothing's here&hellip;</p>
          </template>
        </div>
      </section>
    </b-table>
  </div>
</template>
<script>
import axios from "axios";
import StaffModalEdit from "@/components/StaffModalEdit";
import StaffModalDelete from "@/components/StaffModalDelete";
export default {
  name: "ItemsTable",
  components: {
    StaffModalEdit,
    StaffModalDelete,
  },
  props: {
    dataUrl: {
      type: String,
      default: null,
    },
    checkable: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      staff: {},
      isModalActive: false,
      isModalActive2: false,
      clients: [],
      staffId: null,
      loading: true,
      trashObject: null,
      paginated: true,
      perPage: 10,
      checkedRows: [],
    };
  },
  async mounted() {
    let list = [];
    let response = await axios.get(
      "/roles/roles/?business=" +
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
        id: element.id,
        name: element.name,
        phone_number: element.phone_number,
        role_value: element.role_value,
        role: element.role,
      });
    });
    this.clients = list;
    this.loading = false;
  },
  methods: {
    trashModal(row) {
      this.staff = row;
      this.isModalActive = true;
    },
    trashCancel() {
      this.isModalActive = false;
      this.reset();
    },
    trashConfirm() {
      this.isModalActive = false;
      this.$buefy.snackbar.open({
        message: "Staff was updated successfully",
        type: "is-primary",
        position: "is-bottom",
        indefinite: false,
      });
    },
    trashModal2(staff) {
      this.staffId = staff.id;
      this.staff_phone = staff.phone_number;
      this.isModalActive2 = true;
    },
    async trashConfirm2() {
      this.isModalActive2 = false;
      const loadingComponent = this.$buefy.loading.open();
      try {
        const response = await axios.delete(
          "/roles/roles/" +
            this.staffId +
            "/" +
            "?business=" +
            localStorage.getItem("business"),
          {
            headers: {
              Authorization: localStorage.getItem("auth._token.local"),
            },
          }
        );
        if (this.$auth.user.phone_number == this.staff_phone) {
          this.$auth.logout();
          localStorage.clear();
        }
        this.reset();
        this.$buefy.snackbar.open({
          message: "Staff was deleted successfully",
          type: "is-primary",
          position: "is-bottom",
          indefinite: false,
        });
      } catch (err) {
        this.$buefy.snackbar.open({
          message: err.response.data.detail,
          type: "is-primary",
          position: "is-bottom",
          indefinite: false,
        });
      }
      loadingComponent.close();
    },
    trashCancel2() {
      this.isModalActive2 = false;
    },
    async reset() {
      let list = [];
      let response = await axios.get(
        "/roles/roles/?business=" +
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
          id: element.id,
          name: element.name,
          phone_number: element.phone_number,
          role_value: element.role_value,
          role: element.role,
        });
      });
      this.clients = list;
    },
  },
};
</script>
<style lang="scss">
$green: #34a77f;
$black: #1f1f1f;
$red: #e54f6d;
.color-green {
  color: $green;
}
.color-red {
  color: #e54f6d;
}

.b-table.staff-table {
  border: 1px solid #dedede;
  .table-wrapper.has-sticky-header {
    padding-left: 0;
    margin-right: -8px;
  }
  .is-danger {
    background-color: $red;
  }
  .table th {
    border-bottom: 1px solid #dedede;
  }
  th {
    padding: 15px 10px;
  }
  .table {
    td {
      .button {
        visibility: hidden;
      }
    }
    tr {
      &:hover {
        td {
          .button {
            visibility: visible;
          }
        }
      }
    }
    tbody {
      .buttons {
        justify-content: center;
        .button {
          margin-left: 10px;
          box-shadow: none;
        }
      }
    }
  }
}
</style>
