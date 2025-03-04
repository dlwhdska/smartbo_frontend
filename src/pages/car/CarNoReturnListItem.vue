<template lang="">
  <tr>
    <td @click="openModal">{{ n.reqDate }}</td>
    <td @click="openModal">{{ n.member.department.name }}</td>
    <td @click="openModal">{{ n.member.name }}</td>
    <td @click="openModal">{{ n.car.carNo }}</td>
    <td @click="openModal">{{ n.startDate }} ~ {{ n.endDate }}</td>
    <td>
      <button class="returnbutton" @click="returnHandler">반납완료</button>
    </td>
  </tr>
  <div class="modal-wrap" v-show="modalCheck">
    <div class="modal-container">
      <div class="noreturndetail">
        <span>예약자 : {{ n.member.name }}</span
        ><br /><br />
        <span>소속부서 : {{ n.member.department.name }}</span
        ><br /><br />
        <span>신청날짜 : {{ n.reqDate }}</span
        ><br /><br /><br />
        <span>차량번호 : {{ n.car.carNo }}</span
        ><br /><br /><br />
        <span>차종 : {{ n.car.carType }}</span
        ><br /><br /><br />
        <span>대여기간 : {{ n.startDate }} ~ {{ n.endDate }}</span
        ><br /><br /><br />
        <span>대여목적 : {{ n.purpose }}</span
        ><br /><br /><br />
        <div class="modal-btn">
          <button class="cancel" @click="openModal">취소</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
export default {
  name: "CarNoReturnListItem",
  props: ["n"],
  data() {
    return {
      modalCheck: false,
    };
  },
  methods: {
    openModal() {
      this.modalCheck = !this.modalCheck;
      const today = new Date();
      console.log(today);
    },
    returnHandler() {
      const url = `${this.backURL}/carrent/return?id=${this.n.id}`;
      if (confirm("반납처리를 하시겠습니까?")) {
        axios
          .get(url)
          .then((response) => {
            if (response.status == 200) {
              alert("처리되었습니다.");
              this.$router.push("/carrent/allrentlist");
            }
          })
          .catch((Error) => {
            console.log(Error);
          });
      }
    },
  },
};
</script>
<style scoped>
tr:nth-child(even) {
  background-color: #f9f9f9;
}
tr {
  cursor: pointer;
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
  padding: 20px;
  box-sizing: border-box;
  box-shadow: 0 19px 38px rgba(0, 0, 0, 0.3), 0 15px 12px rgba(0, 0, 0, 0.22);
}
.modal-btn {
  position: relative;
  left: 50%;
  margin-top: 50px;
}
.returnbutton {
  background-color: #2196f3;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
}
.returnbutton:hover {
  background-color: #2189df;
}
</style>
