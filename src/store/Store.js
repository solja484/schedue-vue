import Vue from "vue";
import Vuex, {Store} from "vuex";
import axios from "axios";
import {CurrentState} from "../models/entities/CurrentState";
import {ScheduleType} from "../models/entities/ScheduleType"
import {Role} from "../models/entities/Role";
import {breadcrumbs} from "../assets/api/breadcrumbs";
import universityModule from "./university.module";

Vue.use(Vuex);

const currentYear = 2020, currentSeason=2;
const methodist_hardcoded = {
    id: 79461,
    link: 1861,
    role: 'Методист',
    code: '100000',
    name: 'Тестовий методист',
    methodist: {faculty_id: 123, faculty_name: 'Факультет інформатики'}
};
/*const student_hardcoded = {
    id: 68937,
    link: 66950,
    role: 'Студент',
    code: '204186',
    name: 'Андрусів Соломія Ігорівна',
    student: {
        spec_id: 1472,
        speciality: 'Інженерія програмного забезпечення',
        faculty_id: 123,
        faculty_name: 'Факультет інформатики'
    }
};*/
const store = new Store({

    //TODO store.dispatch('university/fetchFaculties');
        modules: {
            university:universityModule
        },
        state: {
            editableSchedule: {
                selected_faculty: null,
                selected_speciality: null,
                selected_sub_faculty: null,
                selected_level: 1,
                selected_study_year: 1,
                selected_season: 1,
                selected_academic_year: currentYear,
                notes: "",
                schedule_type: ScheduleType.IDLE
            },
            scheduleInfo: {},
            scheduleCourses: [],
            editableCourses: [],
            finalSchedules: [],
            methodistSchedules: [],
            auth: true,
            user: methodist_hardcoded,
            role: Role.METHODIST,
            currentState: CurrentState.MAIN,
            breadcrumbs: breadcrumbs,
            schedule: [],
            loading: false
        },
        getters: {
            role: state => state.role,
            currentState: state => state.currentState,
            user: state => state.user,
            breadcrumbs: state => state.breadcrumbs,

            finalSchedules: state => state.finalSchedules,
            methodistSchedules: state => state.methodistSchedules,

            editableSchedule: state => state.editableSchedule,
            scheduleInfo: state => state.scheduleInfo,
            scheduleCourses: state => state.scheduleCourses,
            editableCourses: state => state.editableCourses,

            loading: state => state.loading
        },
        actions: {
            changeCurrentState({commit}, currentState) {
                commit("setLoading", true);
                commit("setCurrentState", currentState);
                commit("setLoading", false);
            },
            setCreateType({commit}, createType) {
                commit("setCreateType", createType);
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
                    })
                    .catch(error => console.log(error))
                    .finally(() =>
                        commit("setLoading", false));

            },
            fetchUserCourses({state, commit}) {
                commit("setLoading", true);
                axios
                    .get(`/api/user/` + state.user.code + `/courses`)
                    .then(res => {
                        commit("setUserData", res.data);
                    })
                    .catch(error => console.log(error))
                    .finally(() =>
                        commit("setLoading", false));
            },
            fetchFinalSchedules({commit}) {
                commit("setLoading", true);
                axios
                    .get(`/api/schedules`, {
                        params: {
                            year: currentYear,
                            season:currentSeason
                        }
                    })
                    .then(res => {
                        console.log(res.data);
                        commit("setFinalSchedules", res.data)
                    })
                    .catch(error =>
                        console.log(error))
                    .finally(() =>
                        commit("setLoading", false));
            },
            fetchMethodistSchedules({state, commit}) {
                if (state.methodistSchedules.length == 0) {
                    commit("setLoading", true);
                    axios
                        .get(`/api/methodist/schedules`, {
                            params: {
                                year: currentYear,
                                season:currentSeason,
                                faculty_id: state.user.methodist.faculty_id
                            }
                        })
                        .then(res =>
                            commit("setMethodistSchedules", res.data))
                        .catch(error =>
                            console.log(error))
                        .finally(() =>
                            commit("setLoading", false));
                }
            },
            fetchScheduleInfo({commit}, code) {
                commit("setLoading", true);
                axios
                    .get(`/api/schedule/` + code)
                    .then(res => {
                        commit("setScheduleInfo", res.data.schedule);
                        commit("setScheduleCourses", res.data.courses);
                    })
                    .catch(error =>
                        console.log(error))
                    .finally(() =>
                        commit("setLoading", false));
            },
            selectNewScheduleCourses({commit}, data) {
                commit("setLoading", true);
                axios.get('/api/courses', {
                    params: data
                })
                    .then(res =>
                        commit("setScheduleCourses", res.data))
                    .catch(error =>
                        console.log(error))
                    .finally(() =>
                        commit("setLoading", false));
            },
            fetchEditScheduleData({state, commit}, code) {
                if (state.scheduleInfo.code == code)
                    commit('setCurrentScheduleInfoEditable');
                else {
                    commit("setLoading", true);
                    axios
                        .get(`/api/schedule/` + code)
                        .then(res =>
                            commit("setScheduleInfoEditable", res.data))
                        .catch(error =>
                            console.log(error))
                        .finally(() =>
                            commit("setLoading", false));
                }
            },
            setCreateScheduleData({commit}) {
                commit("setCreateScheduleData");
            },
            editSchedule({commit}, code) {
                axios
                    .post(`/api/schedule/edit` + code, code)
                    .then(res => {
                        commit("editSchedule", res.data);
                    })
                    .catch(error => console.log(error));
            },
            createSchedule({commit}, data) {
                axios
                    .post(`/api/schedule/new`, data)
                    .then(res => {
                        commit("addSchedule", res.data);
                    })
                    .catch(error => console.log(error));
            }
        },
        mutations: {
            setCurrentState(state, currentState) {
                state.currentState = currentState;
            },
            setCreateType(state, createType) {
                state.editableSchedule.schedule_type = createType;
            },
            setFinalSchedules(state, data) {
                state.finalSchedules = [];
                data.forEach(d => state.finalSchedules.push(d));
            },
            setMethodistSchedules(state, data) {
                state.methodistSchedules = [];
                data.forEach(d => state.methodistSchedules.push(d));
                console.log(state.methodistSchedules);
            },
            setScheduleInfo(state, data) {
                state.scheduleInfo = data;
                console.log("schedule info");
                console.log(state.scheduleInfo);
            },
            setScheduleCourses(state, data) {
                state.scheduleCourses = data;
                console.log("schedule courses");
                console.log(state.scheduleCourses);
            },
            setLoading(state, load) {
                state.loading = load;
            },
            setCreateScheduleData(state) {
                state.editableSchedule = {
                    selected_faculty: state.user.methodist.faculty_id,
                    selected_speciality: null,
                    selected_sub_faculty: null,
                    selected_level: 1,
                    selected_study_year: 1,
                    selected_season: 1,
                    selected_academic_year: state.university.current_year,
                    notes: "",
                    schedule_type: ScheduleType.IDLE
                };
                state.editableCourses = [];
            },
            setCurrentScheduleInfoEditable(state) {
                console.log("I`m here");
                state.editableSchedule = {
                    selected_faculty: state.scheduleInfo.faculty_id,
                    selected_speciality: state.scheduleInfo.speciality_id,
                    selected_sub_faculty: state.scheduleInfo.subfaculty_id,
                    selected_level: state.scheduleInfo.level,
                    selected_study_year: state.scheduleInfo.study_year,
                    selected_season: state.scheduleInfo.season,
                    selected_academic_year: state.scheduleInfo.academic_year,
                    notes: "",
                    schedule_type: state.scheduleInfo.schedule_type,
                    schedule_code: state.scheduleInfo.code
                };
                state.editableCourses = state.scheduleCourses;
            },
            setScheduleInfoEditable(state, data) {
                state.scheduleInfo = data.schedule;
                state.scheduleCourses = data.courses;
                state.editableSchedule = {
                    selected_faculty: state.scheduleInfo.faculty_id,
                    selected_speciality: state.scheduleInfo.speciality_id,
                    selected_sub_faculty: state.scheduleInfo.subfaculty_id,
                    selected_level: state.scheduleInfo.level,
                    selected_study_year: state.scheduleInfo.study_year,
                    selected_season: state.scheduleInfo.season,
                    selected_academic_year: state.scheduleInfo.academic_year,
                    notes: "",
                    schedule_type: state.scheduleInfo.schedule_type
                };
                state.editableCourses = data.courses;
            },
            setUserData(state, data) {
                state.user.courses = data.course_data;
                state.user.schedule = data.course_schedule;
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
    })
;
export default store;
