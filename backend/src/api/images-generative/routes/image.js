module.exports = {
    routes: [
      {
        method: 'POST',
        path: '/generate-image',
        handler: 'image.generateImage',
        config: {
          policies: [],
          middlewares: [],
        },
      },
    ],
  };
  