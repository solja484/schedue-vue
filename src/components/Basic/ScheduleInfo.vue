<template>
  <div v-if="!loading">
    <vue-excel-xlsx
      v-if="!loadingD"
      :columns="headers"
      :data="rows"
      :filename="filename"
      sheetname="Аркуш 1"
      class="btn btn-lg btn-info text-white info-button float-right mx-5"
    >
      <i class="fa fa-download"></i>
      Завантажити
    </vue-excel-xlsx>
    <Title :message="title" :additional="add"></Title>
    <div v-if="user.methodist">
      <a
        class="black-link mx-5 px-5 text-16"
        v-if="schedule.faculty_id == user.methodist.faculty_id"
        @click="editSchedule"
        >Редагувати</a
      >
    </div>
    <div class="container mx-5 my-3">
      <div class="row mb-1">
        <strong class="col-sm-2 text-right mx-1">Факультет</strong>
        <span class="col-sm-8 ">{{ schedule.faculty }}</span>
      </div>
      <div class="row mb-1">
        <strong class="col-sm-2 text-right mx-1">Програма</strong>
        <span class="col-sm-8 " v-if="schedule.level == 1">Бакалаврська</span>
        <span class="col-sm-8 " v-else-if="schedule.level == 2"
          >Магістерська</span
        >
      </div>
      <div class="row mb-1" v-if="schedule.schedule_type != subfaculty">
        <strong class="col-sm-2 text-right mx-1">Рік навчання</strong>
        <span class="col-sm-8 ">{{ studyYear }} </span>
      </div>
      <div class="row mb-1" v-if="schedule.schedule_type == subfaculty">
        <strong class="col-sm-2 text-right mx-1">Кафедра</strong>
        <span class="col-sm-8 ">{{ schedule.subfaculty }}</span>
      </div>
      <div class="row mb-1" v-else>
        <strong class="col-sm-2 text-right mx-1">Спеціальність</strong>
        <span class="col-sm-8 ">{{ schedule.speciality }}</span>
      </div>
    </div>
    <div class="px-5 mt-3">
      <ViewTable
        :schedule_type="schedule.schedule_type"
        :code="schedule.code"
        :currentState="currentState"
      ></ViewTable>
    </div>
  </div>
</template>

<script>
import Title from "../Nested/Title";
import { Role } from "../../models/entities/Role";
import { CurrentState } from "../../models/entities/CurrentState";
import ViewTable from "../Table/ViewTable";
import { ScheduleType } from "../../models/entities/ScheduleType";

export default {
  name: "ScheduleInfo",
  components: { ViewTable, Title },
  props: ["currentState"],
  data() {
    return {
      user: this.$store.getters["state/user"],
      userRole: this.$store.getters["state/userRole"],
      methodist: Role.METHODIST,
      subfaculty: ScheduleType.SUBFACULTY
    };
  },
  computed: {
    title: function() {
      if (!this.schedule) return "";
      return this.schedule.title;
    },
    seasons: function() {
      return this.$store.getters["university/seasons"];
    },
    add: function() {
      const season = this.seasons.find(l => l.number == this.schedule.season);
      if (season) return season.title + " " + this.schedule.academic_year;
      return "" + this.schedule.academic_year;
    },
    studyYear: function() {
      if (this.schedule.level == 1) return this.schedule.study_year;
      else return this.schedule.study_year - 4;
    },
    schedule: function() {
      return this.$store.getters["schedule/viewInfo"];
    },
    courses: function() {
      return this.$store.getters["schedule/viewRows"];
    },
    loading: function() {
      return this.$store.getters["loading"];
    },
    loadingD: function() {
      return (
        this.$store.getters["schedule/loadingTable"] ||
        this.$store.getters["loading"] ||
        this.$store.getters["schedule/fetchingDownloadInfo"]
      );
    },
    headers: function() {
      return this.$store.getters["download/headers"];
    },
    rows: function() {
      return this.$store.getters["download/rows"];
    },
    filename: function() {
      return this.$store.getters["download/filename"];
    }
  },
  mounted() {
    this.$store.dispatch("schedule/fetchScheduleData", this.$route.params.code);
  },
  methods: {
    editSchedule: function() {
      this.$store
        .dispatch("state/changeCurrentState", CurrentState.SCHEDULE_EDIT)
        .then(() => this.$router.push(`/schedules/edit/` + this.schedule.code));
    },
    saveSchedule: function() {
      let filename = this.$store.getters["download/filename"];
      alert(filename);
    }
  }
};
</script>

<style lang="scss">
@import "../../assets/scss/_variables.scss";

.info-button {
  background: $info !important;
  border-color: $info-border !important;
}

.black-link,
.black-link:hover,
.black-link:focus,
.black-link:active {
  color: black;
  cursor: pointer;
}

.text-16 {
  font-size: 16px;
}
</style>
