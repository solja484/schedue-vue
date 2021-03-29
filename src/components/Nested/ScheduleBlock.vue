<template>
    <div class="px-5">
        <div v-for="f in faculties" :key="f.id" class="mx-5">
            <button
                    v-b-toggle="'col' + type + f.id"
                    class="btn btn-sm btn-block spoiler-colors text-16 mb-1">
                {{ f.name }}
            </button>
            <b-collapse
                    :id="'col' + type + f.id"
                    class="mt-2"
                    v-if="type != 'sub_faculty'">
                <div v-for="l in levels" :key="l.course" class="ml-5">
                    <button
                            v-b-toggle="'col-sub-' + type + l.course"
                            class="btn btn-sm btn-block text-16 mb-1">
                        {{ l.title }} <i class="fa fa-sort-down"></i>
                    </button>
                    <b-collapse :id="'col-sub-' + type + l.course" class="mt-2">
                        <ScheduleList :type="type" :faculty="f.id" :level="l.level" :year="l.year">
                        </ScheduleList>
                    </b-collapse>
                </div>
            </b-collapse>
            <b-collapse :id="'col' + type + f.id" class="mt-2" v-else>
                <div v-for="s in sub_faculty" :key="s.id" class="ml-5">
                    <button
                            v-b-toggle="'col-sub-' + s.id"
                            v-if="s.faculty_id == f.id"
                            class="btn btn-sm btn-block text-16 mb-1">
                        {{ s.name }} <i class="fa fa-sort-down"></i>
                    </button>
                    <b-collapse
                            :id="'col-sub-' + s.id"
                            class="mt-2"
                            v-if="s.faculty_id == f.id">
                        <ScheduleList :type="type" :faculty="f.id" :sub_faculty="s.id">
                        </ScheduleList>
                    </b-collapse>
                </div>
            </b-collapse>
        </div>
    </div>
</template>

<script>

    import {BCollapse} from "bootstrap-vue";
    import ScheduleList from "./ScheduleList";

    export default {
        name: "ScheduleBlock",
        components: {ScheduleList, BCollapse},
        props: ["type"],
        computed:{
            faculties: function () {
                return this.$store.getters["university/faculties"];
            },
            sub_faculty: function () {
                return this.$store.getters["university/sub_faculty"];
            },
            speciality: function () {
                return this.$store.getters["university/speciality"];
            },
            levels: function () {
                return this.$store.getters["university/levels"];
            },
        }

    };
</script>

<style scoped></style>
