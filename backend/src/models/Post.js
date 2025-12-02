const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  text: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const postSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  text: {
    type: String,
    required: true,
    trim: true,
    maxlength: 5000
  },
  image: {
    type: String,
    default: null
  },
  video: {
    type: String,
    default: null
  },
  videoUrl: {
    type: String,
    default: null
  },
  document: {
    type: String,
    default: null
  },
  link: {
    url: String,
    text: String
  },
  // Sondage
  poll: {
    question: {
      type: String,
      trim: true,
      maxlength: 500
    },
    options: [{
      text: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200
      },
      votes: [{
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        },
        votedAt: {
          type: Date,
          default: Date.now
        }
      }]
    }],
    pollType: {
      type: String,
      enum: ['single', 'multiple'], // single choice ou multiple choice
      default: 'single'
    },
    allowMultipleVotes: {
      type: Boolean,
      default: false // Permettre de changer son vote
    },
    endsAt: {
      type: Date,
      default: null // Date de fin du sondage (optionnel)
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [commentSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index pour recherche et tri
postSchema.index({ createdAt: -1 });
postSchema.index({ author: 1 });

module.exports = mongoose.model('Post', postSchema);
