import Vue from "vue";
import Vuex, { Store } from "vuex";
import universityModule from "./university.module";
import stateModule from "./state.module";
import studentModule from "./student.module";
import scheduleModule from "./schedule.module";
import schedulesListModule from "./list.module";
import editModule from "./edit.module";
import downloadModule from "./download.module";

Vue.use(Vuex);

const store = new Store({
  modules: {
    university: universityModule,
    state: stateModule,
    student: studentModule,
    schedule: scheduleModule,
    list: schedulesListModule,
    edit: editModule,
    download: downloadModule
  },
  state: {
    faculty: null,
    loading: false,
    currentYear: 2020,
    currentSeason: 2
  },
  getters: {
    faculty: state => state.faculty,
    loading: state => state.loading,
    currentYear: state => state.currentYear,
    currentSeason: state => state.currentSeason
  },
  actions: {
    changeFaculty({ commit }, newFaculty) {
      commit("setFaculty", newFaculty);
    }
  },
  mutations: {
    setFaculty(state, newFaculty) {
      state.faculty = newFaculty;
    },
    setLoading(state, load) {
      state.loading = load;
    }
  }
});
export default store;