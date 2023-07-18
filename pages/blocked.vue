<template>
  <div>
    <section class="block-content">
      <div class="block-title">
        <img src="@/img/blocked_page.png" alt="blocked page" />
        <h2>Account Blocked!</h2>
        <p>
          Account Blocked We have temporarily locked your account due to
          suspicious activity. <br />
          Please contact our support to unblock your account.
        </p>
        <div class="buttons">
          <b-button
            @click="goToHome"
            icon-left="arrow-left"
            type="is-primary"
            >Go to home page</b-button
          >
        </div>
      </div>
    </section>
  </div>
</template>
<script>
export default {
  auth: false,
  layout: "empty",
  methods:{
    goToHome(){
      localStorage.clear();
      this.$auth.logout();
      this.$axios.setHeader("Authorization", null);
      window.location.assign('/')
    }
  }
};
</script>
<style lang="scss">
$green: #3ab98d;
.block-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 95vh;
  .block-title {
    width: 60vw;
    margin: auto;
    text-align: center;
    img {
      width: 50%;
      padding-bottom: 1.5rem;
    }
    h2 {
      font-size: 26px;
      font-weight: bold;
      padding-bottom: 0.5rem;
      color: #333333;
    }
    p {
      color: #1d262d;
      padding-bottom: 1rem;
      font-size: 16px;
    }
  }
  .buttons {
    display: flex;
    justify-content: center;
    .button.is-primary {
      border-color: $green;
      color: white;
      background-color: $green;
      font-weight: 500;
      &:hover {
        background-color: $green;
      }
      &:focus {
        box-shadow: none;
      }
    }
  }
}
@media screen and (max-width: 768px) {
  .blog-content {
    max-width: 100% !important;
  }
}
</style>