const { v4: uuidv4 } = require("uuid");

module.exports = {
  beforeCreate: async (event) => {
    let isUnique = false;
    let documentId;

    // Lặp cho đến khi tìm được UUID duy nhất
    while (!isUnique) {
      documentId = uuidv4();
      const existingSession = await strapi.db.query("api::chat-session.chat-session").findOne({
        where: { document_id: documentId },
      });
      isUnique = !existingSession; // Duy nhất nếu không tìm thấy bản ghi
    }

    event.params.data.document_id = documentId;
  },
};
