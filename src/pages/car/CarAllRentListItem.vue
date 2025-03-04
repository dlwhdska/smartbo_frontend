<template lang="">
  <tr>
    <td @click="openModal">{{ r.reqDate }}</td>
    <td @click="openModal">{{ r.member.department.name }}</td>
    <td @click="openModal">{{ r.member.name }}</td>
    <td @click="openModal">{{ r.car.carNo }}</td>
    <td @click="openModal">{{ r.startDate }} ~ {{ r.endDate }}</td>
    <td>
      <span
        class="tag"
        v-if="r.status == 2 && formatYYYYmmdd(currentDate) == r.endDate"
        style="background-color: rgb(25, 189, 74)"
        >대여중</span
      >
      <span
        class="tag"
        v-if="r.status == 0"
        style="background-color: rgb(255, 217, 0)"
        >대기</span
      >
      <span
        class="tag"
        v-if="r.status == 1"
        style="background-color: rgb(252, 49, 49)"
        >반려</span
      >
      <span
        class="tag"
        v-if="r.status == 2 && formatYYYYmmdd(currentDate) > r.endDate"
        style="background-color: rgb(252, 49, 49)"
        >미반납</span
      >
    </td>
    <td>
      <button class="approvebutton" v-if="r.status == 0" @click="approve">
        승인
      </button>
      <button
        class="rejectbutton"
        v-if="r.status == 0"
        @click="openRejectModal"
      >
        반려
      </button>
      <button
        class="returnbutton"
        v-if="r.status == 2 && formatYYYYmmdd(currentDate) > r.endDate"
        @click="returnHandler"
      >
        반납처리
      </button>
    </td>
  </tr>
  <div class="modal-wrap" v-show="modalCheck == true">
    <div class="modal-container">
      <button class="cancel" @click="openModal">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          class="bi bi-x-circle"
          viewBox="0 0 16 16"
        >
          <path
            d="M8
  15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"
          />
          <path
            d="M4.646
  4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5
  0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1
  0-.708z"
          />
        </svg>
      </button>
      <div class="rentdetail">
        <h3 style="margin-bottom: 30px; color: #2196f3">신청 정보</h3>
        <label>신청자 </label
        ><span style="font-size: 15px; margin-left: 30px">{{
          r.member.name
        }}</span
        ><br /><br />
        <label>부서명 </label
        ><span style="font-size: 15px; margin-left: 30px">{{
          r.member.department.name
        }}</span
        ><br /><br />
        <label>차량번호 </label
        ><span style="font-size: 15px; margin-left: 15px">{{
          r.car.carNo
        }}</span
        ><br /><br />
        <label>차종 </label
        ><span style="font-size: 15px; margin-left: 45px">{{
          r.car.carType
        }}</span
        ><br /><br />
        <label>대여기간 </label
        ><span style="font-size: 15px; margin-left: 15px"
          >{{ r.startDate }} ~ {{ r.endDate }}</span
        ><br /><br />
        <label>대여목적 </label
        ><span style="font-size: 15px; margin-left: 15px">{{ r.purpose }}</span
        ><br /><br />
        <label v-if="r.status == 1">반려사유 </label
        ><span style="font-size: 15px; margin-left: 15px">{{ r.reject }}</span
        ><br /><br />
        <div class="modal-btn" v-if="r.status == 0">
          <button type="submit" class="ok" @click="approve">승인</button>
        </div>
      </div>
    </div>
  </div>
  <div class="modal-wrap" v-show="rejectModalCheck">
    <div class="modal-container">
      <button class="cancel" @click="openRejectModal">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          class="bi bi-x-circle"
          viewBox="0 0 16 16"
        >
          <path
            d="M8 15A7 7 0 1
  1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"
          />
          <path
            d="M4.646 4.646a.5.5 0
  0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0
  1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1
  0-.708z"
          />
        </svg>
      </button>
      <div class="rejectdetail">
        <h3 style="color: #2196f3">반려사유</h3>
        <form class="rejectmessage" @submit.prevent="rejectHandler">
          <textarea
            type="text"
            name="reject"
            v-model="reject"
            @input="inputHandler"
            maxlength="60"
            placeholder="60자 이내로 입력하세요"
            required
          ></textarea>
          <div class="modal-btn">
            <button type="submit" class="ok">완료</button>
          </div>
        </form>
      </div>
    </div>
  </div>
  <div class="modal-wrap" v-show="approveModalCheck">
    <div class="modal-container">
      <button class="cancel" @click="openApproveModal">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          class="bi bi-x-circle"
          viewBox="0 0 16 16"
        >
          <path
            d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8
  0 1 0 8 0a8 8 0 0 0 0 16z"
          />
          <path
            d="M4.646 4.646a.5.5 0 0 1 .708 0L8
  7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8
  8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"
          />
        </svg>
      </button>
      <div class="approvedetail">
        <label>신청자</label>
        <span style="font-size: 15px; margin-left: 15px">{{
          r.member.name
        }}</span
        ><br /><br />
        <label>부서명</label>
        <span style="font-size: 15px; margin-left: 15px">{{
          r.member.department.name
        }}</span
        ><br /><br />
        <label>차량번호</label>
        <span style="font-size: 15px">{{ r.car.carNo }}</span
        ><br /><br />
        <label>차종</label>
        <span style="font-size: 15px; margin-left: 30px">{{
          r.car.carType
        }}</span
        ><br /><br />
        <label>대여기간</label>
        <span style="font-size: 15px">{{ r.startDate }} ~ {{ r.endDate }}</span
        ><br /><br />
        <label>대여목적</label>
        <span style="font-size: 15px">{{ r.purpose }}</span
        ><br /><br />
        <div class="modal-btn">
          <button type="submit" class="ok" @click="approve">승인</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
