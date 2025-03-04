<template lang="">
    <tr>
        <td>{{n.id}}</td>
        <td>{{n.title}}</td>
        <td>{{n.regdate}}</td>
        <td>{{n.member.name}}</td>
    </tr>
</template>
<script>
export default {
    name: 'NoticeItem',
    props:["n"],
    computed: {
        // 현재 아이템의 index + 1을 rownum으로 설정
        rowNum() {
            return this.$parent.noticelist.content.indexOf(this.n) + 1;
        },
    },
    data(){
        return {
            
        }
    }
}
</script>
<style scoped>

td {
    height: 80px;
    padding: 10px;
    text-align: center;
    border-bottom: px solid #ddd;
}

</style>