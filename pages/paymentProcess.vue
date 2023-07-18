<template>
  <div class="payment-process">
    <h1>Payment Processing...</h1>
    <p>Please don't close this window</p>
  </div>
</template>
<script>
export default {
  async mounted() {
    let uri = window.location.search.substring(1);
    let params = new URLSearchParams(uri);
    let refId = params.get("refId");
    let amt = params.get("amt");
    let oId = params.get("oid");
    let coupon = params.get("coupon");
    if (refId) {
      try {
        let data = {
          pid: oId,
          package: "2",
          payment_method: "esewa",
          amount: amt,
          token: refId,
          coupon: coupon,
        };
        let response = await this.$axios.post("/subscription/payment/", data);
        if (response.data.success) {
          this.$buefy.snackbar.open({
            message: response.data.message,
            type: "is-success",
            position: "is-bottom",
            indefinite: false,
          });
          window.location.assign("/");
        } else {
          this.$router.push("/paymentFailed");
          this.$buefy.snackbar.open({
            message: response.data.message,
            type: "is-danger",
            position: "is-bottom",
            indefinite: false,
          });
        }
      } catch (error) {
        this.$router.push("/paymentFailed");
        this.$buefy.snackbar.open({
          message: error.response.data.detail,
          type: "is-danger",
          position: "is-bottom",
          indefinite: false,
        });
      }
    }
  },
};
</script>
<style lang="scss" scoped>
.payment-process {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 90vh;
  h1 {
    color: #3ab98d;
    font-size: 2.5rem;
    font-weight: 700;
    text-transform: uppercase;
  }
}
</style>