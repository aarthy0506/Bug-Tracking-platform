const mongoose = require('mongoose');
const Counter = require('./Counter');

const commentSchema = new mongoose.Schema(
  {
    user:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

const bugSchema = new mongoose.Schema(
  {
    bugId: {
      type: Number,
      unique: true,
    },
    title: {
      type: String,
      required: [true, 'Bug title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Bug description is required'],
    },
    status: {
      type: String,
      enum: ['open', 'in_progress', 'resolved', 'closed', 'reopened'],
      default: 'open',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    stepsToReproduce: {
      type: String,
      default: '',
    },
    attachments: [{ type: String }],
    comments: [commentSchema],
  },
  { timestamps: true }
);

// Auto-increment bugId before saving
bugSchema.pre('save', async function (next) {
  if (this.isNew) {
    const counter = await Counter.findByIdAndUpdate(
      { _id: 'bugId' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    this.bugId = counter.seq;
  }
  next();
});

module.exports = mongoose.model('Bug', bugSchema);
