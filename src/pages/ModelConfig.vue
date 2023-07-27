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

// detect if the input is not formatted correctly
const temperatureError = ref(false);
const temperatureErrorMessage = ref("");

// convert the limit time between minutes and seconds
const limitTimeInMinutes = computed({
  get: () => limitTime.value / 60 / 1000,
  set: (value) => (limitTime.value = value * 60 * 1000),
});

const submitAPIKey = async () => {
  try {
    const response = await fetch("http://192.168.1.66:3000/setApiKey", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ apiKey: openaiAPIKey.value }),
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

const submitTemperature = async () => {
  try {
    const response = await fetch("http://192.168.1.66:3000/setTemperature", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ temperature: temperature.value }),
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

const submitUserPrompt = async () => {
  try {
    const response = await fetch("http://192.168.1.66:3000/setUserPrompt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userPrompt: userPrompt.value }),
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

const submitLimiterConfig = async () => {
  try {
    const response = await fetch(
      "http://192.168.1.66:3000/uploadLimiterConfig",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          windowMs: limitTime.value,
          max: maxRequest.value,
          message: requestPreventMessage.value,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Http error! status:${response.status}`);
    }

    const responseJSON = await response.json();
    console.log(responseJSON);
  } catch (error) {
    console.log("ERROR:" + error);
  }
};

const submitWidgetConfig = async () => {
  try {
    const response = await fetch("http://192.168.1.66:3000/setWidgetConfig", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        widgetGreetingMessage: widgetGreetingMessage.value,
        widgetBorderColor: widgetBorderColor.value,
        widgetButtonColor: widgetButtonColor.value,
        widgetHintColor: widgetHintColor.value,
        widgetMessageColor: widgetMessageColor.value,
      }),
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
// const submitMaxRequest = async () => {
//   try {
//     const response = await fetch("http://localhost:3000/setMaxRequest", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ maxRequest: maxRequest.value }),
//     });

//     if (!response.ok) {
//       throw new Error(`Http error! status:${response.status}`);
//     }

//     const responseJSON = await response.json();
//     console.log(responseJSON);
//   } catch (error) {
//     console.log("ERROR:" + error);
//   }
// };

// const submitLimitTime = async () => {
//   try {
//     const response = await fetch("http://localhost:3000/setLimitTime", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ limitTime: limitTime.value }),
//     });

//     if (!response.ok) {
//       throw new Error(`Http error! status:${response.status}`);
//     }

//     const responseJSON = await response.json();
//     console.log(responseJSON);
//   } catch (error) {
//     console.log("ERROR:" + error);
//   }
// };

// const submitRequestPreventMessage = async () => {
//   try {
//     const response = await fetch(
//       "http://localhost:3000/setRequestPreventMessage",
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           requestPreventMessage: requestPreventMessage.value,
//         }),
//       }
//     );

//     if (!response.ok) {
//       throw new Error(`Http error! status:${response.status}`);
//     }

//     const responseJSON = await response.json();
//     console.log(responseJSON);
//   } catch (error) {
//     console.log("ERROR:" + error);
//   }
// };

const getAPIKey = async () => {
  const response = await fetch("http://192.168.1.66:3000/getApiKey");
  const responseJSON = await response.json();
  console.log(responseJSON);
  openaiAPIKey.value = responseJSON.apiKey;
};

const getTemperature = async () => {
  const response = await fetch("http://192.168.1.66:3000/getTemperature");
  const responseJSON = await response.json();
  console.log(responseJSON);
  temperature.value = responseJSON.temperature;
};

const getUserPrompt = async () => {
  const response = await fetch("http://192.168.1.66:3000/getUserPrompt");
  const responseJSON = await response.json();
  console.log(responseJSON);
  userPrompt.value = responseJSON.userPrompt;
};

const getLimiterConfig = async () => {
  const response = await fetch("http://192.168.1.66:3000/getLimiterConfig");
  const { windowMs, max, message } = await response.json();
  console.log(windowMs, max, message);
  limitTime.value = windowMs;
  maxRequest.value = max;
  // console.log(typeof(message))
  requestPreventMessage.value = message;
  // console.log(response.json())
};

const getWidgetConfig = async () => {
  const response = await fetch("http://192.168.1.66:3000/getWidgetConfig");
  const responseJSON = await response.json();
  widgetGreetingMessage.value = responseJSON.widgetGreetingMessage;
  widgetBorderColor.value = responseJSON.widgetBorderColor;
  widgetButtonColor.value = responseJSON.widgetButtonColor;
  widgetHintColor.value = responseJSON.widgetHintColor;
  widgetMessageColor.value = responseJSON.widgetMessageColor;
};

// const getMaxRequest = async () => {
//   const response = await fetch("http://localhost:3000/getMaxRequest");
//   const responseJSON = await response.json();
//   console.log(responseJSON);
//   maxRequest.value = responseJSON.maxRequest;
// };

// const getLimitTime = async () => {
//   const response = await fetch("http://localhost:3000/getLimitTime");
//   const responseJSON = await response.json();
//   console.log(responseJSON);
//   limitTime.value = responseJSON.limitTime;
// };

// const getRequestPreventMessage = async () => {
//   const response = await fetch(
//     "http://localhost:3000/getRequestPreventMessage"
//   );
//   const responseJSON = await response.json();
//   console.log(responseJSON);
//   requestPreventMessage.value = responseJSON.requestPreventMessage;
// };

const handleSubmit = async () => {
  await submitAPIKey();
  await submitTemperature();
  await submitUserPrompt();
  await submitLimiterConfig();
  await submitWidgetConfig();
  // await submitMaxRequest();
  // await submitLimitTime();
  // await submitRequestPreventMessage();
};

// get the API key after the DOM is updated
onMounted(async () => {
  await getAPIKey();
  await getTemperature();
  await getUserPrompt();
  await getLimiterConfig();
  await getWidgetConfig();
  // await getMaxRequest();
  // await getLimitTime();
  // await getRequestPreventMessage();
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
