<template>
  <div id="upload">
    <!-- <div class="upload-section">
      <h2>Upload Documents</h2>
      <q-file v-model="files.documents" label="Choose documents" multiple />
      <q-btn label="Upload" @click="uploadFiles('documents')" />
    </div>
    <div class="upload-section">
      <h2>Upload URLs</h2>
      <q-input v-model="urls" label="Enter URLs" />
      <q-btn label="Upload" @click="uploadUrls" />
    </div> -->
    <div id="upload">
    <document-upload @upload="increaseCount('documents', $event)" />
    <url-upload @upload="increaseCount('urls', $event)" />
    <!-- Include other upload components here -->
  </div>
    <p>
      Data sources: Documents: {{ dataSources.documents }}, URLs:
      {{ dataSources.urls }},
      <!-- Add counts for text and QA pairs here. -->
    </p>
    <transition name="fade">
    <p>
      <!-- ... -->
    </p>
  </transition>
    <!-- Add more upload sections for text and QA pairs here. -->
  </div>
</template>

<script>
import DocumentUpload from 'components/DocumentUpload.vue';
import URLUpload from 'components/URLUpload.vue';
// Import other upload components here

export default {
  components: {
    DocumentUpload,
    // URLUpload,
    // Include other upload components here
  },
  data() {
    return {
      files: {
        documents: null,
      },
      urls: "",
      dataSources: {
        documents: 0,
        urls: 0,
        text: 0,
        qa: 0,
      },
    };
  },
  methods: {
    // uploadFiles(type) {
    //   // Here you should call your backend API to upload the files.
    //   this.dataSources.documents++;
    // },
    // uploadUrls() {
    //   // Here you should call your backend API to upload the URLs.
    //   this.dataSources.urls++;
    // },
    increaseCount(type, count) {
      this.dataSources[type] += count;
    }
  },
};
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
/* Add your styles for the upload page here */
</style>
