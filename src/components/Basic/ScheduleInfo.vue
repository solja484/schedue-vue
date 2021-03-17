<template>
    <div v-if="!loading">
        <button class="btn btn-info btn-lg float-right mx-5 info-button" @click="download">
            <i class="fa fa-download"></i> Завантажити
        </button>
        <Title :message="schedule.title" :additional="add"></Title>
        <div v-if="user.methodist">
            <a class="black-link mx-5 px-5 text-16"
               v-if="schedule.faculty_id==user.methodist.faculty_id" @click="editSchedule">Редагувати</a></div>
        <div class="container mx-5 my-3">
            <div class="row mb-1">
                <strong class="col-sm-2 text-right mx-1">Факультет</strong>
                <span class="col-sm-8 ">{{schedule.faculty}}</span>
            </div>
            <div class="row mb-1">
                <strong class="col-sm-2 text-right mx-1">Програма</strong>
                <span class="col-sm-8 " v-if="schedule.level==1">Бакалаврська</span>
                <span class="col-sm-8 " v-else-if="schedule.level==2">Магістерська</span>
            </div>
            <div class="row mb-1">
                <strong class="col-sm-2 text-right mx-1">Рік навчання</strong>
                <span class="col-sm-8 ">{{studyYear}} </span>
            </div>
            <div class="row mb-1" v-if="schedule.subfaculty">
                <strong class="col-sm-2 text-right mx-1">Кафедра</strong>
                <span class="col-sm-8 ">{{schedule.subfaculty}}</span>
            </div>
            <div class="row mb-1" v-if="schedule.speciality">
                <strong class="col-sm-2 text-right mx-1">Спеціальність</strong>
                <span class="col-sm-8 ">{{schedule.speciality}}</span>
            </div>
        </div>
        <div class="px-5 mt-3">
            <ViewTable :schedule_type="schedule.schedule_type" :code="schedule.code"></ViewTable>
        </div>
    </div>
</template>

<script>
    import Title from "../Nested/Title";
    import {Role} from "../../models/entities/Role";
    import {CurrentState} from "../../models/entities/CurrentState";
    import ViewTable from "../Table/ViewTable";

    export default {
        name: "ScheduleInfo",
        components: {ViewTable, Title},
        data() {
            return {
                seasons: this.$store.getters['university/seasons'],
                user: this.$store.getters['state/user'],
                userRole: this.$store.getters['state/userRole'],
                methodist: Role.METHODIST
            }
        },
        computed: {
            add: function () {
                if (!this.loading) {
                    const season = this.seasons.find(l => l.number == this.schedule.season);
                    return season.title + " " + this.schedule.academic_year;
                }
                return "";
            },
            studyYear: function () {
                if (this.schedule.level == 1) return this.schedule.study_year;
                else return (this.schedule.study_year - 4)
            },
            schedule: function () {
                return this.$store.getters['schedule/viewInfo'];
            },
            courses: function () {
                return this.$store.getters['schedule/viewRows'];
            },
            loading: function () {
                return this.$store.getters['loading'];
            }
        },
        mounted() {
            this.$store.dispatch('schedule/fetchScheduleData', this.$route.params.code);
        },
        methods: {
            editSchedule: function () {
                this.$store.dispatch('schedule/setEditScheduleData')
                    .then(()=>{
                this.$store.dispatch('state/changeCurrentState', CurrentState.SCHEDULE_EDIT);
                        this.$router.push(`/schedules/edit/` + this.schedule.code);
                    });
            },
            download: function () {
                //TODO
                alert("trying to download a table");
            }
        }
    }
</script>

<style scoped lang="scss">
    @import "../../assets/scss/_variables.scss";

    .black-link, .black-link:hover, .black-link:focus, .black-link:active {
        color: black;
        cursor: pointer;
    }

    .text-16 {
        font-size: 16px;
    }

    .info-button {
        background: $info !important;
        border-color: $info-border !important;
    }
</style>