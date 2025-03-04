<template>
    <main>
        <h3 class="title"><b>회의실 예약 내역</b><br>
            <div class="date">
                <button class="prevday" @click="prevDay">PREV &lt;&lt; &nbsp;&nbsp;&nbsp;</button>
                <h3 style="display: inline-block;">{{FormattedDate}}</h3>
                <button class="nextday" @click="nextDay">&nbsp;&nbsp;&nbsp; &gt;&gt; NEXT </button>
            </div>
        </h3>
        <div class="meetingroomlist">
            <VueDatePicker 
                :model-value="date" 
                :enable-time-picker="false"
                class="calender"
                @update:model-value="updateList"
            />
            <table class="scrollable-table">
                <thead>
                    <tr>
                        <th>회의실</th>
                        <th>시간</th>
                    </tr>
                </thead>
                <tbody>
                    <MeetingRoomItem 
                        :mr="mr"
                        :date="date"
                        v-if="meetingroomlist"
                        v-for="mr in meetingroomlist"
                        :key="mr.id"
                        @click="clickMeetingRoomReservation()"
                    />
                </tbody>
            </table>
        </div>
    </main>
</template>

<script>
import MeetingRoomItem from '@/pages/meetingroom/MeetingRoomItem.vue'
import VueDatePicker from 'vue3-datepicker'
import axios from 'axios'

export default {
    name: "MeetingRoomList",
    components: { MeetingRoomItem, VueDatePicker },
    data() {
        return {
            meetingroomlist : [],
            date: this.getTodayDate(),
        }
    },
    methods: {
        // 오늘 날짜 구하기
        getTodayDate() {
            const today = new Date();
            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const day = String(today.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        },

        // 형식화된 날짜 반환
        getFormattedDate(date) {
            const selectedDate = new Date(date);
            const year = selectedDate.getFullYear();
            const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
            const day = String(selectedDate.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        },

        prevDay() {
            const currentDate = new Date(this.date);
            currentDate.setDate(currentDate.getDate() - 1);
            this.date = this.getFormattedDate(currentDate);
            this.updateList();
        },

        nextDay() {
            const currentDate = new Date(this.date);
            currentDate.setDate(currentDate.getDate() + 1);
            this.date = this.getFormattedDate(currentDate);
            this.updateList();
        },

        updateList() {
            const url = `${this.backURL}/meetingroom?meetingDate=${this.date}`;
            axios.get(url)
                .then(response => {
                    this.meetingroomlist = response.data;
                })
                .catch(error => {
                    console.log(error);
                });
        },

        clickMeetingRoomReservation() {
            // 모달창으로 띄우기 로직
        },
    },
    watch: {
        $route(newRoute) {
            if (newRoute.params.date) {
                this.date = newRoute.params.date;
            } else {
                this.date = this.getTodayDate();
            }
            this.updateList();
        }
    },
    created() {
        this.updateList();
    },
    computed: {
        FormattedDate() {
            return this.getFormattedDate(this.date);
        }
    },
}
</script>

<style scoped>

/* 페이지 제목 */
.title {
    text-align: center;
    font-size: 28px;
    color: #2c3e50;
    text-transform: uppercase;
    margin-top: 100px;
    margin-bottom: 30px;
    font-weight: bold;
    text-shadow: 1px 1px 1px #ccc;
}

/* 본문 */
.meetingroomlist {
    width: 90%;
    font-family: "Arial", sans-serif;
    padding: 20px;
    margin: 20px;
    margin-left: 6%;
}

div.date {
    margin-top: 20px;
    
    text-align: center;
}

.prevday, .nextday {
    text-align: center;
    font-size: 18px;
    color: #2c3e50;
    text-shadow: 1px 1px 1px #ccc;
}

.scrollable-table {
    border-collapse: collapse;
    width: 100%;

    table-layout: fixed;
}

.scrollable-table th,
.scrollable-table td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: center;
}

.calender {
    width: 150px;

    margin-left: 10px;
    margin-right: auto;
    margin-bottom: 20px;
}

.time-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px; /* 원하는 간격으로 조절하세요. */
    overflow-x: auto; /* 가로 스크롤을 허용합니다. */
}

.time {
    /* 추가된 스타일 */
    min-width: 60px; /* 최소 너비를 지정하세요. */
    text-align: center;
    /* 추가된 스타일 (선택 사항) */
    border: 1px solid #ddd;
    padding: 5px;
}

.time-container > div {
    padding:10px;
}

/* 테이블 행 */
th {
    padding: 8px;
    width: 500px;
    height: 80px;
    text-align: left;
    border-bottom: 1px solid #ddd;
    text-align: center;
}

th {
    background-color: var(--dark-alt);
    color: #ddd;
}

/* 테이블 비율 */
th:nth-child(1),
td:nth-child(1) {
    width: 30%;
}

th:nth-child(2),
td:nth-child(2) {
    width: 70%;
}

tr:nth-child(even) {
    background-color: #f1f9ff;
}
</style>
