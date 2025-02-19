<template>
  <main class="home-page">
    <div class="gridContainer">
      <!-- 상단 3개 컴포넌트 -->
      <div class="item attendance">
        <h3>근태 현황</h3>
        <div class="box">
          <AttendanceInfo />
        </div>
      </div>
      <div class="car-status">
        <CarStatus />
      </div>
      <div class="stuff-status">
        <StuffStatus />
      </div>

      <!-- 하단 2개 컴포넌트 -->
      <div class="item calendar">
        <h3>오늘의 일정</h3>
        <div class="box">
          <router-link class="go-schedule" to="/schedule/calendar">
            <span class="material-icons">add</span>
          </router-link>
          <hr />
          <div class="todoBox">
            <TodayTodoItem
              :t="t"
              v-if="todayTodo !== null && todayTodo.length > 0"
              v-for="t in todayTodo"
              :key="t.id"
            />
            <div v-else class="no">
              <span>오늘의 일정이 없습니다</span>
            </div>
          </div>
        </div>
      </div>
      <div class="item notice">
        <h3>최근 공지사항</h3>
        <div class="box">
          <router-link class="go-notice" to="/notice/noticelist">
            <span class="material-icons">add</span>
          </router-link>
          <hr />
          <div class="noticeBox">
            <NoticeItemDash
              :n="n"
              v-if="noticelist && noticelist.content"
              v-for="n in noticelist.content.slice(0, 5)"
              v-bind:key="n.id"
            />
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
<script>
import Sidebar from "@/components/Sidebar.vue";
import TodayTodoItem from "@/pages/schedule/TodayTodoItem.vue";
import AttendanceInfo from "@/pages/dashboard/AttendanceInfo.vue";
import CarStatus from "@/pages/dashboard/CarStatus.vue";
import StuffStatus from "@/pages/dashboard/StuffStatus.vue";
import NoticeItemDash from "@/pages/dashboard/NoticeItemDash.vue";
import axios from "axios";
export default {
  components: {
    Sidebar,
    TodayTodoItem,
    AttendanceInfo,
    CarStatus,
    StuffStatus,
    NoticeItemDash,
  },
  data() {
    return {
      todayTodo: null,
      noticelist: [],
      currentPage: 1,
      startPage: 1,
      endPage: 1,
    };
  },
  mounted() {
    this.TodayTodoHandler();
  },
  methods: {
    // ======================= 오늘의 일정 ===============================
    TodayTodoHandler() {
      const memberId = localStorage.getItem("memberId");
      const url = `${this.backURL}/schedule/todaytodo?memberId=${memberId}`;
      axios
        .get(url)
        .then((response) => {
          this.todayTodo = response.data;
        })
        .catch((Error) => {
          console.log(Error);
        });
    },

    // ============================== 공지 ================================
    noticeListHandler() {
      const url = `${this.backURL}/notice/list?currentPage=${this.currentPage}`;
      axios
        .get(url)
        .then((response) => {
          this.noticelist = response.data;
          if (this.currentPage <= this.noticelist.totalPages) {
            this.startPage = parseInt((this.currentPage - 1) / 5) * 5 + 1;
            this.endPage = this.startPage + 5 - 1;
          }

          if (this.endPage > this.noticelist.totalPages) {
            this.endPage = this.noticelist.totalPages;
          }
        })
        .catch((Error) => {
          console.log(Error);
        });
    },
  },
  created() {
    this.TodayTodoHandler();
    this.noticeListHandler();
  },
};
</script>
<style scoped>
.gridContainer {
  display: grid;
  grid-template-columns: repeat(6, 1fr); 
  grid-template-rows: repeat(2, 400px);
  row-gap: 40px;
  column-gap: 20px;
}

/* 상단 컴포넌트 배치 */
.attendance {
  grid-column: 1 / 3; 
}

.car-status {  
  grid-column: 3 / 5; 
}

.stuff-status {  
  grid-column: 5 / 7;
}

/* 하단 컴포넌트 배치 */
.calendar {
  grid-column: 1 / 4; 
  grid-row-start: 2;
}

.notice {
  grid-column: 4 / 7; 
  grid-row-start: 2;
}

hr {
  margin: 5px;
}

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

.todoBox {
  height: 280px;
  overflow-y: scroll;
}


.noticeBox {
  height: 90%;
  font-size: 16px;
  overflow: auto;
}

/* 테이블 행 */
th {
  padding: 8px;
  height: 100%;
  text-align: left;
  vertical-align: middle;
  border-bottom: 1px solid #ddd;
  text-align: center;
}

td {
  padding-top: 15px;
  padding-bottom: 0px;
}
</style>
