import axios from "axios";


const studentModule = {
    namespaced:true,
    state:{
        courses:[],
        schedule:{}
    },
    getters:{
        schedule:state=>state.schedule,
        courses:state=>state.courses
    },
    actions:{
        fetchStudentCourses({commit, rootGetters}) {
            let code = rootGetters['state/user'].code;
            commit("setLoading", true, {root:true});
            axios
                .get(`/api/user/` + code + `/courses`)
                .then(res => {
                    commit("setStudentTimetable", res.data);
                })
                .catch(error => console.log(error))
                .finally(() =>
                    commit("setLoading", false, {root:true}));
        },
    },
    mutations:{
        setStudentTimetable(state, data) {
            state.courses = data.course_data;
            state.schedule = data.course_schedule;
        },
    }
};


export default studentModule;