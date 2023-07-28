<script setup>
import { ref, nextTick } from "vue";
const newUrl = ref("");
const urls = ref([]);
const loading = ref(false);
const continueFocus = ref(null);
// mock user id
const userId = "123";

const uploadUrl = async () => {
  // check if the user has entered a message
  if (!newUrl.value.trim()) {
    return;
  }
  loading.value = true;
  // console.log("loading start:" + loading.value);
  try {
    const response = await fetch("http://localhost:3000/urlUploadWindow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url: newUrl.value, userId: userId }),
    });

    if (!response.ok) {
      throw new Error("Failed to upload url");
    }
    const responseJSON = await response.json();
    console.log(
      responseJSON.message,
      responseJSON.urlName,
      responseJSON.userId
    );
    urls.value.push({
      urlPath: newUrl.value,
      urlName: responseJSON.urlName,
    });
    newUrl.value = "";
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
    await nextTick();
    continueFocus.value.focus();
    // console.log("loading finished:" + loading.value);
  }
};

const deleteUrl = async (urlName, userId) => {
  try {
    if (!urlName || urlName === "") {
      console.log("No Url selected");
      return;
    }

    const url = new URL(
      `http://localhost:3000/deleteUrl/${urlName}`
    );
    // add userId to query params
    url.searchParams.append("userId", userId);

    const response = await fetch(url, {
      method: "DELETE",
    });
    if (!response.ok) {
      const errorBody = await response.json();
      console.log("Error response body: " + errorBody.message);
      throw new Error("Failed to delete file");
    }

    const responseJSON = await response.json();
    console.log(responseJSON.message);

    // remove the file from the array
    urls.value = urls.value.filter(
      (url) => url.urlName !== urlName
    );
  } catch (error) {
    console.log(error);
  }
};

// auto focus on the input field
const vFocus = {
  mounted: (el) => el.focus(),
};
</script>
<template>
  <div class="q-pa-md window-view">
    <input
      v-model="newUrl"
      ref="continueFocus"
      label="Enter Url"
      :disabled.="loading"
      v-focus
      @keyup.enter="uploadUrl"
      class="upload-file-input"
      placeholder="Enter Website URL"
    />
    <q-btn
      @click="uploadUrl"
      label="Upload URL"
      :loading="loading"
      class="upload-file-button"
    />
    <q-list>
      <q-item
        class="upload-file-list"
        v-for="(url, index) in urls"
        :key="index"
      >
        <q-item-section>{{ url.urlPath }}</q-item-section>
        <q-btn
          @click="deleteUrl(url.urlName, userId)"
          label="X"
          color="negative"
        ></q-btn>
      </q-item>
    </q-list>
  </div>
</template>
<style scoped>
.window-view {
  /* width: 500px;
  height: 500px; */
  margin: 7rem auto;
  /* border:1px solid #ccc; */
  display: flex;
  flex-direction: column;
  align-items: center;
}
.upload-file-input {
  display: flex;
  width: 400px;
  margin: 0.5rem 2rem;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.upload-file-input:focus {
  outline: none;
  outline: 1px solid lightblue;
  /* box-shadow: 0 0 3px #4c8caf; */
}
.upload-file-button {
  width: 150px;
  margin: 0.5rem 2rem;
}

.upload-file-list {
  width: 400px;
  margin: 0.5rem auto;
  border-radius: 3px;
  background-color: blanchedalmond;
}
</style>
