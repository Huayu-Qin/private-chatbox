<template>
  <div id="chat">
    <div class="chat-container">
      <div class="message" v-for="message in messages" :key="message.id">
        <div class="user-input" v-if="message.sender === 'user'">{{ message.text }}</div>
        <div class="bot-response" v-else>{{ message.text }}</div>
      </div>
    </div>
    <div class="input-container">
      <q-input v-model="input" @keyup.enter="sendMessage" />
      <q-btn label="Send" @click="sendMessage" />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      input: '',
      messages: [
        { id: 1, sender: 'bot', text: 'Hello! How can I assist you today?' }
      ]
    }
  },
  methods: {
    sendMessage() {
      this.messages.push({ id: Date.now(), sender: 'user', text: this.input });
      this.input = '';
      // Here you should call your backend API to get the response from ChatGPT.
    }
  }
}
</script>

<style scoped>
/* Add your styles for the chat interface here */
</style>
