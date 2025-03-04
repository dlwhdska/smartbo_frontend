<template>
    <div v-if="show" class="modal-overlay">
        <!-- 모달 컨텐츠 -->
        <!-- Modal content -->
        <div class="modal-content">

          <!-- Modal head -->
          <div class="modal-head">
            <div class="title"><h3>예약을 취소하겠습니까?</h3></div>
            <br>
          </div>
          <!-- Modal body -->
          <h4>예약내역</h4><br>
          <div class="info">
              <table class="infotbl">
                <thead>
                  <tr>
                  <td>자원명</td>
                  <td>예약 시간</td>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                  <td>{{mrr.meetingroom.name}}</td>
                  <td>{{mrr.meetingDate}} &nbsp; {{mrr.startTime}} - {{mrr.endTime}}</td>
                  </tr>
                </tbody>
              </table>
          </div>
          <br>
          <div class="button">
              <button type="submit" class="confirmbtn" @click="cancelReservationHandler"><b>확인</b></button>
              &nbsp;
              <button class="cancelbtn" @click="closeModal"><b>취소</b></button>
          </div>
        </div>
    </div>
</template>
<script>
import {reactive} from 'vue';
import axios from 'axios'

export default {
  props: {
    show: Boolean,
    mrr: {
      type: Object,
      required: true,
    }
  },
  data() {
    return {

    }
  },
  setup() {
    const state = reactive({
    })
  },
  methods: {
    openCancelModal() {

    },
    closeModal() {
      this.$emit("close");
    },
    cancelReservationHandler(e) {
      const url = `${this.backURL}/meetingroom/deletereservation/${this.mrr.id}`
      console.log(this.mrr.id)

      axios
        .delete(url)
        .then(response => {
          location.href = "/meetingroom/myreservation"
          alert("예약이 취소되었습니다!")
        })
        .catch(error => {
          alert(error.message)
        })
    }
  }
}
</script>
<style scoped>
/* 모달을 화면 중앙에 위치시키기 위한 스타일 */
.modal-overlay {
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

/* 모달 컨텐츠 부분 */
.modal-content {
  width: 500px;
  height: auto;
  background: #fff;
  padding: 30px;
  border-radius: 8px;

  align-content: center;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.title {
  text-align: center;
  font-size: 20px;
  color: #2c3e50;
  text-transform: uppercase;
  font-weight: bold;
  text-shadow: 1px 1px 1px #ccc;

  padding-top: 20px;
}

button.close {
  float: right;
  align-content: center;
  align-items: center;
  justify-content: center;
  align-items: center;
  vertical-align: middle;

  padding-top: 15px;
}

.closebutton {
  float: right;
  width: 30px;
  height: 30px;
}

h4 {
  font-size: 20px;
  color: #2c3e50;
  text-transform: uppercase;
  text-shadow: 1px 1px 1px #ccc;
}

.meetingroominfo {
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* 2개의 열로 설정 */
  gap: 1rem; /* 간격 조절 */
  margin-bottom: 1rem; /* 아래쪽 여백 추가 */

  padding: 10px;
}

.img {
  grid-column: 1;
  width: 200px;
  height: 200px;
  flex: left;
}

.detail {
  grid-column: 2;
}

hr {
  border: 0.1rem solid #ddd;
}

.info {
  text-align: center;
}

table.infotbl {
  text-align: center;

  margin-left: auto;
  margin-right: auto;

  border-top: 2px solid gray;
  border-bottom: 2px solid gray;
}

table.infotbl>tbody>tr>td {
  border-top: 2px solid gray;

  padding: 5px;
}

.button {
  text-align: center;
  margin-bottom: 10px;
}

.confirmbtn {
  display: inline-block;

  border-radius: 4px;
  background: var(--dark);
  color: #ddd;
  border: none;

  text-align: center;
  font-size: 15px;

  padding: 5px;
  width: 50px;
  height: 40px;
  vertical-align: middle;
  align-items: center;
}

.cancelbtn {
  display: inline-block;

  border-radius: 4px;
  color: var(--dark);
  border: 2px solid var(--dark);

  text-align: center;
  font-size: 15px;

  padding: 5px;
  width: 50px;
  height: 40px;
  vertical-align: middle;
  align-items: center;
}

</style>