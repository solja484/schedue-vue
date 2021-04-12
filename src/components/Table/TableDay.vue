<template>
  <tbody class="p-0" v-if="currentState == viewState && !loadingTable">
    <tr class="p-0">
      <td :rowspan="dayRowspan" class="text-middle">
        <div class="rotate text-middle bold">{{ day.name }}</div>
      </td>
    </tr>
    <TableRow
      v-for="row in allRows"
      :key="row.id"
      :row="row"
      :scheduleType="scheduleType"
    ></TableRow>
  </tbody>
  <tbody v-else-if="!loadingTable" class="p-0">
    <tr class="p-0">
      <td :rowspan="dayRowspan" class="text-middle p-0 m-0">
        <div class="rotate text-middle bold p-0 m-0">{{ day.name }}</div>
      </td>
    </tr>

    <EditableTableRow
      v-for="row in rows"
      :key="row.id"
      class="p-0"
      :row="row"
      :scheduleType="scheduleType"
      :disable="disable"
      @clicked="changeRowNum"
    >
    </EditableTableRow>
  </tbody>
</template>

<script>
import { CurrentState } from "../../models/entities/CurrentState";
import EditableTableRow from "./EditableTableRow";
import TableRow from "./TableRow";

export default {
  name: "TableDay",
  components: { TableRow, EditableTableRow },
  props: ["day", "scheduleType", "disable", "currentState"],
  data() {
    return {
      viewState: CurrentState.SCHEDULE_VIEW,
      editState: CurrentState.SCHEDULE_EDIT,
      rows: this.$store.getters["edit/editRow"](this.day.id)
    };
  },
  watch: {
    editDayRows: function() {
      this.rows = this.editDayRows;
    }
  },
  computed: {
    loadingTable: function() {
      if (this.currentState == this.editState)
        return this.$store.getters["edit/loadingTable"];
      else return this.$store.getters["loading"];
    },
    editDayRows: function() {
      return this.$store.getters["edit/editRow"](this.day.id);
    },
    courses: function() {
      if (this.currentState == this.viewState)
        return this.$store.getters["schedule/viewRows"].filter(
          c => c.day_id == this.day.id
        );
      return [];
    },
    dayRowspan: function() {
      if (this.currentState == this.editState)
        return this.$store.getters["edit/getRowspanAll"](this.day.id);
      let result = 3;
      for (let i = 0; i < 7; i++) {
        result += this.getPairRowspan(i + 1);
      }
      return result;
    },
    allRows: function() {
      if (this.currentState == this.editState) return [];
      let result = [];
      for (let i = 1; i < 8; i++) {
        let counter = 0;
        for (let course of this.courses) {
          if (course.pair_id == i) {
            counter++;
            if (counter == 1)
              result.push({
                rowspan: this.getPairRowspan(i),
                time: this.getPairTime(i)
              });
            course["row_num"] = counter;
            result.push(course);
          }
        }
        if (counter == 0) {
          const empty = {
            id: i,
            name: "",
            course_code: "",
            group: 100,
            pair_id: i,
            day_id: this.day.id,
            weeks: "",
            classroom: "",
            teacher: "",
            row_num: 1
          };
          result.push({
            rowspan: 2,
            time: this.getPairTime(i)
          });
          result.push(empty);
        }
      }
      return result;
    }
  },
  methods: {
    changeRowNum(action, row) {
      alert(action);
      if (action == 1) this.addRow(row);
      else this.deleteRow(row);
    },
    addRow: function(row) {
      console.log(row);
      const pairs = this.editDayRows.filter(r => r.pair_id == row.pair_id)
        .length;
      console.log(pairs);
      const newRow = {
        actual_group: 0,
        classroom: "",
        course_code: "",
        day_id: this.day.id,
        exam_type: "",
        group: 100,
        id: "row" + row.pair_id + "day" + row.day_id + (pairs + 1),
        name: "",
        pair_id: row.pair_id,
        row_num: pairs + 1,
        teacher: "",
        weeks: ""
      };
      console.log(newRow);
      this.$store.dispatch("edit/addRow", newRow);
    },
    deleteRow: function(row) {
      this.$store.dispatch("edit/deleteRow", row);
    },
    getPairRowspan(pair_id) {
      let rowspan = 0;
      this.courses.forEach(function(c) {
        if (c.pair_id == pair_id) rowspan++;
      });
      if (rowspan == 0) return 2;
      rowspan++;
      return rowspan;
    },
    getPairTime(pair_id) {
      return this.$store.getters["university/pairs"].find(
        p => p.number == pair_id
      ).time;
    }
  },
  mounted() {}
};
</script>

<style>
.text-middle-left {
  vertical-align: middle !important;
}

.text-middle {
  text-align: center;
  vertical-align: middle !important;
}

.rotate {
  transform: rotate(270deg);
  text-align: center;
}

.italic {
  font-style: italic;
}

.link-black,
.link-black:hover,
.link-black:active,
.link-black:focus {
  cursor: pointer;
  color: black;
}

.bold {
  font-weight: bold;
}
</style>
