<template lang="">
  <tr>
    <td>{{ c.carNo }}</td>
    <td>{{ c.carType }}</td>
    <td>{{ c.maxNum }}인승</td>
    <td><button class="applybutton" @click="openModal">신청</button></td>
  </tr>
  <div class="modal-wrap" v-show="modalCheck">
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
      <div style="margin-top: 30px; text-align: left">
        <form class="apply" @submit.prevent="reserveHandler">
          <label>차량번호</label
          ><span style="font-size: 15px">{{ c.carNo }}</span
          ><br /><br />
          <label>차종</label
          ><span style="font-size: 15px; margin-left: 30px">{{
            c.carType
          }}</span
          ><br /><br /><br />
          <label>대여기간</label
          ><span style="font-size: 15px"
            >{{ d.startDate }} ~ {{ d.endDate }}</span
          ><br /><br /><br />
          <label>대여목적 </label
          ><textarea
            type="text"
            name="purpose"
            v-model="purpose"
            @input="inputHandler"
            maxlength="60"
            placeholder="60자
  이내로 입력하세요"
            required
          ></textarea>
          <div class="modal-btn">
            <button type="submit" class="ok">신청</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
export default {
  name: "CarListItem",
  props: ["c", "d"],
  data() {
    return {
      memberId: "",
      departmentId: "",
      startDate: "",
      endDate: "",
      purpose: "",
      modalCheck: false,
      minStartDate: this.getCurrentDate(),
      minEndDate: this.getCurrentDate(),
      formData: {
        member: {
          id: "",
        },
        car: {
          id: this.c.id,
        },
        startDate: "",
        endDate: "",
        purpose: "",
      },
    };
  },
  methods: {
    openModal() {
      this.modalCheck = !this.modalCheck;
    },
    formatToYYMMDD(date) {
      const year = String(date.getFullYear()).slice(2);
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}/${month}/${day}`;
    },
    getCurrentDate() {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0");
      const day = String(today.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    },
    inputHandler() {
      // startDate 값이 변경될 때 minEndDate를 업데이트합니다.
      this.minEndDate = this.startDate;
      console.log(this.minEndDate);
      this.formData.startDate = this.startDate;
      this.formData.endDate = this.endDate;
      this.formData.purpose = this.purpose;
    },
    reserveHandler() {
      this.formData.member.id = localStorage.getItem("memberId");
      console.log(this.formData.member.id);
      this.formData.startDate = this.d.startDate;
      this.formData.endDate = this.d.endDate;

      if (this.formData.endDate < this.formData.startDate) {
        alert("올바른 날짜 기입이 아닙니다. 대여기간을 다시 확인하세요.");
        return false;
      }

      const url = `${this.backURL}/carrent/reserve`;
      const data = this.formData;
      console.log(data);

      axios
        .post(url, data)
        .then((Response) => {
          alert("신청되었습니다");
          this.modalCheck = !this.modalCheck;
          return false;
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
.modal-btn {
  margin-top: 50px;
  text-align: center;
}
.applybutton,
.ok {
  background-color: #2196f3;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
.cancel:hover {
  color: #58b5c5;
}
.applybutton:hover {
  background-color: #2189df;
}
.ok:hover {
  background-color: #2189df;
}
.cancel {
  float: right;
  color: #58d3e9;
}

label {
  /* color : #02449b; */
  font-weight: 700;
  font-size: 15px;
  padding-right: 40px;
  vertical-align: top;
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
}
</style>
