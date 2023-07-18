<template>
  <div>
    <b-table
      class="pdf-table-top"
      :bordered="true"
      :striped="false"
      :data="data"
      :columns="columns"
    ></b-table>
  </div>
</template>

<script>
export default {
  props: {
    billingItem: {
      type: Array,
    },
  },
  data() {
    return {
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
          label: "QTY",
          centered: true,
          width: "80",
        },
        {
          field: "rate",
          label: "RATE",
          width: "90",
        },
      ],
    };
  },
  mounted() {
    let discount = false;
    this.billingItem.forEach((element) => {
      if (element.discount_percent > 0) {
        discount = true;
      }
    });
    if (discount) {
      this.columns.splice(4, 0, {
        field: "amount",
        label: "AMT",
        width: "100",
      });
      this.columns.splice(5, 0, {
        field: "discount",
        label: "DIS %",
        width: "120",
      });
      this.columns.push({
        field: "total",
        label: "NET AMT",
        width: "100",
      });
    } else {
      this.columns.push({
        field: "total",
        label: "AMOUNT",
        width: "100",
      });
    }
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
  },
};
</script>
<style lang="scss">
.pdf-wrapper-generate {
  .pdf-table-nepali {
    .pdf-table-top {
      .table {
        border-collapse: collapse;
        box-sizing: border-box;
        thead {
          background-color: white;
        }
      }
      .table td,
      .table th {
        border: 1px solid black;
        color: black;
        padding: 0.5em 0.5em;
        font-size: 0.85rem;
      }
      .table td {
        border-top-width: 0;
        border-bottom-width: 1px;
      }
      tr {
        &:last-child {
          td {
            border-bottom-width: 1px;
          }
        }
      }

      tr {
        td {
          text-align: right;
          word-break: break-all;
          &:nth-child(2) {
            text-align: left;
          }
        }
      }
    }
    thead {
      th {
        font-weight: 600;
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
  }
}
</style>