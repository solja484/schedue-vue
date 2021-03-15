<template>
    <div></div>
</template>

<script>

    export default {
        name: "EmptyRow",
        data() {
            return {
                courses: this.$store.getters['scheduleCourses']
            }
        }
    }
</script>

<style scoped>
</style>