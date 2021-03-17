import {levels, seasons} from "../assets/data/levels";
import {schedule_types} from "../assets/data/schedule_types";
import axios from "axios";


const universityModule = {
    namespaced: true,
    state: {
        faculties: [],
        speciality: [],
        sub_faculty: [],
        days: [],
        pairs: [],
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
        fetchFaculties({commit}) {
            commit("setLoading", true, {root: true});
            axios
                .get(`/api/faculty`)
                .then(res => {
                    commit("setFaculties", res.data);
                })
                .catch(error => console.log(error))
                .finally(() =>
                    commit("setLoading", false, {root: true}));

        },
        fetchSubFaculties({commit}) {
            commit("setLoading", true, {root: true});
            axios
                .get(`/api/sub_faculty`)
                .then(res => {
                    commit("setSubFaculties", res.data);
                })
                .catch(error => console.log(error))
                .finally(() =>
                    commit("setLoading", false, {root: true}));

        },
        fetchSpeciality({commit}) {
            commit("setLoading", true, {root: true});
            axios
                .get(`/api/speciality`)
                .then(res => {
                    commit("setSpeciality", res.data);
                })
                .catch(error => console.log(error))
                .finally(() =>
                    commit("setLoading", false, {root: true}));
        },
        fetchDays({commit}) {
            commit("setLoading", true, {root: true});
            axios
                .get(`/api/days`)
                .then(res =>
                    commit("setDays", res.data))
                .catch(error => console.log(error))
                .finally(() =>
                    commit("setLoading", false, {root: true}));
        },
        fetchPairs({commit}) {
            commit("setLoading", true, {root: true});
            axios
                .get(`/api/pairs`)
                .then(res =>
                    commit("setPairs", res.data))
                .catch(error => console.log(error))
                .finally(() =>
                    commit("setLoading", false, {root: true}));
        }
    },
    mutations: {
        setFaculties(state, data) {
            state.faculties = data;
            //data.forEach(d => state.faculties.push(d));
        },
        setSubFaculties(state, data) {
            state.sub_faculty = data;
            // data.forEach(d => state.sub_faculty.push(d));
        },
        setSpeciality(state, data) {
            state.speciality = data;
            // data.forEach(d => state.speciality.push(d));
        },
        setDays(state, data) {
            state.days = data;
            // data.forEach(d => state.university.days.push(d));
        },
        setPairs(state, data) {
            state.pairs = data;
            // data.forEach(d => state.university.pairs.push(d));
        }
    }

};

export default universityModule;