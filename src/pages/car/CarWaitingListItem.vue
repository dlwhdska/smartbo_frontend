<template lang="">
  <tr>
    <td @click="openApproveModal">{{ w.reqDate }}</td>
    <td @click="openApproveModal">{{ w.member.department.name }}</td>
    <td @click="openApproveModal">{{ w.member.name }}</td>
    <td @click="openApproveModal">{{ w.car.carNo }}</td>
    <td @click="openApproveModal">{{ w.startDate }} ~ {{ w.endDate }}</td>
    <td>
      <button class="approvebutton" @click="approve">승인</button>
      <button class="rejectbutton" @click="openRejectModal">반려</button>
    </td>
  </tr>
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
            d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"
          />
          <path
            d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647
  2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646
  5.354a.5.5 0 0 1 0-.708z"
          />
        </svg>
      </button>
      <div class="rejectdetail">
        <h3>반려사유</h3>
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
            d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"
          />
          <path
            d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647
  2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646
  5.354a.5.5 0 0 1 0-.708z"
          />
        </svg>
      </button>
      <div class="approvedetail">
        <label>신청자</label>
        <span style="font-size: 15px; margin-left: 15px">{{
          w.member.name
        }}</span
        ><br /><br />
        <label>부서명</label>
        <span style="font-size: 15px; margin-left: 15px">{{
          w.member.department.name
        }}</span
        ><br /><br />
        <label>차량번호</label>
        <span style="font-size: 15px">{{ w.car.carNo }}</span
        ><br /><br />
        <label>차종</label>
        <span style="font-size: 15px; margin-left: 30px">{{
          w.car.carType
        }}</span
        ><br /><br />
        <label>대여기간</label>
        <span style="font-size: 15px">{{ w.startDate }} ~ {{ w.endDate }}</span
        ><br /><br />
        <label>대여목적</label>
        <span style="font-size: 15px">{{ w.purpose }}</span>
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
  name: "CarWaitingListItem",
  props: ["w"],
  data() {
    return {
      rejectModalCheck: false,
      approveModalCheck: false,
      reject: "",
      formData: {
        id: this.w.id,
        reject: "",
      },
    };
  },
  methods: {
    openRejectModal() {
      this.rejectModalCheck = !this.rejectModalCheck;
    },
    openApproveModal() {
      this.approveModalCheck = !this.approveModalCheck;
    },
    approve() {
      const url = `${this.backURL}/carrent/approve?id=${this.w.id}`;
      axios
        .get(url)
        .then((response) => {
          if (response.status == 200) {
            alert("승인되었습니다.");
            this.$router.push("/carrent/allrentlist");
          }
        })
        .catch((Error) => {
          console.log(Error);
        });
    },
    rejectHandler() {
      this.formData.reject = this.reject;
      const url = `${this.backURL}/carrent/reject`;
      axios
        .put(url, {
          id: this.w.id,
          reject: this.formData.reject,
        })
        .then((Response) => {
          if (Response.status == 200) {
            alert("반려되었습니다.");
            this.$router.push("/carrent/allrentlist");
          }
        })
        .catch((Error) => {
          console.log(Error);
        });
    },
  },
};
</script>
<style scoped>
tr:nth-child(even) {
  background-color: #f9f9f9;
}
tr:hover {
  background-color: #fcfcfc;
}
td {
  padding: 10px;
  text-align: center;
  border-bottom: px solid #ddd;
  border-top: dotted 1px #cccccc;
  font-size: 15px;
  cursor: pointer;
}
.rejectbutton {
  margin-left: 10px;
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
.approvedetail {
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
  margin-top: 50px;
  text-align: center;
}
.ok,
.approvebutton,
.rejectbutton {
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
.approvebutton:hover {
  background-color: #2189df;
}
.rejectbutton:hover {
  background-color: #2189df;
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
