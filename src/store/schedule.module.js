import axios from "axios";
import {ScheduleType} from "../models/entities/ScheduleType";

const currentYear = 2020;


const scheduleModule = {
    namespaced: true,
    state: {
        viewInfo: {},
        viewRows: [],
        editInfo: {},
        editRows: [],
        availableCourses: [],
        createInfo: {},
        loadingTable: false,
        emptyInfo: {
            faculty: null,
            faculty_id: null,
            speciality: null,
            speciality_id: null,
            subfaculty_id: null,
            subfaculty: null,
            level: 1,
            study_year: 1,
            season: 1,
            academic_year: currentYear,
            title: "",
            schedule_type: ScheduleType.IDLE
        }
    },
    getters: {
        viewInfo: state => state.viewInfo,
        viewRows: state => state.viewRows,
        editInfo: state => state.editInfo,
        editRows: state => state.editRows,
        availableCourses: state => state.availableCourses,
        createInfo: state => state.editInfo,
        loadingTable: state => state.loadingTable

    },
    actions: {
        setCreateType({commit}, createType) {
            commit("setCreateType", createType);
        },
        fetchScheduleData({commit}, code) {
            commit("setLoading", true, {root: true});
            axios
                .get(`/api/schedule/` + code)
                .then(res => {
                    commit("setViewInfo", res.data.schedule);
                    commit("setViewRows", res.data.courses);
                })
                .catch(error =>
                    console.log(error))
                .finally(() =>
                    commit("setLoading", false, {root: true}));
        },
        setEditScheduleData({state, commit, dispatch}) {
            let data = {
                "speciality": state.viewInfo.speciality_id,
                "faculty": state.viewInfo.faculty_id,
                "level": state.viewInfo.level,
                "academic_year": state.viewInfo.academic_year,
                "season": state.viewInfo.season
            };
            commit("setLoading", true, {root: true});
            dispatch('fetchAvailableCourses', data)
                .then(() =>
                    commit("setScheduleInfoEditable"))
                .catch(error =>
                    console.log(error))
                .finally(() =>
                    commit("setLoading", false, {root: true}));

        },
        setCreateScheduleData({commit}, type) {
            commit("setLoading", true, {root: true});
            console.log("set create schedule data");
            axios
                .get('/api/schedule_new_code')
                .then(res =>
                    commit("setCreateScheduleData", {code: res.data, type: type}))
                .catch(error =>
                    console.log(error))
                .finally(() =>
                    commit("setLoading", false, {root: true}));
        },
        fetchAvailableCourses({commit}, data) {
            // commit("setLoading", true, {root: true});
            commit("setTableLoading", true);
            axios.get('/api/courses', {
                params: data
            })
                .then(res =>
                    commit("setAvailableCourses", res.data))
                .catch(error =>
                    console.log(error))
                .finally(() => {
                    //   commit("setLoading", false, {root: true});
                    commit("setTableLoading", false);
                });
        },

        editSchedule({commit}, code) {
            commit("setLoading", true, {root: true});
            axios
                .post(`/api/schedule/edit` + code, code)
                .then(res => {
                    commit("editSchedule", res.data);
                })
                .catch(error => console.log(error))
                .finally(() =>
                    commit("setLoading", false, {root: true}));
        },
        createSchedule({commit}, data) {
            commit("setLoading", true, {root: true});
            axios
                .post(`/api/schedule/new`, data)
                .then(res => {
                    commit("addSchedule", res.data);
                })
                .catch(error => console.log(error))
                .finally(() =>
                    commit("setLoading", false, {root: true}));
        },
        deleteSchedule({commit}, code) {
            commit("setLoading", true, {root: true});
            axios
                .post(`/api/schedule/delete`,{code:code})
                .then(res => {
                    console.log(res);
                    commit("deleteSchedule");
                })
                .catch(error => console.log(error))
                .finally(() =>
                    commit("setLoading", false, {root: true}));
        }
    },
    mutations: {
        setCreateType(state, createType) {
            console.log("SET CREATE TYPE " + createType);
            state.editInfo.schedule_type = createType;
        },
        setViewInfo
            (state, data) {
            state.viewInfo = data;
            console.log("schedule info");
            console.log(state.viewInfo);
        },
        setViewRows(state, data) {
            state.viewRows = data;
            console.log("schedule rows");
            console.log(state.viewRows);
        },
        setScheduleInfoEditable(state) {
            console.log("viewInfo");
            console.log(state.viewInfo);
            state.editInfo = state.viewInfo;
            state.editRows = state.viewRows;
        },
        setCreateScheduleData(state, data) {
            console.log("New code below");
            console.log(data.code);

            state.editInfo = state.emptyInfo;
            state.editInfo.schedule_code = data.code;
            state.editInfo.schedule_type = data.type;
            state.editRows = [];
            console.log(state.editInfo);
        },
        setAvailableCourses(state, data) {
            state.availableCourses = data;
        },
        setTableLoading(state, load) {
            state.loadingTable = load;
        },
        deleteSchedule(state) {
            state.viewInfo = {};
            state.viewRows = [];
            state.editInfo = {};
            state.editRows = [];
            state.availableCourses = [];
            state.createInfo = {};
        }
    }
};


export default scheduleModule;