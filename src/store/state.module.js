import { Role } from "../models/entities/Role";
import { CurrentState } from "../models/entities/CurrentState";
import { breadcrumbs } from "../assets/data/breadcrumbs";
import {
  methodist_hardcoded,
  student_hardcoded
} from "../assets/data/user_hardcoded";
import axios from "axios";

const stateModule = {
  namespaced: true,
  state: {
    auth: localStorage.getItem("auth"),
    user: methodist_hardcoded,
    user2: student_hardcoded,
    role: Role.METHODIST,
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
      localStorage.setItem("auth", "N");
      localStorage.setItem("login", "");
      localStorage.setItem("password", "");
      commit("logout");
    },
    login({ commit }, credentials) {
      commit("setLoading", true);
      axios
        .post("/api/user/login", credentials)
        .then(res => {
          localStorage.setItem("auth", "Y");
          localStorage.setItem("login", credentials.login);
          localStorage.setItem("password", credentials.password);
          commit("login", res.data);
          if (res.data.role == "student") {
            commit("setUserRole", "Студент");
            commit("setRole", Role.STUDENT);
          } else if (res.data.role == "metodist_dec") {
            commit("setUserRole", "Методист");
            commit("setRole", Role.METHODIST);
          }
          commit("setFaculty", res.data.faculty_id, { root: true });
        })
        .catch(error => console.log(error))
        .finally(() => commit("setLoading", false));
    }
  },
  mutations: {
    setCurrentState(state, currentState) {
      state.currentState = currentState;
    },
    setUserRole(state, role) {
      state.user.role = role;
      localStorage.setItem("roleCyr", role);
    },
    setRole(state, role) {
      state.role = role;
      localStorage.setItem("role", role);
    },
    logout(state) {
      state.user = {};
      state.role = Role.GUEST;
    },
    login(state, data) {
      state.user = data;
    }
  }
};
export default stateModule;
