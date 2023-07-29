<script setup>
import { ref } from "vue";
const newFiles = ref(null);
const files = ref([]);
const loading = ref(false);
const fileInputRef = ref(null);
const needUpload = ref(false);
// mock user id
const userId = "123";

// trigger the <input> element
const handleUploadAreaClick = () => {
  // only if no file is being uploaded, allow user to select file
  if (!needUpload.value) {
    fileInputRef.value.click();
  }
};

// select the file
const handleFileSelect = (event) => {
  newFiles.value = event.target.files[0];
  // set the file name and status
  files.value.push({
    name: newFiles.value.name,
    status: "pending",
    UniqueName: "",
  });
  // console.log(files.value);
  // indicate that a file is need to be uploaded
  needUpload.value = true;
  // Reset the file input to allow user to select the same file again
  event.target.value = null;
};

const uploadPDF = async () => {
  try {
    if (!newFiles.value) {
      console.log("No file selected");
      return;
    }

    loading.value = true;
    const formData = new FormData();
    // set a new file name
    const newFileName = `${userId}_${newFiles.value.name}`;
    formData.append("file", newFiles.value, newFileName);
    formData.append("name", newFiles.value.name);
    formData.append("userId", userId);

    const response = await fetch("http://localhost:3000/pdfUploadWindow", {
      method: "POST",
      body: formData,
    });
    if (!response.ok) {
      const errorBody = await response.text();
      console.log("Error response body :" + errorBody);
      throw new Error("Failed to upload file");
    }
    const responseJSON = await response.json();
    console.log(
      responseJSON.message,
      responseJSON.fileName,
      responseJSON.userId
    );

    // get the file name and add into array
    // files.value.push(newFiles.value.name);

    // set the status of the file to success
    files.value[files.value.length - 1].status = "success";
    files.value[files.value.length - 1].UniqueName = responseJSON.fileName;

    newFiles.value = null;
    loading.value = false;
    needUpload.value = false;
  } catch (error) {
    console.log(error);
    loading.value = false;
    needUpload.value = false;
  }
};

const deleteFile = async (fileUniqueName, userId) => {
  try {
    if (!fileUniqueName || fileUniqueName === "") {
      console.log("No file selected");
      return;
    }

    const url = new URL(`http://localhost:3000/deleteFile/${fileUniqueName}`);
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
    files.value = files.value.filter(
      (file) => file.UniqueName !== fileUniqueName
    );
  } catch (error) {
    console.log(error);
  }
};
</script>
<template>
  <div class="q-pa-md">
    <div
      class="upload-area"
      :class="{ 'upload-area-disabled': needUpload }"
      @click="handleUploadAreaClick"
    >
      <input
        type="file"
        ref="fileInputRef"
        @change="handleFileSelect"
        style="display: none"
      />
      <q-icon name="cloud_upload" size="3rem" />
      <div>Drag and drop files here</div>
    </div>
    <q-btn
      class="upload-button"
      @click="uploadPDF"
      label="Upload File"
      color="primary"
      :loading="loading"
      :disable="!needUpload"
    ></q-btn>
    <q-list>
      <q-item v-for="(file, index) in files" :key="index" class="item-section">
        <div>
          {{ file.name }}
        </div>
        <span v-if="file.status === 'success'">- Upload Successfully</span>
        <q-btn
          v-if="file.status === 'success'"
          @click="deleteFile(file.UniqueName, userId)"
          label="X"
          color="negative"
        ></q-btn>
      </q-item>
    </q-list>
  </div>
</template>
<style scoped>
.upload-area {
  margin: auto;
  margin-top: 5rem;
  margin-bottom: 2rem;
  width: 200px;
  height: 200px;
  border: 1px solid #ccc;
  outline: 1px solid #ccc;
  outline-offset: 0.3rem;
  box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.3s;
}
.upload-area:hover {
  background-color: #eee;
}

/* .upload-area ::v-deep .q-field__native {
  display: flex;
  align-items: center;
  justify-content: center;
} */

.upload-area-disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.item-section {
  /* margin: 0.3rem; */
  display: flex;
  align-items: center;
  justify-content: center;
  /* justify-content: space-between; */
}

.upload-button {
  margin: 0.5rem auto;
  display: block;
  /* width: 200px; */
  /* height: 50px; */
  border-radius: 5px;
  /* font-size: 1.2rem; */
  /* font-weight: bold; */
  /* text-transform: uppercase; */
  /* letter-spacing: 1px; */
  /* transition: all 0.3s; */
}
</style>
