import axios from "axios";

const schedulesListModule = {
    namespaced: true,
    state: {
        final: [],
        methodist: [],
    },
    getters: {
        final: state => state.final,
        methodist: state => state.methodist,
    },
    actions: {
        fetchFinalSchedules({commit,rootGetters}) {
            commit("setLoading", true, {root: true});
            axios
                .get(`/api/schedules`, {
                    params: {
                        year: rootGetters.currentYear,
                        season: rootGetters.currentSeason
                    }
                })
                .then(res => {
                    commit("setFinalSchedules", res.data)
                })
                .catch(error =>
                    console.log(error))
                .finally(() =>
                    commit("setLoading", false, {root: true}));
        },
        fetchMethodistSchedules({commit, rootGetters}) {
            commit("setLoading", true, {root: true});
            axios
                .get(`/api/methodist/schedules`, {
                    params: {
                        year: rootGetters.currentYear,
                        season: rootGetters.currentSeason,
                        faculty_id: rootGetters.faculty
                    }
                })
                .then(res =>
                    commit("setMethodistSchedules", res.data))
                .catch(error =>
                    console.log(error))
                .finally(() =>
                    commit("setLoading", false, {root: true}));
        }
    },
    mutations: {
        setFinalSchedules(state, data) {
            state.final = data;
            //data.forEach(d => state.finalSchedules.push(d));
            console.log("final schedules fetch");
            console.log(state.final);
        },
        setMethodistSchedules(state, data) {
            state.methodist = data;
            // data.forEach(d => state.methodistSchedules.push(d));
            console.log("methodist schedules fetch");
            console.log(state.methodist);
        },
    }
};


export default schedulesListModule;