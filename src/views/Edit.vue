<template>
  <div>
    <Header></Header>
    <Breadcrumbs type="EDIT" :option="option"></Breadcrumbs>
    <ScheduleInfoEdit :currentState="edit"></ScheduleInfoEdit>
    <Footer></Footer>
  </div>
</template>

<script>
import Header from "../components/Basic/Header";
import Breadcrumbs from "../components/Basic/Breadcrumbs";
import Footer from "../components/Basic/Footer";
import ScheduleInfoEdit from "../components/Basic/ScheduleInfoEdit";
import { CurrentState } from "../models/entities/CurrentState";

export default {
  name: "Edit",
  components: { ScheduleInfoEdit, Footer, Breadcrumbs, Header },
  data() {
    return {
      edit: CurrentState.SCHEDULE_EDIT,
      option: {
        text: this.$route.params.code + "",
        href: "/schedules/view/" + this.$route.params.code,
        active: false,
        state: CurrentState.SCHEDULE_VIEW
      }
    };
  },
  created() {
    this.$store.dispatch(
      "state/changeCurrentState",
      CurrentState.SCHEDULE_EDIT
    );
  }
};
</script>

<style scoped></style>
