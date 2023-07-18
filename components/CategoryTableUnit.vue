<template>
  <div>
    <edit-unit
      :is-active="isModalActive"
      @confirm="trashConfirm"
      @cancel="trashCancel"
      :post="post"
    />
    <delete-unit
      :is-active="isModalActive2"
      @confirm="deleteConfirm"
      @cancel="deleteCancel"
    />
    <b-table
      class="category-table"
      aria-next-label="Next page"
      aria-previous-label="Previous page"
      :checked-rows.sync="checkedRows"
      :checkable="false"
      :paginated="false"
      :per-page="5"
      :striped="false"
      :hoverable="true"
      default-sort="name"
      :data="resultQuery"
    >
      <template slot-scope="props">
        <b-table-column class="pad_left" label="Unit Name" field="name">
          {{ props.row.name }}
        </b-table-column>
        <b-table-column class="pad_left" label="Short Unit Name" field="items">
          {{ props.row.short }}
        </b-table-column>
        <b-table-column>
          <div class="buttons">
            <b-button v-if="globalHelper('editInventory')" @click="trashModal(props.row)" type="is-primary"
              >Edit</b-button
            >
            <b-button v-if="globalHelper('deleteInventory')" @click="deleteItem(props.row.id)" type="is-danger"
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
            <p>
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
import DeleteUnit from "@/components/DeleteUnit";
import EditUnit from "@/components/EditUnit";
export default {
  name: "ItemsTable",
  components: {
    EditUnit,
    DeleteUnit,
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
    searchTransaction: {
      type: String,
    },
    units: {
      type: Object,
    },
  },
  data() {
    return {
      isModalActive: false,
      isModalActive2: false,
      deleteUnitId: "",
      editUnitId: 0,
      clients: [],
      searchQuery: "",
      post: {},
      loading: true,
      trashObject: null,
      paginated: true,
      perPage: 10,
      checkedRows: [],
    };
  },
  watch: {
    searchTransaction(search) {
      this.searchQuery = search;
    },
    units(value) {
      this.clients.unshift({
        name: value.name,
        short: value.short,
        id: value.id,
      });
    },
  },
  async mounted() {
    let list = [];
    let response = await axios.get(
      "/inventory/units/?business=" +
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
        short: element.short,
        id: element.id,
      });
    });
    this.clients = list;
    this.loading = false;
  },
  computed: {
    resultQuery() {
      if (this.searchQuery) {
        return this.clients.filter((item) => {
          return this.searchQuery
            .toLowerCase()
            .split(" ")
            .every(
              (v) =>
                item.name.toLowerCase().includes(v) ||
                item.short.toLowerCase().includes(v)
            );
        });
      } else {
        return this.clients;
      }
    },
  },
  methods: {
    
    trashModal(post) {
      this.post = post;
      this.isModalActive = true;
    },
    async trashCancel() {
      let list = [];
      let response = await axios.get(
        "/inventory/units/?business=" +
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
          short: element.short,
          id: element.id,
        });
      });
      this.clients = list;
      this.isModalActive = false;
    },
    trashConfirm() {
      this.isModalActive = false;
      this.$buefy.snackbar.open({
        message: "Unit was successfully updated",
        type: "is-primary",
        position: "is-bottom",
        indefinite: false,
      });
    },
    deleteItem(id) {
      this.isModalActive2 = true;
      this.deleteUnitId = id;
    },
    async deleteConfirm() {
      try {
        let response = await axios.delete(
          "/inventory/units/" + this.deleteUnitId + "/",
          {
            headers: {
              Authorization: localStorage.getItem("auth._token.local"),
            },
          }
        );
        this.$buefy.snackbar.open({
          message: "Unit was deleted successfully",
          type: "is-primary",
          position: "is-bottom",
          indefinite: false,
        });
        const id = this.deleteUnitId;
        const index = this.clients.findIndex((data) => data.id == id);
        this.clients.splice(index, 1);
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

.b-table.category-table {
  .is-danger {
    background-color: $red;
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
