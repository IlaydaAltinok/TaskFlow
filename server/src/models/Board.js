import mongoose from "mongoose";

const boardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Board name is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false, // Manuel yönetiyoruz
  }
);

// Index'ler
boardSchema.index({ owner: 1 });
boardSchema.index({ members: 1 });

// updatedAt'i otomatik güncelle
boardSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Board = mongoose.model("Board", boardSchema);

export default Board;

