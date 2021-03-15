<template>
        <thead v-if="!loading">
        <tr class="text-center table-header">
            <th style="width: 2%!important;">День</th>
            <th style="width: 7%;">Час</th>
            <th style="width: 3%;" v-if="currentState==createState||currentState==editState"></th>
            <th style="width: 6%;" v-if="currentState==createState||currentState==editState">Код</th>
            <th style="width: 40%;">Дисципліна</th>
            <th>Викладач</th>
            <th style="width: 10%;" v-if="schedule_type==session_type">Вид контролю</th>
            <th style="width: 7%;">Група</th>
            <th style="width: 7%;" v-if="schedule_type!=session_type">Тижні</th>
            <th v-else style="width: 7%;">Дата</th>
            <th style="width: 7%;">Аудиторія</th>
        </tr>
        </thead>
</template>

<script>
    import {ScheduleType} from "../../models/entities/ScheduleType";
import {CurrentState} from "../../models/entities/CurrentState";

    export default {
        name: "TableHead",
        props: ["schedule_type", "code"],
        data() {
            return {
                session_type: ScheduleType.SESSION,
                currentState:this.$store.getters['currentState'],
                createState:CurrentState.SCHEDULE_CREATE,
                editState:CurrentState.SCHEDULE_EDIT
            }
        },
        computed: {
            loading: function () {
                return this.$store.getters['loading'];
            }
        },

    }
</script>
<style lang="scss">
    @import "../../assets/scss/_variables.scss";

    .table-header th {
        border-color: $gray-border;
        background: $gray-fill;
    }

</style>