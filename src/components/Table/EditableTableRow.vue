<template>
  <tr v-if="row.rowspan">
    <td :rowspan="row.rowspan" class="px-0 py-2 text-center text-middle">
      {{ row.time }}
    </td>
  </tr>
  <tr v-else>
    <td class="no-padding text-middle">
      <button
        v-if="row.row_num == 1"
        class="btn m-0 text-muted green-hover"
        :disabled="disable"
        @click="onClickPlus"
      >
        <i class="fa fa-plus "></i>
      </button>
      <button
        v-else
        class="btn m-0 text-muted red-hover"
        :disabled="disable"
        @click="onClickMinus"
      >
        <i class="fa fa-minus "></i>
      </button>
    </td>
    <td class="py-2 bold no-padding text-middle-left">
      <Autocomplete
        v-if="defaultValue == ''"
        :search="search"
        :get-result-value="getResultValue"
        @submit="onSubmit"
        :disabled="disable"
      >
        <template #result="{ result, props }">
          <li v-bind="props" class="autocomplete-result wiki-result">
            <strong>{{ result.course_code }} </strong>{{ result.name }}
          </li>
        </template>
      </Autocomplete>
      <Autocomplete
        v-else
        :default-value="defaultValue"
        :search="search"
        :get-result-value="getResultValue"
        @submit="onSubmit"
        :disabled="disable"
      >
        <template #result="{ result, props }">
          <li v-bind="props" class="autocomplete-result wiki-result">
            <strong>{{ result.course_code }} </strong>{{ result.name }}
          </li>
        </template>
      </Autocomplete>
    </td>
    <td class="py-2 italic no-padding text-middle">
      <b-form-input
        type="text"
        class="form-control m-0  sharp-border"
        v-model="course_teacher"
        :disabled="disable"
      >
      </b-form-input>
    </td>
    <td
      v-if="scheduleType == sessionType"
      class="px-0 py-2 text-center no-padding text-middle"
    >
      <b-form-select
        type="text"
        class="form-control m-0  sharp-border"
        v-model="course_exam"
        :options="examTypes"
        :disabled="disable"
      >
      </b-form-select>
    </td>
    <td class="px-0 py-2 text-center no-padding text-middle">
      <b-form-select
        type="text"
        class="form-control m-0  sharp-border"
        v-model="course_group"
        :disabled="disable"
      >
        <b-form-select-option
          v-for="g in groups"
          :key="g"
          :value="g"
          class="text-14"
        >
          {{ g == 0 ? "Лекція" : g != 100 ? g : "" }}
        </b-form-select-option>
      </b-form-select>
    </td>
    <td class="px-0 py-2 text-center no-padding text-middle">
      <b-form-input
        type="text"
        class="form-control m-0  sharp-border"
        v-model="course_weeks"
        :disabled="disable"
      >
      </b-form-input>
    </td>
    <td class="px-0 py-2 text-center no-padding text-middle">
      <b-form-input
        type="text"
        class="form-control m-0  sharp-border"
        v-model="course_room"
        :disabled="disable"
      >
      </b-form-input>
    </td>
  </tr>
</template>

<script>
import { examination } from "../../assets/data/static";
import { BFormInput, BFormSelect, BFormSelectOption } from "bootstrap-vue";
import { ScheduleType } from "../../models/entities/ScheduleType";
import { CurrentState } from "../../models/entities/CurrentState";
import Autocomplete from "@trevoreyre/autocomplete-vue";

export default {
  name: "EditableTableRow",
  components: { BFormInput, BFormSelect, BFormSelectOption, Autocomplete },
  props: ["row", "scheduleType", "disable"],
  data() {
    return {
      currentState: this.$store.getters["state/currentState"],
      editState: CurrentState.SCHEDULE_EDIT,
      createState: CurrentState.SCHEDULE_CREATE,
      sessionType: ScheduleType.SESSION,
      course_name: this.row.name,
      course_code: this.row.course_code,
      course_teacher: this.row.teacher,
      course_weeks: this.row.weeks,
      course_exam: this.row.exam_type,
      course_room: this.row.classroom,
      course_group: this.row.group,
      examTypes: examination,
      focused: false,
      groups: [this.row.group]
    };
  },
  computed: {
    courses: function() {
      return this.$store.getters["schedule/availableCourses"];
    },
    defaultValue: function() {
      if (this.row.name.length == 0) return "";
      return this.row.course_code + " " + this.row.name;
    }
  },
  methods: {
    search: function(input) {
      if (input.length < 1) {
        return [];
      }
      return this.courses.filter(course => {
        return (
          course.name.toLowerCase().startsWith(input.toLowerCase()) ||
          course.course_code.toString().startsWith(input)
        );
      });
    },
    onSubmit: function(result) {
      this.course_code = result.course_code;
      this.course_name = result.name;
      this.$store.dispatch("edit/changeRow", this.getRow());
    },
    getResultValue: function(result) {
      return result.course_code + " " + result.name;
    },
    getRow: function() {
      return {
        id: this.row.id,
        course_code: this.course_code,
        group: this.course_group,
        day_id: this.row.day_id,
        pair_id: this.row.pair_id,
        weeks: this.course_weeks,
        classroom: this.course_room,
        name: this.course_name,
        teacher: this.course_teacher,
        exam_type: this.course_exam ? this.course_exam : null,
        row_num: this.row.row_num
      };
    },
    onClickMinus: function() {
      this.$emit("clicked", 0, this.row);
    },
    onClickPlus: function() {
      this.$emit("clicked", 1, this.row);
    }
  },
  watch: {
    course_name: function() {
      let res = [];
      let course = this.courses.find(
        course => course.course_code == this.course_code
      );
      for (let i = 0; i <= course.actual_group; i++) res.push(i);
      this.groups = res;
    },
    course_teacher: function() {
      this.$store.dispatch("edit/changeRow", this.getRow());
    },
    course_weeks: function() {
      this.$store.dispatch("edit/changeRow", this.getRow());
    },
    course_exam: function() {
      this.$store.dispatch("edit/changeRow", this.getRow());
    },
    course_room: function() {
      this.$store.dispatch("edit/changeRow", this.getRow());
    },
    course_group: function() {
      this.$store.dispatch("edit/changeRow", this.getRow());
    }
  },
  mounted() {
    this.groups = [];
    for (let i = 0; i <= this.row.actual_group; i++) this.groups.push(i);
  }
};
</script>

<style scoped>
@import "../../assets/scss/autocomplete.css";

.autocomplete-result-list li {
  background-image: none !important;
  padding: 2px 5px !important;
  font-size: 14px !important;
  font-weight: normal;
  text-align: left;
}

.italic {
  font-style: italic;
}

.bold {
  font-weight: bold;
}

.no-padding {
  padding: 3px !important;
}

.sharp-border {
  border-radius: 2px;
}

.text-middle-left {
  text-align: left;
  vertical-align: middle !important;
}

.text-middle {
  text-align: center;
  vertical-align: middle !important;
}

.green-hover:hover i,
.green-hover:active i,
.green-hover:focus i {
  color: #28a745;
}

.red-hover:hover i,
.red-hover:active i,
.red-hover:focus i {
  color: #dc3545;
}
</style>
