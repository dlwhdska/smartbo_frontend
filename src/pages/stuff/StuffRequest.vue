<template>
    <main>
        <StuffRequestList :memberId="memberId" />
        <br>
        <div class="req-container">
            <StuffRequestSend :memberId="memberId" />
        </div>
    </main>
</template>
  
<script>
import StuffRequestSend from '@/pages/stuff/StuffRequestSend.vue'
import StuffRequestList from '@/pages/stuff/StuffRequestList.vue'
export default {
    name: 'StuffReq',
    components: { StuffRequestSend, StuffRequestList },
    data() {
        return {
            memberId: null,

        };
    },
    created() {
        const memberId = localStorage.getItem('memberId');

        if (memberId !== null) {
            this.memberId = memberId;
        } else {
            console.log('로컬 스토리지에 memberId에 해당하는 값이 없습니다.');
        }
    },
}

</script>
  
<style scoped>
main {
    margin-top: 50px;
}
.req-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 5px; 
}
</style>