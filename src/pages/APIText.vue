<script setup>
const submit = async () => {
  const response = await fetch(
    "https://api.intreface.com/v0/db/62cdaf5689b817fd82c76924/omnieaitest/?token=jTNhRXf7UNe",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        externalId: "text",
        body: { key: "value", key2: "value2" },
      }),
    }
  );
  // const response = await fetch("https://api.intreface.com/v0/db/62cdaf5689b817fd82c76924/omnieaitest/list?token=jTNhRXf7UNe")
  const responseJSON = await response.json();
  console.log(responseJSON);
};

const get = async () => {
  const response = await fetch(
    "https://api.intreface.com/v0/db/62cdaf5689b817fd82c76924/omnieaitest/list?token=jTNhRXf7UNe",{
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const responseJSON = await response.json();
  console.log(responseJSON);
};


</script>
<template>
  <q-btn @click="submit" class="button"></q-btn>
  <q-btn @click="get" class="button"></q-btn>
</template>
<style scoped>
.button {
  width: 100px;
  height: 100px;
  background-color: red;
}
</style>
