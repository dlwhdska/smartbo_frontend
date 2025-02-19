<template lang="">
    <tr>
        <td>{{n.id}}</td>
        <td>{{truncateString(n.title, 8)}}</td>
        <td>{{n.regdate}}</td>
        <td>{{n.member.name}}</td>
    </tr>
</template>
<script>
export default {
    props:["n"],
    data(){
        return {
            
        }
    },
    methods: {
        truncateString(str, maxLength) {
            if (str && str.length > maxLength) {
                return str.substring(0, maxLength) + '...';
            } else {
                return str;
            }
        },
    },
}
</script>
<style scoped>

td {
  width: 150rem;
  height: 50px;
  padding: 8px;
  text-align: left;
  border-bottom: 1px solid #ddd;
  text-align: center;
}

</style>