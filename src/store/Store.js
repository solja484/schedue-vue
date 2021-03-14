import Vue from "vue";
import Vuex, {Store} from "vuex";
import axios from "axios";
import {CurrentState} from "../models/entities/CurrentState";
import {ScheduleType} from "../models/entities/ScheduleType"
import {Role} from "../models/entities/Role";
import {breadcrumbs} from "../assets/api/breadcrumbs";
import {levels, seasons} from "../assets/api/levels";
import {schedule_types} from "../assets/api/schedule_types";

Vue.use(Vuex);

const currentYear = 2020, currentSeason = 2;

let schedule_hardcoded = [
    {
        pair: 1,
        courses: {
            Mon: ["Понеділок 1 пара"],
            Tue: ["Вівторок 1 пара"],
            Wed: ["Середа 1 пара"],
            Thu: ["Четвер 1 пара"],
            Fri: ["П'ятниця 1 пара"],
            Sat: ["Субота 1 пара"]
        }
    },
    {
        pair: 2,
        courses: {
            Mon: ["Понеділок 2 пара"],
            Tue: ["Вівторок 2 пара"],
            Wed: ["Середа 2 пара"],
            Thu: ["Четвер 2 пара"],
            Fri: ["П'ятниця 2 пара"],
            Sat: ["Субота 2 пара"]
        }
    },
    {
        pair: 3,
        courses: {
            Mon: ["Понеділок 3 пара"],
            Tue: ["Вівторок 3 пара"],
            Wed: ["Середа 3 пара"],
            Thu: ["Четвер 3 пара"],
            Fri: ["П'ятниця 3 пара"],
            Sat: ["Субота 3 пара"]
        }
    },
    {
        pair: 4,
        courses: {
            Mon: ["Понеділок 4 пара"],
            Tue: ["Вівторок 4 пара"],
            Wed: ["Середа 4 пара"],
            Thu: ["Четвер 4 пара"],
            Fri: ["П'ятниця 4 пара"],
            Sat: ["Субота 4 пара"]
        }
    },
    {
        pair: 5,
        courses: {
            Mon: ["Понеділок 5 пара"],
            Tue: ["Вівторок 5 пара"],
            Wed: ["Середа 5 пара"],
            Thu: ["Четвер 5 пара"],
            Fri: ["П'ятниця 5 пара"],
            Sat: ["Субота 5 пара"]
        }
    },
    {
        pair: 6,
        courses: {
            Mon: ["Понеділок 1 пара"],
            Tue: ["Вівторок 1 пара"],
            Wed: ["Середа 1 пара"],
            Thu: ["Четвер 1 пара"],
            Fri: ["П'ятниця 1 пара"],
            Sat: ["Субота 1 пара"]
        }
    },
    {
        pair: 7,
        courses: {
            Mon: ["Понеділок 1 пара"],
            Tue: ["Вівторок 1 пара"],
            Wed: ["Середа 1 пара"],
            Thu: ["Четвер 1 пара"],
            Fri: ["П'ятниця 1 пара"],
            Sat: ["Субота 1 пара"]
        }
    }
];
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

        state: {
            university: {
                current_year: currentYear,
                current_season: currentSeason,
                faculties: [],
                speciality: [],
                sub_faculty: [],
                days: [],
                pairs: [],
                levels: levels,
                seasons: seasons,
                academic_year: currentYear,
                schedule_types: schedule_types
            },
            emptySchedule: {
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
            finalSchedules: [],
            methodistSchedules: [],
            auth: true,
            user: methodist_hardcoded,
            role: Role.METHODIST,
            currentState: CurrentState.MAIN,
            breadcrumbs: breadcrumbs,
            schedule: schedule_hardcoded,
            loading: false
        },
        getters: {
            role: state => state.role,
            currentState: state => state.currentState,
            user: state => state.user,
            breadcrumbs: state => state.breadcrumbs,
            days: state => state.university.days,
            pairs: state => state.university.pairs,
            schedule: state => state.schedule,
            faculties: state => state.university.faculties,
            sub_faculty: state => state.university.sub_faculty,
            speciality: state => state.university.speciality,
            levels: state => state.university.levels,
            seasons: state => state.university.seasons,
            university: state => state.university,
            emptySchedule: state => state.emptySchedule,
            finalSchedules: state => state.finalSchedules,
            methodistSchedules: state => state.methodistSchedules,
            scheduleInfo: state => state.scheduleInfo,
            scheduleCourses: state => state.scheduleCourses,
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
            fetchFaculties({state, commit}) {
                if (state.university.faculties.length == 0) {
                    commit("setLoading", true);
                    axios
                        .get(`/api/faculty`)
                        .then(res => {
                            commit("setFaculties", res.data);
                        })
                        .catch(error => console.log(error))
                        .finally(() =>
                            commit("setLoading", false));
                }
            },
            fetchSubFaculties({state, commit}) {
                if (state.university.sub_faculty.length == 0) {
                    commit("setLoading", true);
                    axios
                        .get(`/api/sub_faculty`)
                        .then(res => {
                            commit("setSubFaculties", res.data);
                        })
                        .catch(error => console.log(error))
                        .finally(() =>
                            commit("setLoading", false));
                }
            },
            fetchSpeciality({state, commit}) {
                if (state.university.speciality.length == 0) {
                    commit("setLoading", true);
                    axios
                        .get(`/api/speciality`)
                        .then(res => {
                            commit("setSpeciality", res.data);
                        })
                        .catch(error => console.log(error))
                        .finally(() =>
                            commit("setLoading", false));
                }
            },
            fetchDays({state, commit}) {
                if (state.university.days.length == 0) {
                    commit("setLoading", true);
                    axios
                        .get(`/api/days`)
                        .then(res =>
                            commit("setDays", res.data))
                        .catch(error => console.log(error))
                        .finally(() =>
                            commit("setLoading", false));
                }
            },
            fetchPairs({state, commit}) {
                if (state.university.pairs.length == 0) {
                    commit("setLoading", true);
                    axios
                        .get(`/api/pairs`)
                        .then(res =>
                            commit("setPairs", res.data))
                        .catch(error => console.log(error))
                        .finally(() =>
                            commit("setLoading", false));
                }
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
            fetchFinalSchedules({state, commit}) {
                commit("setLoading", true);
                axios
                    .get(`/api/schedules`, {
                        params: {
                            year: state.university.current_year,
                            season: state.university.current_season
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
                                year: state.university.current_year,
                                season: state.university.current_season,
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
                    .then(res =>{
                        commit("setScheduleInfo", res.data.schedule);
                        commit("setScheduleCourses", res.data.courses);
                    })
                    .catch(error =>
                        console.log(error))
                    .finally(() =>
                        commit("setLoading", false));
            },
            selectNewScheduleCourses({commit}, data) {
                console.log("store");
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
            setFaculties(state, data) {
                state.university.faculties = [];
                data.forEach(d => state.university.faculties.push(d));
            },
            setSubFaculties(state, data) {
                state.university.sub_faculty = [];
                data.forEach(d => state.university.sub_faculty.push(d));
            },
            setSpeciality(state, data) {
                state.university.speciality = [];
                data.forEach(d => state.university.speciality.push(d));
            },
            setDays(state, data) {
                state.university.days = [];
                data.forEach(d => state.university.days.push(d));
            },
            setPairs(state, data) {
                state.university.pairs = [];
                data.forEach(d => state.university.pairs.push(d));
            },
            setCurrentState(state, currentState) {
                state.currentState = currentState;
            },
            setCreateType(state, createType) {
                state.emptySchedule.schedule_type = createType;
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
                console.log(state.scheduleInfo);
            },
            setScheduleCourses(state, data) {
                state.scheduleCourses = data;
                console.log("schedule courses"+state.scheduleCourses);
            },
            setLoading(state, load) {
                state.loading = load;
            },
            setCurrentScheduleInfoEditable(state) {
                state.emptySchedule = {
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
            },
            setScheduleInfoEditable(state, data) {
                console.log(state.user + data);
                console.log("SET SCHEDULE INFO EDITABLE!!!!!!");
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