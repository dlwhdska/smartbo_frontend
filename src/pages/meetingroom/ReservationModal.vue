<template>
  <div v-if="show" class="modal-overlay">
    <!-- 모달 컨텐츠 -->
    <!-- Modal content -->
    <div class="modal-content">
      <div class="content">
        <!-- Modal header -->
        <div class="modalheader">
          <button @click="closeModal" class="close">
            <svg
              class="closebutton"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
          </button>
          <h2>회의실 예약하기</h2>
        </div>

        <!-- Modal body -->
        <!--희의실 정보-->
        <div class="meetingroominfo">
          <div class="title"><h3>회의실 정보</h3></div>
          <br /><br />

          <div class="img">
            <img :src="`../../images/${mr.name}.jpg`" :alt="mr.name" />
          </div>

          <div class="detail">
            <div class="roomname">
              <b>{{ mr.name }}</b>
            </div>
            <br />
            <div class="location"><b>위치: </b>{{ mr.location }}</div>
            <br />
            <div class="maxnum"><b>최대 수용 인원: </b>{{ mr.maxNum }}인</div>
            <br />
            <div>
              <b>구비 품목:</b><br />
              모니터 {{ mr.monitor }}대,<br />
              빔프로젝트 {{ mr.projector }}대,<br />
              콘센트 {{ mr.socket }}개,<br />
              마커 {{ mr.marker }}개,<br />
            </div>
          </div>
        </div>

        <!--희의실 예약 정보 입력-->
        <form class="modalform" @submit.prevent="saveReservationHandler">
          <div class="grid gap-4 mb-4 grid-cols-2">
            <div class="resdate">
              <label for="date" class="labeldate">날짜*</label><br />
              <VueDatePicker
                v-model="meetingDate"
                name="meetingDate"
                :enable-time-picker="false"
                :format="formatDate"
                :input-props="{ placeholder: 'Pick the date' }"
                @update:model-value="updateMeetingDate"
                required
              />
            </div>
            <div class="restime">
              <div class="col1">
                <label class="labelstart">시작 시간*</label><br />
                <VueDatePicker
                  v-model="startTime"
                  name="startTime"
                  time-picker
                  disable-time-range-validation
                  minutes-increment="30"
                  minutes-grid-increment="30"
                  :min-time="{ hours: 8, minutes: 0 }"
                  :max-time="{ hours: 20, minutes: 0 }"
                  :format="format"
                  @update:model-value="updateStartTime"
                  required
                />
              </div>
              <div class="col2">
                <label class="labelend">종료 시간*</label><br />
                <VueDatePicker
                  v-model="endTime"
                  name="endTime"
                  minutes-increment="30"
                  minutes-grid-increment="30"
                  time-picker
                  disable-time-range-validation
                  :min-time="minEndTime"
                  :max-time="{ hours: 20, minutes: 0 }"
                  :format="format"
                  @update:model-value="updateEndTime"
                  required
                />
              </div>
            </div>
            <div class="participants">
              회의 참석자 &nbsp;&nbsp;&nbsp; <br />
              <input
                v-model="search"
                type="text"
                class="searchbar"
                placeholder="검색"
              />
              <div v-if="loading"></div>
              <div v-else-if="filteredMembers.length > 0">
                <!-- key를 member.id로 정해서 <tr></tr>안의 내용을 반복 -->
                <div v-for="member in filteredMembers" :key="member.id">
                  <div class="table-row">
                    <div
                      class="table-cell"
                      @click="addParticipant(member)"
                      @keydown.enter="addParticipant(member)"
                    >
                      {{ member.name }}
                    </div>
                  </div>
                </div>
              </div>
              <div v-else>
                <!-- 검색 결과가 없는 경우 메시지를 화면에 표시 -->
                <p>다시 검색해주세요</p>
              </div>
              <div v-if="addedParticipants.length > 0">
                <p class="added"><b>추가된 참석자 &nbsp;&nbsp;</b></p>
                <ul>
                  <li
                    v-for="participant in addedParticipants"
                    :key="participant.id"
                  >
                    {{ participant.name }}
                    <button @click="removeParticipant(participant)">
                      <svg
                        class="removebtn"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                      >
                        <path
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                        />
                      </svg>
                    </button>
                  </li>
                </ul>
              </div>
            </div>
            <div class="purpose">
              <label class="labelpurpose">사용 목적*</label><br />
              <textarea
                v-model="formData.purpose"
                id="purpose"
                name="purpose"
                rows="4"
                placeholder="사용 목적을 입력해주세요"
                required
              ></textarea>
            </div>
          </div>
          <div class="button">
            <button type="submit" class="savebtn"><b>저장</b></button>
            &nbsp;
            <button class="cancelbtn" @click="closeModal"><b>취소</b></button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
