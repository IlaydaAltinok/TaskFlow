import mongoose from "mongoose";

const listSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "List name is required"],
      trim: true,
    },
    board: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Board",
      required: true,
    },
    order: {
      type: Number,
      default: 0,
    },
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
    timestamps: false,
  }
);

// Index'ler
listSchema.index({ board: 1 });
listSchema.index({ board: 1, order: 1 });

// Virtual field: tasks
listSchema.virtual("tasks", {
  ref: "Task",
  localField: "_id",
  foreignField: "list",
});

// Virtual'ları JSON'a dahil et
listSchema.set("toJSON", { virtuals: true });
listSchema.set("toObject", { virtuals: true });

// updatedAt'i otomatik güncelle
listSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const List = mongoose.model("List", listSchema);

export default List;

