<template>
    <div>
        <div class="container p-0 m-0">
            <div class="row m-0 p-0">
                <div class="col-sm-2"></div>
                <button @click="saveSchedule" class="btn btn-info btn-lg info-button col-sm-2 mb-2"
                        :disabled="selected_speciality==null&&selected_sub_faculty==null"
                        v-if="currentState==editState||currentState==createState"><i class="fa fa-save"></i> Зберегти
                </button>
            </div>
        </div>
        <table class="table table-bordered table-align" :class="{'table-hover':!disable}" :id="'schedule-'+code">
            <TableHead :schedule_type="schedule_type"></TableHead>
            <TableDay v-for="day in days" :key="day.number"
                      :day="day" :schedule_type="schedule_type" :disable="disable"
                      :currentState="currentState"></TableDay>
        </table>
    </div>
</template>

<script>
    import TableHead from "./TableHead";
    import TableDay from "./TableDay";
    import {CurrentState} from "../../models/entities/CurrentState";

    export default {
        name: "ViewTable",
        components: {TableHead, TableDay},
        props: ["schedule_type", "code", "currentState", "disable"],
        data() {
            return {
                createState: CurrentState.SCHEDULE_CREATE,
                editState: CurrentState.SCHEDULE_EDIT,
                days: this.$store.getters['university/days'],
            }
        },
        computed: {
            selected_speciality: function () {
                return this.$store.getters['edit/selected_speciality']
            },
            selected_sub_faculty: function () {
                return this.$store.getters['edit/selected_sub_faculty']
            }
        },
        methods: {
            saveSchedule: function () {
                if (this.currentState == this.editState)
                    this.$store.dispatch('edit/editSchedule').then((res) => {
                        this.$router.push('/schedules/view/' + res);
                    });
                else if (this.currentState == this.createState)
                    this.$store.dispatch('edit/createSchedule').then((res) => {
                        this.$router.push('/schedules/view/' + res);
                    });
            },
        }
    }
</script>

<style scoped>
</style>