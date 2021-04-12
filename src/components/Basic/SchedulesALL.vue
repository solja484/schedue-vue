<template>
  <div>
    <button
      v-if="userRole == methodistRole"
      @click="newSchedule()"
      class="btn btn-light mx-5 add-schedule-button"
    >
      <b-icon-plus class="bigger"></b-icon-plus>
      Додати розклад
    </button>
    <div>
      <Title message="Розклади за спеціальністю" additional=""></Title>
      <ScheduleBlock :type="speciality" v-if="!loading"></ScheduleBlock>
      <div class="mx-5" v-for="i in 6" :key="i">
        <b-skeleton class="mx-5  py-2 h-25" v-if="loading"></b-skeleton>
      </div>
      <Title message="Розклади за кафедрами" additional=""></Title>
      <ScheduleBlock :type="subFaculty" v-if="!loading"></ScheduleBlock>
      <Title message="Розклади сесії" additional=""></Title>
      <ScheduleBlock :type="session" v-if="!loading"></ScheduleBlock>
    </div>
  </div>
</template>

<script>
import Title from "../Nested/Title";
import ScheduleBlock from "../Nested/ScheduleBlock";
import { ScheduleType } from "../../models/entities/ScheduleType";
import { CurrentState } from "../../models/entities/CurrentState";
import { Role } from "../../models/entities/Role";
import { BIconPlus, BSkeleton } from "bootstrap-vue";

export default {
  name: "SchedulesALL",
  components: { Title, ScheduleBlock, BIconPlus, BSkeleton },
  data() {
    return {
      speciality: ScheduleType.SPECIALITY,
      subFaculty: ScheduleType.SUBFACULTY,
      session: ScheduleType.SESSION,
      userRole: this.$store.getters["state/role"],
      methodistRole: Role.METHODIST
    };
  },
  computed: {
    loading: function() {
      return this.$store.getters["loading"];
    }
  },
  mounted() {
    this.$store.dispatch("list/fetchFinalSchedules");
  },
  methods: {
    newSchedule: function() {
      this.$store
        .dispatch("state/changeCurrentState", CurrentState.SCHEDULE_NEW)
        .then(() => {
          this.$router.push("/schedules/new");
        })
        .catch(err => console.log(err));
    }
  }
};
</script>

<style lang="scss">
@import "../../assets/scss/_variables.scss";

.add-schedule-button {
  font-size: 20px;
  background: $gray-fill;
  border-color: $gray-border;
  float: right;
}

.text-16 {
  font-size: 16px;
  text-align: left;
}

.text-18 {
  font-size: 18px;
}

.border-none,
.border-none:active,
.border-none:focus,
.border-none:hover {
  border: none;
}

.spoiler-colors {
  color: $spoiler-text;
  background: $spoiler-fill;
  border-color: $spoiler-border;
}
</style>
