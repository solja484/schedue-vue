<template>
  <tr>
    <td class="text-middle">{{ pair.time }}</td>
    <td v-for="day in days" :key="day.number" class="p-0 text-bottom">
      <TimetableCell
        v-for="course in getCourses(day.id)"
        :key="course.id"
        :info="course"
        :type="type"
      ></TimetableCell>
    </td>
  </tr>
</template>

<script>
import TimetableCell from "./TimetableCell";

export default {
  name: "TimetableRow",
  components: { TimetableCell },
  props: ["pair", "type"],
  computed: {
    days: function() {
      return this.$store.getters["university/days"];
    },
    pairs: function() {
      return this.$store.getters["university/pairs"];
    },
    schedule: function() {
      return this.$store.getters["student/schedule"].filter(
        sch => sch.pair_id == this.pair.id
      );
    },
    session: function() {
      return this.$store.getters["student/session"].filter(
        sch => sch.pair_id == this.pair.id
      );
    }
  },
  methods: {
    getCourses: function(day_id) {
      if (this.type == "session")
        return this.session.filter(sch => sch.day_id == day_id);
      else return this.schedule.filter(sch => sch.day_id == day_id);
    }
  }
};
</script>

<style scoped>
.text-middle {
  vertical-align: middle !important;
}

.text-bottom {
  vertical-align: bottom !important;
}
</style>
