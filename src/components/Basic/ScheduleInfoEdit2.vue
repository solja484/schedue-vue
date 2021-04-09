<template>
  <div v-if="!(loading || loadingTable)">
    <button
      @click="saveSchedule"
      class="btn btn-info btn-lg float-right mx-5 info-button"
      :disabled="
        (selected_speciality == null && selected_sub_faculty == null) ||
          selected_name.length == 0
      "
    >
      <i class="fa fa-spinner fa-pulse fa-fw" v-if="loadingSave"></i>
      <i class="fa fa-save" v-else></i> Зберегти
    </button>
    <Title
      v-if="currentState == createState"
      message="Новий розклад "
      :additional="editInfo.code"
    ></Title>
    <Title
      v-else-if="currentState == editState"
      message="Редагування розкладу "
      :additional="editInfo.code"
    ></Title>
    <b-alert
      fade
      variant="success"
      dismissible
      class="mx-5 px-5"
      v-model="showSaveAlert"
      v-if="!loadingSave"
    >
      Зміни збережено
    </b-alert>
    <div class="container mx-5">
      <div class="row">
        <strong class="col-sm-2 text-right text-14">Факультет</strong>
        <b-form-select
          v-model="selected_faculty"
          class="col-sm-4 text-14 mb-1"
          size="sm"
          disabled
        >
          <b-form-select-option :value="methodist.faculty_id"
            >{{ methodist.faculty_name }}
          </b-form-select-option>
        </b-form-select>
      </div>
      <div class="row">
        <strong class="col-sm-2 text-right text-14">Програма</strong>
        <b-form-group
          class="col-sm-4 text-14 mb-1"
          v-slot="{ ariaDescribedby }"
        >
          <b-form-radio-group
            v-model="selected_level"
            :options="level_options"
            :aria-describedby="ariaDescribedby"
          ></b-form-radio-group>
        </b-form-group>
      </div>
      <div class="row " v-if="schedule_type != sub_faculty_type">
        <strong class="col-sm-2 text-right text-14">Спеціальність</strong>
        <b-form-select
          v-model="selected_speciality"
          class="col-sm-4 text-14 mb-1"
          size="sm"
          :disabled="selected_level == null"
        >
          <b-form-select-option :value="null">Не обрано</b-form-select-option>
          <b-form-select-option
            v-for="s in specialityFiltered"
            :key="s.id"
            :value="s.id"
            class="text-14"
          >
            {{ s.name }}
          </b-form-select-option>
        </b-form-select>
        <div class=" col-sm-6"></div>
      </div>
      <div class="row " v-else-if="schedule_type == sub_faculty_type">
        <strong class="col-sm-2 text-right text-14">Кафедра</strong>
        <b-form-select
          v-model="selected_sub_faculty"
          class="col-sm-4 text-14 mb-1"
          size="sm"
        >
          <b-form-select-option :value="null">Не обрано</b-form-select-option>
          <b-form-select-option
            v-for="s in subfacultyFiltered"
            :key="s.id"
            :value="s.id"
            class="text-14"
          >
            {{ s.name }}
          </b-form-select-option>
        </b-form-select>
        <div class=" col-sm-6"></div>
      </div>
      <div class="row" v-if="schedule_type != sub_faculty_type">
        <strong class="col-sm-2 text-right text-14">Рік навчання</strong>
        <b-form-select
          v-model="selected_study_year"
          class="col-sm-1 text-14 mb-1"
          size="sm"
        >
          <b-form-select-option
            v-for="l in yearsByLevel"
            :key="l.course"
            :value="l.year"
            class="text-14"
          >
            {{ l.year }}
          </b-form-select-option>
        </b-form-select>
      </div>
      <div class="row">
        <strong class="col-sm-2 text-right text-14 vertical-middle"
          >Триместр</strong
        >
        <b-form-select
          v-model="selected_season"
          class="col-sm-1 text-14 mb-1"
          size="sm"
        >
          <b-form-select-option
            v-for="s in seasons"
            :key="s.number"
            :value="s.number"
            class="text-14"
          >
            {{ s.title }}
          </b-form-select-option>
        </b-form-select>
      </div>
      <div class="row">
        <strong class="col-sm-2 text-right text-14">Рік</strong>
        <b-form-select
          v-model="selected_academic_year"
          class="col-sm-1 text-14 mb-1"
          size="sm"
        >
          <b-form-select-option :value="academic_year" class="text-14">
            {{ academic_year }}
          </b-form-select-option>
          <b-form-select-option :value="next_academic_year" class="text-14">
            {{ next_academic_year }}
          </b-form-select-option>
        </b-form-select>
      </div>
      <div class="row mt-2">
        <strong class="col-sm-2 text-right text-14">Назва</strong>
        <b-form-input
          class="col-sm-4 t text-14"
          maxlength="100"
          v-model="selected_name"
        ></b-form-input>
      </div>
    </div>
    <div class="px-5 mt-3" v-if="!(loadingTable || loading)">
      <ViewTable
        :schedule_type="schedule_type"
        :code="schedule_code"
        :currentState="currentState"
        :id="'viewschedule-' + schedule_code"
        :disable="selected_speciality == null && selected_sub_faculty == null"
      ></ViewTable>
    </div>
    <div v-else class="px-5 mt-3">
      <b-skeleton-table
        :rows="20"
        :columns="7"
        :table-props="{ bordered: true, striped: true, align: true }"
      ></b-skeleton-table>
    </div>
    <div class="mx-5 pl-5 pr-0 mb-5">
      <div class="row ml-5 text-middle">
        <button
          @click="saveSchedule"
          class="btn btn-info btn-lg mt-2 col-md-2 info-button"
          :disabled="
            selected_speciality == null && selected_sub_faculty == null
          "
        >
          <i class="fa fa-save"></i>
          Зберегти зміни
        </button>
        <div class="col-md-7"></div>
        <div class="col-md-3">
          <a
            class="text-danger text-16 p-2 text-middle float-right pointer"
            @click="showDeleteAlert = !showDeleteAlert"
            v-if="currentState == editState"
          >
            <i class="fa fa-trash mx-1"></i>
            Видалити розклад</a
          >
        </div>
      </div>
    </div>
    <b-alert
      fade
      variant="danger"
      dismissible
      class="mx-5 px-5 delete-alert"
      v-model="showDeleteAlert"
    >
      <h4 class="alert-heading">Видалення розкладу</h4>
      <hr />
      <p>
        Ви впевнені, що хочете видалити розклад? Відмінити цю дію буде неможливо
      </p>
      <p class="mb-0">
        <button class="btn " @click="showDeleteAlert = !showDeleteAlert">
          Скасувати
        </button>
        <button class="btn btn-danger" @click="deleteSchedule">Видалити</button>
      </p>
    </b-alert>
  </div>
  <div v-else>
    <div class="mx-5 mt-5 text-center">
      <div class="row m-2 mb-4">
        <b-skeleton type="input" class=" col-md-7 py-4 float-left"></b-skeleton>
        <div class="col-md-4 py-4"></div>
        <b-skeleton type="input" class="col-md-1 py-4 float-right"></b-skeleton>
      </div>

      <div class="row m-2">
        <div class="col-md-1"></div>
        <b-skeleton type="text" class="col-md-1"></b-skeleton>
        <b-skeleton type="text" class="col-md-4 mx-3 py-3"></b-skeleton>
      </div>
      <div class="row m-2">
        <div class="col-md-1"></div>
        <b-skeleton type="text" class="col-md-1"></b-skeleton>
        <b-skeleton type="text" class="col-md-4 mx-3"></b-skeleton>
      </div>
      <div class="row m-2">
        <div class="col-md-1"></div>
        <b-skeleton type="text" class="col-md-1"></b-skeleton>
        <b-skeleton type="text" class="col-md-4 mx-3 py-3"></b-skeleton>
      </div>
      <div class="row m-2">
        <div class="col-md-1"></div>
        <b-skeleton type="text" class="col-md-1"></b-skeleton>
        <b-skeleton type="text" class="col-md-1 mx-3 py-3"></b-skeleton>
      </div>
      <div class="row m-2">
        <div class="col-md-1"></div>
        <b-skeleton type="text" class="col-md-1"></b-skeleton>
        <b-skeleton type="text" class="col-md-1 mx-3 py-3"></b-skeleton>
      </div>
      <div class="row m-2">
        <div class="col-md-1"></div>
        <b-skeleton type="text" class="col-md-1"></b-skeleton>
        <b-skeleton type="text" class="col-md-1 mx-3  py-3"></b-skeleton>
      </div>
      <div class="row m-2">
        <div class="col-md-1  py-3"></div>
        <b-skeleton type="text" class="col-md-1  "></b-skeleton>
        <b-skeleton type="text" class="col-md-4 mx-3  py-3"></b-skeleton>
      </div>
    </div>
    <div class="px-5">
      <b-skeleton-table
        :rows="20"
        :columns="7"
        :table-props="{ bordered: true, striped: true, align: true }"
      ></b-skeleton-table>
    </div>
  </div>
