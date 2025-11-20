const Feedback = require("../models/feedbackModel");

exports.addFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.create({
      user_id: req.user.id,
      ...req.body,
    });
    res.status(201).json({ message: "Feedback submitted", feedback });
  } catch (error) {
    res.status(500).json({ message: "Error adding feedback", error: error.message });
  }
};

exports.getFeedbackBySite = async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ site_id: req.params.siteId })
      .populate("user_id", "name");
    res.status(200).json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching feedback", error: error.message });
  }
};
