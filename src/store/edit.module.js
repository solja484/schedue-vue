import axios from "axios";

const currentYear = 2020;
const editModule = {
  namespaced: true,
  state: {
    selected_faculty_name: "",
    selected_faculty: null,
    selected_speciality: null,
    selected_sub_faculty: null,
    selected_study_year: null,
    selected_season: null,
    selected_academic_year: null,
    selected_name: null,
    selected_level: 1,
    schedule_code: null,
    schedule_type: null,
    loadingSave: false,
    loadingTable: false,
    editTable: [],
    tableRows: []
  },
  getters: {
    selected_faculty_name: state => state.selected_faculty_name,
    selected_speciality: state => state.selected_speciality,
    selected_sub_faculty: state => state.selected_sub_faculty,
    selected_faculty: state => state.selected_faculty,
    selected_study_year: state => state.selected_study_year,
    selected_season: state => state.selected_season,
    selected_academic_year: state => state.selected_academic_year,
    selected_name: state => state.selected_name,
    selected_level: state => state.selected_level,
    schedule_code: state => state.schedule_code,
    schedule_type: state => state.schedule_type,
    editTable: state => state.editTable,
    loadingSave: state => state.loadingSave,
    loadingTable: state => state.loadingTable,
    tableRows: state => state.tableRows,
    editRow: state => index => state.tableRows[index],
    getRowspanPair: state => (pair_id, day_id) => {
      let rowspan = 0;
      state.editTable.forEach(function(c) {
        if (c.pair_id == pair_id && c.day_id == day_id) rowspan++;
      });
      if (rowspan == 0) return 2;
      rowspan++;
      return rowspan;
    },
    getRowspanAll: (state, getters) => day_id => {
      let result = 3;
      for (let i = 1; i < 8; i++) {
        result += getters.getRowspanPair(i, day_id);
      }
      return result;
    }
  },
  actions: {
    fetchEditScheduleData({ commit, dispatch }, code) {
      commit("setLoading", true, { root: true });
      axios
        .get(`/api/schedule/` + code)
        .then(res => {
          commit("setEditScheduleData", res.data.schedule);
          commit("setEditTable", res.data.courses);
        })
        .catch(err => console.log(err))
        .finally(() => {
          dispatch("setTableRows");
          dispatch("fetchAvailableCourses");
          commit("setLoading", false, { root: true });
        });
    },
    fetchNewScheduleData({ commit, rootGetters, dispatch }, type) {
      commit("setLoading", true, { root: true });
      axios
        .get("/api/schedule/new")
        .then(res => {
          commit("setCreateScheduleData", {
            code: res.data,
            type: type,
            faculty_id: rootGetters["state/user"].methodist.faculty_id,
            faculty: rootGetters["state/user"].methodist.faculty
          });
          commit("clearTable");
        })
        .catch(error => console.log(error))
        .finally(() => {
          dispatch("fetchAvailableCourses");
          dispatch("setTableRows");
          commit("setLoading", false, { root: true });
        });
    },
    setScheduleType({ commit }, type) {
      commit("setScheduleType", type);
    },
    setSelectedFaculty({ commit }, faculty) {
      commit("setSelectedFaculty", faculty);
    },
    setSelectedSpeciality({ commit, dispatch }, speciality) {
      commit("setSelectedSpeciality", speciality);
      dispatch("fetchAvailableCourses");
    },
    setSelectedSubFaculty({ commit }, subFaculty) {
      commit("setSelectedSubFaculty", subFaculty);
    },
    setSelectedStudyYear({ commit }, studyYear) {
      commit("setSelectedStudyYear", studyYear);
    },
    setSelectedSeason({ commit, dispatch }, season) {
      commit("setSelectedSeason", season);
      dispatch("fetchAvailableCourses");
    },
    setSelectedAcademicYear({ commit, dispatch }, academicYear) {
      commit("setSelectedAcademicYear", academicYear);
      dispatch("fetchAvailableCourses");
    },
    setSelectedName({ commit }, name) {
      commit("setSelectedName", name);
    },
    setSelectedLevel({ commit, dispatch }, level) {
      commit("setSelectedLevel", level);
      dispatch("fetchAvailableCourses");
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
    deleteRow({ commit }, row) {
      commit("deleteTableRow", row);
    },
    editSchedule({ state, commit }) {
      commit("setLoadingSave", true);
      let tableToSave = [];
      for (let i = 1; i < 7; i++) {
        tableToSave = tableToSave.concat(
          state.tableRows[i].filter(c => c.course_code && c.course_code != "")
        );
        console.log(
          state.tableRows[i].filter(c => c.course_code && c.course_code != "")
        );
      }
      state.editTable = tableToSave;
      console.log(tableToSave);
      axios.post(`/api/schedule/edit`, state).then(() => {
        commit("setLoadingSave", false);
      });
      //  .catch(error => console.log(error))
      //  .finally(() => commit("clearFields"));
    },
    createSchedule({ commit, state }) {
      commit("setLoadingSave", true);
      axios
        .post(`/api/schedule/create`, state)
        .then(() => {
          commit("setLoadingSave", false);
        })
        .catch(error => console.log(error))
        .finally(() => commit("clearFields"));
    },
    fetchAvailableCourses({ commit, state, dispatch }) {
      commit("setLoadingTable", true);
      axios
        .get("/api/university/courses", {
          params: {
            faculty: state.selected_faculty,
            speciality: state.selected_speciality,
            level: state.selected_level,
            season: state.selected_season,
            academic_year: state.selected_academic_year
          }
        })
        .then(res => {
          dispatch("schedule/setAvailableCourses", res.data, {
            root: true
          }).then(() => commit("setLoadingTable", false));
        });
    },
    setTableRows({ state, commit, getters, rootGetters }) {
      let rows = [];
      let result = [];
      for (let day of rootGetters["university/days"]) {
        result = [];
        for (let i = 1; i < 8; i++) {
          let counter = 0;
          for (let course of state.editTable.filter(c => c.day_id == day.id)) {
            if (course.pair_id == i) {
              counter++;
              if (counter == 1)
                result.push({
                  rowspan: getters.getRowspanPair(i, day.id),
                  time: rootGetters["university/pairs"].find(p => p.number == i)
                    .time
                });
              course["row_num"] = counter;
              result.push(course);
            }
          }
          if (counter == 0) {
            const empty = {
              id: i,
              name: "",
              course_code: "",
              group: 100,
              pair_id: i,
              day_id: day.id,
              weeks: "",
              classroom: "",
              teacher: "",
              row_num: 1
            };
            result.push({
              rowspan: 2,
              time: rootGetters["university/pairs"].find(p => p.number == i)
                .time
            });
            result.push(empty);
          }
        }
        rows[day.id] = result;
      }
      commit("setTableRows", rows);
    }
  },
  mutations: {
    setEditScheduleData(state, data) {
      state.selected_faculty = data.faculty_id;
      state.selected_speciality = data.speciality_id;
      state.selected_sub_faculty = data.subfaculty_id;
      state.selected_study_year = data.study_year;
      state.selected_season = data.season;
      state.selected_academic_year = data.academic_year;
      state.selected_name = data.title;
      state.selected_level = data.level;
      state.schedule_code = data.code;
      state.schedule_type = data.schedule_type;
      state.selected_faculty_name = data.faculty;
    },
    setCreateScheduleData(state, data) {
      state.schedule_code = data.code;
      state.schedule_type = data.type;
      state.selected_faculty = data.faculty_id;
      state.selected_faculty_name = data.faculty;
      state.selected_speciality = null;
      state.selected_sub_faculty = null;
      state.selected_study_year = 1;
      state.selected_season = 1;
      state.selected_academic_year = currentYear;
      state.selected_name = "";
      state.selected_level = 1;
      state.editTable = [];
    },
    setEditTable(state, data) {
      state.editTable = data;
    },
    setTableRows(state, rows) {
      console.log("TABLE ROWS", rows);
      state.tableRows = rows;
    },
    setSelectedSpeciality(state, speciality) {
      state.selected_speciality = speciality;
    },
    setSelectedFaculty(state, faculty) {
      state.selected_faculty = faculty;
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
    },
    setScheduleType(state, type) {
      state.schedule_type = type;
    },
    setLoadingSave(state, load) {
      state.loadingSave = load;
    },
    setLoadingTable(state, load) {
      state.loadingTable = load;
    },
    addTableRow(state, row) {
      state.tableRows[row.day_id].push(row);
      console.log(state.tableRows[row.day_id]);
    },
    changeTableRow(state, row) {
      let newTable = state.tableRows[row.day_id].filter(
        r =>
          r.day_id != row.day_id ||
          r.pair_id != row.pair_id ||
          r.row_num != row.row_num
      );
      newTable.push(row);
      state.tableRows[row.day_id] = newTable;
    },
    deleteTableRow(state, row) {
      state.tableRows[row.day_id] = state.tableRows[row.day_id].filter(
        r =>
          r.day_id != row.day_id ||
          r.pair_id != row.pair_id ||
          r.row_num != row.row_num
      );
    },
    clearTable(state) {
      console.log("CLEAR");
      state.editTable = [];
      state.tableRows = [];
    },
    clearFields(state) {
      state.selected_faculty = null;
      state.selected_speciality = null;
      state.selected_sub_faculty = null;
      state.selected_study_year = 1;
      state.selected_season = 1;
      state.selected_academic_year = currentYear;
      state.selected_name = "";
      state.selected_level = 1;
      state.schedule_code = null;
      state.schedule_type = null;
      state.editTable = [];
      state.tableRows = [];
    }
  }
};

export default editModule;