<script>
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { reactive } from "vue";
import axios from "axios";

export default {
  props: {
    show: Boolean,
    mr: {
      type: Object,
      required: true,
    },
  },
  components: { VueDatePicker },
  data() {
    return {
      id: "",
      startTime: "", // 시작 시간
      endTime: "", // 종료 시간
      meetingDate: "", //회의 날짜
      purpose: "", //회의 목적
      format: "HH:mm", // 시간 형식
      formatDate: "yyyy-MM-dd", //날짜 형식

      formDataList: [],
      loading: true,
      members: [],
      search: "",
      addedParticipants: [], //추가된 참석자 저장

      formData: {
        startTime: "", // 시작 시간
        endTime: "", // 종료 시간
        meetingDate: "", //회의 날짜
        purpose: "", //회의 목적
        meetingroom: {
          id: 0,
        },
        member: {
          id: "",
          name: "",
        },
        participants: [],
      },
      selectedMeeting: 0, // 선택된 회의실 id
      originalMeeting: 0, // 모달 열 때의 초기 id
    };
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
    minEndTime() {
      return this.startTime;
    },
  },
  setup() {
    const state = reactive({
      date: null,
      startTime: { hours: 8, minutes: 0 },
    });
  },
  methods: {
    openModal() {},
    closeModal() {
      this.$emit("close");
    },
    created() {
      this.starttime = "{ hours: 8, minutes: 0 }";
    },
    updateMeetingId() {
      console.log(this.id);
      this.formData.meetingroom.id = this.id;
    },
    updateStartTime(selectedTime) {
      const hours =
        this.startTime.hours < 10
          ? "0" + this.startTime.hours
          : this.startTime.hours;
      const minutes =
        this.startTime.minutes < 10
          ? "0" + this.startTime.minutes
          : this.startTime.minutes;
      // "HH:mm" 형식의 문자열로 변환
      const startTime = `${hours}:${minutes}`;
      this.startTime = selectedTime;
      console.log(this.startTime);

      this.formData.startTime = startTime;
    },
    updateEndTime(selectedTime) {
      const endhours =
        this.endTime.hours < 10 ? "0" + this.endTime.hours : this.endTime.hours;
      const endminutes =
        this.endTime.minutes < 10
          ? "0" + this.endTime.minutes
          : this.endTime.minutes;
      const endtime = `${endhours}:${endminutes}`;
      this.endTime = selectedTime;
      console.log(endtime);

      this.formData.endTime = endtime;
    },
    updateMeetingDate() {
      const date = this.meetingDate;
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const formattedDate = `${year}-${month < 10 ? "0" + month : month}-${
        day < 10 ? "0" + day : day
      }`;
      this.meetingDate = formattedDate;
      console.log(this.meetingDate);

      this.formData.meetingDate = this.meetingDate;
    },
    addParticipant(member) {
      this.addedParticipants.push(member);
      console.log(member);

      this.formData.participants = this.addedParticipants.map(
        (participant) => ({
          member: {
            id: participant.id,
          },
        })
      );
    },
    removeParticipant(participant) {
      // member.id와 일치하는 참석자를 addedParticipants 배열에서 찾기
      const indexToRemove = this.addedParticipants.findIndex(
        (addedParticipant) => addedParticipant.id === participant.id
      );

      if (indexToRemove !== -1) {
        // 배열에서 찾은 참석자 제거
        this.addedParticipants.splice(indexToRemove, 1);
        console.log("제거 완료");
        console.log(this.addedParticipants);

        // 추가된 참석자의 id를 갖는 객체를 formDataList 업데이트
        this.formDataList = this.addedParticipants.map((participant) => ({
          meetingId: {
            id: `${this.mrr.id}`,
          },
          member: {
            id: participant.id,
          },
        }));
      }
    },
    async fetchData() {
      try {
        this.loading = true;
        const url = `${this.backURL}/address/members`;
        const response = await axios.get(url);
        // response.data에는 id, name, position, tel정보가 있음, 그 정보를 members배열에 넣음
        this.members = response.data;
      } catch (error) {
        console.error("사원 정보를 불러오지 못했습니다:", error);
      } finally {
        this.loading = false;
      }
    },
    saveReservationHandler(e) {
      const url = `${this.backURL}/meetingroom`;
      this.formData.meetingroom.id = this.mr.id;
      this.formData.member.id = localStorage.getItem("memberId");
      this.formData.member.name = localStorage.getItem("name");
      const data = this.formData;

      console.log(this.formData);
      axios
        .post(url, data, { withCredentials: true })
        .then((response) => {
          location.href = "/meetingroom";
          alert("예약되었습니다!");
        })
        .catch((error) => {
          if (error.response.status === 403) {
            alert(error.response.data.message);
          } else if (error.response.status === 500) {
            alert("오류가 발생했습니다.");
          }
        });
    },
  },
  watch: {
    search(newValue) {
      if (newValue.trim() !== "") {
        this.fetchData();
      } else {
        // 검색결과가 없으면 member배열 비우기
        this.members = [];
      }
    },
  },
};
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

  /* overflow-y: auto; */
}

