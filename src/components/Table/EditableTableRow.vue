<template>
    <tr v-if="row.rowspan">
        <td :rowspan="row.rowspan" class="px-0 py-2 text-center text-middle">{{row.time}}</td>
    </tr>
    <tr v-else>
        <td class="no-padding text-middle">
            <button class="btn m-0 text-muted" :disabled="disable"><i class="fa fa-plus"></i></button>
        </td>
        <td class="py-2 bold no-padding text-middle-left">
            <Autocomplete
                    v-if="default_value==''"
                    :search="search"
                    :get-result-value="getResultValue"
                    @submit="onSubmit" :disabled="disable">
                <template #result="{ result, props }">
                    <li
                            v-bind="props"
                            class="autocomplete-result wiki-result">
                        <strong>{{ result.course_code }} </strong>{{ result.name }}
                    </li>
                </template>
            </Autocomplete>
            <Autocomplete
                    v-else
                    :default-value="default_value"
                    :search="search"
                    :get-result-value="getResultValue"
                    @submit="onSubmit" :disabled="disable">
                <template #result="{ result, props }">
                    <li
                            v-bind="props"
                            class="autocomplete-result wiki-result">
                        <strong>{{ result.course_code }} </strong>{{ result.name }}
                    </li>
                </template>
            </Autocomplete>
        </td>
        <td class="py-2 italic no-padding text-middle">
            <b-form-input type="text" class="form-control m-0  sharp-border"
                          v-model="course_teacher" :disabled="disable">
            </b-form-input>
        </td>
        <td v-if="schedule_type==session_type" class="px-0 py-2 text-center no-padding text-middle">
            <b-form-select type="text" class="form-control m-0  sharp-border"
                           v-model="course_exam" :options="exam_types" :disabled="disable">
            </b-form-select>
        </td>
        <td class="px-0 py-2 text-center no-padding text-middle">
            <b-form-select type="text" class="form-control m-0  sharp-border"
                           v-model="course_group" :disabled="disable">
                <b-form-select-option v-for="g in groups" :key="g" :value="g" class="text-14">
                    {{g==0? "Лекція":g!=100? g :"" }}
                </b-form-select-option>
            </b-form-select>
        </td>
        <td class="px-0 py-2 text-center no-padding text-middle">
            <b-form-input type="text" class="form-control m-0  sharp-border"
                          v-model="course_weeks" :disabled="disable">
            </b-form-input>
        </td>
        <td class="px-0 py-2 text-center no-padding text-middle">
            <b-form-input type="text" class="form-control m-0  sharp-border"
                          v-model="course_room" :disabled="disable">
            </b-form-input>
        </td>
    </tr>
</template>

<script>
    import {examination} from "../../assets/data/levels"
    import {BFormInput, BFormSelect, BFormSelectOption} from "bootstrap-vue"
    import {ScheduleType} from "../../models/entities/ScheduleType";
    import {CurrentState} from "../../models/entities/CurrentState";
    import Autocomplete from '@trevoreyre/autocomplete-vue';
    export default {
        name: "EditableTableRow",
        components: {BFormInput, BFormSelect, BFormSelectOption, Autocomplete},
        props: ['row', 'schedule_type', 'disable'],
        data() {
            return {
                currentState: this.$store.getters['state/currentState'],
                editState:CurrentState.SCHEDULE_EDIT,
                createState:CurrentState.SCHEDULE_CREATE,
                session_type: ScheduleType.SESSION,
                course_name: this.row.name,
                course_code: this.row.course_code,
                course_teacher: this.row.teacher,
                course_weeks: this.row.weeks,
                course_exam: this.row.exam_type,
                course_room: this.row.classroom,
                course_group: this.row.group,
                exam_types: examination,
                groups: [this.row.group],
                focused:false,

            }
        },
        computed: {
            courses: function () {
                return this.$store.getters['schedule/availableCourses'];
            },
            default_value: function () {
                if(this.row.name.length==0) return "";
                    return this.row.course_code+" "+this.row.name;
                }
            },
        methods: {
            getCourseGroup: function () {
                if (this.row.group == 0) return 'Лекція';
                if (this.row.group == 100) return "";
                return this.row.group;
            },
            search: function (input) {
                if (input.length < 1) {
                    return []
                }
                return this.courses.filter(course => {
                    return course.name.toLowerCase()
                        .startsWith(input.toLowerCase()) || course.course_code.toString().startsWith(input)
                });
            },
            onSubmit: function (result) {
                this.course_code = result.course_code;
                this.course_name = result.name;
            },
            getResultValue: function (result) {
                return result.course_code + " " + result.name;
            }
        },
        watch: {
            course_name: function () {
                let res = [];
                let course = this.courses.find(course => course.course_code == this.course_code);
                for (let i = 0; i <= course.actual_group; i++) res.push(i);
                this.groups = res;
            }
        }
    }
</script>

<style scoped>
    @import '../../assets/scss/autocomplete.css';



    .autocomplete-result-list li {
        background-image: none !important;
        padding: 2px 5px !important;
        font-size: 14px !important;
        font-weight: normal;
        text-align: left;
    }

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

    .text-middle-left {
        text-align: left;
        vertical-align: middle !important;
    }

    .text-middle {
        text-align: center;
        vertical-align: middle !important;
    }
</style>