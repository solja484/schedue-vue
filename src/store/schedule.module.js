import axios from "axios";

const scheduleModule = {
  namespaced: true,
  state: {
    viewInfo: {},
    viewRows: [],
    availableCourses: [],
    createType: null,
    fetchingDownloadInfo: false
  },
  getters: {
    viewInfo: state => state.viewInfo,
    viewRows: state => state.viewRows,
    fetchingDownloadInfo: state => state.fetchingDownloadInfo,
    availableCourses: state => state.availableCourses
  },
  actions: {
    setCreateType({ commit }, createType) {
      commit("setCreateType", createType);
    },
    fetchScheduleData({ commit, dispatch }, code) {
      commit("setLoading", true, { root: true });
      axios
        .get(`/api/schedule/` + code)
        .then(res => {
          commit("setViewInfo", res.data.schedule);
          commit("setViewRows", res.data.courses);
          console.log(res.data);
          commit("setDownloadInfoLoading", true);
          dispatch("download/setDownloadInfo", res.data, { root: true }).then(
            commit("setDownloadInfoLoading", false)
          );
        })
        .catch(error => console.log(error))
        .finally(() => {
          commit("setLoading", false, { root: true });
        });
    },
    deleteSchedule({ commit }, code) {
      commit("setLoading", true, { root: true });
      axios
        .post(`/api/schedule/delete`, { code: code })
        .then(() => {
          commit("deleteSchedule");
        })
        .catch(error => console.log(error))
        .finally(() => commit("setLoading", false, { root: true }));
    },
    setAvailableCourses({ commit }, courses) {
      commit("setAvailableCourses", courses);
    }
  },
  mutations: {
    setCreateType(state, createType) {
      state.createType = createType;
    },
    setViewInfo(state, data) {
      state.viewInfo = data;
    },
    setViewRows(state, data) {
      state.viewRows = data;
    },
    setAvailableCourses(state, data) {
      state.availableCourses = data;
    },
    setTableLoading(state, load) {
      state.loadingTable = load;
    },
    setDownloadInfoLoading(state, load) {
      state.fetchingDownloadInfo = load;
    },
    deleteSchedule(state) {
      state.viewInfo = {};
      state.viewRows = [];
    }
  }
};

export default scheduleModule;
