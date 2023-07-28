const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", redirect: { name: "chatbox" } },
      {
        path: "databaseRetrival",
        name: "databaseRetrival",
        component: () => import("pages/DatabaseRetrival.vue"),
        children: [
          { path: "", redirect: { name: "chatbox" } },
          {
            path: "chatbox",
            name: "chatbox",
            component: () => import("pages/ChatBox.vue"),
          },
          {
            path: "chatboxWindow",
            name: "chatboxWindow",
            component: () => import("pages/ChatBoxWindow.vue"),
          },
        ],
      },
      {
        path: "chatboxWindowMemory",
        name: "chatboxWindowMemory",
        component: () => import("pages/ChatBoxWindowMemory.vue"),
      },
      {
        path: "modelConfig",
        name: "modelConfig",
        component: () => import("pages/ModelConfig.vue"),
      },
      {
        path: "source",
        name: "source",
        component: () => import("pages/SourceData.vue"),
        children: [
          { path: "", redirect: { name: "pdfUpload" } },
          {
            path: "pdfUpload",
            name: "pdfUpload",
            component: () => import("pages/PDFUpload.vue"),
          },
          {
            path: "urlUpload",
            name: "urlUpload",
            component: () => import("pages/URLUpload.vue"),
          },
          {
            path: "pdfUploadWindow",
            name: "pdfUploadWindow",
            component: () => import("pages/PDFUploadWindow.vue"),
          },
          {
            path: "urlUploadWindow",
            name: "urlUploadWindow",
            component: () => import("pages/URLUploadWindow.vue"),
          },
        ],
      },
    ],
  },
  {
    path: "/apiText",
    name: "apiText",
    component: () => import("pages/APIText.vue"),
  },
  // ChatBoxWindowMemory

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },

  // {
  //   path: "/chatbox",
  //   component: () => import("pages/ChatBox.vue"),
  //   children: [{ path: "", component: () => import("pages/ChatBox.vue") }],
  // },
];

export default routes;
