<template>
    <div v-if="!loading">
        <Header></Header>
        <Breadcrumbs type="VIEW"></Breadcrumbs>
        <ScheduleInfo></ScheduleInfo>
        <Footer></Footer>
    </div>
</template>

<script>
    import Header from "../components/Basic/Header";
    import Breadcrumbs from "../components/Basic/Breadcrumbs";
    import ScheduleInfo from "../components/Basic/ScheduleInfo";
    import Footer from "../components/Basic/Footer";
    import {CurrentState} from "../models/entities/CurrentState";

    export default {
        name: "ViewPage",
        components: {Footer, ScheduleInfo, Breadcrumbs, Header},
        computed: {
            loading: function () {
                return this.$store.getters['loading'];
            }
        },
        mounted() {
            this.$store.dispatch('changeCurrentState', CurrentState.SCHEDULE_VIEW);
        }
    };
</script>

<style scoped></style>