export default {
  name: "CarAllRentListItem",
  props: ["r"],
  data() {
    return {
      reqDate: "",
      modalCheck: false,
      currentDate: new Date(),
      rejectModalCheck: false,
      approveModalCheck: false,
      reject: "",
      formData: {
        id: this.r.id,
        reject: "",
      },
      startPage: 1,
      endPage: 1,
    };
  },
  methods: {
    openModal() {
      this.modalCheck = !this.modalCheck;
    },
    openRejectModal() {
      this.rejectModalCheck = !this.rejectModalCheck;
    },
    openApproveModal() {
      this.approveModalCheck = !this.approveModalCheck;
    },
    approve() {
      const url = `${this.backURL}/carrent/approve?id=${this.r.id}`;
      axios
        .get(url)
        .then((response) => {
          if (response.status == 200) {
            alert("승인되었습니다.");
            window.location.reload();
          }
        })
        .catch((Error) => {
          console.log(Error);
        });
    },
    rejectHandler() {
      this.formData.reject = this.reject;
      const url = `${this.backURL}/carrent/reject`;
      // const data = this.formData
      axios
        .put(url, {
          id: this.r.id,
          reject: this.formData.reject,
        })
        .then((Response) => {
          if (Response.status == 200) {
            alert("반려되었습니다.");
            window.location.reload();
          }
        })
        .catch((Error) => {
          console.log(Error);
        });
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
    returnHandler() {
      const url = `${this.backURL}/carrent/return?id=${this.r.id}`;
      if (confirm("반납처리를 하시겠습니까?")) {
        axios
          .get(url)
          .then((response) => {
            if (response.status == 200) {
              alert("처리되었습니다.");
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
    console.log("r: ", this.r);
    console.log("currentDate", this.currentDate);
  },
};
</script>
<style scoped>
td {
  padding: 25px;
  font-size: 15px;
  border-top: dotted 2px;
  border-color: #dfdfdf;
  text-align: center;
  cursor: pointer;
}
.purpose {
  cursor: pointer;
}
.applycancelbutton {
  margin-left: "20px";
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
  border-radius: 10px;
  padding: 50px;
  padding-top: 30px;
  box-sizing: border-box;
  box-shadow: 0 19px 38px rgba(0, 0, 0, 0.3), 0 15px 12px rgba(0, 0, 0, 0.22);
}
.approvedetail,
.rentdetail {
  margin-top: 30px;
  text-align: left;
}
.rejectdetail {
  margin-top: 30px;
  text-align: center;
}
label {
  /* color : #02449b; */
  font-weight: 700;
  font-size: 15px;
  padding-right: 40px;
  vertical-align: top;
}
.modal-btn {
  margin-top: 30px;
  text-align: center;
}
.tag {
  background-color: rgb(252, 49, 49);
  color: white;
  border-radius: 15px;
  padding: 20px;
  padding-top: 5px;
  padding-bottom: 5px;
  font-size: 12px;
}
.ok,
.approvebutton,
.rejectbutton,
.returnbutton {
  background-color: #2196f3;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
.approvebutton:hover {
  background-color: #2189df;
}
.rejectbutton:hover {
  background-color: #2189df;
}
.returnbutton:hover {
  background-color: #2189df;
}
.ok:hover {
  background-color: #2189df;
}
.rejectbutton {
  margin-left: 10px;
}
.cancel {
  float: right;
  color: #58d3e9;
}
.cancel:hover {
  color: #58b5c5;
}
textarea {
  border: 1px solid #d8d8d8;
  border-radius: 5px;
  font-size: 15px;
  width: 300px;
  height: 100px;
  resize: none;
  font-size: 13px;
  padding: 10px;
  margin-top: 20px;
}
</style>
