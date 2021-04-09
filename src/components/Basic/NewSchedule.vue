<template>
  <div>
    <Title message="Додати розклад"></Title>
    <div class="mx-5 ">
      <form class="w-50 px-3 form-center">
        <label for="new-schedule-type" class="text-16">Тип розкладу:</label>
        <b-form-select
          id="new-schedule-type"
          v-model="selected"
          size="md"
          class="mb-3"
          variant="secondary">
          <template #first>
            <b-form-select-option :value="null" disabled>
              Не обрано
            </b-form-select-option>
          </template>
          <b-form-select-option
            v-for="type in schedule_types"
            :key="type.value"
            :value="type.value"
            class="py-3">
            {{ type.title }}
          </b-form-select-option>
        </b-form-select>
        <button
          class="btn btn-secondary"
          type="button"
          @click="createNewSchedule"
          :disabled="selected == null">
          Створити
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import Title from "../Nested/Title";
import { CurrentState } from "../../models/entities/CurrentState.js";
import { BFormSelect, BFormSelectOption } from "bootstrap-vue";

export default {
  name: "NewSchedule",
  components: { Title, BFormSelect, BFormSelectOption },
  data() {
    return {
      selected: null,
      code: null
    };
  },
  computed: {
    schedule_types: function() {
      return this.$store.getters["university/schedule_types"];
    },
    loading: function() {
      return this.$store.getters["loading"];
    }
  },
  methods: {
    createNewSchedule: function() {
      this.$store
        .dispatch("schedule/setCreateType", this.selected)
        .then(() =>
          this.$store.dispatch("state/changeCurrentState", CurrentState.SCHEDULE_CREATE))
        .catch(err => console.log(err))
        .finally(() => this.$router.push("/schedules/create"));
    }
  }
};
</script>

<style scoped>
.text-16 {
  font-size: 16px;
}

.form-center {
  margin-left: 25%;
}

.invalid {
  border-color: crimson;
}
</style>
