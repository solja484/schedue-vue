<template>
    <tr v-if="row.rowspan">
        <td :rowspan="row.rowspan" class="px-0 py-2 text-middle">{{row.time}}</td>
    </tr>
    <tr v-else>
        <td v-if="row.name" class="py-2 bold text-middle-left">
            <span class="badge badge-secondary mr-1">{{row.course_code}}</span>
            <a :href="'https://my.ukma.edu.ua/course/'+row.course_code" class="link-black ml-1"
               target="_blank" rel="noopener noreferrer">{{row.name}}</a>
        </td>
        <td v-else class="py-4"></td>
        <td class="py-2 italic text-middle-left">{{row.teacher}}</td>
        <td v-if="schedule_type==session_type" class="px-0 py-2 text-middle">{{row.exam_type}}</td>
        <td v-if="row.group!=0&&row.group<100" class="px-0 py-2 text-middle">{{row.group}}</td>
        <td v-else-if="row.group==0" class="px-0 py-2 text-middle">Лекція</td>
        <td v-else class="px-0 py-2 text-middle"></td>
        <td class="px-0  text-middle">{{row.weeks}}</td>
        <td v-if="row.classroom!=''" class="px-0 py-2 text-middle">{{row.classroom}}</td>
        <td v-else class="px-0 py-2 text-middle"></td>

    </tr>
</template>

<script>
    import {ScheduleType} from "../../models/entities/ScheduleType";

    export default {
        name: "TableRow",
        props: ['schedule_type', 'row'],
        data() {
            return {
                session_type: ScheduleType.SESSION
            }
        }
    }
</script>

<style scoped>

</style>