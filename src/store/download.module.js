const downloadModule = {
    namespaced: true,
    state: {
        headers: [],
        rows: [],
        filename: "",
        sessionHeaders: [{label: "День", field: "day"}, {label: "Час", field: "time"},
            {label: "Дисципліна", field: "course"}, {label: "Викладач", field: "teacher"},
            {label: "Вид контролю", field: "exam"}, {label: "Група", field: "group"},
            {label: "Дата", field: "weeks"}, {label: "Аудиторія", field: "room"}],

        simpleHeaders: [{label: "День", field: "day"}, {label: "Час", field: "time"},
            {label: "Дисципліна", field: "course"}, {label: "Викладач", field: "teacher"},
            {label: "Група", field: "group"}, {label: "Тижні", field: "weeks"}, {
                label: "Аудиторія", field: "room"
            }]
    },
    getters: {
        headers: state => state.headers,
        rows: state => state.rows,
        filename: state => state.filename
    },
    actions: {
        setDownloadInfo({commit, dispatch}, info) {
            commit("setFilename", info.schedule.title);
            commit("setHeaders", info.schedule.schedule_type);
            dispatch('setRows', {courses:info.courses,type:info.schedule.schedule_type});
        },
        setFilename({commit}, filename) {
            commit("setFilename", filename);
        },
        setHeaders({commit}, headers) {
            commit("setHeaders", headers);
        },
        setRows({commit, rootGetters}, data) {
            let rows = [];
            let days = rootGetters['university/days'];
            let pairs = rootGetters['university/pairs'];
            for (let day of days)
                for (let pair of pairs) {
                    let courses = data.courses.filter(c => c.pair_id == pair.id && c.day_id == day.id);
                    let elem = {};
                    if (pair.number == 1) elem["day"] = day.name;
                    elem["time"] = pair.time;
                    if (courses.length > 0) {
                        elem["course"] = courses[0].name;
                        elem["teacher"] = courses[0].teacher;
                        elem["group"] = courses[0].group=='0' ? "Лекція" : courses[0].group;
                        elem["weeks"] = courses[0].weeks;
                        if(data.type=="session") elem["exam"] = courses[0].exam_type;
                        elem["room"] = courses[0].classroom;
                        courses.shift();
                    }
                    rows.push(elem);
                    for (let course of courses) {
                        elem = {};
                        elem["course"] = course.name;
                        elem["teacher"] = course.teacher;
                        elem["group"] = course.group=='0' ? "Лекція" : course.group;
                        elem["weeks"] = course.weeks;
                        if(data.type=="session") elem["exam"] = course.exam_type;
                        elem["room"] = course.classroom;
                        rows.push(elem);
                    }

                }

            commit("setRows", rows);
        }
    },
    mutations: {
        setHeaders(state, type) {
            if (type == "session")
                state.headers = state.sessionHeaders;
            else state.headers = state.simpleHeaders;
        },
        setRows(state, rows) {
            state.rows=rows;
        },
        setFilename(state, filename) {
            state.filename = filename;
        },
    }
};

export default downloadModule;