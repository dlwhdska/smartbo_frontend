<template>
    <div v-if="show" class="modal-overlay">
        <!-- 모달 컨텐츠 -->
        <!-- Modal content -->
        <div class="modal-content">
            <!-- Modal header -->
            <div class="modalheader">
                <button @click="closeModal" class="close">
                    <svg class="closebutton" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                    </svg>
                </button>
                <h2 class="title">
                    회의실 예약 상세
                </h2>
            </div>

            <!-- Modal body -->
            <!--회의 정보-->
            <div class="meetingroominfo">
                <div><h3>{{mrr.meetingroom.name}}</h3></div><br><br>
                
                <div>
                <img class="img" :src="`../../images/${mrr.meetingroom.name}.jpg`" :alt="mrr.meetingroom.name">
                </div>

                <div class="detail">
                    <div class="location"><b>위치: </b>{{mrr.meetingroom.location}}</div>
                    <br>
                    <div class="maxnum"><b>최대 수용 인원: </b>{{mrr.meetingroom.maxNum}}인</div>
                </div>
            </div>
            <hr>
            <!--예약 정보-->
            <div class="reservationinfo">
                <div class="member">
                    <b>예약자: </b> {{mrr.member.name}}
                </div>
                <br>
                <div class="date">
                    <b>회의 날짜: </b> {{mrr.meetingDate}}
                </div>
                <br>
                <div class="time">
                    <b>시간: </b>
                    {{mrr.startTime}} - {{mrr.endTime}}
                </div>
                <br>
                <div class="participants">
                    <b>회의 참여자: </b>
                    <p v-for="mp in mrr.participants">
                      <span>{{mp.member.name}} &nbsp;</span>
                    </p>
                </div>
                <br>
                <div class="purpose">
                    <b>사용목적: </b>{{mrr.purpose}}
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import {reactive} from 'vue';

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
    openModal() {

    },
    closeModal() {
      this.$emit("close");
    },
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
  width: 700px;
  background: #fff;
  padding: 10px;
  border-radius: 10px;

  align-content: center;
  align-items: center;
  justify-content: center;
  text-align: left;
}

.title {
  text-align: center;
  font-size: 28px;
  color: #2c3e50;
  text-transform: uppercase;
  font-weight: bold;
  text-shadow: 1px 1px 1px #ccc;

  margin-top: 0px;
  margin-bottom: 20px;
}

button.close {
  float: right;
  padding-top: 30px;
  padding-bottom: 0px;
}

.closebutton {
  float: right;
  white-space: nowrap;

  margin-left: 600px;

  width: 50px;
  height: 50px;
}

h3 {
  float: left;
  padding-top: 10px;
  padding-bottom: 0px;

  font-size: 20px;
  color: #2c3e50;
  text-transform: uppercase;
  text-shadow: 1px 1px 1px #ccc;
}

.meetingroominfo {
  display: grid;
  width: 80%;
  padding-left: 10px;

  grid-template-columns: repeat(2, 1fr); /* 2개의 열로 설정 */
  gap: 1rem; /* 간격 조절 */
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

span {
  white-space: nowrap;
}

hr{
  border: 0.1rem solid #ddd;
}

.reservationinfo {
  width: 80%;

  padding-left: 10px;
  padding-bottom: 30px;
}

p {
  display: inline-block;
}

b {
  display: inline-block;
  width: 120px;
}

</style>