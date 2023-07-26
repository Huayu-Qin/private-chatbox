<script setup>
import { ref, watch, nextTick, onMounted, onUnmounted } from "vue";

const messages = ref([{ text: "Hello, how can I help you?", type: "bot" }]);
const input = ref("");
// floating button state
const showChat = ref(false);
const loading = ref(false);
// continue focus on the input field
const continueFocus = ref(null);
// source to get the real-time data
let source = null;

// clean up the real-time stream data
const processToken = (token) => {
  return token.replace(/\\n/g, "\n").replace(/\"/g, "");
};

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
  // console.log(input.value)

  messages.value.push({
    text: input.value,
    type: "user",
  });
  // console.log(messages.value);

  // add a basic message to receive the stream response
  const bufferMessage = {
    text: "",
    type: "bot",
  };
  messages.value.push(bufferMessage);

  try {
    // quit the previous source if it exists
    if (source) {
      source.close();
    }
    // create a new EventSource to get the real-time data for new message
    source = new EventSource("http://localhost:3000/chatMemory");
    // create listener for the beginning of the stream
    source.addEventListener("newToken", (event) => {
      // clean up the token
      const cleanedToken = processToken(event.data);
      // add the token to the last bot message
      messages.value[messages.value.length - 1].text += cleanedToken;
    });
    // create listener for the end of the stream
    source.addEventListener("stop", () => {
      source.close();
    });

    //office domain:192.168.1.66
    const response = await fetch("http://192.168.1.66:3000/chatMemory", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ input: input.value }),
    });

    // check if the response is ok
    if (!response.ok) {
      if (response.status === 429) {
        const errorJSON = await response.json();
        throw new Error(errorJSON || "Too many requests");
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    // messages.value.push({
    //   text: responseJSON.result.response, // for bufferMemory and redisMemory
    //   // text: responseJSON.result.text, // for vectorMemory and conversationSummaryMemory
    //   type: "bot",
    // });
  } catch (error) {
    console.log("ERROR:" + error);
    messages.value.push({
      text: error.message,
      type: "bot",
    });
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

// change the state of the chatbox, but v-model can change it automatically, so it deprecated.
const toggleChat = () => {
  showChat.value = !showChat.value;
};

// auto focus on the input field
const vFocus = {
  mounted: (el) => el.focus(),
};

// Scroll to the bottom of the chat window
const chatWindow = ref(null);

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
  [messages.value, showChat],
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
// make sure the source is closed when the component is unmounted
onUnmounted(() => {
  if (source) {
    source.close();
  }
});
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
                  userStyle: message.type === 'user',
                  alignRight: message.alignRight,
                }"
              >
                {{ message.text }}
              </div>
              <div class="input-container">
                <textarea
                  class="chat-input"
                  placeholder="Ask somethings about the website                                                                 ↵"
                  v-model="input"
                  v-focus
                  ref="continueFocus"
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
