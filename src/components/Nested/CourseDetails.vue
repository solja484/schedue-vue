<template>
  <div>
    <b-popover
      :target="
        'cell-' + item.course_cdoc + '-' + item.day_id + '-' + item.pair_id
      "
      triggers="hover"
      position="right"
      fade
      delay="70"
      class="text-12"
    >
      <template #title>
        <b>{{ course.name }}</b>
      </template>
      <p class="my-1">
        <span class="badge badge-secondary mr-1"
          >{{ course.credits }} кред.</span
        >
        <span class="badge badge-secondary mr-1">{{ course.hours }} год.</span>
        <span class="badge badge-secondary mr-1">{{ course.year }} рік</span>
        <span
          class="badge badge-success"
          v-if="course.status_happened == 'happened'"
          >Курс відбувся</span
        >
        <span class="badge badge-danger" v-else>Курс не відбувся</span>
      </p>
      <p class="my-1" v-for="type in regType" :key="type.name">
        <span
          class="badge badge-secondary"
          v-if="type.name == course.reg_type"
          >{{ type.translate }}</span
        >
      </p>
      <p class="my-1 text-12">
        {{ faculty }}<br />
        {{ subFacultyName }}
      </p>
      <p class="my-1 text-12 bold">
        Тижні: {{ item.weeks }}<br />
        Аудиторія: {{ item.room }}
      </p>
    </b-popover>
  </div>
</template>

<script>
import { BPopover } from "bootstrap-vue";

export default {
  name: "CourseDetails",
  components: { BPopover },
  props: ["item"],
  data() {
    return {
      regType: [
        { name: "mandat", translate: "Нормативна" },
        { name: "zfree", translate: "Вільного вибору" },
        { name: "option", translate: "Професійно-орієнтована" }
      ]
    };
  },
  computed: {
    course: function() {
      return this.$store.getters["student/courses"].find(
        course => course.code == this.item.course_cdoc
      );
    },
    faculty: function() {
      return this.$store.getters["university/faculties"].find(
        f => f.id == this.subfaculty.faculty_id
      ).name;
    },
    subfaculty: function() {
      return this.$store.getters["university/sub_faculty"].find(
        sub => sub.id == this.item.subfaculty
      );
    },
    subFacultyName: function() {
      return this.subfaculty.name;
    }
  }
};
</script>

<style scoped>
.text-12 {
  font-size: 12px;
}

.bold {
  font-weight: bolder;
}
</style>
