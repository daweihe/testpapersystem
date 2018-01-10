<template>
    <div class="container">
            <tableInfo></tableInfo>

            <lookInfo></lookInfo>    

            <editInfo></editInfo>

            <addSubject></addSubject>
    </div>
</template>

<script>
    import lookInfo from './lookInfo.vue'
    import editInfo from './editInfo.vue'
    import tableInfo from './tableInfo.vue'
    import addSubject from './addSubject.vue'

    export default {
        data(){
            return {
                
            }
        },
        components:{
            lookInfo,
            editInfo,
            tableInfo,
            addSubject
        }
    }
</script>

<style scoped>
    .container{
        overflow-y: auto;
        width:100%;
        height:100%;
        float:left;
    }
</style>