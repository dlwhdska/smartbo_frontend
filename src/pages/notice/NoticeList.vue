<template>
  <main>
  <h3 class="title">공지사항</h3>
  <div class="noticelist">
    <table>
      <thead>
        <tr>
          <th>번호</th>
          <th>제목</th>
          <th>작성일자</th>
          <th>작성자</th>
        </tr>
      </thead>

      <tbody>
        <NoticeItem
          :n="addRowNumToNotice(n)"
          v-if="noticelist"
          v-for="n in noticelist.content"
          v-bind:key="n.id"
          @click="clickNoticeInfo(`${n.id}`)"
        />
      </tbody>
    </table>
  </div>
  <br>
    <PageGroup
      v-if="noticelist"
      :path="$route.params.currentPage ? $route.params.currentPage : 1"
      :currentPage="currentPage"
      :startPage="startPage"
      :endPage="endPage"
    />
  </main>
</template>
<script scoped>
import NoticeItem from "@/pages/notice/NoticeItem.vue";
import PageGroup from "@/components/PageGroup.vue";
import axios from "axios";

export default {
  name: "NoticeList",
  components: { NoticeItem, PageGroup },
  data() {
    return {
      noticelist: [],
      currentPage: 1,
      startPage: 1,
      endPage: 1,
    };
  },
  methods: {
    //----페이지그룹의 페이지(ex: [1] [2] [NEXT])객체가 클릭되었을 때 할 일 START----
    axiosHandler() {
      const url = `${this.backURL}/notice/list?currentPage=${this.currentPage}`;
      axios
        .get(url)
        .then((response) => {
          this.noticelist = response.data;
          if (this.currentPage <= this.noticelist.totalPages) {
            this.startPage = parseInt((this.currentPage - 1) / 5) * 5 + 1;
            this.endPage = this.startPage + 5 - 1;
          }

          if (this.endPage > this.noticelist.totalPages) {
            this.endPage = this.noticelist.totalPages;
          }
        })
        .catch((Error) => {
          console.log(Error);
        });
    },
    //----페이지그룹의 페이지(ex: [1] [2] [NEXT])객체가 클릭되었을 때 할 일 END----

    //----리스트 중 한 항목 클릭되었을 때 할 일 START----
    clickNoticeInfo(id) {
      this.id = id;
      this.$router.push({ path: `./${id}` });
    },
    //----리스트 중 한 항목 클릭되었을 때 할 일 END----

    addRowNumToNotice(n) {
      // 현재 아이템의 index + 1을 rownum으로 설정
      const rowNum = this.noticelist.content.indexOf(n) + 1;
      // n.id를 rowNum으로 대체한 객체를 반환
      return { ...n, id: rowNum };
    },
  },
  watch: {
    //----라우터값이 변경되었을 때 할 일 START----
    $route(newRoute, oldRoute) {
      console.log("라우터값이 변경" + newRoute.path + "," + oldRoute.path);
      if (newRoute.params.currentPage) {
        this.currentPage = newRoute.params.currentPage;
      } else {
        this.currentPage = 1;
      }
      this.axiosHandler();
    },
    //----라우터값이 변경되었을 때 할 일 END----
  },
  created() {
    console.log("created myreservationlist");
    if (this.$route.params.currentPage) {
      this.currentPage = this.$route.params.currentPage;
    }
    this.axiosHandler();
  },
};
</script>
<style scoped>
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

div.noticelist {
  width: 90%;
  font-family: "Arial", sans-serif;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 20px;
  margin: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-left: 6%;
}

table {
  border-collapse: collapse;
  width: 100%;

  align-content: center;
}

td {
    padding: 10px;
    text-align: center;
    border-bottom: 1px solid #ddd;
}

thead {
    background-color: #f5f5f5;
}

tbody tr:nth-child(even) {
    background-color: #f9f9f9;
}

tbody tr:hover {
    background-color: #eaeaea;
}

/* 테이블 행 */
th {
  padding: 8px;
  height: 80px;
  text-align: left;
  border-bottom: 1px solid #ddd;
  text-align: center;
}

/* 테이블 비율 */
th:nth-child(1),
td:nth-child(1) {
  width: 20%;
}

th:nth-child(2),
td:nth-child(2) {
  width: 40%;
}

th:nth-child(3),
td:nth-child(3) {
  width: 20%;
}

th:nth-child(4),
td:nth-child(4) {
  width: 20%;
}

tr:nth-child(even) {
  background-color: #fff6f6;
}
</style>
