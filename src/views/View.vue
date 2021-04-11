<template>
  <div>
    <Header></Header>
    <Breadcrumbs type="VIEW" :option="option"></Breadcrumbs>
    <ScheduleInfo :currentState="viewState"></ScheduleInfo>
    <Footer></Footer>
  </div>
</template>

<script>
import Header from "../components/Basic/Header";
import Breadcrumbs from "../components/Basic/Breadcrumbs";
import ScheduleInfo from "../components/Basic/ScheduleInfo";
import Footer from "../components/Basic/Footer";
import { CurrentState } from "../models/entities/CurrentState";

export default {
  name: "ViewPage",
  components: { Footer, ScheduleInfo, Breadcrumbs, Header },
  data() {
    return {
      viewState: CurrentState.SCHEDULE_VIEW,
      option: {
        text: this.$route.params.code + "",
        active: true,
        href: "/schedules/view/" + this.$route.params.code
      }
    };
  },
  mounted() {
    this.$store.dispatch(
      "state/changeCurrentState",
      CurrentState.SCHEDULE_VIEW
    );
  }
};
</script>

<style scoped></style>
