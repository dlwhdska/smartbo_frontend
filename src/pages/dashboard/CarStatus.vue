<template>
    <div v-if="departmentId === '4'" class="item car">
        <h3>차량 신청내역</h3>
        <div class="box">
            <div>
                <div class="carText">승인대기</div>
                <div class="carCnt">{{ waitingCnt }} 건</div>
            </div>
            <div>
                <div class="carText">대여중</div>
                <div class="carCnt">{{ rentCnt }} 건</div>
            </div>
            <div>
                <div class="carText">미반납</div>
                <div class="carCnt">{{ noReturnCnt }} 건</div>
            </div>
        </div>
    </div>
    <div v-else class="item car">
        <h3>차량 신청현황</h3>
        <div class="box">
            <div>
                <div class="carText">승인대기 : </div>
                <div class="carCnt">{{ myWaitingCnt }} 건</div>
            </div>
            <div>
                <div class="carText">대여중 : </div>
                <div class="carCnt">{{ myRentCnt }} 건</div>
            </div>
            <div>
                <div class="carText">미반납 : </div>
                <div class="carCnt">{{ myNoReturnCnt }} 건</div>
            </div>
        </div>
    </div>
</template>
  
<script>
import axios from "axios";
export default {
    data() {
        return {
            departmentId: 0,
            waitingCnt: 0,
            rentCnt: 0,
            noReturnCnt: 0,
            myWaitingCnt: 0,
            myRentCnt: 0,
            myNoReturnCnt: 0,
        }
    },
    props: {
        title: String,
        statuses: Array,
    },

    created() {
        this.departmentId = localStorage.getItem("departmentId");
        this.CarRentCountHandler();
        this.MyCarRentCountHandler();
    },

    methods: {
        // ======================= 차량 관리 현황 원희===============================
        CarRentCountHandler() {
            const url = `${this.backURL}/carrent/maincarrent`;
            axios
                .get(url)
                .then((response) => {
                    this.waitingCnt = response.data.waitingCnt;
                    this.rentCnt = response.data.rentCnt;
                    this.noReturnCnt = response.data.noReturnCnt;
                })
                .catch((Error) => {
                    console.log(Error);
                });
        },
        // ======================= 나의 차량 신청 현황 원희===============================
        MyCarRentCountHandler() {
            const memberId = localStorage.getItem("memberId");
            const url = `${this.backURL}/carrent/mainmycarrent?memberId=${memberId}`;
            axios
                .get(url)
                .then((response) => {
                    this.myWaitingCnt = response.data.myWaitingCnt;
                    this.myRentCnt = response.data.myRentCnt;
                    this.myNoReturnCnt = response.data.myNoReturnCnt;
                })
                .catch((Error) => {
                    console.log(Error);
                });
        }
    },
};
</script>
  
<style scoped>
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

.car .box div {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}

.carCnt {
  font-size: 25px;
}

.carText {
  color: #2196F3;
  padding-top: 20px;
  padding-bottom: 20px;
}

</style>