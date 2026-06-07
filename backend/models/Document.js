const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    content: {
      type: Object,
      default: () => ({
        type: "doc",
        content: [{ type: "paragraph" }],
      }),
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    sharedWith: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },

        permission: {
          type: String,
          default: "edit",
        },
      },
    ],

    attachments: [String],
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Document", documentSchema);
