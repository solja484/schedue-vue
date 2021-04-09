<template>
  <div class="text-center line-height-5 m-5">
    <p class="my-0">
      <b>Користувач</b><br />
      {{ user.name }}<br />
      <b>Роль</b><br />
      {{ user.role }}
    </p>
  </div>
</template>

<script>
export default {
  name: "UserInfo",
  computed: {
    user: function() {
      return this.$store.getters["state/user"];
    }
  }
};
</script>

<style scoped></style>
