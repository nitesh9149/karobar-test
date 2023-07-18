<template>
  <div>
    <section class="error-content">
      <div class="error-title">
        <h1>{{ error.statusCode }}</h1>
        <h2>{{ error.message }}</h2>
      </div>
      <div class="buttons">
        <b-button
          @click="logout"
          icon-left="arrow-left"
          type="is-primary"
          >Go to home page</b-button
        >
      </div>
    </section>
  </div>
</template>
<script>
export default {
  auth: false,
  layout: "empty",
  props: ["error"],
  methods:{
    logout() {
      localStorage.clear();
      this.$auth.logout();
      window.location.assign('/')
    },
  }
};
</script>
<style lang="scss">
$green: #3ab98d;
.error-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 95vh;
  .error-title {
    text-align: center;
    h1 {
      font-size: 10rem;
      color: $green;
    }
    h2 {
      font-size: 2rem;
      padding-bottom: 1rem;
    }
    p {
      color: #1d262d;
      padding-bottom: 1rem;
      font-size: 18px;
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