<template>
    <table class="table table-bordered table-hover table-align">
        <TableHead :schedule_type="schedule_type"></TableHead>
        <TableDay v-for="day in days" :key="day.number" :day="day" :schedule_type="schedule_type"></TableDay>
    </table>
</template>

<script>
    import TableHead from "./TableHead";
    import TableDay from "./TableDay";
    import {ScheduleType} from "../../models/entities/ScheduleType";

    export default {
        name: "ViewTable",
        components: {TableHead, TableDay},
        props: ["schedule_type", "code"],
        data() {
            return {
                days: this.$store.getters['days'],
                session_type: ScheduleType.SESSION
            }
        }
    }
</script>

<style scoped>

</style>