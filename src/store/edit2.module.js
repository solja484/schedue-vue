import axios from "axios";

const editModule = {
  namespaced: true,
  state: {
    selected_faculty: null,
    selected_speciality: null,
    selected_sub_faculty: null,
    selected_study_year: null,
    selected_season: null,
    selected_academic_year: null,
    selected_name: null,
    selected_level: 1,
    schedule_code: null,
    loadingSave: false,
    schedule_type: null,
    editTable: []
  },
  getters: {
    loadingSave: state => state.loadingSave,
    selected_speciality: state => state.selected_speciality,
    selected_sub_faculty: state => state.selected_sub_faculty,
    editTable: state => state.editTable
  },
  actions: {
    setSelectedFaculty({ commit }, faculty) {
      commit("setSelectedFaculty", faculty);
    },
    setScheduleType({ commit }, type) {
      commit("setScheduleType", type);
    },
    setSelectedSpeciality({ commit }, speciality) {
      commit("setSelectedSpeciality", speciality);
    },
    setSelectedSubFaculty({ commit }, subFaculty) {
      commit("setSelectedSubFaculty", subFaculty);
    },
    setSelectedStudyYear({ commit }, studyYear) {
      commit("setSelectedStudyYear", studyYear);
    },
    setSelectedSeason({ commit }, season) {
      commit("setSelectedSeason", season);
    },
    setSelectedAcademicYear({ commit }, academicYear) {
      commit("setSelectedAcademicYear", academicYear);
    },
    setSelectedName({ commit }, name) {
      commit("setSelectedName", name);
    },
    setSelectedLevel({ commit }, level) {
      commit("setSelectedLevel", level);
    },
    setScheduleCode({ commit }, code) {
      commit("setScheduleCode", code);
    },
    setLoadingSave({ commit }, load) {
      commit("setLoadingSave", load);
    },
    clearTable({ commit }) {
      commit("clearTable");
    },
    addRow({ commit }, row) {
      commit("addTableRow", row);
    },
    changeRow({ commit }, row) {
      commit("changeTableRow", row);
    },
    editSchedule({ state, commit }) {
      commit("setLoadingSave", true);
      //console.log("EDIT SCHEDULE POST DATA");
      //  console.log(state);
      axios
        .post(`/api/schedule/edit`, state)
        .then(() => {
          commit("setLoadingSave", false);
        })
        .catch(error => console.log(error))
        .finally(() => commit("clearFields"));
      return state.schedule_code;
    },
    createSchedule({ commit, state }) {
      commit("setLoadingSave", true);
      //   console.log("CREATE SCHEDULE POST DATA");
      //  console.log(state);
      axios
        .post(`/api/schedule/create`, state)
        .then(() => {
          commit("setLoadingSave", false);
        })
        .catch(error => console.log(error))
        .finally(() => commit("clearFields"));
      return state.schedule_code;
    }
  },
  mutations: {
    setSelectedFaculty(state, faculty) {
      state.selected_faculty = faculty;
    },
    setSelectedSpeciality(state, speciality) {
      state.selected_speciality = speciality;
    },
    setSelectedSubFaculty(state, subFaculty) {
      state.selected_sub_faculty = subFaculty;
    },
    setSelectedStudyYear(state, studyYear) {
      state.selected_study_year = studyYear;
    },
    setSelectedSeason(state, season) {
      state.selected_season = season;
    },
    setSelectedAcademicYear(state, academicYear) {
      state.selected_academic_year = academicYear;
    },
    setSelectedName(state, name) {
      state.selected_name = name;
    },
    setSelectedLevel(state, level) {
      state.selected_level = level;
    },
    setScheduleCode(state, code) {
      state.schedule_code = code;
      console.log("set schedule code");
      console.log(state);
    },
    setScheduleType(state, type) {
      state.schedule_type = type;
    },
    setLoadingSave(state, load) {
      state.loadingSave = load;
    },
    addTableRow(state, row) {
      state.editTable.push(row);
    },
    changeTableRow(state, row) {
      let newTable = state.editTable.filter(
        r =>
          r.day_id != row.day_id ||
          r.pair_id != row.pair_id ||
          r.row_num != row.row_num
      );
      newTable.push(row);
      state.editTable = newTable;
    },
    clearTable(state) {
      console.log("CLEAR");
      state.editTable = [];
    },
    clearFields(state) {
      state.selected_faculty = null;
      state.selected_speciality = null;
      state.selected_sub_faculty = null;
      state.selected_study_year = null;
      state.selected_season = null;
      state.selected_academic_year = null;
      state.selected_name = null;
      state.selected_level = 1;
      state.schedule_code = null;
      state.editTable = [];
    }
  }
};

export default editModule;
