<script setup>
import { ref, onMounted, computed } from "vue";

let openaiAPIKey = ref("");
let temperature = ref(0);
let userPrompt = ref("");
let maxRequest = ref(null);
let limitTime = ref(null);
let requestPreventMessage = ref("");
let widgetBorderColor = ref("");
let widgetMessageColor = ref("");
let widgetHintColor = ref("");
let widgetButtonColor = ref("");
let widgetGreetingMessage = ref("");
const userId = "123";

// detect if the input is not formatted correctly
const temperatureError = ref(false);
const temperatureErrorMessage = ref("");

// convert the limit time between minutes and seconds
const limitTimeInMinutes = computed({
  get: () => limitTime.value / 60 / 1000,
  set: (value) => (limitTime.value = value * 60 * 1000),
});

const setUserConfig = async () => {
  try {
    const response = await fetch("http://localhost:3000/userConfig", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: userId }),
    });
    if (!response.ok) {
      throw new Error(`Http error! status:${response.status}`);
    }

    const responseJSON = await response.json();
    console.log(responseJSON);
  } catch (error) {
    console.log("ERROR:" + error);
  }
};

const updateUserConfig = async () => {
  const dataToUpdata = {
    userId: userId,
    openaiAPIKey: openaiAPIKey.value,
    temperature: temperature.value,
    userPrompt: userPrompt.value,
    maxRequest: maxRequest.value,
    limitTime: limitTime.value,
    requestPreventMessage: requestPreventMessage.value,
    widgetBorderColor: widgetBorderColor.value,
    widgetMessageColor: widgetMessageColor.value,
    widgetHintColor: widgetHintColor.value,
    widgetButtonColor: widgetButtonColor.value,
    widgetGreetingMessage: widgetGreetingMessage.value,
  };
  try {
    const response = await fetch(`http://localhost:3000/userConfig/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataToUpdata),
    });

    if (!response.ok) {
      throw new Error(`Http error! status:${response.status}`);
    }

    const responseJSON = await response.json();
    console.log(responseJSON);
  } catch (error) {
    console.log("ERROR:" + error);
  }
};

const getUserConfig = async () => {
  try {
    const response = await fetch(`http://localhost:3000/userConfig/${userId}`);
    const responseJSON = await response.json();
    if (response.ok) {
      console.log(responseJSON);
      openaiAPIKey.value = responseJSON.openaiAPIKey;
      temperature.value = responseJSON.temperature;
      userPrompt.value = responseJSON.userPrompt;
      maxRequest.value = responseJSON.maxRequest;
      limitTime.value = responseJSON.limitTime;
      requestPreventMessage.value = responseJSON.requestPreventMessage;
      widgetBorderColor.value = responseJSON.widgetBorderColor;
      widgetMessageColor.value = responseJSON.widgetMessageColor;
      widgetHintColor.value = responseJSON.widgetHintColor;
      widgetButtonColor.value = responseJSON.widgetButtonColor;
      widgetGreetingMessage.value = responseJSON.widgetGreetingMessage;
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log("ERROR:" + error);
    return false;
  }
};

const handleSubmit = async () => {
  await updateUserConfig();
};

// get the value after the DOM is updated
onMounted(async () => {
  const isUserConfigExist = await getUserConfig();
  if (!isUserConfigExist) {
    await setUserConfig();
  }
});

// restrict the input to only numbers and decimals
const restrictTemperatureInput = (event) => {
  // fetch the character inputted
  const char = String.fromCharCode(event.charCode);
  const newTemperature = temperature.value + char;

  //check if the input is a number
  if (isNaN(newTemperature)) {
    event.preventDefault();
    return;
  }
  // Convert to number and check range
  const numberValue = Number(newTemperature);
  if (numberValue > 1 || numberValue < 0) {
    event.preventDefault();
    return;
  }

  // check if the input is a decimal
  const decimalPart = newTemperature.split(".")[1];
  if (decimalPart && decimalPart.length > 1) {
    event.preventDefault();
    return;
  }

  // validate the input
  const validateTemperature = () => {
    //
  };
};
</script>
<template>
  <div class="q-pa-md input-field">
    <q-input
      v-model="openaiAPIKey"
      filled
      label="API KEY"
      class="input-message"
    />
    <q-input
      v-model="temperature"
      filled
      label="Temperature    0-reserved 1-creative"
      :error="temperatureError"
      :error-message="temperatureErrorMessage"
      @blur="validateTemperature"
      @keypress="restrictTemperatureInput"
    />
    <q-slider
      v-model="temperature"
      :min="0"
      :max="1"
      :step="0.1"
      with-labels
      label-always
    ></q-slider>
    <q-input
      v-model="userPrompt"
      filled
      type="textarea"
      rows="7"
      label="UserPrompt"
    />
    <span>Limit the number of messages sent from one device.</span>
    <div class="chat-limit">
      <q-input v-model="maxRequest" filled label="Max Requests" />
      <q-input v-model="limitTimeInMinutes" filled label="Limit Time Minute" />
    </div>
    <q-input
      v-model="requestPreventMessage"
      filled
      label="Show the message when request block"
      class="input-message"
    />
    <span>Widget Color</span>
    <div class="widget-form">
      <q-input
        v-model="widgetGreetingMessage"
        filled
        type="textarea"
        rows="2"
        label="Enter the greeting words"
      />
      <span
        >Border color:
        <span :style="{ color: widgetBorderColor }">{{
          widgetBorderColor
        }}</span></span
      >
      <input type="color" v-model="widgetBorderColor" />
      <span
        >Message color:
        <span :style="{ color: widgetMessageColor }">{{
          widgetMessageColor
        }}</span></span
      >
      <input type="color" v-model="widgetMessageColor" />
      <span
        >Hint color:
        <span :style="{ color: widgetHintColor }">{{
          widgetHintColor
        }}</span></span
      >
      <input type="color" v-model="widgetHintColor" />
      <span
        >Widget button color:
        <span :style="{ color: widgetButtonColor }">{{
          widgetButtonColor
        }}</span></span
      >
      <input type="color" v-model="widgetButtonColor" />
    </div>
    <q-btn
      class="submit-button"
      @click="handleSubmit"
      label="Submit"
      color="primary"
    ></q-btn>
  </div>
</template>
<style scoped>
.input-field {
  margin: 1rem auto;
  width: 500px;
  display: flex;
  flex-direction: column;
  /* justify-content: space-between; */
}
/* apply to all kinds of direct children of parent element */
.input-field > * {
  margin: 1rem;
}

.chat-limit {
  display: flex;
  /* justify-content: space-between; */
}

.chat-limit > * {
  margin: 0 0.5rem;
}

.input-message {
  /* width: 25rem; */
}

.widget-form {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.submit-button {
  width: 10rem;
  align-self: flex-end;
}
</style>
