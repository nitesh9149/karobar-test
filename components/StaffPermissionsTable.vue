<template>
  <b-table
    class="staff-permissions-table"
    :data="data"
    :bordered="true"
    :sticky-header="true"
  >
    <template slot-scope="props">
      <b-table-column field="features" label="Features">
        <span style="font-weight: 600">{{ props.row.title }}</span
        >{{ props.row.features }}
      </b-table-column>

      <b-table-column width="250" field="permissions" label="Permissions">
        <div v-for="(item, index) in props.row.permissions" :key="index">
          {{ item }}
        </div>
      </b-table-column>

      <b-table-column width="250" field="condition">
        <div v-for="(item, index) in props.row.condition" :key="index">
          <div v-if="item == 'yes'" style="color: #3ab98d">Yes</div>
          <div v-if="item == 'no'" style="color: #e54f6d">No</div>
          <div v-if="item == 'only-Party-statement'">Only Party Statement</div>
          <div v-if="item == 'limited'">Limited</div>
        </div>
      </b-table-column>
    </template>

    <template #empty>
      <div class="has-text-centered">No records</div>
    </template>
  </b-table>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
    },
  },
};
</script>
<style lang="scss">
.staff-permissions-table {
  .table {
    border-collapse: collapse;
  }
  .table-wrapper.has-sticky-header {
    height: calc(100vh - 100px);
  }
  .table th {
    font-weight: 600;
    font-size: 16px;
    color: #333333;
    padding-left: 1.5rem;
    border-color: #dedede;
  }
  .table td {
    font-size: 15px;
    padding-left: 1.5rem;
    border-color: #dedede;
    color: #333333;
    font-weight: 500;
    &:first-child {
      vertical-align: top !important;
    }
    &:nth-child(2) {
      padding: 0;
    }
    &:nth-child(3) {
      padding: 0;
    }
    & > div {
      padding-top: 0.5rem;
      padding-bottom: 0.5rem;
      border-bottom: 1px solid #dedede;
      padding-left: 2rem;
      &:last-child {
        border-bottom: none;
      }
    }
  }
}
</style>