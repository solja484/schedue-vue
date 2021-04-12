<template>
  <tr v-if="row.rowspan">
    <td :rowspan="row.rowspan" class="px-0 py-2 text-middle">{{ row.time }}</td>
  </tr>
  <tr v-else>
    <td v-if="row.name" class="py-2  text-middle-left">
      <span class="badge badge-secondary mr-1">{{ row.course_code }}</span>
      <a
        :href="'https://my.ukma.edu.ua/course/' + row.course_code"
        class="link-black ml-1 bold"
        target="_blank"
        rel="noopener noreferrer"
        >{{ row.name }}</a
      >
      <em> {{ row.teacher }} </em>
    </td>
    <td v-else class="py-4"></td>
    <td v-if="scheduleType == sessionType" class="px-0 py-2 text-middle">
      {{ row.exam_type }}
    </td>
    <td v-if="row.group != 0 && row.group < 100" class="px-0 py-2 text-middle">
      {{ row.group }}
    </td>
    <td v-else-if="row.group == 0" class="px-0 py-2 text-middle">Лекція</td>
    <td v-else class="px-0 py-2 text-middle"></td>
    <td class="px-0 text-middle">{{ row.weeks }}</td>
    <td v-if="row.classroom != ''" class="px-0 py-2 text-middle">
      {{ row.classroom }}
    </td>
    <td v-else class="px-0 py-2 text-middle"></td>
  </tr>
</template>

<script>
import { ScheduleType } from "../../models/entities/ScheduleType";

export default {
  name: "TableRow",
  props: ["scheduleType", "row"],
  data() {
    return {
      sessionType: ScheduleType.SESSION
    };
  }
};
</script>

<style scoped></style>
