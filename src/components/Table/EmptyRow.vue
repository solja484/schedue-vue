<template>
    <div>
        <autocomplete
                :search="search"
                :get-result-value="getResultValue"
                @submit="onSubmit">
            <template
                    #default="{rootProps,
                    inputProps,
                    inputListeners,
                    resultListProps,
                    resultListListeners,
                    results,
                    resultProps}">
                <div v-bind="rootProps">
                    <input
                            v-bind="inputProps"
                            v-on="inputListeners"
                            class="p-2 m-0 form-control"
                            :class="[
                            { 'autocomplete-input-no-results': noResults },
                            { 'autocomplete-input-focused': focused }]"
                            @focus="handleFocus"
                            @blur="handleBlur"
                    />
                    <ul v-bind="resultListProps" v-on="resultListListeners">
                        <li
                                v-for="(result, index) in results"
                                :key="resultProps[index].id"
                                v-bind="resultProps[index]">
                            {{ result.name }}
                        </li>
                    </ul>
                </div>
            </template>
        </autocomplete>

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
                if (input.length < 1){
                    return [];}
                return this.courses.filter(course => {
                    return course.name.toLowerCase()
                        .startsWith(input.toLowerCase())
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

    .autocomplete-result-list li{
        background-image: none!important;
        padding: 2px 5px!important;
        font-size: 14px!important;
    }

    .autocomplete-input{
        font-size: 14px;
        background-image: none!important;
    }
</style>