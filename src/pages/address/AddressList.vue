<template>
  <main>
    <h3 class="title">주소록</h3>
    <div class="search-container">
      <input
        v-model="search"
        type="text"
        placeholder="이름, 직급 또는 부서명을 입력하세요"
        class="search-input"
      />
      <button @click="findAll" class="search-button">조회</button>
    </div>
    <div v-if="loading">잠시만 기다려주세요...</div>
    <div v-else>
      <div class="table-container">
        <table class="address-table">
          <thead class="address-thead">
            <tr class="address-tr">
              <th>사원 번호</th>
              <th>이름</th>
              <th>부서명</th>
              <th>직급</th>
              <th>사내번호</th>
            </tr>
          </thead>
          <tbody class="address-tbody scrollable-tbody">
            <tr v-for="member in filteredMembers" :key="member.id">
              <td>{{ member.id }}</td>
              <td>{{ member.name }}</td>
              <td>{{ member.departmentName }}</td>
              <td>{{ member.position }}</td>
              <td>{{ member.tel }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </main>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      loading: true,
      members: [],
      search: "",
    };
  },
  computed: {
    filteredMembers() {
      return this.members.filter((member) => {
        return (
          !this.search ||
          member.name.includes(this.search) ||
          member.position.includes(this.search) ||
          member.departmentName.includes(this.search)
        );
      });
    },
  },
  mounted() {
    this.findAll();
  },
  methods: {
    async findAll() {
      try {
        const response = await axios.get(`${this.backURL}/address/members`);
        this.members = response.data;
        this.loading = false;
      } catch (error) {
        console.error("사원 정보를 불러오지 못했습니다:", error);
        this.loading = true;
      }
    },
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
  margin-bottom: 20px;
  font-weight: bold;
  text-shadow: 1px 1px 1px #ccc;
}

.address-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

th,
td {
  padding: 10px;
  text-align: center;
  border-bottom: 1px solid #ddd;
}

.address-thead {
  background-color: #f5f5f5;
}

.address-tbody tr:nth-child(even) {
  background-color: #f9f9f9;
}

.address-tbody tr:hover {
  background-color: #eaeaea;
}

.search-container {
  text-align: center;
  margin-bottom: 20px;
}

.search-input {
  padding: 10px;
  margin-right: 10px;
  width: 300px; /* 변경된 부분: 검색 필드의 길이를 조정합니다. */
}

.search-button {
  padding: 10px;
  cursor: pointer;
  background-color: #3498db;
  color: #fff;
  border: none;
  border-radius: 3px;
}
.table-container {
  overflow-y: auto; /* 스크롤이 필요한 경우 수직 스크롤을 생성합니다. */
  max-height: 400px;
}

.scrollable-tbody {
  /* 스크롤바 디자인을 적용합니다. 필요에 따라 스타일을 조절할 수 있습니다. */
  scrollbar-width: thin;
  scrollbar-color: #3498db #f5f5f5;
}

.scrollable-tbody::-webkit-scrollbar {
  width: 8px; /* WebKit 브라우저에 대한 스크롤바 너비 설정 */
}

.scrollable-tbody::-webkit-scrollbar-thumb {
  background-color: #3498db; /* 스크롤바 색상 설정 */
  border-radius: 4px; /* 스크롤바 모서리를 둥글게 만듭니다. */
}

.scrollable-tbody::-webkit-scrollbar-track {
  background-color: #f5f5f5; /* 스크롤바 트랙의 배경색 설정 */
}
.address-thead {
  background-color: #f5f5f5;
  position: sticky;
  top: 0; /* 상단에 고정 */
  z-index: 1; /* 다른 요소 위에 나타나도록 설정 */
}
</style>
