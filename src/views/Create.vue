<template>
    <div>
        <Header></Header>
        <Breadcrumbs type="CREATE"></Breadcrumbs>
        <ScheduleInfoEdit :currentState="create"></ScheduleInfoEdit>
        <Footer></Footer>
    </div>
</template>

<script>
    import Header from "../components/Basic/Header";
    import Breadcrumbs from "../components/Basic/Breadcrumbs";
    import Footer from "../components/Basic/Footer";
    import ScheduleInfoEdit from "../components/Basic/ScheduleInfoEdit";
    import {CurrentState} from "../models/entities/CurrentState";

    export default {
        name: "Create",
        components: {ScheduleInfoEdit, Footer, Breadcrumbs, Header},
        data(){
            return{
                create:CurrentState.SCHEDULE_CREATE
            }
        },
        created(){
            this.$store.dispatch('changeCurrentState', CurrentState.SCHEDULE_CREATE);
        }
    };
</script>

<style scoped></style>
