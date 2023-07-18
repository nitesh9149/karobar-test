<template>
  <div>
    <div class="payment-fail">
      <img src="@/img/payment_fail.png" alt="Renew Subscription" />
      <h1>Payment Failed!</h1>
      <p>
        We couldn't proceed your payment successfully.<br> Please contact our
        Support.
      </p>
    </div>
  </div>
</template>
<style lang="scss">
.payment-fail {
  margin: auto;
  padding-top: 9rem;
  width: 30vw;
  text-align: center;
  img {
    width: 60%;
  }
  h1 {
    font-weight: bold;
    font-size: 24px;
    padding-top: 1rem;
    color: #333333;
  }
  p {
    color: #333333;
  }
}
@media screen and (max-width: 768px) {
  .payment-fail {
    width: 70vw;
  }
}
</style>