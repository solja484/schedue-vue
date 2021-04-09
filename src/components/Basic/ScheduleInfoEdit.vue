<template>
    <div v-if="!(loading || loadingTable)">
        <button
                @click="saveSchedule"
                class="btn btn-info btn-lg float-right mx-5 info-button"
                :disabled=" (selected_speciality == null && selected_sub_faculty == null) ||
          selected_name.length < 5">
            <i class="fa fa-spinner fa-pulse fa-fw" v-if="loadingSave"></i>
            <i class="fa fa-save" v-else></i> Зберегти
        </button>
        <Title
                v-if="currentState == createState"
                message="Новий розклад "
                :additional="schedule_code"
        ></Title>
        <Title
                v-else-if="currentState == editState"
                message="Редагування розкладу "
                :additional="schedule_code"
        ></Title>
        <b-alert
                fade
                variant="success"
                dismissible
                class="mx-5 px-5"
                v-model="showSaveAlert"
                v-if="!loadingSave"
        >
            Зміни збережено
        </b-alert>
        <div class="container mx-5">
            <div class="row">
                <strong class="col-sm-2 text-right text-14">Факультет</strong>
                <b-form-select
                        v-model="selected_faculty"
                        class="col-sm-4 text-14 mb-1"
                        size="sm"
                        disabled>
                    <b-form-select-option :value="selected_faculty"
                    >{{ selected_faculty_name }}
                    </b-form-select-option>
                </b-form-select>
            </div>
            <div class="row">
                <strong class="col-sm-2 text-right text-14">Програма</strong>
                <b-form-group
                        class="col-sm-4 text-14 mb-1"
                        v-slot="{ ariaDescribedby }"
                >
                    <b-form-radio-group
                            v-model="selected_level"
                            :options="level_options"
                            :aria-describedby="ariaDescribedby"
                    ></b-form-radio-group>
                </b-form-group>
            </div>
            <div class="row " v-if="schedule_type != sub_faculty_type">
                <strong class="col-sm-2 text-right text-14">Спеціальність</strong>
                <b-form-select
                        v-model="selected_speciality"
                        class="col-sm-4 text-14 mb-1"
                        size="sm"
                        :disabled="selected_level == null"
                >
                    <b-form-select-option :value="null">Не обрано</b-form-select-option>
                    <b-form-select-option
                            v-for="s in specialityFiltered"
                            :key="s.id"
                            :value="s.id"
                            class="text-14"
                    >
                        {{ s.name }}
                    </b-form-select-option>
                </b-form-select>
                <div class=" col-sm-6"></div>
            </div>
            <div class="row " v-else-if="schedule_type == sub_faculty_type">
                <strong class="col-sm-2 text-right text-14">Кафедра</strong>
                <b-form-select
                        v-model="selected_sub_faculty"
                        class="col-sm-4 text-14 mb-1"
                        size="sm"
                >
                    <b-form-select-option :value="null">Не обрано</b-form-select-option>
                    <b-form-select-option
                            v-for="s in subfacultyFiltered"
                            :key="s.id"
                            :value="s.id"
                            class="text-14"
                    >
                        {{ s.name }}
                    </b-form-select-option>
                </b-form-select>
                <div class=" col-sm-6"></div>
            </div>
            <div class="row" v-if="schedule_type != sub_faculty_type">
                <strong class="col-sm-2 text-right text-14">Рік навчання</strong>
                <b-form-select
                        v-model="selected_study_year"
                        class="col-sm-1 text-14 mb-1"
                        size="sm"
                >
                    <b-form-select-option
                            v-for="l in yearsByLevel"
                            :key="l.course"
                            :value="l.year"
                            class="text-14"
                    >
                        {{ l.year }}
                    </b-form-select-option>
                </b-form-select>
            </div>
            <div class="row">
                <strong class="col-sm-2 text-right text-14 vertical-middle"
                >Триместр</strong
                >
                <b-form-select
                        v-model="selected_season"
                        class="col-sm-1 text-14 mb-1"
                        size="sm"
                >
                    <b-form-select-option
                            v-for="s in seasons"
                            :key="s.number"
                            :value="s.number"
                            class="text-14">
                        {{ s.title }}
                    </b-form-select-option>
                </b-form-select>
            </div>
            <div class="row">
                <strong class="col-sm-2 text-right text-14">Рік</strong>
                <b-form-select
                        v-model="selected_academic_year"
                        class="col-sm-1 text-14 mb-1"
                        size="sm">
                    <b-form-select-option :value="academic_year" class="text-14">
                        {{ academic_year }}
                    </b-form-select-option>
                    <b-form-select-option :value="next_academic_year" class="text-14">
                        {{ next_academic_year }}
                    </b-form-select-option>
                </b-form-select>
            </div>
            <div class="row mt-2">
                <strong class="col-sm-2 text-right text-14">Назва</strong>
                <b-form-input
                        class="col-sm-4 text-14"
                        maxlength="100"
                        v-model="selected_name"
                        aria-describedby="password-help-block"
                ></b-form-input>
                <div class="col-sm-6"></div>
                <div class="col-sm-2"></div>
                <b-form-text id="password-help-block" class="col-sm-4 p-0">
                    Назва повинна містити не менше 5 символів
                </b-form-text>
            </div>
        </div>
        <div class="px-5 mt-3" v-if="!(loadingTable||loading)">
                <ViewTable :schedule_type="schedule_type"
                           :code="schedule_code"
                           :currentState="currentState"
                           :id="'viewschedule-'+schedule_code"
                           :disable="selected_speciality==null&&selected_sub_faculty==null"></ViewTable>
            </div>
            <div v-else class="px-5 mt-3">
                <b-skeleton-table
                        :rows="20"
                        :columns="7"
                        :table-props="{ bordered: true, striped: true, align:true }"
                ></b-skeleton-table>
            </div>
        <div class="mx-5 pl-5 pr-0 mb-5">
            <div class="row ml-5 text-middle">
                <button
                        @click="saveSchedule"
                        class="btn btn-info btn-lg mt-2 col-md-2 info-button"
                        :disabled=" (selected_speciality == null && selected_sub_faculty == null) ||
                        selected_name.length < 5">
                    <i class="fa fa-save"></i>
                    Зберегти зміни
                </button>
                <div class="col-md-7"></div>
                <div class="col-md-3">
                    <a class="text-danger text-16 p-2 text-middle float-right pointer"
                       @click="showDeleteAlert = !showDeleteAlert"
                       v-if="currentState == editState">
                        <i class="fa fa-trash mx-1"></i>
                        Видалити розклад</a>
                </div>
            </div>
        </div>
        <b-alert
                fade
                variant="danger"
                dismissible
                class="mx-5 px-5 delete-alert"
                v-model="showDeleteAlert">
            <h4 class="alert-heading">Видалення розкладу</h4>
            <hr/>
            <p>
                Ви впевнені, що хочете видалити розклад? Відмінити цю дію буде неможливо
            </p>
            <p class="mb-0">
                <button class="btn " @click="showDeleteAlert = !showDeleteAlert">
                    Скасувати
                </button>
                <button class="btn btn-danger" @click="deleteSchedule">Видалити</button>
            </p>
        </b-alert>
    </div>
    <div v-else>
        <div class="mx-5 mt-5 text-center">
            <div class="row m-2 mb-4">
                <b-skeleton type="input" class=" col-md-7 py-4 float-left"></b-skeleton>
                <div class="col-md-4 py-4"></div>
                <b-skeleton type="input" class="col-md-1 py-4 float-right"></b-skeleton>
            </div>

            <div class="row m-2">
                <div class="col-md-1"></div>
                <b-skeleton type="text" class="col-md-1"></b-skeleton>
                <b-skeleton type="text" class="col-md-4 mx-3 py-3"></b-skeleton>
            </div>
            <div class="row m-2">
                <div class="col-md-1"></div>
                <b-skeleton type="text" class="col-md-1"></b-skeleton>
                <b-skeleton type="text" class="col-md-4 mx-3"></b-skeleton>
            </div>
            <div class="row m-2">
                <div class="col-md-1"></div>
                <b-skeleton type="text" class="col-md-1"></b-skeleton>
                <b-skeleton type="text" class="col-md-4 mx-3 py-3"></b-skeleton>
            </div>
            <div class="row m-2">
                <div class="col-md-1"></div>
                <b-skeleton type="text" class="col-md-1"></b-skeleton>
                <b-skeleton type="text" class="col-md-1 mx-3 py-3"></b-skeleton>
            </div>
            <div class="row m-2">
                <div class="col-md-1"></div>
                <b-skeleton type="text" class="col-md-1"></b-skeleton>
                <b-skeleton type="text" class="col-md-1 mx-3 py-3"></b-skeleton>
            </div>
            <div class="row m-2">
                <div class="col-md-1"></div>
                <b-skeleton type="text" class="col-md-1"></b-skeleton>
                <b-skeleton type="text" class="col-md-1 mx-3  py-3"></b-skeleton>
            </div>
            <div class="row m-2">
                <div class="col-md-1  py-3"></div>
                <b-skeleton type="text" class="col-md-1  "></b-skeleton>
                <b-skeleton type="text" class="col-md-4 mx-3  py-3"></b-skeleton>
            </div>
        </div>
        <div class="px-5">
            <b-skeleton-table
                    :rows="20"
                    :columns="7"
                    :table-props="{ bordered: true, striped: true, align: true }"
            ></b-skeleton-table>
        </div>
    </div>
