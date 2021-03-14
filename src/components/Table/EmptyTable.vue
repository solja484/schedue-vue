<template>
    <table class="table table-bordered table-hover table-align">
        <TableHead :schedule_type="schedule_type"></TableHead>
        <tbody v-for="day in days" :key="day.number">
        <tr class="p-0">
            <td :rowspan='8' class="text-middle">
                <div class="rotate text-middle bold">{{day.name}}</div>
            </td>
        </tr>
        <EmptyRow v-for="pair in pairs" :key="pair.number"
                  :pair="pair" :schedule_type="schedule_type" :currentState="currentState"></EmptyRow>

        </tbody>
    </table>
</template>

<script>
    import TableHead from "./TableHead";
    import EmptyRow from "./EmptyRow";

    export default {
        name: "EmptyTable",
        components: {EmptyRow, TableHead},
        props: ['schedule_type','currentState','disabled'],
        data() {
            return {
                pairs: this.$store.getters['pairs'],
                days: this.$store.getters['days']
            }
        }
    }
</script>

<style scoped>
    .text-middle {
        text-align: center;
        vertical-align: middle !important;
    }

    .rotate {
        transform: rotate(270deg);
        text-align: center;

    }
</style>
