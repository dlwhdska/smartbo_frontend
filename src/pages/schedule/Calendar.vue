<template>
  <main>
    <div class="calendar">
      <FullCalendar
        ref="fullCalendar"
        :options="calendarOptions"
        :events="calendarOptions.events"
        eventClick="scheduleDetailHandler"
      >
        <template v-slot:eventContent="arg">
          <div class="event" @click="scheduleDetailHandler(arg)">
            <b>{{ formatTime(arg.event.start) }} {{ arg.event.title }} </b>
          </div>
        </template>
      </FullCalendar>
      <!--***************************일정 추가********************************-->
      <div class="modal-wrap" v-show="addModalCheck">
        <div class="modal-container">
          <button class="cancel" @click="closeAddModal">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-x-circle"
              viewBox="0 0 16 16"
            >
              <path
                d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"
              />
              <path
                d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"
              />
            </svg>
          </button>
          <div class="formdiv">
            <form class="add-schedule" @submit.prevent="scheduleAddHandler">
              <label>제목 </label
              ><input
                type="text"
                v-model="FormData.scheduleTitle"
                class="title"
                maxlength="15"
                placeholder="15자 이내로 입력하세요"
                required
              /><br /><br />
              <label>기간</label
              ><input
                type="date"
                name="startDate"
                v-model="startDate"
                required
              />
              <input
                type="time"
                name="starttime"
                v-model="FormData.startTime"
                required
              /><br /><br />
              <label
                >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label
              >~
              <input
                type="date"
                name="endDate"
                v-model="endDate"
                :min="startDate"
                required
              />
              <input
                type="time"
                name="endtime"
                v-model="FormData.endTime"
                :min="FormData.startTime"
                required
              /><br /><br />
              <label>메모 </label
              ><textarea
                class="content"
                v-model="FormData.content"
                maxlength="60"
                placeholder="60자 이내로 입력하세요"
              ></textarea>
              <div class="modal-btn">
                <button type="submit" class="ok">등록</button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <!--***************************상세 정보 및 수정********************************-->
      <div class="modal-wrap" v-show="detailModalCheck">
        <div class="modal-container">
          <button class="cancel" @click="closeDetailModal">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-x-circle"
              viewBox="0 0 16 16"
            >
              <path
                d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"
              />
              <path
                d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"
              />
            </svg></button
          ><br />
          <div
            class="schedule-detail"
            v-if="modifyCheck == false && c !== null"
          >
            <span class="detail-label">제목</span>
            <span style="font-size: 15px">{{ c.title }}</span
            ><br />
            <hr />
            <br />
            <div>
              <div class="startdiv">
                <span style="font-size: 20px">{{
                  formatYYYYmmdd(c.start)
                }}</span
                ><br />
                <span style="font-size: 17px">{{ formatHHmmss(c.start) }}</span>
              </div>
              <div class="enddiv">
                <span style="font-size: 20px">{{
                  c.end ? formatYYYYmmdd(c.end) : formatYYYYmmdd(c.start)
                }}</span
                ><br />
                <span style="font-size: 17px">{{
                  c.end ? formatHHmmss(c.end) : formatHHmmss(c.start)
                }}</span>
              </div>
            </div>
            <br />
            <hr />
            <br />
            <span v-if="c.extendedProps.memo" class="detail-label">메모</span
            ><br /><br />
            <span style="text-align: justify">{{ c.extendedProps.memo }}</span
            ><br /><br /><br />
          </div>
          <div class="modal-btn" v-if="modifyCheck == false">
            <button type="submit" class="ok" @click="modifyModal">수정</button>
            <button class="delete" @click="deleteHandler">삭제</button>
          </div>
          <div
            class="modify-detail"
            v-if="modifyCheck == true && FormData !== null"
          >
            <form @submit.prevent="modifyHandler">
              <label>제목 </label
              ><input
                class="title"
                type="text"
                name="scheduleTitle"
                v-model="FormData.scheduleTitle"
                maxlength="15"
                placeholder="15자 이내로 입력하세요"
                required
              /><br /><br />
              <label>기간</label
              ><input
                type="date"
                name="startDate"
                v-model="startDate"
                required
              />
              <input
                type="time"
                name="start"
                v-model="sTime"
                required
              /><br /><br />
              <label
                >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label
              >~
              <input
                type="date"
                name="endDate"
                v-model="endDate"
                :min="startDate"
                required
              />
              <input
                type="time"
                name="endtime"
                v-model="eTime"
                :min="sTime"
                required
              /><br /><br /><br />
              <label>메모 </label
              ><textarea
                type="text"
                class="content"
                name="content"
                v-model="FormData.content"
                maxlength="60"
                placeholder="60자 이내로 입력하세요"
              ></textarea>
              <div class="modal-btn" v-if="modifyCheck">
                <button type="submit" class="ok">완료</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
