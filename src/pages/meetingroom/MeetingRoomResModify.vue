<template>
    <div v-if="show" class="modal-overlay">
        <!-- 모달 컨텐츠 -->
        <!-- Modal content -->
        <div class="modal-content">
            <!-- Modal header -->
            <div class="modalheader">
                <button class="close">
                    <svg @click="closeModal" class="closebutton" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                    </svg>
                </button>
                <h2 class="title">
                    회의실 예약 수정
                </h2>
            </div>
            <br>
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
                    <b>예약자: </b>{{mrr.member.name}}
                </div>
                <br>
                <!----수정 가능한 영역 START---->
                <div class="participants"> 
                <b>회의 참석자: </b>
                <div v-for="mp in mrr.participants" :key="mp.id" class="participant-item">
                  <p>{{mp.member.name}} &nbsp; </p>
                </div>
                <br>
                <input v-model="search" type="text" class="searchbar" placeholder="검색"/>
                  <div v-if="loading"></div>
                  <div v-else-if="filteredMembers.length > 0">
                      <!-- key를 member.id로 정해서 <tr></tr>안의 내용을 반복 -->
                      <div v-for="member in filteredMembers" :key="member.id">
                        <div class="table-row">
                          <div class="table-cell" @click="addParticipant(member)">{{ member.name }}</div>
                        </div>
                      </div>
                  </div>
                  <div v-else>
                  <!-- 검색 결과가 없는 경우 메시지를 화면에 표시 -->
                  <p>다시 검색해주세요</p>
                  </div>
                  <div v-if="addedParticipants.length > 0">
                    <p class="added"><b>추가된 참석자:</b></p>
                    <ul>
                      <li v-for="participant in addedParticipants" :key="participant.id">
                        {{ participant.name }}
                        <button @click="removeParticipant(participant)">
                          <svg class="removebtn" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none">
                              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" 
                              stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                          </svg>
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
                <!----수정 가능한 영역 END---->
                <br>
                <div class="date">
                    <b>회의 날짜: </b>{{mrr.meetingDate}}
                </div>
                <br>
                <div class="time">
                    <b>시간: </b>{{mrr.startTime}} - {{mrr.endTime}}
                </div>
                <br>
                <div class="purpose">
                    <b>사용목적: </b>{{mrr.purpose}}
                </div>
            </div>
            <div class="button">
              <button type="submit" class="confirmbtn" @click="updateParticipantHandler"><b>저장</b></button>
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
      formDataList: [],
      loading: true,
      members: [],
      search: "",
      addedParticipants: [], //추가된 참석자 저장
    }
  },
  computed: {
     filteredMembers() {
      return this.members.filter((member) => {
        // 검색어가 없거나, 검색어가 이름과 직급에 포함되어 있는 경우에만 반환
        return (
          !this.search ||
          member.name.includes(this.search) ||
          member.position.includes(this.search)
        );
      });
    },
  },
  mounted() {

  },
  setup() {
    const state = reactive({
        // date: null,
        // startTime: {hours: 8, minutes: 0},
    })
  },
  methods: {
    openUpdateModal() {

    },
    closeModal() {
      this.$emit("close");
    },
    addParticipant(member) {
      this.addedParticipants.push(member);
      console.log(member);

      this.formDataList = this.addedParticipants.map((participant) => ({
        meetingId: {
          id : `${this.mrr.id}`
        },
        member: {
          id: participant.id
        }
      }))
    },
    removeParticipant(participant) {
      // member.id와 일치하는 참석자를 addedParticipants 배열에서 찾기
      const indexToRemove = this.addedParticipants.findIndex(
        (addedParticipant) => addedParticipant.id === participant.id
      );

      if (indexToRemove !== -1) {
        // 배열에서 찾은 참석자 제거
        this.addedParticipants.splice(indexToRemove, 1);
        console.log("제거 완료")
        console.log(this.addedParticipants)

        // 추가된 참석자의 id를 갖는 객체를 formDataList 업데이트
        this.formDataList = this.addedParticipants.map((participant) => ({
          meetingId: {
            id : `${this.mrr.id}`
          },
          member: {
            id: participant.id
          }
        }))
      }
    },
    updateParticipantHandler(e) {
      const url = `${this.backURL}/meetingroom/myreservation`
      const data = this.formDataList

      console.log(this.formDataList)
      axios
        .post(url, data)
        .then(response => {
          location.href = "/meetingroom/myreservation"
          alert("수정되었습니다!")
        })
        .catch(error => {
          alert(error.message)
        })
    },
    async fetchData() {
      try {
        this.loading=true;
        const url = `${this.backURL}/address/members`
        const response = await axios.get(url);
        // response.data에는 id, name, position, tel정보가 있음, 그 정보를 members배열에 넣음
        this.members = response.data;
      } catch (error) {
        console.error("사원 정보를 불러오지 못했습니다:", error);
      } finally {
        this.loading = false;
      }
    },
  },
  watch: {
    search(newValue) {
      if (newValue.trim() !== "") {
        this.fetchData();
      } else {
        // Clear the members array when the search term is empty
        this.members = [];
      }
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
  height: auto;
  background: #fff;
  padding: 10px;
  padding-bottom: 30px;
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

  padding-top: 0px;
  margin-top: 0px;
  margin-bottom: 0px;
}

button.close {
  float: right;
  padding-top: 20px;
  margin-bottom: 0px;
}

.closebutton {
  float: right;
  white-space: nowrap;

  margin-left: 600px;
  margin-bottom: 0px;

  width: 50px;
  height: 50px;
}

h3 {
  float: left;
  padding-top: 0px;

  font-size: 20px;
  color: #2c3e50;
  text-transform: uppercase;
  text-shadow: 1px 1px 1px #ccc;
}

.removebtn {
  width: 15px;
  height: 15px;
}

.meetingroominfo {
  display: grid;
  width: 80%;
  padding-left: 10px;

  grid-template-columns: repeat(2, 1fr); /* 2개의 열로 설정 */
  gap: 1rem; /* 간격 조절 */
}

.reservationinfo {
  width: 80%;

  padding-left: 10px;
  padding-bottom: 30px; 
}

.img {
  grid-column: 1;
  width: 200px;
  height: 200px;
  flex: left;
}

.searchbar {
  height: 30px;
  border-radius: var(--dp-border-radius);
  border: 1px solid lightgray;
  padding: 10px;
}

/* 점 제거 */
ul {
  list-style-type: none;
  padding-top: 0px;
  padding-bottom: 0px;
  margin-bottom: 0px;
}

li {
  padding-top: 0px;
  padding-bottom: 0px;
  margin-bottom: 0px;
}

.detail {
  grid-column: 2;
}

hr{
  border: 0.1rem solid #ddd;
}

p {
  display: inline-block;
}

b {
  display: inline-block;
  width: 120px;
}

.participant-item {
  display: inline-block;
}

.added {
  white-space : nowrap;
  padding-top: 0px;
  padding-bottom: 0px;
  margin-bottom: 10px;

  display: inline-block;
}

button {
  text-align: center;
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
  height: 40px;
  vertical-align: middle;
  align-items: center;
}

</style>