<template>
  <b-breadcrumb class="mx-5 my-3 active-color">
    <b-breadcrumb-item
      v-for="link in links"
      :key="link.text"
      @click="redirectTo(link)"
      :active="link.active"
    >
      {{ link.text }}
    </b-breadcrumb-item>
    <b-breadcrumb-item
      v-if="option"
      @click="redirectTo(option)"
      :active="option.active"
      >{{ option.text }}</b-breadcrumb-item
    >
  </b-breadcrumb>
</template>

<script>
import { BBreadcrumb, BBreadcrumbItem } from "bootstrap-vue";

export default {
  name: "Breadcrumbs",
  components: { BBreadcrumb, BBreadcrumbItem },
  data() {
    return {
      links: this.$store.getters["state/breadcrumbs"][this.type]
    };
  },
  props: ["type", "option"],
  methods: {
    redirectTo: function(link) {
      this.$store
        .dispatch("state/changeCurrentState", link.state)
        .then(() => this.$router.push(link.href).then())
        .catch(err => console.log(err));
    }
  }
};
</script>

<style scoped lang="scss">
@import "../../assets/scss/_variables.scss";

.active-color a {
  color: $breadcrumb-active;
}
</style>
