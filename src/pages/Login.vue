<template>
  <div class="login-container">
    <!-- <h2 v-if="!isLoggedIn">Login</h2> -->
    <form class="login-form" v-if="!isLoggedIn" @submit.prevent="login">
      <!-- <label for="id">사원번호: </label> -->
      <img class="login-img" :src="`../images/logo.png`" alt="logo" />
      <input
        class="member-input"
        v-model="id"
        type="text"
        id="id"
        required
        placeholder="사원번호"
      />

      <!-- <label for="password">비밀번호: </label> -->
      <input
        class="password-input"
        v-model="password"
        type="password"
        id="password"
        required
        placeholder="비밀번호"
      />
      <button class="login-button" type="submit">로그인</button>
    </form>

    <div class="notify_bar" v-if="notifyMessage" @click="handleNotificationClick()" :data-type="notificationType">
        <div class="notify_bar_title">알림</div>
        <br>
        <div>{{ notifyMessage }}</div>
    </div>

    <router-view v-if="isLoggedIn"></router-view>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      id: "",
      password: "",
      isLoggedIn: false,

      notifyMessage: "",
      notificationTimer: null,
    };
  },
  // component 생성되자마자 호출, 새로고침 할 때마다 호출
  created() {
    // 페이지가 로드될 때 세션 정보를 확인
    this.findSession();
  },
  methods: {
    async login() {
      try {
        // response에 LoginRequestDTO값을 받아옴
        const response = await axios.post(`${this.backURL}/login`, {
          id: this.id,
          password: this.password,
        });
        //로그인하면 상태를 true로 변경
        this.isLoggedIn = true;

        // localStorage에 로그인 상태 저장
        localStorage.setItem("isLoggedIn", "true");

        // localStorage에 memberId로 id저장
        localStorage.setItem("memberId", response.data.memberId);

        // localStorage에 departmentId로 departmentId저장
        localStorage.setItem("departmentId", response.data.departmentId);

        // localStorage에 name으로 사원이름 저장
        localStorage.setItem("name", response.data.name);

        // SSE 구독 시작 ==
        this.startSSE();
        
        location.reload();
        this.$router.push("/dashboard");
        this.$data.user = response.data;
      } catch (error) {
        console.error("로그인 실패:", error);
      }
    },


    async startSSE() {
      if (this.isLoggedIn) {
        const id = localStorage.getItem("memberId");
        // String id = localStorage.getItem
        // EventSource를 이용해 SSE 구독 시작
        // this.eventSource = new EventSource(`${this.backURL}/subscribe/${this.id}`);
        this.eventSource = new EventSource(`${this.backURL}/subscribe/${id}`);

        this.eventSource.addEventListener("sse", (event) => {
          console.log(event.data);
          console.log(event);

          const data = JSON.parse(event.data);

          // 브라우저의 알림 표시
          this.showNotification(data);
          // this.showNotification(event.data);
        });
      }
    },


    async showNotification(data) {
      // 브라우저 알림
      const notification = new Notification("제목", {
        body: data.content,
      });

      this.notifyMessage = data.content;

      // 브라우저의 알림이 클릭 되었을 때
      notification.addEventListener("click", () => {
        window.open(data.url, "_blank");
      });
      // 타이머를 설정하여 10초 후에 알림을 숨김
      this.notificationTimer = setTimeout(() => {
        this.notifyMessage = "";
      }, 10 * 1000);
    },

    async findSession() {
      //----
      // 브라우저 스토리지에서 로그인 상태 확인
      const storedLoggedIn = localStorage.getItem("isLoggedIn");
      this.isLoggedIn = storedLoggedIn === "true";

      if (this.isLoggedIn) {
        console.log("로그인 상태입니다. id: ");


        // 이전 SSE 구독을 중지
        this.stopSSE();

        // memberId 값이 존재할 때만 SSE 구독 시작
        if (this.isLoggedIn) {
          console.log("이전 로그인 정보로 SSE 구독 시작합니다.");
          this.startSSE(this.isLoggedIn);
        }
      } else {
        console.log("로그인하지 않은 상태입니다.");
      } // if-else
    },

    async logout() {
      try {

        if (this.eventSource) {
          this.eventSource.close();
          this.eventSource = null;
        }
        // =============

        await axios.get(`${this.backURL}/logout`, {});
        this.isLoggedIn = false;

        // localStorage에서 로그인 상태 제거
        localStorage.removeItem("isLoggedIn");

        // localStorage에서 memberId 제거
        localStorage.removeItem("memberId");

        // localStorage에서 departmentId 제거
        localStorage.removeItem("departmentId");

        localStorage.removeItem("name");
        this.$router.push("/dashboard");
        //화면 새로고침
        location.reload();
      } catch (error) {
        console.error("로그아웃 실패:", error);
      }
    },
    // ========================== 구독 중지 ============================ 
    async stopSSE() {
      // 이전 SSE 구독을 중지하고 eventSource 초기화
      if (this.eventSource) {
        this.eventSource.close();
        this.eventSource = null;
        console.log("이전 SSE 구독을 중지합니다.");
      }
    },
    handleNotificationClick() {
      console.log("타입 : ", this.notificationType);
            switch (this.notificationType) {
                case "CAR" :
                    this.$router.push("/arrent/myrentlist");
                    break;
                case "MEETING" :
                    this.$router.push("/meetingroom/myreservation")
                    break;
                case "STUFF" :
                    this.$router.push("/stuff/request");
                    break;
                default:
                    break;
            }
    }
  },
};
</script>
<style scoped>
.login-container {
  background-color: white; /*rgb(243, 245, 247);*/
  width: 100vw;
}

.notify_bar {
  position: fixed;
  right: 10px; /* 화면 오른쪽과의 여백 설정 */
  bottom: 10px; /* 화면 하단과의 여백 설정 */
  width: 390px;
  height: 100px;
  padding: 10px;
  border: 2px solid #ccc;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  font-family: Arial, sans-serif;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;

  background-color: rgba(59, 126, 216, 1);
  /* background:  rgba(255,255,255,0.1); */
  border-radius: 10px 10px 10px 10px;
}
.notify_bar_title {
  position: absolute;
  left: 10px; /* 왼쪽과의 여백 설정 */
  top: 10px; /* 위쪽과의 여백 설정 */
  font-weight: normal;
  font-size: 12px;
}

/*  */
.login-form {
  max-width: 400px;
  width: 100%;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  background-color: #f9f9f9;
  text-align: center;
  margin: 0 auto; /* 가운데 정렬을 위한 margin 속성 추가 */
  position: absolute; /* 위치를 absolute로 설정 */
  top: 50%; /* 부모 요소의 50% 위치로 이동 */
  left: 50%; /* 부모 요소의 50% 위치로 이동 */
  transform: translate(
    -50%,
    -50%
  ); /* 자기 자신의 50% 만큼 이동하여 중앙 정렬 */
}

.member-input {
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}
.password-input {
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.login-button {
  width: 100%;
  padding: 12px;
  background-color: #2196f3;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 18px;
  margin-top: 20px;
  /* 버튼 위쪽 여백 추가 */
}

.login-img {
  width: 100px;
  height: auto;
}
</style>
