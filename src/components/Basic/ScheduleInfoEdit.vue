<template>
    <div v-if="!loading">
        <button @click="saveSchedule" class="btn btn-info btn-lg float-right mx-5 info-button"
                :disabled="selected_speciality==null&&selected_sub_faculty==null"><i class="fa fa-save"></i> Зберегти
        </button>
        <Title v-if="currentState==createState" message="Новий розклад"></Title>
        <Title v-else-if="currentState==editState" message="Редагування розкладу" additional=""></Title>
        <div class="container mx-5">
            <div class="row">
                <strong class="col-sm-2 text-right text-14">Факультет</strong>
                <b-form-select v-model="selected_faculty" class="col-sm-4 text-14 mb-1" size="sm" disabled>
                    <b-form-select-option :value="methodist.faculty_id">{{methodist.faculty_name}}
                    </b-form-select-option>
                </b-form-select>
            </div>
            <div class="row">
                <strong class="col-sm-2 text-right text-14">Програма</strong>
                <b-form-group class="col-sm-4 text-14 mb-1" v-slot="{ ariaDescribedby }">
                    <b-form-radio-group
                            v-model="selected_level"
                            :options="level_options"
                            :aria-describedby="ariaDescribedby"
                    ></b-form-radio-group>
                </b-form-group>
            </div>
            <div class="row " v-if="schedule_type!=sub_faculty_type">
                <strong class="col-sm-2 text-right text-14">Спеціальність</strong>
                <b-form-select v-model="selected_speciality" class="col-sm-4 text-14 mb-1"
                               size="sm" :disabled="selected_level==null">
                    <b-form-select-option :value="null">Не обрано</b-form-select-option>
                    <b-form-select-option v-for="s in specialityFiltered" :key="s.id" :value="s.id" class="text-14">
                        {{s.name}}
                    </b-form-select-option>
                </b-form-select>
                <div class=" col-sm-6"></div>
            </div>
            <div class="row " v-else-if="schedule_type==sub_faculty_type">
                <strong class="col-sm-2 text-right text-14">Кафедра</strong>
                <b-form-select v-model="selected_sub_faculty" class="col-sm-4 text-14 mb-1" size="sm">
                    <b-form-select-option :value="null">Не обрано</b-form-select-option>
                    <b-form-select-option v-for="s in subfacultyFiltered" :key="s.id" :value="s.id" class="text-14">
                        {{s.name}}
                    </b-form-select-option>
                </b-form-select>
                <div class=" col-sm-6"></div>
            </div>
            <div class="row" v-if="schedule_type!=sub_faculty_type">
                <strong class="col-sm-2 text-right text-14">Рік навчання</strong>
                <b-form-select v-model="selected_study_year" class="col-sm-1 text-14 mb-1" size="sm">
                    <b-form-select-option v-for="l in yearsByLevel" :key="l.course" :value="l.year" class="text-14">
                        {{l.year}}
                    </b-form-select-option>
                </b-form-select>
            </div>
            <div class="row">
                <strong class="col-sm-2 text-right text-14 vertical-middle">Триместр</strong>
                <b-form-select v-model="selected_season" class="col-sm-1 text-14 mb-1" size="sm">
                    <b-form-select-option v-for="s in seasons" :key="s.number" :value="s.number"
                                          class="text-14">
                        {{s.title}}
                    </b-form-select-option>
                </b-form-select>
            </div>
            <div class="row">
                <strong class="col-sm-2 text-right text-14">Рік</strong>
                <b-form-select v-model="selected_academic_year" class="col-sm-1 text-14 mb-1" size="sm">
                    <b-form-select-option :value="academic_year" class="text-14">
                        {{academic_year}}
                    </b-form-select-option>
                    <b-form-select-option :value="next_academic_year" class="text-14">
                        {{next_academic_year}}
                    </b-form-select-option>
                </b-form-select>
            </div>
            <div class="row mt-2">
                <strong class="col-sm-2 text-right text-14">Назва</strong>
                <b-form-input class="col-sm-4 t text-14" maxlength="100" v-model="selected_name"></b-form-input>
            </div>
        </div>
        <div class="px-5 mt-3" v-if="!loadingTable">
            <ViewTable :schedule_type="schedule_type"
                       :code="schedule_code"
                       :currentState="currentState"
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
                <button @click="saveSchedule" class="btn btn-info btn-lg mt-2 col-md-2 info-button"
                        :disabled="selected_speciality==null&&selected_sub_faculty==null"><i class="fa fa-save"></i>
                    Зберегти зміни
                </button>
                <div class="col-md-7"></div>
                <div class="col-md-3">
                    <a class="text-danger text-16 p-2 text-middle float-right pointer"
                       @click="showDeleteAlert=!showDeleteAlert">
                        <i class="fa fa-trash mx-1"></i>
                        Видалити розклад</a>
                </div>
            </div>

        </div>
        <b-alert fade variant="danger" dismissible class="mx-5 px-5 delete-alert" v-model="showDeleteAlert">
            <h4 class="alert-heading">Видалення розкладу</h4>
            <hr>
            <p>
                Ви впевнені, що хочете видалити розклад? Відмінити цю дію буде неможливо
            </p>
            <p class="mb-0">
                <button class="btn " @click="showDeleteAlert=!showDeleteAlert">Скасувати</button>
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
                    :table-props="{ bordered: true, striped: true, align:true }"
            ></b-skeleton-table>
        </div>
    </div>
