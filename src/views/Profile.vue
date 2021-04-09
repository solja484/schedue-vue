<template>
  <div>
    <Header></Header>
    <Breadcrumbs type="PROFILE"></Breadcrumbs>
    <UserInfo></UserInfo>
    <StudentList v-if="role == student"></StudentList>
    <MethodistList v-if="role == methodist"></MethodistList>
    <Footer></Footer>
  </div>
</template>

<script>
import Header from "../components/Basic/Header";
import Footer from "../components/Basic/Footer";
import UserInfo from "../components/Basic/UserInfo";
import Breadcrumbs from "../components/Basic/Breadcrumbs";
import StudentList from "../components/Basic/StudentList";
import { Role } from "../models/entities/Role";
import MethodistList from "../components/Basic/MethodistList";

export default {
  name: "Profile",
  components: {
    MethodistList,
    Header,
    Breadcrumbs,
    StudentList,
    UserInfo,
    Footer
  },
  data() {
    return {
      role: this.$store.getters["state/role"],
      student: Role.STUDENT,
      methodist: Role.METHODIST
    };
  }
};
</script>
