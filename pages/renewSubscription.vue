<template>
  <div>
    <div class="renew-subs">
      <img src="@/img/subscription.png" alt="Renew Subscription" />
      <h1>Pro Plan Needed/Expired!</h1>
      <p>
        To Continue using the business, Please Contact your owner to Renew
        Karobar Pro Plan
      </p>
    </div>
  </div>
</template>
<style lang="scss">
.renew-subs {
  margin: auto;
  padding-top: 9rem;
  width: 30vw;
  text-align: center;
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
  .renew-subs {
    width: 70vw;
  }
}
</style>