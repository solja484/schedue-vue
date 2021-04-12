<template>
  <thead v-if="!loading" :id="'head' + code">
    <tr class="text-center table-header">
      <th style="width: 2%!important;">День</th>
      <th style="width: 100px!important;">Час</th>
      <th
        style="width: 3%;"
        v-if="currentState == createState || currentState == editState"
      ></th>
      <th v-if="currentState == viewState">Дисципліна, викладач</th>
      <th style="width: 40%;" v-if="currentState != viewState">
        Дисципліна{{ currentState }}
      </th>
      <th v-if="currentState != viewState">Викладач</th>
      <th style="width: 10%;" v-if="scheduleType == sessionType">
        Вид контролю
      </th>
      <th style="width: 7%;">Група</th>
      <th style="width: 7%;" v-if="scheduleType != sessionType">Тижні</th>
      <th v-else style="width: 7%;">Дата</th>
      <th style="width: 7%;">Аудиторія</th>
    </tr>
  </thead>
</template>

<script>
import { ScheduleType } from "../../models/entities/ScheduleType";
import { CurrentState } from "../../models/entities/CurrentState";

export default {
  name: "TableHead",
  props: ["scheduleType", "code"],
  data() {
    return {
      sessionType: ScheduleType.SESSION,
      currentState: this.$store.getters["state/currentState"],
      createState: CurrentState.SCHEDULE_CREATE,
      editState: CurrentState.SCHEDULE_EDIT,
      viewState: CurrentState.SCHEDULE_VIEW
    };
  },
  computed: {
    loading: function() {
      return this.$store.getters["loading"];
    }
  }
};
</script>
<style lang="scss">
@import "../../assets/scss/_variables.scss";

.table-header th {
  border-color: $gray-border;
  background: $gray-fill;
}
</style>
