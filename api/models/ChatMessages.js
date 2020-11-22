module.exports = {
  tableName: "chatMessages",
  attributes: {
    text: {
      type: "string",
      required: true,
    },
    createdBy: {
      model: "users",
    },
  },
};
