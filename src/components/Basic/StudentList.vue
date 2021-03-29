<template>
    <div v-if="!loading" class="mx-5 mb-5">
        <Title  message="Розклад" :additional="additional" class="text-center"></Title>
        <Timetable type="courses" ></Timetable>
        <div v-if="showDetails">
        <CourseDetails v-for="item in schedule" :key="item.id" :item="item"></CourseDetails>
        </div>
        <Title message="Розклад сесії" :additional="additional" class="text-center pt-5"></Title>
        <p  class="alert alert-primary text-center" v-if="!loadingSessionTable && session.length==0">
            Розклад сесії поки недоступний
        </p>
        <Timetable type="session" v-else-if="!loadingSessionTable"></Timetable>
    </div>
</template>

<script>

    import CourseDetails from "../Nested/CourseDetails";
    import Title from "../Nested/Title";
    import Timetable from "../Table/Timetable";

    export default {
        name: "StudentList",
        components: {
            Timetable,
            Title,
            CourseDetails
        },
        data(){
         return {
             showDetails:false
         }
        },
        computed: {
            loading: function () {
                return this.$store.getters['loading'];
            },
            loadingSessionTable:function(){
                return this.$store.getters['student/loadingSession'];
            },
            schedule: function () {
                return this.$store.getters['student/schedule'];
            },
            courses:function () {
                return this.$store.getters['student/courses'];
            },
            session:function(){
                return this.$store.getters['student/session'];
            },
            additional:function () {
                let season = this.$store.getters['currentSeason'];
                let year = this.$store.getters['currentYear'];
                if(season==1) return "Осінь "+year+"-"+(year+1)+"н.р.";
                else if(season==2) return "Весна "+year+"-"+(year+1)+"н.р.";
                else if(season==3) return "Літо "+year+"-"+(year+1)+"н.р.";
                return "";
            }
        },
        mounted() {
            this.$store.dispatch('student/fetchStudentCourses');
            this.$store.dispatch('student/fetchStudentSession');
            this.$store.dispatch('university/fetchDays');
            this.$store.dispatch('university/fetchPairs');
            this.$store.dispatch('university/fetchFaculties');
            this.$store.dispatch('university/fetchSubFaculties');
            setTimeout(() => this.showDetails = true, 15000);
        }
    };
</script>

