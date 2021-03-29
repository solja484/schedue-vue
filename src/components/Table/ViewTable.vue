<template>
    <!--div>
        <button @click="saveSchedule" class="btn btn-info btn-lg info-button float-right mb-2 px-5"
                :disabled="selected_speciality==null&&selected_sub_faculty==null"
                v-if="currentState==editState||currentState==createState"><i class="fa fa-save"></i> Зберегти
        </button-->
    <table class="table table-bordered table-align" :class="{'table-hover':!disable}" :id="'schedule-'+code">
        <TableHead :schedule_type="schedule_type"></TableHead>
        <TableDay v-for="day in days" :key="day.number"
                  :day="day" :schedule_type="schedule_type" :disable="disable"
                  :currentState="currentState"></TableDay>
    </table>
    <!--/div-->
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
            }
        },
        computed: {
            days: function () {
                return this.$store.getters["university/days"]
            },
            selected_speciality: function () {
                return this.$store.getters['edit/selected_speciality']
            },
            selected_sub_faculty: function () {
                return this.$store.getters['edit/selected_sub_faculty']
            }
        },
        methods: {
            saveSchedule: function () {
                this.loadingSave = true;
                let table = document.getElementById('schedule-' + this.schedule_code);
                let headerColumns = table.querySelectorAll("th");
                let headerString = "";
                let counter = 0;
                for (let th of headerColumns) {
                    counter++;
                    if (counter > 3)
                        headerString += "<th>" + th.innerHTML.toString() + "</th>";
                }
                let finalHeaderString = "<thead><tr>" + headerString + "</tr></thead>";
                let bodys = table.querySelectorAll("tbody");
                let tableString = "";
                for (let body of bodys)
                    tableString += body.innerHTML.toString();
                const HtmlTableToJson = require('html-table-to-json');
                const res = HtmlTableToJson.parse("<table>" + finalHeaderString + tableString + "</table>");
                console.log(res);
                /*
                 if (this.currentState == this.editState)
                     this.$store.dispatch('edit/editSchedule').then((res) => {
                         this.$router.push('/schedules/view/' + res);
                     });
                 else if (this.currentState == this.createState)
                     this.$store.dispatch('edit/createSchedule').then((res) => {
                         this.$router.push('/schedules/view/' + res);
                     });*/
            },
        }
    }
</script>

<style scoped>
</style>