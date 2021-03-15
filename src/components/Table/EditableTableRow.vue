<template>
    <tr v-if="row.rowspan">
        <td :rowspan="row.rowspan" class="px-0 py-2 text-center text-middle">{{row.time}}</td></tr>
    <tr v-else>
        <td class="no-padding text-middle">
            <button class="btn m-0" :disabled="disable"><i class="fa fa-plus"></i></button>
        </td>
        <td class="py-2 bold no-padding text-middle">
            <b-form-input type="text" class="form-control m-0 h-100 sharp-border px-0 text-center"
                          v-model="course_code" :disabled="disable">
            </b-form-input>
        </td>
        <td class="py-2 bold no-padding text-middle">
            <b-form-input type="text" class="form-control m-0 h-100 sharp-border"
                          v-model="course_name" :disabled="disable">
            </b-form-input>
        </td>
        <td class="py-2 italic no-padding text-middle">
            <b-form-input type="text" class="form-control m-0 h-100 sharp-border"
                          v-model="course_teacher" :disabled="disable">
            </b-form-input>
        </td>
        <td v-if="schedule_type==session_type" class="px-0 py-2 text-center no-padding text-middle">
            <b-form-select type="text" class="form-control m-0 h-100 sharp-border"
                           v-model="course_exam" :options="exam_types" :disabled="disable">
            </b-form-select>
        </td>
        <td class="px-0 py-2 text-center no-padding text-middle">
            <b-form-input type="text" class="form-control m-0 h-100 sharp-border"
                          v-model="course_group" :disabled="disable">
            </b-form-input>
        </td>
        <td class="px-0 py-2 text-center no-padding text-middle">
            <b-form-input type="text" class="form-control m-0 h-100 sharp-border"
                          v-model="course_weeks" :disabled="disable">
            </b-form-input>
        </td>
        <td class="px-0 py-2 text-center no-padding text-middle">
            <b-form-input type="text" class="form-control m-0 h-100 sharp-border"
                          v-model="course_room" :disabled="disable">
            </b-form-input>
        </td>
    </tr>
</template>

<script>
    import {examination} from "../../assets/api/levels"
    import {BFormInput, BFormSelect} from "bootstrap-vue"
    import {ScheduleType} from "../../models/entities/ScheduleType";

    export default {
        name: "EditableTableRow",
        components: {BFormInput, BFormSelect},
        props: ['row', 'schedule_type', 'disable'],
        data() {
            return {
                course_name: this.row.name,
                course_code: this.row.course_code,
                course_teacher: this.row.teacher,
                course_weeks: this.row.weeks,
                course_exam: this.row.exam_type,
                course_room: this.row.classroom,
                course_group: this.getCourseGroup(),
                exam_types: examination,
                session_type: ScheduleType.SESSION
            }
        },
        computed: {},
        methods: {
            getCourseGroup: function () {
                if (this.row.group == 0) return 'Лекція';
                if (this.row.group == 100) return "";
                return this.row.group;
            }
        }
    }
</script>

<style scoped>

    .italic {
        font-style: italic;
    }

    .bold {
        font-weight: bold;
    }

    .no-padding {
        padding: 3px !important;
    }

    .sharp-border {
        border-radius: 2px;
    }

    .text-middle {
        text-align: center;
        vertical-align: middle !important;
    }
</style>