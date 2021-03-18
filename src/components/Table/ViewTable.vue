<template>
    <table class="table table-bordered table-align" :class="{'table-hover':!disable}" id="schedule">
        <TableHead :schedule_type="schedule_type"></TableHead>
        <TableDay v-for="day in days" :key="day.number"
                  :day="day" :schedule_type="schedule_type" :disable="disable" :currentState="currentState"></TableDay>
    </table>
</template>

<script>
    import TableHead from "./TableHead";
    import TableDay from "./TableDay";

    export default {
        name: "ViewTable",
        components: {TableHead, TableDay},
        props: ["schedule_type", "code", "currentState", "disable"],
        data() {
            return {
                days: this.$store.getters['university/days']
            }
        },

    }
</script>

<style scoped>

</style>