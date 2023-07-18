<template>
  <div>
    {{ billData }}
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
    billingItem: {
      type: Array,
    },
    selection: {
      type: Array,
    },
  },
  data() {
    return {
      colored: "",
      data: [],
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
          width: "180",
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
          centered: true,
          width: "90",
        },
      ],
    };
  },
  watch: {
    billingItem(bill) {
      let discount = false;
      bill.forEach((element) => {
        if (element.discount_percent > 0) {
          discount = true;
        }
      });
      if (discount) {
        this.columns.splice(4, 0, {
          field: "amount",
          label: "AMOUNT",
          width: "120",
        });
        this.columns.splice(5, 0, {
          field: "discount",
          label: "DISCOUNT",
          width: "120",
        });
        this.columns.push({
          field: "total",
          label: "NET AMOUNT",
          width: "120",
        });
      } else {
        this.columns.push({
          field: "total",
          label: "AMOUNT",
          width: "120",
        });
      }
    },
  },
  computed: {
    billData() {
      if (this.billingItem.length) {
        let list = [];
        this.billingItem.forEach((element, index) => {
          let qNum = 0;
          if (Number(element.quantity) % 1 != 0) {
            qNum = Number(element.quantity).toFixed(2);
          } else {
            qNum = Number(element.quantity).toFixed(0);
          }
          list.push({
            sn: index + 1,
            item_name: element.item_name,
            quantity: element.unit == "" ? qNum : qNum + " " + element.unit,
            rate: "Rs." + " " + this.conversion(element.rate),
            amount:
              "Rs." +
              " " +
              this.conversion(Number(element.quantity) * Number(element.rate)),
            discount: element.discount_percent
              ? `Rs. ${this.conversion(element.discount_amount)}
              (${this.conversion(element.discount_percent) + "%"})`
              : "Rs. " + 0,
            total: "Rs." + " " + this.conversion(element.total),
          });
        });
        this.data = list;
      }
    },
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
  mounted() {
    if (this.billingItem.length) {
      let discount = false;
      this.billingItem.forEach((element) => {
        if (element.discount_percent > 0) {
          discount = true;
        }
      });
      if (discount) {
        this.columns.splice(4, 0, {
          field: "amount",
          label: "AMOUNT",
          width: "90",
        });
        this.columns.splice(5, 0, {
          field: "discount",
          label: "DISCOUNT",
          width: "170",
        });
        this.columns.push({
          field: "total",
          label: "NET AMOUNT",
          width: "120",
        });
      } else {
        this.columns.push({
          field: "total",
          label: "AMOUNT",
          width: "120",
        });
      }
    }
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
    word-break: break-all;
    font-size: 0.8rem;
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
      word-break: break-all;
      // &:last-child {
      //   text-align: right;
      // }
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