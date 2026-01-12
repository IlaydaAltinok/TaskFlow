import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: [true, "Password is required"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false, // createdAt'i manuel yönetiyoruz
  }
);

// Email için unique index (zaten unique: true var ama ekstra güvenlik)
userSchema.index({ email: 1 }, { unique: true });

// Password hashleme için pre-save hook
userSchema.pre("save", function (next) {
  // Eğer passwordHash değişmediyse hashleme
  if (!this.isModified("passwordHash")) {
    return next();
  }

  // Async işlemi promise olarak yap
  bcrypt.genSalt(10)
    .then((salt) => {
      return bcrypt.hash(this.passwordHash, salt);
    })
    .then((hash) => {
      this.passwordHash = hash;
      next();
    })
    .catch((error) => {
      next(error);
    });
});

// Password karşılaştırma metodu
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.passwordHash);
};

const User = mongoose.model("User", userSchema);

export default User;

