<template>
    <div>
        <Autocomplete
                :default-value="default_value"
                :search="search"
                :get-result-value="getResultValue"
                @submit="onSubmit" :disabled="disable">
            <template #result="{ result, props }">
                <li
                        v-bind="props"
                        class="autocomplete-result">
                    <strong>{{ result.course_code }} </strong>{{ result.name }}
                </li>
            </template>
        </Autocomplete>

    </div>
</template>

<script>
    import Autocomplete from '@trevoreyre/autocomplete-vue';
    export default {
        name: "EmptyRow",
        components: {
            Autocomplete
        },
        data(){
            return {}
        },
        computed: {
            courses: function () {
                return this.$store.getters['schedule/availableCourses'];
            }
        },
        methods: {
            search: function (input) {
                if (input.length < 1) {
                    return []
                }
                return this.courses.filter(course => {
                    return course.name.toLowerCase()
                        .startsWith(input.toLowerCase()) || course.course_code.toString().startsWith(input)
                });
            },
            onSubmit: function (result) {
                alert(`You selected ${result.name}`);
            },
            getResultValue: function (result) {
                console.log(result);
                return result.name;
            }
        }
    }
</script>

<style scoped>

    .autocomplete-result{
        background-image: none!important;
        padding: 2px 5px!important;
        font-size: 14px!important;
    }

    .autocomplete-input{
        font-size: 14px;
        background-image: none!important;
    }
</style>