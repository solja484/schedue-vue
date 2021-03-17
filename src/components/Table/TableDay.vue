<template>
    <tbody class="p-0" v-if="currentState==viewState">
    <tr class="p-0">
        <td :rowspan='rowspan_all' class="text-middle">
            <div class="rotate text-middle bold">{{day.name}}</div>
        </td>
    </tr>
    <TableRow v-for="row in rows_all" :key="row.id" :row="row" :schedule_type="schedule_type"></TableRow>
    </tbody>
    <tbody v-else class="p-0">
    <tr class="p-0">
        <td :rowspan='rowspan_all' class="text-middle p-0 m-0">
            <div class="rotate text-middle bold p-0 m-0">{{day.name}}</div>
        </td>
    </tr>
    <EditableTableRow v-for="row in rows_all" :key="row.id" class="p-0"
                      :row="row"
                      :schedule_type="schedule_type"
                      :disable="disable">
    </EditableTableRow>
    </tbody>
</template>

<script>
    import {ScheduleType} from "../../models/entities/ScheduleType";
    import {CurrentState} from "../../models/entities/CurrentState";
    import EditableTableRow from "./EditableTableRow";
    import TableRow from "./TableRow";

    export default {
        name: "TableDay",
        components: {TableRow, EditableTableRow},
        props: ["day", "schedule_type", 'disable'],
        data() {
            return {
                pairs: this.$store.getters['university/pairs'],
                session_type: ScheduleType.SESSION,
                currentState: this.$store.getters['state/currentState'],
                viewState: CurrentState.SCHEDULE_VIEW,
                editState: CurrentState.SCHEDULE_EDIT
            }
        },
        computed: {
            courses: function () {
                if (this.currentState == CurrentState.SCHEDULE_VIEW)
                    return this.$store.getters['schedule/viewRows'].filter(c => c.day_id == this.day.id);
                else
                    return this.$store.getters['schedule/editRows'].filter(c => c.day_id == this.day.id);
            },
            rowspan_all: function () {
                let result = 3;
                for (let i = 0; i < 7; i++) {
                    result += this.rowspan_pair(i + 1);
                }

                return result;
            },
            rows_all: function () {
                let result = [];
                for (let i = 1; i < 8; i++) {
                    let counter = 0;
                    for (let course of this.courses) {
                        if (course.pair_id == i) {
                            counter++;
                            if (counter == 1)
                                result.push({"rowspan": this.rowspan_pair(i), "time": this.pair_time(i)});
                            result.push(course);
                        }
                    }
                    if (counter == 0) {
                        let empty = {
                            "id": i,
                            "name":"",
                            "course_code": "",
                            "group": 100,
                            "pair_id": i,
                            "weeks": "",
                            "classroom": "",
                            "teacher": ""
                        };
                        result.push({
                            "rowspan": 2,
                            "time": this.pair_time(i)
                        });
                        result.push(empty);
                    }
                }
                return result;
            }
        }, methods: {
            rowspan_pair(pair_id) {
                let rowspan = 0;
                this.courses.forEach(function (c) {
                    if (c.pair_id == pair_id)
                        rowspan++;
                });
                if (rowspan == 0) return 2;
                rowspan++;
                return rowspan;
            },
            pair_time(pair_id) {
                return this.pairs.find(p => p.number == pair_id).time;
            }
        }
    }
</script>

<style>
    .text-middle-left {
        vertical-align: middle !important;
    }

    .text-middle {
        text-align: center;
        vertical-align: middle !important;
    }

    .rotate {
        transform: rotate(270deg);
        text-align: center;

    }

    .italic {
        font-style: italic;
    }

    .link-black, .link-black:hover, .link-black:active, .link-black:focus {
        cursor: pointer;
        color: black;
    }

    .bold {
        font-weight: bold;
    }
</style>