</template>

<script>
    import Title from "../../components/Nested/Title";
    import {CurrentState} from "../../models/entities/CurrentState";
    import {ScheduleType} from "../../models/entities/ScheduleType";
    import {
        BFormSelect,
        BFormSelectOption,
        BFormGroup,
        BFormRadioGroup,
        BFormInput,
        BSkeletonTable,
        BSkeleton,
        BAlert,
        BFormText
    } from "bootstrap-vue";
    import {Role} from "../../models/entities/Role";
    import ViewTable from "../Table/ViewTable";

    export default {
        name: "ScheduleInfoEdit",
        components: {
            ViewTable, Title,
            BFormSelect,
            BFormSelectOption,
            BFormGroup,
            BFormRadioGroup,
            BFormInput,
            BSkeletonTable,
            BSkeleton,
            BAlert,
            BFormText
        },
        data() {
            return {
                currentState: this.$store.getters["state/currentState"],
                createState: CurrentState.SCHEDULE_CREATE,
                editState: CurrentState.SCHEDULE_EDIT,
                showDeleteAlert: false,
                showSaveAlert: false,
                sub_faculty_type: ScheduleType.SUBFACULTY,
                academic_year: this.$store.getters["university/academic_year"],
                methodist: this.$store.getters["state/user"].methodist,
                seasons: this.$store.getters["university/seasons"],
                schedule_code: this.$route.params.code,
                level_options: [{text: "Бакалаврська", value: 1},
                    {text: "Магістерська", value: 2}]
            };
        },
        computed: {
            selected_sub_faculty: {
                get: function () {
                    return this.$store.getters['edit/selected_sub_faculty'];
                }, set: function (value) {
                    this.$store.dispatch('edit/setSelectedSubFaculty', value);
                }
            },
            selected_speciality: {
                get: function () {
                    return this.$store.getters['edit/selected_speciality'];
                }, set: function (value) {
                    this.$store.dispatch('edit/setSelectedSpeciality', value);
                }
            },
            selected_faculty: {
                get: function () {
                    return this.$store.getters['edit/selected_faculty'];
                }, set: function (value) {
                    this.$store.dispatch('edit/setSelectedFaculty', value);
                }
            },
            selected_faculty_name: function () {
                return this.$store.getters['edit/selected_faculty_name'];
            },
            schedule_type: function () {
                return this.$store.getters['edit/schedule_type'];
            },
            selected_study_year: {
                get: function () {
                    return this.$store.getters['edit/selected_study_year'];
                }, set: function (value) {
                    this.$store.dispatch('edit/setSelectedStudyYear', value);
                }
            },
            selected_season: {
                get: function () {
                    return this.$store.getters['edit/selected_season'];
                }, set: function (value) {
                    this.$store.dispatch('edit/setSelectedSeason', value);
                }
            },
            selected_academic_year: {
                get: function () {
                    return this.$store.getters['edit/selected_academic_year'];
                }, set: function (value) {
                    this.$store.dispatch('edit/setSelectedAcademicYear', value);
                }
            },
            selected_name: {
                get: function () {
                    return this.$store.getters['edit/selected_name'];
                }, set: function (value) {
                    this.$store.dispatch('edit/setSelectedName', value);
                }
            },
            selected_level: {
                get: function () {
                    return this.$store.getters['edit/selected_level'];
                }, set: function (value) {
                    this.$store.dispatch('edit/setSelectedLevel', value);
                    this.$store.dispatch('edit/setSelectedSpeciality', null);
                    this.$store.dispatch('edit/setSelectedSubFaculty', null);
                }
            },
            yearsByLevel: function () {
                return this.$store.getters["university/levels"].filter(
                    l => l.level == this.selected_level
                );
            },
            next_academic_year: function () {
                return this.academic_year + 1;
            },
            subfacultyFiltered: function () {
                if (this.schedule_type == this.sub_faculty_type)
                    return this.$store.getters["university/sub_faculty"].filter(
                        s => s.faculty_id == this.selected_faculty
                    );
                return [];
            },
            specialityFiltered: function () {
                if (this.schedule_type != this.sub_faculty_type)
                    return this.$store.getters["university/speciality"].filter(
                        s => s.faculty_id == this.selected_faculty &&
                            s.level == this.selected_level);
                return [];
            },
            loading: function () {
                return this.$store.getters["loading"];
            },
            loadingTable: function () {
                return this.$store.getters["edit/loadingTable"];
            },
            loadingSave: function () {
                return this.$store.getters["edit/loadingSave"];
            }
        },
        methods: {
            saveSchedule: function () {
                if (this.currentState == this.editState)
                    this.$store.dispatch("edit/editSchedule").then(() => {
                //        this.$store.dispatch("edit/fetchEditScheduleData", this.$route.params.code);
                        this.showSaveAlert = true;
                    });
                else if (this.currentState == this.createState)
                    this.$store.dispatch("edit/createSchedule").then(() => {
                        this.$router.push("/schedules/view/" + this.schedule_code);
                    });
            },
            deleteSchedule: function () {
                this.$store
                    .dispatch("schedule/deleteSchedule", this.schedule_code)
                    .then(() =>
                        this.$store.dispatch("state/changeCurrentState", CurrentState.SCHEDULES_ALL))
                    .then(() => this.$router.push("/schedules"))
                    .catch(err => console.log(err));
                return null;
            },
        },
        mounted() {
            if (this.currentState == this.editState) {
                if (this.$store.getters['state/role'] == Role.GUEST)
                    this.$router.push('/schedule/view/' + this.$route.params.code);
                this.$store.dispatch("edit/fetchEditScheduleData", this.$route.params.code)
                    //.then(()=>{
                 //   this.$store.dispatch('schedule/fetchAvailableCourses',{
                   //     faculty_if
                    //});
               // });
            } else if (this.currentState == this.createState) {
                if (this.$store.getters['state/role'] == Role.GUEST) this.$router.push('/schedules');
                this.$store.dispatch("edit/fetchNewScheduleData", this.$store.getters['schedule/createType']);
            }
        }
    };
</script>

<style scoped lang="scss">
    @import "../../assets/scss/_variables.scss";

    .float-right {
        float: right !important;
    }

    .pointer,
    .pointer:focus,
    .pointer:hover,
    .pointer:active {
        cursor: pointer;
    }

    .text-14 {
        font-size: 14px;
    }

    .text-16 {
        font-size: 16px;
    }

    .vertical-middle {
        vertical-align: middle !important;
    }

    .info-button {
        background: $info !important;
        border-color: $info-border !important;
    }
</style>
