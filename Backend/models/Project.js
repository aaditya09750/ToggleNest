const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a project title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a project description'],
    },
    deadline: {
      type: Date,
      required: [true, 'Please add a deadline'],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    status: {
      type: String,
      enum: ['Active', 'Completed', 'On Hold'],
      default: 'Active',
    },
  },
  {
    timestamps: true,
  }
);

projectSchema.index({ createdBy: 1 });
projectSchema.index({ members: 1 });
projectSchema.index({ status: 1 });

module.exports = mongoose.model('Project', projectSchema);
