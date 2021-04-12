<template>
  <table
    class="table table-bordered table-align"
    :class="{ 'table-hover': !disable }"
  >
    <TableHead :scheduleType="scheduleType"></TableHead>
    <TableDay
      v-for="day in days"
      :key="day.number"
      :day="day"
      :scheduleType="scheduleType"
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
  props: ["scheduleType", "code", "currentState", "disable"],
  data() {
    return {
      createState: CurrentState.SCHEDULE_CREATE,
      editState: CurrentState.SCHEDULE_EDIT
    };
  },
  computed: {
    days: function() {
      return this.$store.getters["university/days"];
    }
  }
};
</script>

<style scoped></style>
