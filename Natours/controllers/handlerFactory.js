const AppError = require('../utils/appError');

exports.updateOne = Model => async (req, res) => {
  const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!doc) {
    throw new AppError('No document found with that ID', 404);
  }

  res.json({
    status: 'success',
    data: {
      doc
    }
  });
};

exports.deleteOne = Model => async (req, res) => {
  const doc = await Model.findByIdAndDelete(req.params.id);

  if (!doc) {
    throw new AppError('No document found with that ID', 404);
  }

  res.status(204).json({
    status: 'success'
  });
};
