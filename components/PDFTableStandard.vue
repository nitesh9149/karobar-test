<template>
  <div>
    <b-table
      :class="[colored]"
      :bordered="false"
      :striped="false"
      :data="data"
      :columns="columns"
    >
      <template #footer> </template>
    </b-table>
    <span style="display: none">{{ changeColor }}</span>
  </div>
</template>

<script>
export default {
  props: {
    color: {
      type: Number,
    },
  },
  data() {
    return {
      colored: "",
      data: [
        {
          sn: 1,
          item_name: "Noodles",
          quantity: "2 PCS",
          rate: "500",
          total: "1000",
        },
        {
          sn: 2,
          item_name: "Masala",
          quantity: "6 PCS",
          rate: "50",
          total: "300",
        },
        {
          sn: 3,
          item_name: "Noodles",
          quantity: "2 PCS",
          rate: "500",
          total: "1000",
        },
      ],
      columns: [
        {
          field: "sn",
          label: "SN",
          width: "40",
          numeric: true,
          centered: true,
        },
        {
          field: "item_name",
          label: "ITEMS",
          width: "260",
        },
        {
          field: "quantity",
          label: "QUANTITY",
          centered: true,
          width: "80",
        },
        {
          field: "rate",
          label: "RATE",
          width: "90",
        },
        {
          field: "total",
          label: "AMOUNT",
          width: "120",
        },
      ],
    };
  },
  mounted() {
    this.colored = "green";
  },
  computed: {
    changeColor() {
      let color = this.color;
      if (this.color) {
        if (color == 1) {
          this.colored = "green";
        }
        if (color == 2) {
          this.colored = "red";
        }
        if (color == 3) {
          this.colored = "blue";
        }
        if (color == 4) {
          this.colored = "orange";
        }
        if (color == 5) {
          this.colored = "sky";
        }
        if (color == 6) {
          this.colored = "black";
        }
      }
      return color;
    },
  },
};
</script>
<style lang="scss">
$green: #fdfdfd;
.pdf-table-standard {
  .table {
    padding: 0 1.5rem;
    box-sizing: border-box;
  }
  .table tbody tr:last-child td {
    border-bottom-width: 1px;
  }
  .table td,
  .table th {
    border-color: #dbdbdb;
  }
  .table th {
    color: white;
    border: 0;
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
.green {
  thead {
    background-color: #3ab98d;
  }
}
.red {
  thead {
    background-color: #e54f6d;
  }
}
.blue {
  thead {
    background-color: #0094fa;
  }
}
.orange {
  thead {
    background-color: #ff6600;
  }
}
.sky {
  thead {
    background-color: #00bcd5;
  }
}
.black {
  thead {
    background-color: #1f1f1f;
  }
}
</style>