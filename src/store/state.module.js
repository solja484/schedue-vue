import { Role } from "../models/entities/Role";
import { CurrentState } from "../models/entities/CurrentState";
import { breadcrumbs } from "../assets/data/breadcrumbs";
import {
  methodist_hardcoded
  //  student_hardcoded
} from "../assets/data/userSettings";
import axios from "axios";

const stateModule = {
  namespaced: true,
  state: {
    auth: localStorage.auth,
    user: localStorage.user ? JSON.parse(localStorage.user) : {},
    user2: methodist_hardcoded,
    role: localStorage.role,
    currentState: CurrentState.MAIN,
    breadcrumbs: breadcrumbs
  },
  getters: {
    role: state => state.role,
    currentState: state => state.currentState,
    user: state => state.user,
    breadcrumbs: state => state.breadcrumbs,
    auth: state => state.auth
  },
  actions: {
    changeCurrentState({ commit }, currentState) {
      commit("setCurrentState", currentState);
    },
    logout({ commit }) {
      localStorage.removeItem("user");
      localStorage.role = Role.GUEST;
      localStorage.auth = false;
      commit("logout");
    },
    login({ commit, dispatch }, credentials) {
      commit("setLoading", true, { root: true });
      axios
        .post("/api/user/login", credentials)
        .then(res => {
          localStorage.auth = true;
          commit("login", res.data);
          if (res.data.role == "student") {
            commit("setUserRole", "Студент");
            localStorage.role = Role.STUDENT;
            commit("setRole", Role.STUDENT);
            dispatch("changeFaculty", res.data.student.faculty_id, {
              root: true
            });
          } else if (res.data.role == "metodist_dec") {
            commit("setUserRole", "Методист");
            localStorage.role = Role.METHODIST;
            commit("setRole", Role.METHODIST);
            dispatch("changeFaculty", res.data.methodist.faculty_id, {
              root: true
            });
          }
        })
        .catch(error => console.log(error))
        .finally(() => commit("setLoading", false, { root: true }));
    }
  },
  mutations: {
    setCurrentState(state, currentState) {
      state.currentState = currentState;
    },
    setUserRole(state, role) {
      state.user.role = role;
      localStorage.user = JSON.stringify(state.user);
    },
    setRole(state, role) {
      state.role = role;
    },
    logout(state) {
      state.auth = localStorage.auth;
      state.user = null;
      state.role = localStorage.role;
    },
    login(state, data) {
      localStorage.user = JSON.stringify(data);
      state.user = JSON.parse(localStorage.user);
    }
  }
};
export default stateModule;
