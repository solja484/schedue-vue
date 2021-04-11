<template>
  <table class="table table-bordered table-responsive mb-5">
    <thead class="table-header">
      <tr class="text-center table-header">
        <th style="width: 5%;">Час</th>
        <th v-for="day in days" :key="day.number" style="width: 16%;">
          {{ day.name }}
        </th>
      </tr>
    </thead>
    <tbody>
      <TimetableRow
        v-for="pair in pairs"
        :key="pair.number"
        :pair="pair"
        :type="type"
      ></TimetableRow>
    </tbody>
  </table>
</template>

<script>
import TimetableRow from "../Table/TimetableRow";

export default {
  name: "Timetable",
  components: {
    TimetableRow
  },
  props: ["type"],
  computed: {
    days: function() {
      return this.$store.getters["university/days"];
    },
    pairs: function() {
      return this.$store.getters["university/pairs"];
    }
  }
};
</script>

<style scoped></style>