<script>
import "bootstrap-icons/font/bootstrap-icons.css";
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Calendar } from "@fullcalendar/core";
import bootstrap5Plugin from "@fullcalendar/bootstrap5";
import "bootstrap/dist/css/bootstrap.css";
import axios from "axios";

export default {
  name: "Calendar",
  components: {
    FullCalendar, // make the <FullCalendar> tag available
  },
  data() {
    return {
      c: null,
      calendarOptions: {
        plugins: [bootstrap5Plugin, dayGridPlugin, interactionPlugin],
        initialView: "dayGridMonth",
        dateClick: this.handleDateClick,
        events: [
          {
            title: "",
            start: "",
            end: "",
            extendedProps: {
              eventId: "",
              memo: "",
            },
          },
        ],
        themeSystem: "bootstrap5",
        customButtons: {
          addbutton: {
            text: "일정추가",
            click: this.openAddModal,
          },
        },
        headerToolbar: {
          start: "prev next",
          center: "title",
          end: "addbutton",
          prev: "arrow-left-square-fill",
          next: "arrow-right-square-fill",
        },
      },
      addModalCheck: false,
      detailModalCheck: false,
      modifyCheck: false,
      startDate: null,
      endDate: null,
      sTime: null,
      eTime: null,
      FormData: {
        startTime: null,
        endTime: null,
        scheduleTitle: "",
        content: "",
        member: {
          id: "",
        },
      },
    };
  },
  methods: {
    openAddModal() {
      this.addModalCheck = !this.addModalCheck;
    },
    closeAddModal() {
      this.addModalCheck = !this.addModalCheck;
      this.FormData.startTime = null;
      this.FormData.endTime = null;
      this.FormData.scheduleTitle = null;
      this.FormData.content = null;
    },
    closeDetailModal() {
      this.detailModalCheck = !this.detailModalCheck;
      this.modifyCheck = false;
    },
    modifyModal() {
      this.FormData.scheduleTitle = this.c.title;
      this.FormData.content = this.c.extendedProps.memo;
      this.startDate = this.formatYYYYmmdd(this.c.start);
      this.sTime = this.formatHHmmss(this.c.start);

      if (this.c.end == null) {
        this.endDate = this.formatYYYYmmdd(this.c.start);
        this.eTime = this.formatHHmmss(this.c.start);
      } else {
        this.endDate = this.formatYYYYmmdd(this.c.end);
        this.eTime = this.formatHHmmss(this.c.end);
      }

      console.log(this.FormData.scheduleTitle);
      console.log(this.FormData.content);
      this.modifyCheck = !this.modifyCheck;
    },
    scheduleHandler(memberId) {
      console.log(memberId);
      const url = `${this.backURL}/schedule/calendar?memberId=${memberId}`;
      axios
        .get(url, { params: this.data })
        .then((response) => {
          console.log(response.data);
          if (response.data && response.data.length > 0) {
            this.calendarOptions.events = response.data.map((event) => ({
              title: event.scheduleTitle,
              start: event.startTime,
              end: event.endTime,
              extendedProps: {
                eventId: event.id,
                memo: event.content,
              },
            }));
          }
          console.log("캘린더옵션 events", this.calendarOptions.events);
        })
        .catch((Error) => {
          console.log(Error);
        });
    },
    handleDateClick: function (arg) {
      this.startDate = arg.dateStr;
      this.endDate = arg.dateStr;
      this.openAddModal();
    },
    formatYYYYmmdd(date) {
      console.log(date);
      if (date !== null) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
      } else {
        return date;
      }
    },
    formatHHmmss(date) {
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");

      return `${hours}:${minutes}`;
    },
    formatTime(time) {
      if (time instanceof Date) {
        const hours = time.getHours().toString().padStart(2, "0");
        const minutes = time.getMinutes().toString().padStart(2, "0");
        return `${hours}:${minutes}`;
      } else {
        // 문자열인 경우에 대한 처리 추가
        return time;
      }
    },
    scheduleAddHandler() {
      if (this.endDate < this.startDate) {
        alert("올바른 날짜 기입이 아닙니다. 기간을 다시 확인하세요.");
        return false;
      }

      if (this.FormData.endTime < this.FormData.startTime) {
        alert("올바른 시간 기입이 아닙니다. 시간을 다시 확인하세요.");
        return false;
      } else {
        this.FormData.startTime = `${this.startDate} ${this.FormData.startTime}:00`;
        this.FormData.endTime = `${this.endDate} ${this.FormData.endTime}:00`;
        this.FormData.member.id = localStorage.getItem("memberId");

        const url = `${this.backURL}/schedule/add`;
        const data = this.FormData;
        console.log(data);

        axios
          .post(url, data)
          .then((Response) => {
            alert("추가되었습니다");
            this.addModalCheck = !this.addModalCheck;
            window.location.reload();
          })
          .catch((Error) => {
            console.log(Error);
          });
      }
    },
    scheduleDetailHandler(arg) {
      // console.log(arg.event.extendedProps);
      // alert(arg.event.extendedProps.memo)
      this.c = arg.event;
      this.detailModalCheck = !this.detailModalCheck;
    },
    modifyHandler() {
      console.log(this.c.extendedProps.eventId);
      this.FormData.id = this.c.extendedProps.eventId;
      console.log(this.FormData.id);
      if (this.endDate < this.startDate) {
        alert("올바른 날짜 기입이 아닙니다. 기간을 다시 확인하세요.");
        return false;
      }

      if (this.eTime < this.sTime) {
        alert("올바른 시간 기입이 아닙니다. 시간을 다시 확인하세요.");
        return false;
      }

      this.FormData.startTime = `${this.startDate} ${this.sTime}:00`;
      this.FormData.endTime = `${this.endDate} ${this.eTime}:00`;

      const url = `${this.backURL}/schedule/modify`;
      const data = this.FormData;
      console.log(data);

      axios
        .put(url, data)
        .then((Response) => {
          console.log("됐음");
          if (Response.status == 200) {
            alert("수정되었습니다");
            this.modifyCheck = !this.modifyCheck;
            window.location.reload();
          }
        })
        .catch((Error) => {
          console.log(Error);
        });
    },
    deleteHandler() {
      const id = this.c.extendedProps.eventId;
      const url = `${this.backURL}/schedule/delete/${id}`;

      if (confirm("삭제하시겠습니까?")) {
        axios
          .delete(url)
          .then((Response) => {
            if (Response.status == 200) {
              alert("삭제되었습니다");
              window.location.reload();
            }
          })
          .catch((Error) => {
            console.log(Error);
          });
      }
    },
  },
  created() {
    const memberId = localStorage.getItem("memberId");
    this.scheduleHandler(memberId);
  },
};
</script>
<style scoped>
/* .modal-header{
    background-color: #4199fd;
    border-radius: 10px 10px 0px 0px;
}
.modal-header > p{
    padding-top: 20px;
    padding-left: 20px;
    color: white;
    font-weight: 500;
    letter-spacing: 1px;
    font-size: 20px;
} */
.event {
  cursor: pointer;
  background-color: #e8ecff;
  width: 100%;
  border-radius: 3px;
  padding: 2px;
  padding-left: 8px;
  color: #073f88;
  overflow: hidden;
}
.modal-wrap {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 99;
}
/* modal or popup */
.modal-container {
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 550px;
  background: #fff;
  border-radius: 20px;
  padding: 50px;
  padding-top: 30px;
  box-sizing: border-box;
  box-shadow: 0 19px 38px rgba(0, 0, 0, 0.3), 0 15px 12px rgba(0, 0, 0, 0.22);
  z-index: 1;
}
.formdiv {
  margin-top: 30px;
}
.modal-btn {
  margin-top: 50px;
  text-align: center;
}
.ok,
.delete {
  background-color: #2196f3;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
.ok:hover {
  background-color: #2189df;
}
.delete:hover {
  background-color: #2189df;
}
.cancel:hover {
  color: #58b5c5;
}
.ok {
  margin-right: 20px;
}
.cancel {
  color: #58d3e9;
  float: right;
}

label {
  /* color : #02449b; */
  font-weight: 700;
  font-size: 15px;
  padding-right: 40px;
  vertical-align: top;
}
.add-schedule > input {
  border: 1px solid #d8d8d8;
  height: 35px;
  font-size: 13px;
}
.title {
  width: 300px;
  border-radius: 5px;
}
.content {
  border: 1px solid #d8d8d8;
  border-radius: 5px;
  font-size: 15px;
  width: 300px;
  height: 100px;
  resize: none;
  font-size: 13px;
  padding: 10px;
}

input {
  border: 1px solid #d8d8d8;
  border-radius: 5px;
  padding: 10px;
  height: 35px;
  font-size: 13px;
}

.detail-label {
  color: black;
  font-size: 15px;
  font-weight: 700;
  padding-right: 40px;
  vertical-align: top;
}
hr {
  border: solid 1px #cccccc;
}
.startdiv,
.enddiv {
  width: 50%;
  text-align: center;
  display: inline-block;
}
.startdiv {
  border-right: solid 1px #e6e6e6;
}
</style>