</template>

<script>
import Title from "../../components/Nested/Title";
import { CurrentState } from "../../models/entities/CurrentState";
import { ScheduleType } from "../../models/entities/ScheduleType";
import {
  BFormSelect,
  BFormSelectOption,
  BFormGroup,
  BFormRadioGroup,
  BFormInput,
  BSkeletonTable,
  BSkeleton,
  BAlert
} from "bootstrap-vue";
import ViewTable from "../Table/ViewTable";

export default {
  name: "ScheduleInfoEdit2",
  components: {
    ViewTable,
    Title,
    BFormSelect,
    BFormSelectOption,
    BFormGroup,
    BFormRadioGroup,
    BFormInput,
    BSkeletonTable,
    BSkeleton,
    BAlert
  },
  data() {
    return {
      currentState: this.$store.getters["state/currentState"],
      showDeleteAlert: false,
      showSaveAlert: false,
      createState: CurrentState.SCHEDULE_CREATE,
      editState: CurrentState.SCHEDULE_EDIT,
      sub_faculty_type: ScheduleType.SUBFACULTY,
      academic_year: this.$store.getters["university/academic_year"],
      methodist: this.$store.getters["state/user"].methodist,
      sub_faculty_all: this.$store.getters["university/sub_faculty"],
      speciality_all: this.$store.getters["university/speciality"],
      faculty_all: this.$store.getters["university/faculties"],
      seasons: this.$store.getters["university/seasons"],
      courses: this.$store.getters["schedule/availableCourses"],
      selected_faculty: this.$store.getters["state/user"].methodist.faculty_id,
      selected_speciality: null,
      selected_sub_faculty: null,
      selected_study_year: null,
      selected_season: null,
      selected_academic_year: null,
      selected_name: "",
      selected_level: 1,
      schedule_code: this.$route.params.code,
      level_options: [
        { text: "Бакалаврська", value: 1 },
        { text: "Магістерська", value: 2 }
      ]
    };
  },
  computed: {
    yearsByLevel: function() {
      return this.$store.getters["university/levels"].filter(
        l => l.level == this.selected_level
      );
    },
    next_academic_year: function() {
      return this.academic_year + 1;
    },
    subfacultyFiltered: function() {
      if (this.schedule_type == this.sub_faculty_type)
        return this.sub_faculty_all.filter(
          s => s.faculty_id == this.selected_faculty
        );
      return [];
    },
    specialityFiltered: function() {
      if (this.schedule_type != this.sub_faculty_type)
        return this.speciality_all.filter(
          s =>
            s.faculty_id == this.selected_faculty &&
            s.level == this.selected_level
        );
      return [];
    },
    editInfo: function() {
      return this.$store.getters["schedule/editInfo"];
    },
    schedule_type: function() {
      return this.$store.getters["schedule/editInfo"].schedule_type;
    },
    loading: function() {
      return this.$store.getters["loading"];
    },
    loadingTable: function() {
      return this.$store.getters["schedule/loadingTable"];
    },
    loadingSave: function() {
      return this.$store.getters["edit/loadingSave"];
    }
  },
  watch: {
    editInfo: function() {
      this.selected_speciality = this.editInfo.speciality_id;
      this.selected_sub_faculty = this.editInfo.subfaculty_id;
      this.selected_study_year = this.editInfo.study_year;
      this.selected_season = this.editInfo.season;
      this.selected_academic_year = this.editInfo.academic_year;
      this.selected_name = this.editInfo.title;
      this.selected_level = this.editInfo.level;
      this.schedule_code = this.editInfo.code;
      this.$store.dispatch("edit/setScheduleType", this.editInfo.schedule_type);
    },
    selected_level: function() {
      this.selected_speciality = null;
      this.selected_sub_faculty = null;
      this.$store.dispatch("edit/setSelectedLevel", this.selected_level);
    },
    selected_speciality: function() {
      this.fetchAvailableCourses();
      this.$store.dispatch(
        "edit/setSelectedSpeciality",
        this.selected_speciality
      );
    },
    selected_sub_faculty: function() {
      this.fetchAvailableCourses();
      this.$store.dispatch(
        "edit/setSelectedSubFaculty",
        this.selected_sub_faculty
      );
    },
    selected_academic_year: function() {
      if (
        this.selected_level &&
        this.selected_season &&
        this.selected_academic_year
      )
        this.fetchAvailableCourses();
      this.$store.dispatch(
        "edit/setSelectedAcademicYear",
        this.selected_academic_year
      );
    },
    selected_season: function() {
      if (
        this.selected_level &&
        this.selected_season &&
        this.selected_academic_year
      )
        this.fetchAvailableCourses();
      this.$store.dispatch("edit/setSelectedSeason", this.selected_season);
    },
    selected_study_year: function() {
      this.$store.dispatch(
        "edit/setSelectedStudyYear",
        this.selected_study_year
      );
    },
    selected_name: function() {
      this.$store.dispatch("edit/setSelectedName", this.selected_name);
    }
  },
  methods: {
    fetchAvailableCourses: function() {
      const data = {
        speciality: this.selected_speciality,
        faculty: this.methodist.faculty_id,
        level: this.selected_level,
        academic_year: this.selected_academic_year,
        season: this.selected_season
      };
      this.$store.dispatch("schedule/fetchAvailableCourses", data);
    },
    saveSchedule: function() {
      if (this.currentState == this.editState)
        this.$store.dispatch("edit/editSchedule").then(() => {
          this.showSaveAlert = true;
          // this.$router.push('/schedules/view/' + this.editInfo.code);
        });
      else if (this.currentState == this.createState)
        this.$store.dispatch("edit/createSchedule").then(() => {
          //this.showSaveAlert=true;
          this.$router.push("/schedules/view/" + this.editInfo.code);
        });
    },
    deleteSchedule: function() {
      this.$store
        .dispatch("schedule/deleteSchedule", this.editInfo.code)
        .then(() =>
          this.$store.dispatch(
            "state/changeCurrentState",
            CurrentState.SCHEDULES_ALL
          )
        )
        .then(() => this.$router.push("/schedules"))
        .catch(err => console.log(err));
      return null;
    },
    setSelecteds() {
      this.selected_speciality = this.editInfo.speciality_id;
      this.selected_sub_faculty = this.editInfo.subfaculty_id;
      this.selected_study_year = this.editInfo.study_year;
      this.selected_season = this.editInfo.season;
      this.selected_academic_year = this.editInfo.academic_year;
      this.selected_name = this.editInfo.title;
      this.selected_level = this.editInfo.level;
    }
  },
  mounted() {
    if (this.$route.params.code != this.editInfo.code) {
      this.$store
        .dispatch("schedule/fetchScheduleDataForEdit", this.$route.params.code)
        .then(() => {
          this.$store.dispatch(
            "state/changeCurrentState",
            CurrentState.SCHEDULE_EDIT
          );
        })
        .catch(err => console.log(err))
        .finally(() => {
          this.setSelecteds();
          console.log(this.editInfo);
        });
    } else {
      this.setSelecteds();
    }
    this.$store.dispatch(
      "edit/setSelectedFaculty",
      this.$store.getters["faculty"]
    );
    this.$store.dispatch("edit/setScheduleCode", this.$route.params.code);
    this.$store.dispatch("edit/setScheduleType", this.editInfo.schedule_type);
  }
};
</script>

<style scoped lang="scss">
@import "../../assets/scss/_variables.scss";

.float-right {
  float: right !important;
}

.pointer,
.pointer:focus,
.pointer:hover,
.pointer:active {
  cursor: pointer;
}

.text-14 {
  font-size: 14px;
}

.text-16 {
  font-size: 16px;
}

.vertical-middle {
  vertical-align: middle !important;
}

.info-button {
  background: $info !important;
  border-color: $info-border !important;
}
</style>
