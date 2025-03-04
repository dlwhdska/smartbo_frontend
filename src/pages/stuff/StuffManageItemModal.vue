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
        <tr>
          <td class="label">사원명</td>
          <td>{{ request.member.name }}</td>
        </tr>
        <tr>
          <td class="label">부서명</td>
          <td>{{ request.member.department.name }}</td>
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
        <tr>
          <td v-if="request.status === 2" class="label">반려사유</td>
          <td>{{ request.reject }}</td>
        </tr>

      </table>
      <div v-if="request.status === 0">
        <div class="info-item">
          <label for="rejectReason" class="label">반려 사유</label>
          <textarea id="rejectReason" v-model="reject" rows="4" cols="50" placeholder="반려 사유를 50자 이내로 입력하세요"
            required ></textarea>
        </div>
        <div class="button-group">
          <button class="approve-button" @click="approveRequest">승인</button>
          <button class="reject-button" @click="rejectRequest">반려</button>
        </div>
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
    approveRequest() {
      // 확인 대화상자 추가
      if (!confirm('승인하시겠습니까?')) {
        return; // 사용자가 '아니오'를 선택한 경우, 함수를 빠져나간다.
      }

      if (this.request.quantity > this.request.stuff.stock) {
        alert('승인 가능한 수량이 없습니다.');
        return;
      }

      const params = {
        id: this.request.id,
        stuff: {
          id: this.request.stuff.id,
        },
        quantity: this.request.quantity,
        status: 1,
      };
      axios
        .put(`${this.backURL}/stuff/approve`, params,
          {
            withCredentials: true,
          }
        )
        .then((response) => {
          location.href = "/stuff/stuffmanage"
          alert('승인되었습니다')
        })
        .catch((error) => {
          alert('승인에 실패했습니다', error.message)
        });
      this.closeModal();
    },

    rejectRequest() {
      if (!this.reject || !this.reject) {
                alert('올바른 접근이 아닙니다. 반려 사유를 입력하세요.');
                return;
            }
      
      // 확인 대화상자 추가
      if (!confirm('반려하시겠습니까?')) {
        return; // 사용자가 '아니오'를 선택한 경우, 함수를 빠져나간다.
      }
      

      const params = {
        id: this.request.id,
        reject: this.reject,
        status: 2,
      };
      axios
        .put(`${this.backURL}/stuff/reject`, params,
          {
            withCredentials: true,
          }
        )
        .then((response) => {
          location.href = "/stuff/stuffmanage"
          alert('반려되었습니다')
        })
        .catch((error) => {
          alert('반려에 실패했습니다', error.message)
        });
      this.closeModal();
    },
  },
};
</script>

<style scoped>
/* 모달 스타일링 */
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

.button-group {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.approve-button,
.reject-button {
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.approve-button {
  background-color: #2196F3;
}

.reject-button {
  background-color: #2196F3;
}

.approve-button:hover,
.reject-button:hover {
  background-color: #2189df;
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

.label {
  width: 130px;
  font-weight: bold;
  margin-right: 5px;
}

#rejectReason {
  width: 100%;
}
</style>