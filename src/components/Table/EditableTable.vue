<template>
    <table class="table table-bordered table-hover table-align" >
        <TableHead :schedule_type="schedule_type"></TableHead>
    </table>
</template>

<script>
    import TableHead from "./TableHead";
    export default {
        name: "EditableTable",
        components: {TableHead},
        props:['schedule_type'],
        data(){
            return{

            }
        }
    }
</script>

<style scoped>

</style>
