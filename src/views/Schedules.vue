<template>
  <div>
    <Header></Header>
    <div>
      <Breadcrumbs type="ALL"></Breadcrumbs>
      <SchedulesALL></SchedulesALL>
    </div>
    <Footer></Footer>
  </div>
</template>

<script>
import Header from "../components/Basic/Header";
import Footer from "../components/Basic/Footer";
import Breadcrumbs from "../components/Basic/Breadcrumbs";
import SchedulesALL from "../components/Basic/SchedulesALL";
export default {
  name: "Schedules",
  components: {SchedulesALL, Breadcrumbs, Header, Footer }
};
</script>
