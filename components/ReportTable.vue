<template>
  <div>
    <b-table class="expenses-table"
      aria-next-label="Next page"
      aria-previous-label="Previous page"
      :checkable="false"
      :loading="isLoading"
      :paginated="false"
      :per-page="5"
      :striped="false"
      :hoverable="true"
      :sticky-header="true"
      default-sort="name"
      :data="clients"
    >
      <template slot-scope="props">
        <b-table-column label="Date" field="Date">
          <span>
            {{
              new Date(props.row.date).toLocaleDateString("en-IN", {
                year: "numeric",
                month: "long",
                day: "numeric",
              }).split(" ",3)[2]
            }}
            {{
              new Date(props.row.date).toLocaleDateString("en-IN", {
                year: "numeric",
                month: "long",
                day: "numeric",
              }).split(" ",3)[1]
            }}
            {{
              new Date(props.row.date).toLocaleDateString("en-IN", {
                year: "numeric",
                month: "long",
                day: "numeric",
              }).split(" ",3)[0]
            }}
          </span>
        </b-table-column>
        <b-table-column label="Party Name" field="name">
          {{props.row.party}}
        </b-table-column>
        <b-table-column class="pad_left" label="Bill no." field="exp">
          {{ props.row.exp }}
        </b-table-column>
         <b-table-column class="pad_left" label="Total Amt" field="note">
          Rs. {{ props.row.note }}
        </b-table-column>
        <b-table-column class="pad_left" label="Paid Amt" field="mode">
          Rs. {{ props.row.mode }}
        </b-table-column>
        <b-table-column class="pad_left" label="Balance Amt" field="amount">
          Rs. {{ props.row.amount }}
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
// import axios from 'axios'
export default {
  name: "ClientsTableSample",
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
      clients: [
        {
          party: "Samir Phuyal",
          exp: 120,
          date: "2016/10/15 13:43:27",
          note: "100000",
          amount: "400,000",
          mode: "150000",
        },
        {
          party: "Rikesh Niroula",
          exp: 120,
          date: "2016/10/15 13:43:27",
          note: "500000",
          amount: "200,000",
          mode: "40000",
        },
        {
          party: "Sachin Dahal",
          exp: 120,
          date: "2016/10/15 13:43:27",
          note: "100000",
          amount: "200,000",
          mode: "50000",
        },
        {
          party: "Nitesh Rajbanshi",
          exp: 120,
          date: "2016/10/15 13:43:27",
          note: "500000",
          amount: "200,000",
          mode: "150000",
        },
        {
          party: "Samir Phuyal",
          exp: 120,
          date: "2016/10/15 13:43:27",
          note: "100000",
          amount: "200,000",
          mode: "150000",
        },
        {
          party: "Samir Phuyal",
          exp: 120,
          date: "2016/10/15 13:43:27",
          note: "500000",
          amount: "200,000",
          mode: "40000",
        },
        {
          party: "Samir Phuyal",
          exp: 120,
          date: "2016/10/15 13:43:27",
          note: "100000",
          amount: "200,000",
          mode: "40000",
        },
        {
          party: "Samir Phuyal",
          exp: 120,
          date: "2016/10/15 13:43:27",
          note: "500000",
          amount: "200,000",
          mode: "40000",
        },
        {
          party: "Samir Phuyal",
          exp: 120,
          date: "2016/10/15 13:43:27",
          note: "100000",
          amount: "200,000",
          mode: "50000",
        },
        {
          party: "Samir Phuyal",
          exp: 120,
          date: "2016/10/15 13:43:27",
          note: "100000",
          amount: "200,000",
          mode: "40000",
        },
        {
          party: "Samir Phuyal",
          exp: 120,
          date: "2016/10/15 13:43:27",
          note: "100000",
          amount: "200,000",
          mode: "150000",
        },
        {
          party: "Samir Phuyal",
          exp: 120,
          date: "2016/10/15 13:43:27",
          note: "500000",
          amount: "200,000",
          mode: "150000",
        },
        {
          party: "Samir Phuyal",
          exp: 120,
          date: "2016/10/15 13:43:27",
          note: "100000",
          amount: "200,000",
          mode: "150000",
        },
        {
          party: "Samir Phuyal",
          exp: 120,
          date: "2016/10/15 13:43:27",
          note: "500000",
          amount: "200,000",
          mode: "150000",
        },
        {
          party: "Samir Phuyal",
          exp: 120,
          date: "2016/10/15 13:43:27",
          note: "100000",
          amount: "200,000",
          mode: "150000",
        },
        {
          party: "Samir Phuyal",
          exp: 120,
          date: "2016/10/15 13:43:27",
          note: "100000",
          amount: "200,000",
          mode: "50000",
        },
        {
          party: "Samir Phuyal",
          exp: 120,
          date: "2016/10/15 13:43:27",
          note: "100000",
          amount: "200,000",
          mode: "50000",
        },
        {
          party: "Samir Phuyal",
          exp: 120,
          date: "2016/10/15 13:43:27",
          note: "500000",
          amount: "200,000",
          mode: "50000",
        },
        {
          party: "Samir Phuyal",
          exp: 120,
          date: "2016/10/15 13:43:27",
          note: "100000",
          amount: "200,000",
          mode: "50000",
        },
        {
          party: "Samir Phuyal",
          exp: 120,
          date: "2016/10/15 13:43:27",
          note: "500000",
          amount: "200,000",
          mode: "150000",
        },
        {
          party: "Samir Phuyal",
          exp: 120,
          date: "2016/10/15 13:43:27",
          note: "100000",
          amount: "200,000",
          mode: "150000",
        },
        {
          party: "Samir Phuyal",
          exp: 120,
          date: "2016/10/15 13:43:27",
          note: "100000",
          amount: "200,000",
          mode: "150000",
        },
        {
          party: "Samir Phuyal",
          exp: 120,
          date: "2016/10/15 13:43:27",
          note: "100000",
          amount: "200,000",
          mode: "150000",
        },
        {
          party: "Samir Phuyal",
          exp: 120,
          date: "2016/10/15 13:43:27",
          note: "500000",
          amount: "200,000",
          mode: "150000",
        },
        {
          party: "Samir Phuyal",
          exp: 120,
          date: "2016/10/15 13:43:27",
          note: "100000",
          amount: "200,000",
          mode: "150000",
        },
        {
          party: "Samir Phuyal",
          exp: 120,
          date: "2016/10/15 13:43:27",
          note: "500000",
          amount: "200,000",
          mode: "150000",
        },
        {
          party: "Samir Phuyal",
          exp: 120,
          date: "2016/10/15 13:43:27",
          note: "100000",
          amount: "200,000",
          mode: "150000",
        },
        {
          party: "Samir Phuyal",
          exp: 120,
          date: "2016/10/15 13:43:27",
          note: "100000",
          amount: "200,000",
          mode: "150000",
        },
      ],
      isLoading: false,
      trashObject: null,
      paginated: true,
      perPage: 10,
      CheckedRows: [],
    };
  },
  methods: {
    trashModal(trashObject) {
      this.trashObject = trashObject;
    },
  },
};
</script>
<style lang="scss">
$green: #34a77f;
$black: #1f1f1f;
</style>