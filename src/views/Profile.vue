<template>
    <div>
        <Header></Header>
        <Breadcrumbs type="PROFILE"></Breadcrumbs>
        <UserInfo></UserInfo>
        <Title v-if="role==student" message="Розклад" additional="" class="text-center"></Title>
        <StudentTable v-if="role==student"></StudentTable>
        <MethodistList v-if="role==methodist"></MethodistList>
        <Footer></Footer>
    </div>
</template>

<script>
    import Header from "../components/Basic/Header";
    import Footer from "../components/Basic/Footer";
    import UserInfo from "../components/Basic/UserInfo";
    import Breadcrumbs from "../components/Basic/Breadcrumbs";
    import StudentTable from "../components/Table/StudentTimetable";
    import Title from "../components/Nested/Title";
    import {Role} from "../models/entities/Role";
    import MethodistList from "../components/Basic/MethodistList";

    export default {
        name: "Profile",
        components: {MethodistList, Header, Breadcrumbs, StudentTable, UserInfo, Title, Footer},
        data() {
            return {
                role: this.$store.getters['state/role'],
                student: Role.STUDENT,
                methodist: Role.METHODIST
            }
        }
    };
</script>