</template>

<script>
    import Title from "../../components/Nested/Title";
    import {CurrentState} from "../../models/entities/CurrentState";
    import {ScheduleType} from "../../models/entities/ScheduleType"
    import {
        BFormSelect, BFormSelectOption, BFormGroup, BFormRadioGroup,
        BFormInput, BSkeletonTable, BSkeleton, BAlert
    } from "bootstrap-vue";
    import ViewTable from "../Table/ViewTable";

    export default {
        name: "ScheduleInfoEdit",
        components: {
            ViewTable, Title, BFormSelect, BFormSelectOption, BFormGroup,
            BFormRadioGroup, BFormInput, BSkeletonTable, BSkeleton, BAlert
        },
        props: ['currentState'],
        data() {
            return {
                showDeleteAlert: false,
                createState: CurrentState.SCHEDULE_CREATE,
                editState: CurrentState.SCHEDULE_EDIT,
                academic_year: this.$store.getters['university/academic_year'],
                methodist: this.$store.getters['state/user'].methodist,
                sub_faculty_all: this.$store.getters['university/sub_faculty'],
                speciality_all: this.$store.getters['university/speciality'],
                faculty_all: this.$store.getters['university/faculties'],
                yearsByLevel: this.$store.getters['university/levels'].filter(l => l.level == 1),
                selected_faculty: this.$store.getters['state/user'].methodist.faculty_id,
                selected_speciality: null,
                selected_sub_faculty: null,
                selected_study_year: null,
                selected_season: null,
                selected_academic_year: null,
                selected_name: null,
                selected_level: null,
                schedule_code: null,
                sub_faculty_type: ScheduleType.SUBFACULTY,
                seasons: this.$store.getters['university/seasons'],
                level_options: [
                    {text: 'Бакалаврська', value: 1},
                    {text: 'Магістерська', value: 2}
                ],
                courses: this.$store.getters['schedule/availableCourses']
            }
        },
        computed: {
            next_academic_year: function () {
                return this.academic_year + 1
            },
            subfacultyFiltered: function () {
                if (this.schedule_type == this.sub_faculty_type)
                    return this.sub_faculty_all.filter(s =>
                        (s.faculty_id == this.selected_faculty));
                return [];
            },
            specialityFiltered: function () {
                if (this.schedule_type != this.sub_faculty_type)
                    return this.speciality_all.filter(s =>
                        (s.faculty_id == this.selected_faculty && s.level == this.selected_level));
                return [];
            },
            editInfo: function () {
                return this.$store.getters['schedule/editInfo'];
            },
            schedule_type: function () {
                return this.$store.getters['schedule/editInfo'].schedule_type
            },
            loading: function () {

                console.log(this.editInfo.schedule_type);
                console.log(this.schedule_type);
                return (this.$store.getters['loading']);
            },
            loadingTable: function () {
                return this.$store.getters['schedule/loadingTable'];
            }
        },
        watch: {
            editInfo: function () {
                this.selected_speciality = this.editInfo.speciality_id;
                this.selected_sub_faculty = this.editInfo.subfaculty_id;
                this.selected_study_year = this.editInfo.study_year;
                this.selected_season = this.editInfo.season;
                this.selected_academic_year = this.editInfo.academic_year;
                this.selected_name = this.editInfo.title;
                this.selected_level = this.editInfo.level;
                this.schedule_code = this.editInfo.schedule_code;
            },
            selected_level: function () {
                this.specialityFiltered;
                this.yearsByLevel = this.$store.getters['university/levels'].filter(l => l.level == this.selected_level);
                this.selected_speciality = null;
                this.selected_sub_faculty = null;
            },
            selected_speciality: function () {
                console.log("watcher");
                let data = {
                    "speciality": this.selected_speciality,
                    "faculty": this.methodist.faculty_id,
                    "level": this.selected_level,
                    "academic_year": this.selected_academic_year,
                    "season": this.selected_season
                };
                this.$store.dispatch('schedule/fetchAvailableCourses', data);
            },
            selected_sub_faculty: function () {
                console.log("watcher");
                let data = {
                    "faculty": this.methodist.faculty_id,
                    "level": this.selected_level,
                    "academic_year": this.selected_academic_year,
                    "season": this.selected_season
                };
                this.$store.dispatch('schedule/fetchAvailableCourses', data);
            },
            selected_academic_year: function () {
                console.log("watcher");
                let data = {
                    "speciality": this.selected_speciality,
                    "faculty": this.methodist.faculty_id,
                    "level": this.selected_level,
                    "academic_year": this.selected_academic_year,
                    "season": this.selected_season
                };
                this.$store.dispatch('schedule/fetchAvailableCourses', data);
            },
            selected_season: function () {
                console.log("watcher");
                this.fetchAvailableCourses();
            },
        },
        methods: {
            fetchAvailableCourses: function () {
                let data = {
                    "speciality": this.selected_speciality,
                    "faculty": this.methodist.faculty_id,
                    "level": this.selected_level,
                    "academic_year": this.selected_academic_year,
                    "season": this.selected_season
                };
                this.$store.dispatch('schedule/fetchAvailableCourses', data);
            },
            saveSchedule: function () {
                const data = {
                    "selected_faculty": this.selected_faculty,
                    "selected_speciality": this.selected_speciality,
                    "selected_sub_faculty": this.selected_sub_faculty,
                    "selected_level": this.selected_level,
                    "selected_study_year": this.selected_study_year,
                    "selected_season": this.selected_season,
                    "selected_academic_year": this.selected_academic_year,
                    "notes": this.notes,
                    "schedule_type": this.schedule_type
                };
                console.log(data);
                if (this.currentState == this.editState)
                    this.$store.dispatch('editSchedule', data).then((res) => {
                        this.$router.push('/view/' + res.code);
                    });
                else if (this.currentState == this.createState)
                    this.$store.dispatch('createSchedule', data).then((res) => {
                        this.$router.push('/view/' + res.code);
                    });
            },
            deleteSchedule: function () {
                this.$store.dispatch('schedule/deleteSchedule', this.editInfo.code)
                    .then(() =>
                        this.$store.dispatch('state/changeCurrentState', CurrentState.SCHEDULES_ALL))
                    .then(()=>this.$router.push("/schedules"))
                    .catch((err) => console.log(err));
                return null;
            }
        },
        mounted() {
            this.selected_speciality = this.editInfo.speciality_id;
            this.selected_sub_faculty = this.editInfo.subfaculty_id;
            this.selected_study_year = this.editInfo.study_year;
            this.selected_season = this.editInfo.season;
            this.selected_academic_year = this.editInfo.academic_year;
            this.selected_name = this.editInfo.title;
            this.selected_level = this.editInfo.level;
            this.schedule_code = this.editInfo.schedule_code;
            if (!this.$store.getters['state/user'].methodist && this.currentState == this.editState)
                this.$router.push('/schedules/view/' + this.$route.params.code);
            else if (this.$store.getters['state/currentState'] != this.currentState)
                this.$router.push('/schedules/view/' + this.$route.params.code);
        }
    }
</script>

<style scoped lang="scss">
    @import "../../assets/scss/_variables.scss";

    .float-right {
        float: right !important;
    }

    .pointer, .pointer:focus, .pointer:hover, .pointer:active {
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