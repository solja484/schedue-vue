<template>
    <div class="mx-5">
        <br>
        <button
                @click="newSchedule()"
                class="btn btn-light  add-schedule-button">
            <b-icon-plus class="bigger"></b-icon-plus>
            Додати розклад
        </button>
        <div v-if="!loading">
            <div v-for="block in scheduleBlocks" :key="block.type">
                <MethodistListElem :type="block.type" :title="block.title"></MethodistListElem>
            </div>
        </div>
    </div>
</template>

<script>

    import {CurrentState} from "../../models/entities/CurrentState";
    import {ScheduleType} from "../../models/entities/ScheduleType";
    import {BIconPlus} from 'bootstrap-vue';
    import MethodistListElem from "../Nested/MethodistListElem";

    export default {
        name: "MethodistList",
        components: {MethodistListElem, BIconPlus},
        data() {
            return {
                speciality: ScheduleType.SPECIALITY,
                sub_faculty: ScheduleType.SUBFACULTY,
                session: ScheduleType.SESSION,
                methodist: this.$store.getters['state/user'].methodist,
                scheduleBlocks: [{title: "Розклади за спеціальністю", type: ScheduleType.SPECIALITY},
                    {title: "Розклади кафедри", type: ScheduleType.SUBFACULTY},
                    {title: "Розклади сесії", type: ScheduleType.SESSION}]
            }
        },
        methods: {
            newSchedule: function () {
                this.$store
                    .dispatch("state/changeCurrentState", CurrentState.SCHEDULE_NEW)
                    .then(() => {
                        this.$router.push("/schedules/new").then();
                    })
                    .catch(err => console.log(err));
            }
        },
        computed: {
            loading: function () {
                return this.$store.getters['loading'];
            }
        },
        mounted() {
            this.$store.dispatch('list/fetchMethodistSchedules');
        }
    };
</script>

<style lang="scss" >
    @import "../../assets/scss/_variables.scss";

    .add-schedule-button {
        font-size: 20px;
        background: $gray-fill;
        border-color: $gray-border;
        float: right;
    }

    .text-16 {
        font-size: 16px;
        text-align: left;
    }

    .text-18 {
        font-size: 18px;
    }

    .text-middle {
        vertical-align: center !important;
    }

    .border-none,
    .border-none:active,
    .border-none:focus,
    .border-none:hover {
        border: none;
    }


    .spoiler-colors {
        color: $spoiler-text;
        background: $spoiler-fill;
        border-color: $spoiler-border;
    }
</style>
