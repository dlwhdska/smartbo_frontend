<template lang="">
    <div v-if="departmentId === '4'" class="item stuff">
		<h3>비품 요청내역</h3>
		<div class="box stuffBox">
			<div class="stuff-text">미처리 비품 요청</div>
			<div class="reqSize">{{ unprocessedReqSize }} 건</div>
		</div>
	</div>
	<div v-else class="item stuff">
		<h3>비품 요청현황</h3>
		<div class="box stuffBox">
			<div class="stuff-text">처리 대기중인 비품 요청</div>
			<div class="reqSize">{{ waitproccessReqSize }} 건</div>
		</div>
	</div>
</template>
<script>
import axios from "axios";
export default {
    data() {
        return {
            departmentId: 0,
            unprocessedReqSize: 0,
			waitproccessReqSize: 0,
        }
    },

    created() {
        this.departmentId = localStorage.getItem("departmentId");
        this.UnproccessedReqHandler();
		this.WaitproccesseReqHandler();
    },

    methods: {
        //=====================비품 내역 ====================
		UnproccessedReqHandler() {
			const url = `${this.backURL}/stuff/unprocessedreq`
			axios.get(url)
				.then(response => {
					this.unprocessedReqSize = response.data
				})
				.catch((Error) => {
					console.log(Error)
				})
		},
		WaitproccesseReqHandler() {
			const memberId = localStorage.getItem('memberId');
			const url = `${this.backURL}/stuff/waitproccess?memberId=${memberId}`
			axios.get(url)
				.then(response => {
					this.waitproccessReqSize = response.data
				})
				.catch((Error) => {
					console.log(Error)
				})
		},
    },
}
</script>
<style scoped>

.box {
  height: 350px;
  border: 1px solid #ccc;
  border-radius: 15px;
  box-shadow: 10px 10px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.item h3 {
	font-size: 16px;
	font-weight: bold;
	color: #1565c0;
	margin-left: 10px;
	margin-bottom: 10px;
}

.stuff .box div {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}

.stuffBox {
	padding-top: 120px;
	padding-bottom: 120px;
}

.stuffBox div {
	padding-bottom: 40px;
}

.reqSize {
	font-size: 25px;
}

.stuff-text {
	color: #2196F3;
}
</style>