<template>
    <div class="text-center line-height-5 m-5">
        <p class="my-0"><b>Користувач</b><br>
       {{ user.name }}<br>
        <b>Роль</b><br>
       {{ user.role }}<br>
       <b>Етап</b><br>
       Презентації курсів</p>
    </div>
</template>

<script>
    export default {
        name: "UserInfo",
        data() {
            return {
                user: this.$store.getters["state/user"]
            };
        },
    }
</script>

<style scoped>

</style>