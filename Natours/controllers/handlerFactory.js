const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

exports.createOne = Model => async (req, res) => {
  const doc = await Model.create(req.body);

  return res.status(201).json({
    status: 'success',
    data: {
      data: doc
    }
  });
};

exports.getOne = (Model, popOptions) => async (req, res) => {
  const { id } = req.params;

  let query = Model.findById(id);
  if (popOptions) query = query.populate(popOptions);
  const doc = await query;

  if (!doc) {
    throw new AppError('No document found with that ID', 404);
  }

  res.json({
    status: 'success',
    data: {
      data: doc
    }
  });
};

exports.getAll = Model => async (req, res) => {
  let filter = {};

  if (req.params.tourId) filter = { tour: req.params.tourId };

  const features = new APIFeatures(Model.find(filter), req.query)
    .filter()
    .sort()
    .pagination()
    .projection();

  const doc = await features.query;

  res.status(200).json({
    status: 'success',
    results: doc.length,
    data: {
      data: doc
    }
  });
};

exports.updateOne = Model => async (req, res) => {
  const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!doc) {
    throw new AppError('No document found with that ID', 404);
  }

  return res.json({
    status: 'success',
    data: {
      data: doc
    }
  });
};

exports.deleteOne = Model => async (req, res) => {
  const doc = await Model.findByIdAndDelete(req.params.id);

  if (!doc) {
    throw new AppError('No document found with that ID', 404);
  }

  return res.status(204).json({
    status: 'success'
  });
};
