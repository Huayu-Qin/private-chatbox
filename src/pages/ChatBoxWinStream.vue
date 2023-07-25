<script setup>
import { ref, watch, nextTick, onMounted } from "vue";
import { useChat } from "ai/vue";

const { messages, input, handleSubmit } = useChat({ api: "/chatStream" });

// floating button state

const loading = ref(false);
// continue focus on the input field
const continueFocus = ref(null);
// Scroll to the bottom of the chat window
const chatWindow = ref(null);

const sendMessage = async (event) => {
  // check if the user has entered a message
  if (!input.value.trim()) {
    return;
  }
  loading.value = true;
  // event.preventDefault();
  if (input.value === "") {
    return;
  }

  // console.log(messages.value);
  try {
    await handleSubmit(event);
    // push the result into the messges array
  } catch (error) {
    console.log("ERROR:" + error);
  } finally {
    input.value = "";
    loading.value = false;
    // focus on the input field
    // make sure the dom is updated
    await nextTick();
    continueFocus.value.focus();
  }
};
// Press enter + shift to get a new line
const insertNewLine = (event) => {
  // event.preventDefault();

  // get the current cursor position
  const cursorPosition = event.target.selectionStart;
  // insert a new line
  input.value =
    input.value.substring(0, cursorPosition) +
    "\n" +
    input.value.substring(cursorPosition);
  console.log(input.value);
};

// auto focus on the input field
const vFocus = {
  mounted: (el) => el.focus(),
};

// update the chatWindow ref after the DOM is updated
onMounted(() => {
  // delay the execution of the code until the DOM is updated
  nextTick(() => {
    // scroll to the bottom of the chat Window
    chatWindow.value.scrollTop = chatWindow.value.scrollHeight;
  });
});

// detect the messages array for changes
watch(
  [messages.value],
  () => {
    // delay the execution of the code until the DOM is updated
    nextTick(() => {
      if (chatWindow.value) {
        // scroll to the bottom of the chat window
        chatWindow.value.scrollTop = chatWindow.value.scrollHeight;
        // console.log(`Scrolled to bottom`);
      }
    });
  },
  // make sure the watcher is executed after the DOM is updated
  { flush: "post" }
);
</script>
<template>
  <q-layout>
    <q-page-container>
      <q-page class="flex flex-center">
        <div class="q-pa-md row justify-center">
          <!-- make a transition animation -->

          <div class="chat-window">
            <div class="messages-container" ref="chatWindow">
              <!-- <q-chat-message name="me" :text="['hey, how are you?']" sent />
                  <q-chat-message name="Jane" :text="['doing fine, how r you?']" /> -->
              <div
                class="message"
                v-for="(message, index) in messages"
                :key="index"
                :class="{
                  userStyle: message.role === 'user',
                  alignRight: message.alignRight,
                }"
              >
                {{ message.content }}
              </div>
              <div class="input-container">
                <textarea
                  class="chat-input"
                  placeholder="Ask somethings about the website                                                                 ↵"
                  v-model="input"
                  v-focus
                  ref="continueFocus"
                  @change="handleInputChange"
                  @keydown.shift.enter.prevent="insertNewLine"
                  @keydown.enter.exact.prevent="sendMessage"
                  :disabled="loading"
                ></textarea>
                <q-btn
                  class="chat-button"
                  label="Send"
                  @click="sendMessage"
                  :loading="loading"
                />
              </div>
            </div>
          </div>
          <!-- <q-tbn class="floating-button" @click="toggleChat" label="Chat" /> -->
        </div>
        <!-- floating button -->
      </q-page>
    </q-page-container>
  </q-layout>
</template>
<style scoped>
.chat-window {
  position: relative;
  background-color: white;
  margin: auto;
  right: 3.5rem;
  width: 600px;
  height: 600px;
  border: 2px solid lightblue;
  border-radius: 1rem;
  box-shadow: 5px 5px 5px #eee;
  padding: 1rem;
  flex-direction: column;
  justify-content: space-between;
  z-index: 9999;

  /* Hide scrollbar for Chrome, Safari and Opera */
  ::-webkit-scrollbar {
    display: none;
  }

  /* Hide scrollbar for IE, Edge and Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}

.messages-container {
  width: 565px;
  height: 500px;
  flex-grow: 1;
  overflow-y: auto;
  margin-bottom: 2rem;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
}
.message {
  background-color: lightblue;
  /* rgb(233, 233, 235) */
  color: white;
  /* background: rgb(208, 233, 208); */
  border-radius: 0.5rem;
  padding: 0.5rem;
  margin: 0.2rem;
  display: inline-block;
  align-self: flex-start;
  /* makes \n character be rendered as line breaks */
  white-space: pre-wrap;
}
.userStyle {
  /* set the box to the right side */
  align-self: flex-end;
  background-color: #eee;
  /* #eee */
  color: rgb(33, 33, 33);
  /* text-align: right; */
  /* display: inline-block; */
}

.input-container {
  display: flex;
  justify-content: space-between;
}
.chat-input {
  position: absolute;
  height: 2.5rem;
  bottom: 1rem;
  left: 1.2rem;
  width: 29.5rem;
  display: flex;
  border: 1px solid #eee;
  border-radius: 0.5rem;
  padding: 0.5rem;
  box-shadow: 1px 1px 2px rgba(96, 89, 89, 0.3);
  /* rgba(96, 89, 89, 0.3) */
  /* forbid user to resize the textarea */
  resize: none;
  /* height: 2.5rem; */
}

.chat-input:focus {
  outline: none;
  outline: 2px solid lightblue;
  /* box-shadow: 0 0 3px #4c8caf; */
}

.chat-button {
  position: absolute;
  bottom: 1.2rem;
  right: 1.2rem;
}

.floating-button {
  position: fixed;
  bottom: 3rem;
  right: 4rem;
  z-index: 999;
  background-color: lightblue;
}
</style>
