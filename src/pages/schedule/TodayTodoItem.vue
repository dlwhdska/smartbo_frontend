<template>
    <div>
        <span>{{formatHHmmss(t.startTime)}}</span><span>{{t.scheduleTitle}}</span>
    </div>
</template>
<script>
import axios from 'axios'

export default {
    name: 'TodayTodoItem',
    props: [ 't' ],
    data() {
        return {
            
        }
    },
    methods: {
        formatHHmmss(data){
            const date = new Date(data)
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');

            return `${hours}:${minutes}`
        },
    },
    created(){
        console.log('컴포넌트'+this.t.startTime)
    }
}
</script>
<style scoped>
div{
    padding : 10px;
}
span{
    margin : 10px;
}
</style>