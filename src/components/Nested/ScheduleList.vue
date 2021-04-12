<template>
  <div v-if="!loading">
    <ScheduleListELem
      v-for="s in schedulesFiltered"
      :key="s.code"
      :code="s.code"
      :title="s.title"
    ></ScheduleListELem>
  </div>
</template>

<script>
import { ScheduleType } from "../../models/entities/ScheduleType";
import ScheduleListELem from "../Nested/ScheduleListELem";

export default {
  name: "ScheduleList",
  components: { ScheduleListELem },
  props: ["type", "faculty", "subFaculty", "level", "year"],
  data() {
    return {
      subFacultyType: ScheduleType.SUBFACULTY
    };
  },
  computed: {
    schedules: function() {
      return this.$store.getters["list/final"];
    },
    loading: function() {
      return this.$store.getters["loading"];
    },
    schedulesFiltered: function() {
      if (this.type == this.subFacultyType)
        return this.schedules.filter(
          s =>
            s.schedule_type == this.type &&
            s.faculty_id == this.faculty &&
            this.subFaculty == s.subfaculty_id
        );
      else
        return this.schedules.filter(
          s =>
            s.schedule_type == this.type &&
            s.faculty_id == this.faculty &&
            this.level == s.level &&
            this.year == s.study_year
        );
    }
  }
};
</script>

<style scoped></style>
