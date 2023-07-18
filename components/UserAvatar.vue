<template>
  <div class="is-user-avatar">
    <img
      v-if="this.$auth.user.photo"
      width="28"
      height="28"
      :src="this.$auth.user.photo"
      :alt="userName"
    />
    <div class="username" v-else>
      {{ userName.charAt(0).toUpperCase() }}
    </div>
  </div>
</template>

<script>
export default {
  name: "UserAvatar",
  data() {
    return {
      userName: this.$auth.user.full_name,
    };
  },
};
</script>
<style scoped lang="scss">
.username {
  width: 28px;
  height: 28px;
  background-color: #3ab98d;
  color: white;
  border-radius: 50%;
  text-align: center;
}
.is-user-avatar {
  img {
    height: 1.75rem;
    object-fit: cover;
  }
}
</style>
