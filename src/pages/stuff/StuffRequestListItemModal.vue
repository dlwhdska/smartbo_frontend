<template>
    <div class="modal">
        <div class="modal-content">
            <button class="close-button" @click="closeModal">
                <span class="material-symbols-outlined">close</span>
            </button>
            <h3>요청 정보</h3>
            <table>
                <tr>
                    <td class="label">요청날짜</td>
                    <td>{{ request.reqDate }}</td>
                </tr>
            </table>
            <br>
            <h3>요청 비품정보</h3>
            <table>
                <tr>
                    <td class="label">품목번호</td>
                    <td>{{ request.stuff.id }}</td>
                </tr>
                <tr>
                    <td class="label">품목명</td>
                    <td>{{ request.stuff.name }}</td>
                </tr>
                <tr>
                    <td class="label">요청수량</td>
                    <td>{{ request.quantity }}</td>
                </tr>
                <tr>
                    <td class="label">요청사유</td>
                    <td>{{ request.purpose }}</td>
                </tr>
            </table>
            <br>
            <div v-if="request.status === 2">
                <div class="info-item">
                    <div class="info-item"><span class="label">반려 사유:</span> {{ request.reject }}</div>
                </div>
            </div>
            <div v-if="request.status === 0">
                <button class="cancel-button" @click="cancelRequest">요청 취소</button>
            </div>
        </div>
    </div>
</template>
  
<script>
import axios from 'axios'
export default {
    props: {
        request: Object,
    },
    data() {
        return {
            reject: '',
        }
    },
    methods: {
        closeModal() {
            this.$emit('close');
        },

        cancelRequest() {
            // 확인 대화상자 추가
            if (!confirm('요청을 취소하시겠습니까?')) {
                return; // 사용자가 '아니오'를 선택한 경우, 함수를 빠져나간다.
            }

            const url = `${this.backURL}/stuff/request?id=${this.request.id}`;
            axios
                .delete(url)
                .then((response) => {
                    alert('요청이 취소되었습니다.');
                    this.closeModal();
                    window.location.reload();
                })
                .catch((error) => {
                    alert('요청 취소에 실패했습니다.');
                });
        },
    },
};
</script>
  
<style scoped>
.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}

.modal-content {
    width: 400px;
    background: #fff;
    padding: 20px;
    border-radius: 8px;
}

.modal-content h3 {
    font-size: 20px;
    color: #2196F3;
}

.close-button {
    float: right;
    width: 30px;
    height: 30px;
    border: none;
    background: none;
    cursor: pointer;
    font-size: 20px;
    margin-left: 330px;
}

.info-item {
    margin-bottom: 10px;
}

.label {
    width: 130px;
    font-weight: bold;
    margin-right: 5px;
}


.cancel-button {
    background-color: #2196F3;
    color: white;
    padding: 10px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    float: right;
}

.cancel-button:hover {
    background-color: #2189df;
}
</style>