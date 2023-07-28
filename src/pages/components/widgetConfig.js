export async function getWidgetConfig() {
  const response = await fetch("http://localhost:3000/getWidgetConfig");
  const responseJSON = await response.json();
  widgetGreetingMessage.value = responseJSON.widgetGreetingMessage;
  widgetBorderColor.value = responseJSON.widgetBorderColor;
  widgetButtonColor.value = responseJSON.widgetButtonColor;
  widgetHintColor.value = responseJSON.widgetHintColor;
  widgetMessageColor.value = responseJSON.widgetMessageColor;
  return {
    widgetGreetingMessage,
    widgetBorderColor,
    widgetButtonColor,
    widgetHintColor,
    widgetMessageColor,
  };
}
