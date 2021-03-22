<template>
    <div>

        <Title :message="title" additional=""></Title>
        <div v-for="sch in schedules" :key="sch.id" class="">
            <b-icon-eye-slash v-if="sch.draft==1" class="text-muted text-28 m-2 float-left link"
                              title="Розклад НЕ доступний для студентів. Натисніть, щоб відкрити доступ."
                              @click="showSchedule(sch.id)"></b-icon-eye-slash>
            <b-icon-eye v-else class="text-blue text-28  m-2 float-left"
                        title="Розклад доступний для студентів. Натисніть, щоб закрити доступ."
                        @click="hideSchedule(sch.id)"></b-icon-eye>
            <BSkeleton type="input" class="mx-5 my-2" v-if="loadingElem && loadingElemId==sch.id"></BSkeleton>
            <ScheduleListELem class="mx-5" v-else
                              :code="sch.code" :title="sch.title"></ScheduleListELem>
        </div>
        <b-alert v-model="showSuccessAlert" variant="success" dismissible class="mt-3 mr-5" fade>
            Розклад успішно відкрито для перегляду студентами!
        </b-alert>
        <b-alert v-model="hideSuccessAlert" variant="info" dismissible class="mt-3 mr-5" fade>
            Розклад закрито для перегляду студентами
        </b-alert>

    </div>
</template>

<script>
    import Title from "../Nested/Title";
    import ScheduleListELem from "../Nested/ScheduleListELem";
    import {BIconEye, BIconEyeSlash, BAlert, BSkeleton} from 'bootstrap-vue'

    export default {
        name: "MethodistListElem",
        components: {ScheduleListELem, BIconEyeSlash, BIconEye, BAlert, BSkeleton, Title},
        props: ["title", "type"],
        data() {
            return {
                showSuccessAlert: false,
                hideSuccessAlert: false,
                loadingElemId: 0
            }
        },
        computed: {
            schedules: function () {
                return this.$store.getters['list/methodist'].filter(s => s.schedule_type == this.type);
            },
            loadingElem: function () {
                return this.$store.getters['list/loadingElem'];
            }
        }, methods: {
            showSchedule: function (id) {
                this.loadingElemId = id;
                this.$store.dispatch('list/changeDraftMode', {id: id, draft: 0})
                    .then(() => this.loadingElemId = 0)
                    .catch((err) => console.log(err))
                    .finally(() => this.showSuccessAlert = true);
            },
            hideSchedule: function (id) {
                this.loadingElemId = id;
                this.$store.dispatch('list/changeDraftMode', {id: id, draft: 1})
                    .then(() => this.loadingElemId = 0)
                    .catch((err) => console.log(err))
                    .finally(() => this.hideSuccessAlert = true);
            }
        }
    }
</script>

<style scoped>

    .text-blue {
        color: #6699CC; /*#336699;*/
    }

    .text-28 {
        font-size: 24px;
    }

    .link {
        cursor: pointer;
    }
</style>