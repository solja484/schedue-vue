import {Role} from "../models/entities/Role";
import {CurrentState} from "../models/entities/CurrentState";
import {breadcrumbs} from "../assets/data/breadcrumbs";
import {methodist_hardcoded} from "../assets/data/user_hardcoded";
import axios from "axios";

const stateModule = {
    namespaced: true,
    state: {
        auth: true,
        user: methodist_hardcoded,
        role: Role.METHODIST,
        currentState: CurrentState.MAIN,
        breadcrumbs: breadcrumbs,
    },
    getters: {
        role: state => state.role,
        currentState: state => state.currentState,
        user: state => state.user,
        breadcrumbs: state => state.breadcrumbs,
        auth: state => state.auth
    },
    actions: {
        changeCurrentState({commit}, currentState) {
            commit("setCurrentState", currentState);
        },
        logout({commit}) {
            commit("logout");
        },
        login({commit}, credentials) {
            commit("setLoading", true);
            axios
                .post("/api/login", credentials)
                .then(res => {
                    commit("login", res.data[0]);
                    if (res.data[0].role == 'student') {
                        commit("setUserRole", 'Студент');
                        commit("setRole", Role.STUDENT);
                    } else if (res.data[0].role == 'metodist_dec') {
                        commit("setUserRole", 'Методист');
                        commit("setRole", Role.METHODIST);
                    }
                    commit("setFaculty", res.data[0].faculty_id, {root: true});
                })
                .catch(error => console.log(error))
                .finally(() =>
                    commit("setLoading", false));

        },
    },
    mutations: {
        setCurrentState(state, currentState) {
            state.currentState = currentState;
        },
        setUserRole(state, role) {
            state.user.role = role;
        },
        setRole(state, role) {
            state.role = role;
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