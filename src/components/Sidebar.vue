<template>
  <!--is_expanded가 참이라면 문자열 'is-expanded'`이 포함되고, 그렇지 않으면 포함되지 않게 함-->
  <aside :class="getClassObject">
    <div class="logo">
      <img src="../../public/images/logo.png" alt="vue" />
    </div>

    <div class="menu-toggle-wrap">
      <button class="menu-toggle" @click="toggleMenu">
        <span class="material-icons">keyboard_double_arrow_right</span>
      </button>
    </div>

    <div class="menu">
      <div class="button">
        <span class="material-icons">badge</span>
        <span class="text">{{ memberName }}님 환영합니다</span>
      </div>
    </div>
    <h3>Menu</h3>
    <div class="menu">
      <router-link class="button" to="/dashboard">
        <span class="material-icons">apps</span>
        <span class="text">대시보드</span>
      </router-link>
      <router-link class="button" to="/attendance">
        <span class="material-icons">check_circle</span>
        <span class="text">근태관리</span>
      </router-link>
      <router-link class="button" to="/notice/noticelist">
        <span class="material-icons">campaign</span>
        <span class="text">공지사항</span>
      </router-link>
      <router-link class="button" to="/address/addresslist">
        <span class="material-icons">group</span>
        <span class="text">주소록</span>
      </router-link>
      <router-link class="button" to="/schedule/calendar">
        <span class="material-icons">calendar_month</span>
        <span class="text">일정</span>
      </router-link>
      <router-link class="button" to="/meetingroom">
        <span class="material-icons">meeting_room</span> 
        <span class="text">회의실 예약</span>
      </router-link>
      <router-link class="button" to="/meetingroom/myreservation">
        <span class="material-icons">fact_check</span>
        <span class="text">회의실 내예약보기</span>
      </router-link>
      <router-link class="button" to="/carrent/carlist">
        <span class="material-icons">no_crash</span>
        <span class="text">차량 예약</span><br />
      </router-link>
      <router-link v-if="departmentId === '4'" class="button" to="/carrent/manage">
        <span class="material-icons">car_rental</span>
        <span class="text">차량 관리</span>
      </router-link>
      <router-link class="button" to="/stuff/request">
        <span class="material-icons">add_box</span>
        <span class="text">비품 요청</span>
      </router-link>
      <router-link v-if="departmentId === '4'" class="button" to="/stuff/stuffmanage">
        <span class="material-icons">shelves</span>
        <span class="text">비품 요청 관리</span>
      </router-link>
    </div>

    <div class="flex"></div>

    <div class="menu">
      <div class="button logoutBt" @click="logout" v-if="isLoggedIn">
        <span class="material-icons">logout</span>
        <span class="text">로그아웃</span>
      </div>
    </div>
  </aside>
</template>

<script>
import axios from "axios";
import { ref } from "vue";

export default {
  name: "Sidebar",
  data() {
    return {
      is_expanded: localStorage.getItem("is_expanded") === "true",
      memberName: "",
      departmentId: 0,
      isLoggedIn: false,

      isStatusOn: false,
      scrollPostion: 0,
      hasContent: false, // 종 색깔
      hasContent: false,
    };
  },
  methods: {
    toggleMenu() {
      this.is_expanded = !this.is_expanded;
      localStorage.setItem("is_expanded", this.is_expanded);
    },

    async logout() {
      try {
        // SSE 연결 해제 
        if (this.eventSource) {
          this.eventSource.close();
          this.eventSource = null;
        }
        // =============

        await axios.get(`${this.backURL}/logout`, {});

        // localStorage에서 로그인 상태 제거
        localStorage.removeItem("isLoggedIn");

        // localStorage에서 memberId 제거
        localStorage.removeItem("memberId");

        // localStorage에서 departmentId 제거
        localStorage.removeItem("departmentId");

        // localStorage에서 name 제거
        localStorage.removeItem("name");

        this.$router.push("/home");
        //화면 새로고침
        location.reload();
      } catch (error) {
        console.error("로그아웃 실패:", error);
      }
    },

    toggleOnOff: function () {
      this.isStatusOn = !this.isStatusOn;
      console.log("isStatusOn 값:", this.isStatusOn);
    },
  },
  computed: {
    getClassObject() {
      return { "is-expanded": this.is_expanded };
    },
  },

  created() {
    const memberName = window.localStorage.getItem("name");
    this.memberName = memberName;
    const departmentId = window.localStorage.getItem("departmentId");
    this.departmentId = departmentId;
    if(window.localStorage.getItem("isLoggedIn")==null){
      this.isLoggedIn = false
    }else{
      this.isLoggedIn = true
    }

    const id = window.localStorage.getItem("memberId");
    // const id = 1;
    console.log("localStorage memberId : ", id);
    const url = `${this.backURL}/subscribe?memberId=${id}`;
  },
};
</script>

<style lang="scss" scoped>
aside {
  display: flex;
  flex-direction: column;
  width: calc(2rem + 32px); //최소 넓이 = 2rem + 아이콘 크기 32px
  min-height: 100vh; // 부모와 상관없이 화면 채움
  border-radius: 0 25px 25px 0;
  overflow: hidden;
  padding: 1rem;

  background-color: #1565c0; //var(--dark); //var()는 사용자 지정 속성
  color: var(--light);

  transition: 0.2s ease-out; //토글 속도

  .flex {
    flex: 1 1 0%;
  }

  .logo {
    margin-bottom: 1rem;

    img {
      width: 2rem;
    }
  }

  .menu-toggle-wrap {
    display: flex;
    // flex 컨테이너 안의 아이템들을 오른쪽으로 정렬
    justify-content: flex-end;
    margin-bottom: 1rem;

    position: relative;
    top: 0;
    // ease-out은 빠르게 시작되어서 완만하게 끝나는 속도 곡선
    transition: 0.2s ease-out;

    .menu-toggle {
      transition: 0.2s ease-out;

      .material-icons {
        font-size: 2rem;
        color: var(--light);
        transition: 0.2s ease-out;
      }

      &:hover {
        .material-icons {
          color: var(--primary);
          transform: translateX(0.5rem);
        }
      }
    }
  }

  h3,
  .button .text {
    display: none;
    opacity: 0;
    transition: 0.3s ease-out;
  }

  h3 {
    color: var(--grey);
    font-size: 0.875rem;
    margin-bottom: 0.5rem;
    margin-top: 0.5rem;
    text-transform: uppercase;
  }

  .menu {
    margin: 0 -1rem;

    .button {
      display: flex;
      align-items: center;
      text-decoration: none;

      padding: 0.5rem 1rem;
      transition: 0.2s ease-out;

      .material-icons {
        font-size: 2rem;
        color: var(--light);
        margin-right: 1rem;
        transition: 0.2s ease-out;
      }

      .text {
        color: var(--light);
        transition: 0.2s ease-out;
      }

      &:hover,
      &.router-link-exact-active {
        background-color: var(--dark-alt);
        border-right: 5px solid var(--primary);

        .material-icons,
        .text {
          color: var(--primary);
        }
      }
    }
  }

  // &.is-expanded 부모 선택자에 is-expanded 클래스가 추가된 경우에 스타일이 적용되도록 함
  &.is-expanded {
    width: var(--sidebar-width);

    .menu-toggle-wrap {
      top: -3rem;

      .menu-toggle {
        transform: rotate(-180deg);
      }
    }

    h3,
    .button .text {
      display: flex;
      opacity: 1;
    }

    .button {
      .material-icons {
        margin-right: 1rem;
      }
    }
  }

  @media (max-width: 768px) {
    position: fixed;
    z-index: 99; // 요소의 수직 위치 지정 - 제일 높음
  }
}

// 찬석
.notify {
  position: absolute; 
  width: 400px;
  height: 480px;
  margin-left: 13.1%;
  margin-top: 21%;
  padding: 10px;
  background-color: #3b7ed8;
  border: 1px solid white;
  border-radius: 4px;
  max-height: 450px;
  overflow-y: scroll;

  padding-right: 20px;
  z-index: 999;
}
.material-symbols-outlined {
  font-size: 90px;
  font-variation-settings:
  'FILL' 0,
  'wght' 400,
  'GRAD' 0,
  'opsz' 24
}
/* 스크롤바 스타일링 */
.notify::-webkit-scrollbar {
  width: 10px;
}

.notify::-webkit-scrollbar-thumb {
  background-color: var(--light); /* 스크롤바 색상 */
  border-radius: 4px; /* 스크롤바 모양 */
}

.notify::-webkit-scrollbar-track {
  border-radius: 4px; /* 스크롤바 트랙 모양 */
}

/* 이모티콘에 애니메이션 적용 */
.material-icons.bell-has-content {
  color: #ffcc00 !important;
  animation: bellAnimation 0.5s ease-in-out infinite;
  /* 무한 반복하는 애니메이션 설정 */
}

.logoutBt {
  cursor: pointer;
}
</style>