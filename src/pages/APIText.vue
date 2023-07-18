<script setup>
const submit = async () => {
  // const response = await fetch(
  //   "https://api.intreface.com/v0/db/62cdaf5689b817fd82c76924/omnieaitest/?token=jTNhRXf7UNe",
  //   {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       externalId: "124",
  //       body: [1, 2],
  //     }),
  //   }
  // );
  const response = await fetch("https://api.intreface.com/v0/db/62cdaf5689b817fd82c76924/omnieaitest/list?token=jTNhRXf7UNe")
  const responseJSON = await response.json();
  console.log(responseJSON);
};
</script>
<template>
  <q-btn @click="submit" class="button"></q-btn>
</template>
<style scoped>
.button{
  width: 100px;
  height: 100px;
  background-color: red;
}</style>
