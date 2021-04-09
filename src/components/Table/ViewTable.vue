<template>
  <table
    class="table table-bordered table-align"
    :class="{ 'table-hover': !disable }"
    :id="'schedule-' + code"
  >
    <TableHead :schedule_type="schedule_type"></TableHead>
    <TableDay
      v-for="day in days"
      :key="day.number"
      :day="day"
      :schedule_type="schedule_type"
      :disable="disable"
      :currentState="currentState"
    ></TableDay>
  </table>
</template>

<script>
import TableHead from "./TableHead";
import TableDay from "./TableDay";
import { CurrentState } from "../../models/entities/CurrentState";

export default {
  name: "ViewTable",
  components: { TableHead, TableDay },
  props: ["schedule_type", "code", "currentState", "disable"],
  data() {
    return {
      createState: CurrentState.SCHEDULE_CREATE,
      editState: CurrentState.SCHEDULE_EDIT
    };
  },
  computed: {
    days: function() {
      return this.$store.getters["university/days"];
    },
    selected_speciality: function() {
      return this.$store.getters["edit/selected_speciality"];
    },
    selected_sub_faculty: function() {
      return this.$store.getters["edit/selected_sub_faculty"];
    }
  }
};
</script>

<style scoped></style>
