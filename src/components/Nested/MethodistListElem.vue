<template>
  <div>
    <Title :message="title" additional=""></Title>
    <b-alert
      v-model="showSuccessAlert"
      variant="success"
      dismissible
      class="mt-3 ml-5"
      fade
    >
      Розклад {{ alertTitle }} успішно відкрито для перегляду студентами!
    </b-alert>
    <b-alert
      v-model="hideSuccessAlert"
      variant="info"
      dismissible
      class="mt-3 ml-5"
      fade
    >
      Розклад {{ alertTitle }} закрито для перегляду студентами
    </b-alert>
    <div v-if="type != subfacultyType">
      <div v-for="l in levels" :key="l.course" class="ml-5">
        <button
          v-b-toggle="'col-sub-' + type + l.course"
          class="btn btn-sm btn-block spoiler-colors text-16 mb-1 text-left"
        >
          {{ l.title }} <i class="fa fa-sort-down"></i>
        </button>
        <b-collapse :id="'col-sub-' + type + l.course" class="mt-2">
          <div
            v-for="sch in schedulesByLevel(l.level, l.year)"
            :key="sch.id"
            class=""
          >
            <b-icon-eye-slash
              v-if="sch.draft == 1"
              class="text-muted text-28 m-2 float-left link"
              title="Розклад НЕ доступний для студентів. Натисніть, щоб відкрити доступ."
              @click="showSchedule(sch)"
            ></b-icon-eye-slash>
            <b-icon-eye
              v-else
              class="text-blue text-28  m-2 float-left"
              title="Розклад доступний для студентів. Натисніть, щоб закрити доступ."
              @click="hideSchedule(sch)"
            ></b-icon-eye>
            <BSkeleton
              type="input"
              class="mx-5 my-2"
              v-if="loadingElem && loadingElemId == sch.id"
            ></BSkeleton>
            <ScheduleListELem
              class="mx-5"
              v-else
              :code="sch.code"
              :title="sch.title"
            ></ScheduleListELem>
          </div>
        </b-collapse>
      </div>
    </div>
    <div v-else class="ml-5">
      <div v-for="sch in schedules" :key="sch.id" class="">
        <b-icon-eye-slash
          v-if="sch.draft == 1"
          class="text-muted text-28 m-2 float-left link"
          title="Розклад НЕ доступний для студентів. Натисніть, щоб відкрити доступ."
          @click="showSchedule(sch)"
        ></b-icon-eye-slash>
        <b-icon-eye
          v-else
          class="text-blue text-28  m-2 float-left"
          title="Розклад доступний для студентів. Натисніть, щоб закрити доступ."
          @click="hideSchedule(sch)"
        ></b-icon-eye>
        <BSkeleton
          type="input"
          class="mx-5 my-2"
          v-if="loadingElem && loadingElemId == sch.id"
        ></BSkeleton>
        <ScheduleListELem
          class="mx-5"
          v-else
          :code="sch.code"
          :title="sch.title"
        ></ScheduleListELem>
      </div>
    </div>
  </div>
</template>

<script>
import Title from "../Nested/Title";
import ScheduleListELem from "../Nested/ScheduleListELem";
import { BIconEye, BIconEyeSlash, BAlert, BSkeleton } from "bootstrap-vue";
import { ScheduleType } from "../../models/entities/ScheduleType";

export default {
  name: "MethodistListElem",
  components: {
    ScheduleListELem,
    BIconEyeSlash,
    BIconEye,
    BAlert,
    BSkeleton,
    Title
  },
  props: ["title", "type"],
  data() {
    return {
      showSuccessAlert: false,
      hideSuccessAlert: false,
      subfacultyType: ScheduleType.SUBFACULTY,
      loadingElemId: 0,
      alertTitle: ""
    };
  },
  computed: {
    levels: function() {
      return this.$store.getters["university/levels"];
    },
    schedules: function() {
      return this.$store.getters["list/methodist"].filter(
        s => s.schedule_type == this.type
      );
    },
    loadingElem: function() {
      return this.$store.getters["list/loadingElem"];
    }
  },
  methods: {
    schedulesByLevel: function(level, year) {
      return this.schedules.filter(
        s => s.level == level && s.study_year == year
      );
    },
    showSchedule: function(schedule) {
      console.log(schedule);
      this.loadingElemId = schedule.id;
      this.$store
        .dispatch("list/changeDraftMode", { id: schedule.id, draft: 0 })
        .then(() => {
          this.loadingElemId = 0;
          this.alertTitle = '"' + schedule.title + '"';
        })
        .catch(err => console.log(err))
        .finally(() => (this.showSuccessAlert = true));
    },
    hideSchedule: function(schedule) {
      console.log(schedule);
      this.loadingElemId = schedule.id;
      this.$store
        .dispatch("list/changeDraftMode", { id: schedule.id, draft: 1 })
        .then(() => {
          this.loadingElemId = 0;
          this.alertTitle = '"' + schedule.title + '"';
        })
        .catch(err => console.log(err))
        .finally(() => (this.hideSuccessAlert = true));
    }
  }
};
</script>

<style scoped>
.text-blue {
  color: #6699cc; /*#336699;*/
}

.text-16 {
  font-size: 16px;
}

.text-28 {
  font-size: 20px;
  vertical-align: middle;
}

.link {
  cursor: pointer;
}
</style>
