<template>
  <div>
    <b-table
      :bordered="true"
      :striped="true"
      :data="data"
      :columns="columns"
    ></b-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      data: [
        {
          id: 1,
          first_name: "Noodles",
          last_name: "1",
          date: "Rs. 400",
          amount: "Rs. 400",
        },
        {
          id: 2,
          first_name: "Masala",
          last_name: "7",
          date: "Rs. 400",
          amount: "Rs. 2,800",
        },
        {
          id: 3,
          first_name: "Biscuits",
          last_name: "5",
          date: "Rs. 400",
          amount: "Rs. 2,000",
        },
        {
          id: 4,
          first_name: "Dal",
          last_name: "6",
          date: "Rs. 400",
          amount: "Rs. 2,400",
        },
        {
          id: 5,
          first_name: "Atta",
          last_name: "2",
          date: "Rs. 400",
          amount: "Rs. 800",
        },
      ],
      columns: [
        {
          field: "id",
          label: "SN",
          width: "40",
          numeric: true,
          centered: true,
        },
        {
          field: "first_name",
          label: "ITEMS",
          width: "260",
        },
        {
          field: "last_name",
          label: "QUANTITY",
          centered: true,
          width: "80",
        },
        {
          field: "date",
          label: "RATE",
          width: "90",
        },
        {
          field: "amount",
          label: "AMOUNT",
          width: "120",
        },
      ],
    };
  },
};
</script>
<style lang="scss">
.pdf-table-simple {
  .table {
    border-collapse: collapse;
    box-sizing: border-box;
  }
  .table td,
  .table th {
    border: 1px solid #dedede;
    color: black;
  }
  .table th {
    border-top: 0;
  }
  thead {
    th {
      .th-wrap {
        justify-content: flex-end;
      }
      &:nth-child(2) {
        .th-wrap {
          justify-content: flex-start;
        }
      }
    }
  }
  tr {
    td {
      text-align: right;
      &:nth-child(2) {
        text-align: left;
      }
    }
  }
}
</style>