import { model, Schema } from "mongoose";

export const Fees = model(
  "Fees",
  new Schema(
    {
      studentID: {
        type: Schema.Types.ObjectId,
        ref: "Student",
      },
      year: { type: String, required: true },
      monthlyAmount: { type: Number, required: true },
      payments: [
        {
          month: { type: Number, required: true },
          amount: { type: Number, required: true },
          status: {
            type: String,
            default: "pending",
            enum: ["pending", "success"],
          },
          date: { type: Date, required: false },
        },
      ],
      totalAmount: { type: Number, required: false },
    },
    { timestamps: true }
  ).pre("save", async function (next) {
    if (this.payments.some((p) => p.amount > this.monthlyAmount))
      return next(
        new Error("The received amount is higger than the montly amount")
      );

    if (!this.totalAmount)
      this.totalAmount = this.monthlyAmount * this.payments.length;

    next();
  })
);
