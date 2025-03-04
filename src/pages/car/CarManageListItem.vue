<template lang="">
    <tr>
        <td>{{c.id}}</td>
        <td>{{c.carNo}}</td>
        <td>{{c.carType}}</td>
        <td>{{c.maxNum}}인승</td>
        <td><span class="tag" v-if="c.status==1" style="background-color: rgb(25, 189, 74);">대여중</span>
            <span class="tag" v-if="c.status==2" style="background-color: rgb(252, 49, 49);">미반납</span></td>
        <!-- <td><span v-if="c.status==2">미반납</span><span v-if="c.status==1">대기중</span></td> -->
    </tr>
</template>
<script>
import axios from 'axios'
export default {
    name: 'CarManageListItem',
    props:["c"],
    data(){
        return {
            
        }
    },
    methods: {
        
    }
}
</script>
<style scoped>
tr:nth-child(even) {
    background-color: #f9f9f9;
}
tr:hover {
    background-color: #fcfcfc;
}
td{
    padding: 10px;
    text-align: center;
    border-bottom: px solid #ddd;
    border-top : dotted 1px #cccccc;
    font-size: 15px;
    cursor: pointer;
}
.tag{
    color: white;
    border-radius:15px;
    padding: 20px;
    padding-top: 5px;
    padding-bottom:5px;
    font-size: 12px;
}
</style>