import { levels, seasons, days, pairs } from "../assets/data/static";
import { schedule_types } from "../assets/data/schedule_types";
import axios from "axios";

const universityModule = {
  namespaced: true,
  state: {
    faculties: [],
    speciality: [],
    sub_faculty: [],
    days: days,
    pairs: pairs,
    levels: levels,
    seasons: seasons,
    academic_year: 2020,
    schedule_types: schedule_types,
    current_season: 2
  },
  getters: {
    days: state => state.days,
    pairs: state => state.pairs,
    faculties: state => state.faculties,
    sub_faculty: state => state.sub_faculty,
    speciality: state => state.speciality,
    levels: state => state.levels,
    seasons: state => state.seasons,
    academic_year: state => state.academic_year,
    schedule_types: state => state.schedule_types,
    currentSeason: state => state.current_season
  },
  actions: {
    fetchFaculties({ commit }) {
      commit("setLoading", true, { root: true });
      axios
        .get(`/api/university/faculty`)
        .then(res => {
          commit("setFaculties", res.data);
        })
        .catch(error => console.log(error))
        .finally(() => commit("setLoading", false, { root: true }));
    },
    fetchSubFaculties({ commit }) {
      commit("setLoading", true, { root: true });
      axios
        .get(`/api/university/sub_faculty`)
        .then(res => {
          commit("setSubFaculties", res.data);
        })
        .catch(error => console.log(error))
        .finally(() => commit("setLoading", false, { root: true }));
    },
    fetchSpeciality({ commit }) {
      commit("setLoading", true, { root: true });
      axios
        .get(`/api/university/speciality`)
        .then(res => {
          commit("setSpeciality", res.data);
        })
        .catch(error => console.log(error))
        .finally(() => commit("setLoading", false, { root: true }));
    }
  },
  mutations: {
    setFaculties(state, data) {
      state.faculties = data;
    },
    setSubFaculties(state, data) {
      state.sub_faculty = data;
    },
    setSpeciality(state, data) {
      state.speciality = data;
    }
  }
};

export default universityModule;
