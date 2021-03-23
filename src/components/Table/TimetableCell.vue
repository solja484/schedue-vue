<template>
  <div class="px-2 py-3 cursor border-bottom" :class="{hover:type=='courses'}"
       :id="'cell-'+info.course_cdoc+'-'+info.day_id+'-'+info.pair_id">
    <p class="m-0" v-if="type=='courses'">
      <span class="badge badge-secondary p-1">{{info.course_cdoc}}</span>
      <span v-if='info.group==0' class="badge badge-info mx-1 p-1">Лекція</span>
      <span v-else class="badge practice mx-1 p-1">{{info.group}} група</span>
    </p>
    <p v-else>
      <span class="float-right">{{info.weeks}}</span>
      <span class="badge badge-secondary p-1">{{info.course_cdoc}}</span>
      <br>
      <span class="badge practice mr-1 p-1" v-if="info.group">{{info.group}} група</span>
      <span v-else class="badge practice mr-1 p-1" >Всі групи</span>

    </p>
    <strong class=" p-0 m-0">{{ info.name }}</strong><br>
    <em class=" p-0 m-0 text-muted">{{info.teacher}}</em>
  </div>
</template>

<script>
export default {
  name: "TimetableCell",
  props: ["info","type"]
};
</script>

<style scoped lang="scss">
  @import "../../assets/scss/_variables.scss";
  .hover:hover{
    background: $gray-hover;
  }

  .cursor{
    cursor: default;
  }
  .practice {
    color: white;
    background: $success;
  }

  .lecture {
    color: white;
    background: $info;
    border-color: $info-border;
  }

</style>
