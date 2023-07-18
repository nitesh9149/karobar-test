<template>
  <div>
    <delete-business
      :is-active="isModalActive"
      @confirm="trashConfirm"
      @cancel="trashCancel"
    />

    <b-table
      class="staff-table"
      aria-next-label="Next page"
      aria-previous-label="Previous page"
      :checked-rows.sync="checkedRows"
      :checkable="false"
      :loading="isLoading"
      :paginated="false"
      :per-page="5"
      :striped="false"
      :hoverable="true"
      default-sort="name"
      :data="clients"
    >
      <template slot-scope="props">
        <b-table-column class="pad_left" label="Business Name" field="name">
          {{ props.row.name }}
        </b-table-column>
        <b-table-column class="pad_left" label="Address" field="address">
          {{ props.row.address }}
        </b-table-column>
        <b-table-column class="pad_left" label="Email Address" field="email">
          {{ props.row.email }}
        </b-table-column>
        <b-table-column class="pad_left" label="Phone No." field="phone">
          {{ props.row.contact_number }}
        </b-table-column>
        <b-table-column>
          <div class="buttons">
            <b-button @click="editBusiness(props.row)" type="is-primary"
              >Edit</b-button
            >
            <b-button @click="trashModal(props.row.id)" type="is-danger"
              >Delete</b-button
            >
          </div>
        </b-table-column>
      </template>
      <section slot="empty" class="section">
        <div class="content has-text-grey has-text-centered">
          <template v-if="isLoading">
            <p>
              <b-icon icon="dots-horizontal" size="is-large" />
            </p>
            <p>Fetching data...</p>
          </template>
          <template v-else> </template>
          <b-skeleton height="50px" :animated="true"></b-skeleton>
          <b-skeleton height="50px" :animated="true"></b-skeleton>
          <b-skeleton height="50px" :animated="true"></b-skeleton>
          <b-skeleton height="50px" :animated="true"></b-skeleton>
        </div>
      </section>
    </b-table>
  </div>
</template>
<script>
import DeleteBusiness from "@/components/DeleteBusiness";
import axios from "axios";

export default {
  name: "ItemsTable",
  components: {
    DeleteBusiness,
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
      isModalActive: false,
      clients: [],
      isLoading: false,
      trashObject: null,
      paginated: true,
      perPage: 10,
      checkedRows: [],
      deleteId: null,
    };
  },
  async mounted() {
    let list = [];
    let response = await axios.get("/business/businesses/", {
      headers: {
        Authorization: localStorage.getItem("auth._token.local"),
      },
    });
    response.data.forEach((element) => {
      list.push({
        name: element.name,
        address: element.address != null ? element.address : "-",
        contact_number:
          element.contact_number != null ? element.contact_number : "-",
        id: element.id,
        email: element.email != null ? element.email : "-",
      });
    });
    this.clients = list;
  },
  fetchOnServer: false,
  methods: {
    trashModal(a) {
      this.isModalActive = true;
      this.deleteId = a;
    },
    trashCancel() {
      this.isModalActive = false;
    },
    async trashConfirm() {
      let response = await axios.delete(
        "/business/businesses/" + this.deleteId + "/",
        {
          headers: {
            Authorization: localStorage.getItem("auth._token.local"),
          },
        }
      );
      this.$buefy.snackbar.open({
        message: "Business has been successfully deleted.",
        type: "is-primary",
        position: "is-bottom",
        indefinite: false,
      });
      this.$router.go();
      this.isModalActive = false;
    },
    editBusiness(a) {
      this.$router.push("/businessSettings");
      localStorage.setItem("editId", a.id);
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
