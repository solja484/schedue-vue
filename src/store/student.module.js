import axios from "axios";

const studentModule = {
  namespaced: true,
  state: {
    courses: [],
    schedule: [],
    session: [],
    loadingS: false
  },
  getters: {
    schedule: state => state.schedule,
    courses: state => state.courses,
    session: state => state.session,
    loadingSession: state => state.loadingS
  },
  actions: {
    fetchStudentCourses({ commit, rootGetters }) {
      let code = rootGetters["state/user"].code;
      commit("setLoading", true, { root: true });
      axios
        .get(`/api/user/courses`, { params: { code: code } })
        .then(res => {
          commit("setStudentTimetable", res.data);
        })
        .catch(error => console.log(error))
        .finally(() => commit("setLoading", false, { root: true }));
    },
    fetchStudentSession({ commit, rootGetters }) {
      let code = rootGetters["state/user"].code;
      commit("setLoadingSession", true);
      axios
        .get(`/api/user/session`, { params: { code: code } })
        .then(res => {
          commit("setStudentSession", res.data);
        })
        .catch(error => console.log(error))
        .finally(() => commit("setLoadingSession", false));
    }
  },
  mutations: {
    setStudentTimetable(state, data) {
      state.courses = data.course_data;
      state.schedule = data.course_schedule;
    },
    setStudentSession(state, data) {
      state.session = data;
    },
    setLoadingSession(state, load) {
      state.loadingS = load;
    }
  }
};

export default studentModule;
