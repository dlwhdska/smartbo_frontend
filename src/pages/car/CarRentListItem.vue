<template lang="">
  <tr @click="openModal">
    <td>{{ r.reqDate }}</td>
    <td>{{ r.member.department.name }}</td>
    <td>{{ r.member.name }}</td>
    <td>{{ r.car.carNo }}</td>
    <td>{{ r.startDate }} ~ {{ r.endDate }}</td>
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
      <div class="rentdetail">
        <label>신청자</label
        ><span style="font-size: 15px; margin-left: 15px">{{
          r.member.name
        }}</span
        ><br /><br />
        <label>부서명</label
        ><span style="font-size: 15px; margin-left: 15px">{{
          r.member.department.name
        }}</span
        ><br /><br />
        <label>차량번호</label
        ><span style="font-size: 15px">{{ r.car.carNo }}</span
        ><br /><br />
        <label>차종</label
        ><span style="font-size: 15px; margin-left: 30px">{{
          r.car.carType
        }}</span
        ><br /><br />
        <label>대여기간</label
        ><span style="font-size: 15px">{{ r.startDate }} ~ {{ r.endDate }}</span
        ><br /><br />
        <label>대여목적</label
        ><span style="font-size: 15px">{{ r.purpose }}</span>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
export default {
  name: "CarRentListItem",
  props: ["r"],
  data() {
    return {
      modalCheck: false,
    };
  },
  methods: {
    openModal() {
      this.modalCheck = !this.modalCheck;
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
.rentdetail {
  margin-top: 30px;
  text-align: left;
}
label {
  /* color : #02449b; */
  font-weight: 700;
  font-size: 15px;
  padding-right: 40px;
  vertical-align: top;
}
.cancel {
  float: right;
  color: #58d3e9;
}
.cancel:hover {
  color: #58b5c5;
}
</style>
