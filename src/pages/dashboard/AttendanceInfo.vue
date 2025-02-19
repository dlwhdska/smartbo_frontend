<template>
    <div>
        <div class="currentDay">{{ currentDay }}</div>
        <div class="currentTime">{{ currentTime }}</div>
        <br>
        <div class="timeBox">
            <div>
                <span>출근 시간</span>
                <span>{{ attendanceTime }}</span>
            </div>
            <div>
                <span>퇴근 시간</span>
                <span>{{ offTime }}</span>
            </div>
        </div>
        <div class="buttons">
            <button @click="attendanceHandler">출근</button>
            <button @click="attendance2Handler">퇴근</button>
        </div>
    </div>
</template>
  
<script>
import axios from "axios";
export default {
    data() {
        return {
            currentDay: this.getCurrentDay(),
            currentTime: this.getCurrentTime(),
            attendanceTime: null,
            offTime: null,
        }
    },
    props: {
    },
    methods: {
        getCurrentDay() {
            const now = new Date();
            const year = now.getFullYear();
            const month = (now.getMonth() + 1).toString().padStart(2, "0");
            const day = now.getDate().toString().padStart(2, "0");
            const days = ["일", "월", "화", "수", "목", "금", "토"];
            const dayOfWeek = days[now.getDay()];
            return `${year}년 ${month}월 ${day}일 (${dayOfWeek})`;
        },

        getCurrentTime() {
            const now = new Date();
            const hours = now.getHours().toString().padStart(2, "0");
            const minutes = now.getMinutes().toString().padStart(2, "0");
            const seconds = now.getSeconds().toString().padStart(2, "0");
            return `${hours}시 ${minutes}분 ${seconds}초`;
        },

        attendanceHandler() {
            const id = localStorage.getItem("memberId");

            const url = `${this.backURL}/attendance`;
            const memberId = id; // memberId 값 설정 (임시로 1로 설정) -> session이나 localstorage id 가져와야함
            const currentTime = new Date(); // 현재 시간을 가져옴
            const memberData = {
                memberId: memberId,
                currentTime: currentTime,
                member: {
                    id: id, // memberId 값 설정 (임시로 1로 설정) -> session이나 localstorage id 가져와야함
                },
            };

            axios
                .post(url, memberData)
                .then((response) => {
                    alert("출근 완료");
                    location.href = "/dashboard"
                })
                .catch((error) => {
                    console.error("출근 요청 실패", error);
                    alert('이미 출근한 사원입니다.')
                });
        },

        attendance2Handler() {
            const id = localStorage.getItem("memberId");

            const url = `${this.backURL}/attendance`;
            const memberId = id;

            axios
                .get(`${this.backURL}/attendance/today?memberId=${memberId}`)
                .then((response) => {
                    // 출석 데이터가 있는 경우
                    const attendanceData = response.data;
                    if (attendanceData) {
                        // 이미 퇴근한 경우
                        if (attendanceData.endTime) {
                            alert('이미 퇴근한 사원입니다.');
                        } else {
                            // 확인 대화상자 추가
                            if (!confirm('퇴근 처리하겠습니까?')) {
                                return; // 사용자가 '아니오'를 선택한 경우, 함수를 빠져나간다.
                            }
                            // 출석 데이터가 있고 퇴근하지 않은 경우
                            const currentTime = new Date(); // 현재 시간을 가져옴
                            const memberData = {
                                memberId: memberId,
                                currentTime: currentTime,
                                member: {
                                    id: id,
                                },
                            };

                            axios
                                .put(url, memberData)
                                .then((response) => {
                                    if (response.status === 200) {
                                        alert("퇴근 완료! 조심히가세요~");
                                        location.href = "/dashboard"
                                    }
                                })
                                .catch((error) => {
                                    console.error("퇴근 요청 실패", error);
                                    if (error.response.status === 400) {
                                        alert('퇴근한 상태입니다. 이미 퇴근하셨습니다.');
                                    } else {
                                        alert('퇴근 요청에 실패했습니다.');
                                    }
                                });
                        }
                    } else {
                        // 출석 데이터가 없는 경우
                        alert('출근 기록이 없습니다. 먼저 출근을 기록해야 합니다.');
                    }
                })
                .catch((error) => {
                    console.error("출근 데이터 조회 실패", error);
                });
        },

        fetchAttendanceData(memberId) {
            // const id = localStorage.getItem('memberId');

            const url = `${this.backURL}/attendance/today?memberId=${memberId}`;

            axios
                .get(url)
                .then((response) => {
                    const data = response.data;
                    this.attendanceTime = data.startTime;
                    this.offTime = data.endTime;
                })
                .catch((error) => {
                    console.error("출근 및 퇴근 시간 조회 실패", error);
                });
        },
    },

    mounted() {
        setInterval(() => {
            this.currentTime = this.getCurrentTime();
        }, 1000);

        const memberId = localStorage.getItem("memberId");
        this.fetchAttendanceData(memberId);
    },
    created() {

    },
}
</script>
  
<style scoped>
.buttons {
    display: flex;
    justify-content: space-around;
}

.buttons button {
    width: 100px;
    padding: 10px 20px;
    margin: 5px;
    font-size: 14px;
    cursor: pointer;
    border: 2px solid #2196F3;
    background-color: transparent;
    color: #2196F3;
    border-radius: 25px;
    transition: background-color 0.3s ease;
}

.buttons button:hover {
    background-color: rgba(21, 101, 192, 0.1);
}

.currentDay {
    color: rgba(128, 128, 128, 0.8);
}

.currentTime {
    font-size: 20px;
    font-weight: bold;
}

.timeBox {
    margin-top: 50px;
    margin-bottom: 70px;
}

.timeBox div {
    display: flex;
    justify-content: space-between;
}

.timeBox span {
    text-align: center;
    flex: 1;
}
</style>