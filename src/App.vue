<template>
  <div id="app">
    <router-view />
  </div>
</template>
<script>
import { methodist_hardcoded } from "./assets/data/userSettings";
import { Role } from "./models/entities/Role";

const head = document.getElementsByTagName("HEAD")[0];
const link = document.createElement("link");
link.rel = "stylesheet";
link.href =
  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css";
head.appendChild(link);

export default {
  name: "App",
  computed: {
    loading: function() {
      return this.$store.getters["loading"];
    }
  },
  mounted() {
    localStorage.setItem("user", JSON.stringify(methodist_hardcoded));
    localStorage.auth = true;
    localStorage.role = Role.METHODIST;
    console.log("USER", JSON.parse(localStorage.user));
    this.$store.dispatch("university/fetchFaculties");
    this.$store.dispatch("university/fetchSpeciality");
    this.$store.dispatch("university/fetchSubFaculties");
  }
};
</script>

<style lang="scss">
#app {
  font-family: "Helvetica Neue", Helvetica, sans-serifl, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

* {
  font-size: 14px;
}
</style>