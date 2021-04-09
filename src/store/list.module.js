import axios from "axios";

const schedulesListModule = {
  namespaced: true,
  state: {
    final: [],
    methodist: [],
    loadingElem: false
  },
  getters: {
    final: state => state.final,
    methodist: state => state.methodist,
    loadingElem: state => state.loadingElem
  },
  actions: {
    fetchFinalSchedules({ commit, rootGetters }) {
      commit("setLoading", true, { root: true });
      axios
        .get(`/api/schedules/all`, {
          params: {
            year: rootGetters.currentYear,
            season: rootGetters.currentSeason
          }
        })
        .then(res => {
          commit("setFinalSchedules", res.data);
        })
        .catch(error => console.log(error))
        .finally(() => commit("setLoading", false, { root: true }));
    },
    fetchMethodistSchedules({ commit, rootGetters }) {
      commit("setLoading", true, { root: true });
      axios
        .get(`/api/schedules/methodist`, {
          params: {
            year: rootGetters.currentYear,
            season: rootGetters.currentSeason,
            faculty_id: rootGetters.faculty
          }
        })
        .then(res => commit("setMethodistSchedules", res.data))
        .catch(error => console.log(error))
        .finally(() => commit("setLoading", false, { root: true }));
    },
    changeDraftMode({ commit }, data) {
      commit("setLoadingElem", true);
      axios
        .post("/api/schedule/draft", data)
        .then(() => commit("setScheduleDraftMode", data))
        .catch(err => console.log(err))
        .finally(() => commit("setLoadingElem", false));
    }
  },
  mutations: {
    setScheduleDraftMode(state, data) {
      let schedule = state.methodist.find(sch => sch.id == data.id);
      schedule.draft = data.draft;

      let updatedList = state.methodist.map(item => {
        if (item.id == data.id) return { ...item, draft: data.draft };
        return item;
      });
      state.methodist = updatedList;
    },
    setLoadingElem(state, load) {
      state.loadingElem = load;
    },
    setFinalSchedules(state, data) {
      state.final = data;
    },
    setMethodistSchedules(state, data) {
      state.methodist = data;
    }
  }
};

export default schedulesListModule;
