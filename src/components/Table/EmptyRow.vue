<template>
    <tr>
        <td class="px-0 py-2 text-center text-middle" rowspan="1">{{pair.time}}</td>
        <td class="no-padding text-middle">
            <button class="btn m-0"><i class="fa fa-plus text-success"></i></button>
        </td>
        <td class="no-padding text-middle">
            <b-form-input type="text" class="form-control m-0 w-100 h-100 sharp-border"
                          v-model="selected_course"/>
        <td class="no-padding text-middle">
            <b-form-input type="text" class="form-control m-0 w-100 h-100 sharp-border"
                          v-model="selected_teacher"/>
        </td>
        <td class="no-padding text-middle">
            <b-form-input type="text" class="form-control m-0 w-100 h-100 sharp-border"
                          v-model="selected_group" :disabled="selected_course==null"/>
        </td>
        <td class="no-padding text-middle">
            <b-form-input type="text" class="form-control m-0 w-100 h-100 sharp-border"
                          v-model="selected_week"/>
        </td>
        <td class="no-padding text-middle">
            <b-form-input type="text" class="form-control m-0 w-100 h-100 sharp-border"
                          v-model="selected_room"/>
        </td>

    </tr>
</template>

<script>
    import {examination} from "../../assets/api/levels"
    import {BFormInput} from "bootstrap-vue";

    export default {
        name: "EmptyRow",
        components: {BFormInput},
        props: ['pair', 'schedule_type'],
        computed: {
            weeks: function () {
                return [...Array(15).keys()];
            }
        },
        data() {
            return {
                selected_course: null,
                selected_teacher: "",
                selected_room: "",
                selected_group: "",
                selected_exam: "",
                selected_week: null,
                exam_types: examination,
                faculty_id: this.$store.getters['user'].methodist.faculty_id
            }
        }
    }
</script>

<style scoped>
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