/* 모달 컨텐츠 부분 */
.modal-content {
  width: 800px;
  max-height: 900px;
  background: #fff;
  /* padding: 20px; */
  border-radius: 10px;

  align-content: center;
  align-items: center;
  justify-content: center;
  text-align: left;

  overflow-y: auto;
}

.content {
  height: 100%;

  padding-left: 20%;
  padding-right: auto;
  padding-top: 50px;
  padding-bottom: 50px;

  margin-top: 50px;

  align-content: center;
  align-items: center;
  justify-content: center;
  text-align: left;
}

/* 모달 헤더 부분 */
h2 {
  text-align: center;
  font-size: 28px;
  color: #2c3e50;
  text-transform: uppercase;
  margin-top: 50px;
  margin-bottom: 30px;
  font-weight: bold;
  text-shadow: 1px 1px 1px #ccc;
}

.title {
  float: left;

  font-size: 20px;
  color: #2c3e50;
  text-transform: uppercase;
  font-weight: bold;
  text-shadow: 1px 1px 1px #ccc;
}

.meetingroominfo {
  display: grid;
  width: 80%;

  grid-template-columns: repeat(2, 1fr); /* 2개의 열로 설정 */
  gap: 1rem; /* 간격 조절 */
  margin-bottom: 1rem; /* 아래쪽 여백 추가 */

  padding: 10px;
}

.meetingroom {
  display: inline-block;
}

.roomname {
  font-size: 20px;
}

.img {
  vertical-align: middle;
}

img {
  grid-column: 1;
}

.detail {
  grid-column: 2;
}

img {
  width: 280px;
  height: 280px;
  flex: left;
}

.close {
  float: right;
  padding-top: 15px;
}

.closebutton {
  float: right;
  white-space: nowrap;

  margin-left: 700px;

  width: 50px;
  height: 50px;
}

/* 모달 내 폼 부분 */
.modalform {
  width: 80%;
}

select {
  width: 100%;
  border-radius: var(--dp-border-radius);
  border: 1px solid lightgray;
  padding: 10px;
  color: #333;
}

.meetingroom .resdate {
  grid-column: span 2;
}

label {
  margin-bottom: 10px;
}

div.meetingroom,
div.resdate,
div.resdate,
div.col1,
div.col2,
div.purpose {
  padding: 5px;
  margin: 5px;
}

.col1 {
  grid-column: 1; /* 첫 번째 열에 배치 */
}

.col2 {
  white-space: nowrap;
  grid-column: 2; /* 두 번째 열에 배치 */
}

.participants {
  padding: 10px;
}

.searchbar {
  height: 40px;
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

.added {
  white-space: nowrap;
  padding-top: 0px;
  padding-bottom: 0px;
  margin-bottom: 3px;

  display: inline-block;
}

textarea {
  width: 100%;
  border-radius: var(--dp-border-radius);
  border: 1px solid lightgray;
  padding: 10px;
}

textarea:active {
  border: 1px solid blue;
}

div.button {
  text-align: center;
}

button.savebtn {
  display: inline-block;

  border-radius: 4px;
  background: var(--dark);
  color: #ddd;
  border: none;

  text-align: center;
  font-size: 14px;

  padding: 5px;
  width: 100px;
  height: 35px;
  vertical-align: middle;
  align-items: center;
}

button.cancelbtn {
  display: inline-block;

  border-radius: 4px;
  color: var(--dark);
  border: 2px solid var(--dark);

  text-align: center;
  font-size: 14px;

  padding: 5px;
  width: 100px;
  height: 35px;
  vertical-align: middle;
  align-items: center;
}

.removebtn {
  width: 15px;
  height: 15px;
}
</style>
